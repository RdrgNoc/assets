'use strict';

const timingNoty = 3500;
var idUser = $("#MainContent_hddnIdUsuario").val();
var idRolUser = $("#MainContent_hddnPage").val();
var cveOSd = $("#MainContent_hddnOS").val().trim();
var cveUPd = $("#MainContent_hddnUP").val().trim();
var cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();

const d = new Date();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validarMedida(valor, unidad) {
    const numero = parseFloat(valor);

    if (isNaN(numero)) return false;

    switch (unidad) {
        case '1':
            return numero >= 0 && numero <= 100;
        case '2':
            return Number.isInteger(numero) && numero >= 0 && numero <= 24;
        case '3':
            return Number.isInteger(numero) && numero >= 0 && numero <= 365;
        case '4':
            return Number.isInteger(numero) && numero >= 0;
        default:
            return false;
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var obtenerSelectDatosEfiscal = function () {
    fetchDataArr(0, {}, 3, function (response) {
        if (response) {
            const select = $("#cboEfiscal");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.id_efiscal, text: item.efiscal })); });
            select.val(cveEfiscald);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var obtenerSelectDatosOS = function (txtEfiscal) {
    fetchDataArr(1, { _txtEfiscal: txtEfiscal }, 3, function (response) {
        if (response) {
            const select = $("#cboOs");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.Cve_Organo_Superior, text: item.Txt_Organo_Superior })); });
            select.val(cveOSd);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    })
}

