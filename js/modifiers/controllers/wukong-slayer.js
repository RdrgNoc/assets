'use strict';

const timingNoty = 3500;
var idUser = $("#MainContent_hddnIdUsuario").val();
var idRolUser = $("#MainContent_hddnPage").val();
var cveOSd = $("#MainContent_hddnOS").val().trim();
var cveUPd = $("#MainContent_hddnUP").val().trim();
var cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gDr(cveOS, cveUP, eFiscal) {
    fetchDataArr(3, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 5, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA DATOS PERSONAS REPORTE`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        if (item.SN_TERMINADO === true) {
                            $("#txtNombreTitular").val(item.TITULAR).attr("disabled", true);
                            $("#txtNombreCoor").val(item.CCI).attr("disabled", true);
                            $("#txtNombreEnlace").val(item.ENLACE_RIESGOS).attr("disabled", true);
                            $("#txtNombreIntegro").val(item.INTEGRO).attr("disabled", true);
                            $("#txtNombreAutorizo").val(item.AUTORIZO).attr("disabled", true);
                            $("#btnS_Datos").attr("data-ctrl-datos", item.ID_CTRL_DATOS).attr("disabled", true).text("Si requiere editar, contacte con el administrador para desactivar el candado");;
                        } else {
                            $("#txtNombreTitular").val(item.TITULAR).removeAttr("disabled");
                            $("#txtNombreCoor").val(item.CCI).removeAttr("disabled");
                            $("#txtNombreEnlace").val(item.ENLACE_RIESGOS).removeAttr("disabled");
                            $("#txtNombreIntegro").val(item.INTEGRO).removeAttr("disabled");
                            $("#txtNombreAutorizo").val(item.AUTORIZO).removeAttr("disabled");
                            $("#btnS_Datos").attr("data-ctrl-datos", item.ID_CTRL_DATOS).removeAttr("disabled");
                        }
                    });
                } else {
                    $("#btnS_Datos").attr("data-ctrl-datos", 0);
                    showMgs("No contiene ningun dato para los reportes.", 'info');
                }
            } else {
                showMgs("Ocurrió un error al obtener los datos.", 'error');
                return;
            }
        } else if (response === "error") {
            showMgs("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sDdr(cveOS, cveUP, idUsuario, eFiscal, txtNombreTitular, txtNombreCoor, txtNombreEnlace, txtNombreIntegro, txtNombreAutorizo, idCtrl) {
    fetchDataArr(4, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idUser: idUsuario, _txtNombreTitular: txtNombreTitular, _txtNombreCoor: txtNombreCoor, _txtNombreEnlace: txtNombreEnlace, _txtNombreIntegro: txtNombreIntegro, _txtNombreAutorizo: txtNombreAutorizo, _idCtrlDatos: idCtrl }, 5, function (response) {
        if (response) {
            logger.log(`%cRespuesta a INSERT DATOS ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            if (responseS[0] === "ok") {
                showMgs("Se insertaron correctamente los datos para los reporte, por lo cual ya puede generarlos.", 'success');
                clearForms(1);
            } else if (responseS[0] === "error") {
                showMgs("Ocurrio un error al insertar los datos para los reportes.", 'error');
            } else if (responseS[0] === "existe") {
                showMgs("Detectamos que existen datos. Contacte al administrador", 'error');
            }
            gDr(cveOS, cveUP, eFiscal);
        } else if (response === "error") {
            showMgs("Error al cargar datos", 'error');
        }
    });
    $("#btnS_Datos").removeAttr("disabled");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var obtenerSelectDatosEfiscal = function () {
    fetchDataArr(0, {}, 5, function (response) {
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
    fetchDataArr(1, { _txtEfiscal: txtEfiscal }, 5, function (response) {
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
    fetchDataArr(2, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 5, function (response) {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    loadEndpoints(5);
    obtenerSelectDatosEfiscal();
    obtenerSelectDatosOS(cveEfiscald);
    obtenerSelectDatosUP(cveEfiscald, cveOSd, '')
    if (idRolUser === '101') {
        logger.log("Usuario captura");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", true);

        gDr(cveOSd, cveUPd, cveEfiscald);
    } else if (idRolUser === '103' || idRolUser === '104') {
        logger.log("Usuario administrador");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
    }

    $(document).on("click", "#btnSearch", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();

        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            gDr(cveOS, cveUP, eFiscal);
        }
    });

    $(document).on("change", "#cboOs, #cboUp, #cboEfiscal", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();

        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            gDr(cveOS, cveUP, eFiscal);
        }
    });

    $(document).on("click", "#btnS_Datos", async function () {
        $("#btnS_Datos").attr("disabled", true);
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        var idReturn = $(this)[0].dataset.ctrlDatos;

        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (validarFormularioDatos() === true) {
                const txtNombreTitularData = $("#txtNombreTitular").val().trim();
                const txtNombreCoorData = $("#txtNombreCoor").val().trim();
                const txtNombreEnlaceData = $("#txtNombreEnlace").val().trim();
                const txtNombreIntegroData = $("#txtNombreIntegro").val().trim();
                const txtNombreAutorizoData = $("#txtNombreAutorizo").val().trim();
                const idCtrlDatos = idReturn
                sDdr(cveOS, cveUP, idUser, eFiscal, txtNombreTitularData, txtNombreCoorData, txtNombreEnlaceData, txtNombreIntegroData, txtNombreAutorizoData, idCtrlDatos);
            } else {
                $("#btnS_Datos").removeAttr("disabled");
            }
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validarFormularioDatos() {
    let esValido = true;

    const txtNombreTitular = $("#txtNombreTitular").val().trim();
    if (txtNombreTitular === "") {
        showMsgForm("txtNombreTitular", "Ingrese el nombre del titular a quien va dirigido.", 'error');
        esValido = false;
    }

    const txtNombreCoor = $("#txtNombreCoor").val().trim();
    if (txtNombreCoor === "") {
        showMsgForm("txtNombreCoor", "Ingrese el nombre del coordinador de control interno.", 'error');
        esValido = false;
    }

    const txtNombreEnlace = $("#txtNombreEnlace").val().trim();
    if (txtNombreEnlace === "") {
        showMsgForm("txtNombreEnlace", "Ingrese el nombre del enlace de administración de riesgos.", 'error');
        esValido = false;
    }

    const txtNombreIntegro = $("#txtNombreIntegro").val().trim();
    if (txtNombreIntegro === "") {
        showMsgForm("txtNombreIntegro", "Ingrese el nombre de quien integro los datos.", 'error');
        esValido = false;
    }

    const txtNombreAutorizo = $("#txtNombreAutorizo").val().trim();
    if (txtNombreAutorizo === "") {
        showMsgForm("txtNombreAutorizo", "Ingrese el nombre de quien autorizo los datos.", 'error');
        esValido = false;
    }

    return esValido;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearForms(type) {
    if (type === 1) {
        $("#txtNombreTitular").val("");
        $("#txtNombreCoor").val("");
        $("#txtNombreEnlace").val("");
        $("#txtNombreIntegro").val("");
        $("#txtNombreAutorizo").val("");
    } else if (type === 2) {
    } else if (type === 3) {
    } else if (type === 4) {
    } else if (type === 5) {
    } else if (type === 6) {
    }
}