var obtenerSelectDatosUP = function (txtEfiscal, txtOS, tipo) {
    fetchDataArr(2, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 3, function (response) {
        if (response) {
            const select = $("#cboUp");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.Cve_Unidad_Presupuestal, text: item.Txt_Unidad_Presupuestal })); });
            select.val(cveUPd === '' ? 0 : tipo === 'cambio' ? txtOS === cveOSd ? cveUPd : 0 : cveUPd);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var obtenerSelectDatosMedida = function () {
    fetchDataArr(3, {}, 3, function (response) {
        if (response) {
            const select = $("#cboUnidadMedidaP");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.ID_UNIDAD_MEDIDA, text: item.DESC_BREVE })); });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gDfm(cveOS, cveUP, eFiscal) {
    var html = '';
    fetchDataArr(4, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 3, function (response) {
        if (response) {
            logger.error("RESPUESTA METAS FACTOR: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        html += `<tr>
                                    <td class='text-1000'>${item.FOLIO}</td>
                                    <td class='text-1000'>${item.DESC_FACTOR}</td>
                                    <td class='text-1000'>${item.POSIBLE_EFECTO}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-secondary btnEditMetaFactor customButton' type='button' data-ctrl-factor='${item.ID_CTRL_FACTOR}'>Insertar metas</button>
                                        </div>
                                    </td>
                                </tr>`;
                    });
                    recargarTabla("tableMetasFactor", html);
                } else {
                    recargarTabla("tableMetasFactor", null);
                    showMsg("Sin factores.", 'info');
                }
            } else {
                showMsg("Ocurrió un error al obtener los datos.", 'error');
                return;
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDmxf(idCtrlFactor) {
    fetchDataArr(5, { _idCtrlFactor: idCtrlFactor }, 3, function (response) {
        if (response) {
            logger.error("RESPUESTA METAS FACTOR BY ID: ", response);
            if (response !== 'error') {
                var flagMetaA;
                const numberMes = d.getMonth();
                switch (numberMes) {
                    case 0: //ENERO
                    case 1: //FEBRERO
                    case 2: //MARZO 
                    case 3: //ABRIL
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                        flagMetaA = true;
                        break;
                    case 11:
                        flagMetaA = false;
                        break;
                    default:
                        flagMetaA = true;
                        break;
                }
                //flagMetaA = false;
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var flagMetaP = item.CAPTURADO_P === true ? true : false;
                        var flagMetaPEdit = item.SN_PERMISO === false ? flagMetaP === true ? true : false : item.SN_PERMISO === true ? false : item.SN_PERMISO === null ? false : true;
                        var descBtnMetaP = item.SN_PERMISO === false ? flagMetaP === true ? 'Solicite permiso para modificar su meta programada' : 'Guardar meta programada' : item.SN_PERMISO === true ? 'Editar meta programada' : 'Guardar meta programada';
                        var flagMetaAA = item.CAPTURADO_A === false && flagMetaA === true ? true : item.CAPTURADO_A === true ? true : false;
                        var descBtnMetaA = item.CAPTURADO_A === false && flagMetaA === true ? 'Espere al último mes del Cuarto Trimestre para capturar.' : item.CAPTURADO_A === true ? 'Ya no puede capturar' : 'Espere al último mes del Cuarto Trimestre para capturar.';

                        $("#txtCuantitativaA").attr("disabled", flagMetaAA).val(item.CANTIDAD_CUANTITATIVA_A);
                        $("#txtComentarioA").attr("disabled", flagMetaAA).val(item.DESC_COMENTARIOS);
                        $("#btnS_MetaAlcanzada").attr("disabled", flagMetaAA).attr("data-ctrl-meta-a", item.ID_CTRL_META_A).attr("data-ctrl-factor", idCtrlFactor).text(descBtnMetaA);

                        $("#txtDescCualitativaP").attr("disabled", flagMetaPEdit).val(item.DESC_CUALITATIVA);
                        $("#txtCuantitativaP").attr("disabled", flagMetaPEdit).val(item.CANTIDAD_CUANTITATIVA_P);
                        $("#cboUnidadMedidaP").attr("disabled", flagMetaPEdit).val(item.ID_UNIDAD_MEDIDA === null ? 0 : item.ID_UNIDAD_MEDIDA);
                        $("#btnS_MetaProgramada").attr("disabled", flagMetaPEdit).attr("data-ctrl-meta-p", item.ID_CTRL_META_P).attr("data-ctrl-factor", idCtrlFactor).text(descBtnMetaP);
                    });
                } else {
                    showMsg("Sin meta programada.", 'info');
                    // $("#txtCuantitativaA").attr("disabled", true);
                    // $("#txtComentarioA").attr("disabled", true);
                    // $("#btnS_MetaAlcanzada").attr("disabled", true).attr("data-ctrl-meta-a", item.ID_CTRL_META_A).attr("data-ctrl-factor", idCtrlFactor);
                }
            } else {
                showMsg("Ocurrió un error al obtener los datos.", 'error');
                return;
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sUfmp(idCtrlMetaP, txtDescCuantitativa, idUser, txtCantidadCuantitativa, cboUnidadMedida, __idCtrlFactor) {
    fetchDataArr(6, { _idCtrlMetaP: idCtrlMetaP, _txtCualitativa: txtDescCuantitativa, _txtCuantitativa: txtCantidadCuantitativa, _idUsuario: idUser, _idMedida: cboUnidadMedida }, 3, function (response) {
        if (response) {
            logger.log("Respuesta a UPDATE FACTOR META PROGRAMADA:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se actualizo la meta programada.", 'success');
                clearForms(1);
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al querer actualizar la meta programada.", 'error');
            }
            gDmxf(__idCtrlFactor);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    //$("#btnS_MetaProgramada").removeAttr("disabled");
}

function sUfma(idCtrlMetaA, txtDescComentario, idUser, txtCantidadCuantitativa, __idCtrlFactor) {
    fetchDataArr(7, { _idCtrlMetaA: idCtrlMetaA, _txtComentario: txtDescComentario, _txtCuantitativa: txtCantidadCuantitativa, _idUsuario: idUser }, 3, function (response) {
        if (response) {
            logger.log("Respuesta a UPDATE FACTOR META ALCANZADA:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se actualizo la meta alcanzada.", 'success');
                clearForms(1);
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al querer actualizar la meta alcanzada.", 'error');
            }
            gDmxf(__idCtrlFactor);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    //$("#btnS_MetaProgramada").removeAttr("disabled");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    loadEndpoints(3);
    obtenerSelectDatosEfiscal();
    obtenerSelectDatosOS(cveEfiscald);
    obtenerSelectDatosUP(cveEfiscald, cveOSd, '')
    obtenerSelectDatosMedida();
    if (idRolUser === '101') {
        logger.log("Usuario captura");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", true);

        gDfm(cveOSd, cveUPd, cveEfiscald);
    } else if (idRolUser === '201' || idRolUser === '301') {
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        logger.log("Usuario administrador")
    }

    $(document).on("click", "#btnSearch, #cboEfiscal", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            gDfm(cveOS, cveUP, eFiscal);
        }

    });

    $(document).on("click", ".btnEditMetaFactor", function () {
        var idReturn = $(this)[0].dataset.ctrlFactor;
        gDmxf(idReturn);
        $("#modalMetasForm").modal("show");
    });

    $(document).on("click", "#btnS_MetaProgramada", function () {
        $("#btnS_MetaProgramada").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlFactor;
        var idReturn2 = $(this)[0].dataset.ctrlMetaP;
        if ((idReturn === 0 || idReturn === "0") && (idReturn2 === 0 || idReturn2 === "0")) {
            showMsg('Error al obtener datos...', 'alert');
            return;
        }
        if (validarFormularioMetaA() === true) {
            const cboUnidadMedidaPData = $("#cboUnidadMedidaP").val();
            const txtDescCualitativaPData = $("#txtDescCualitativaP").val().trim();
            const txtCuantitativaPData = $("#txtCuantitativaP").val().trim();
            if (validarMedida(txtCuantitativaPData, cboUnidadMedidaPData) !== false) {
                //showMsg(`Cantidad valida: ${cboUnidadMedidaPData}:${txtCuantitativaPData}`, 'alert');
                sUfmp(idReturn2, txtDescCualitativaPData, idUser, txtCuantitativaPData, cboUnidadMedidaPData, idReturn)
            } else {
                showMsg(`Cantidad invalida respecto a la unidad de medida que eligio.`, 'alert');
                $("#btnS_MetaProgramada").removeAttr("disabled");
                return;
            }
        } else {
            $("#btnS_MetaProgramada").removeAttr("disabled");
        }
    });

    $(document).on("click", "#btnS_MetaAlcanzada", function () {
        $("#btnS_MetaAlcanzada").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlFactor;
        var idReturn2 = $(this)[0].dataset.ctrlMetaA;
        if ((idReturn === 0 || idReturn === "0") && (idReturn2 === 0 || idReturn2 === "0")) {
            showMsg('Error al obtener datos...', 'alert');
            return;
        }
        if (validarFormularioMetaP() === true) {
            const cboUnidadMedidaPData = $("#cboUnidadMedidaP").val();
            const txtComentarioAData = $("#txtComentarioA").val().trim();
            const txtCuantitativaAData = $("#txtCuantitativaA").val().trim();
            if (validarMedida(txtCuantitativaAData, cboUnidadMedidaPData) !== false) {
                //showMsg(`Cantidad valida: ${cboUnidadMedidaPData}:${txtCuantitativaAData}`, 'alert');
                sUfma(idReturn2, txtComentarioAData, idUser, txtCuantitativaAData, idReturn)
            } else {
                showMsg(`Cantidad invalida respecto a la unidad de medida que eligio en la meta programada.`, 'alert');
                $("#btnS_MetaAlcanzada").removeAttr("disabled");
                return;
            }
        } else {
            $("#btnS_MetaAlcanzada").removeAttr("disabled");
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validarFormularioMetaA() {
    let esValido = true;

    const cboUnidadMedidaP = $("#cboUnidadMedidaP").val();
    if (cboUnidadMedidaP === "" || cboUnidadMedidaP === "0") {
        showMsgForm("cboUnidadMedidaP", "Elija la unidad de medida.", "error");
        esValido = false;
    }

    const txtDescCualitativaP = $("#txtDescCualitativaP").val().trim();
    if (txtDescCualitativaP === "") {
        showMsgForm("txtDescCualitativaP", "Ingrese la descripción.", "error");
        esValido = false;
    }

    const txtCuantitativaP = $("#txtCuantitativaP").val().trim();
    if (txtCuantitativaP === "") {
        showMsgForm("txtCuantitativaP", "Ingrese la cantidad.", "error");
        esValido = false;
    }

    return esValido;
}

function validarFormularioMetaP() {
    let esValido = true;

    const txtComentarioA = $("#txtComentarioA").val().trim();
    if (txtComentarioA === "") {
        showMsgForm("txtComentarioA", "Ingrese sus comentarios.", "error");
        esValido = false;
    }

    const txtCuantitativaA = $("#txtCuantitativaA").val().trim();
    if (txtCuantitativaA === "") {
        showMsgForm("txtCuantitativaA", "Ingrese la cantidad.", "error");
        esValido = false;
    }

    return esValido;
}

function clearForms(type) {
    if (type === 1) {
        $("#cboUnidadMedidaP").val(0);
        $("#txtDescCualitativaP").val("");
        $("#txtCuantitativaP").val("");
    } else if (type === 2) {
        $("#txtComentarioA").val("");
        $("#txtCuantitativaA").val("");
    } else if (type === 3) {
    } else if (type === 4) {
    } else if (type === 5) {
    } else if (type === 6) {
    }
}