'use strict';

var idUser = $("#MainContent_hddnIdUsuario").val();
var idRolUser = $("#MainContent_hddnPage").val();
var cveOSd = $("#MainContent_hddnOS").val().trim();
var cveUPd = $("#MainContent_hddnUP").val().trim();
var cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();

const d = new Date();
const numberMonth = parseInt(d.getMonth()) + 1;

const s03 = $("#alertSpin");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validateFileCer(input) {
    const fileName = input.value;

    const allowedExtensions = /(\.cer)$/i;

    if (!allowedExtensions.exec(fileName)) {
        showMsg('Por favor, seleccione un archivo con extensión .cer.', 'error');
        input.value = '';
        return false;
    }

    showMsg('Archivo valido.', 'success');
    return true;
}

function validateFileKey(input) {
    const fileName = input.value;

    const allowedExtensions = /(\.key)$/i;

    if (!allowedExtensions.exec(fileName)) {
        showMsg('Por favor, seleccione un archivo con extensión .key.', 'error');
        input.value = '';
        return false;
    }

    showMsg('Archivo valido.', 'success');
    return true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var obtenerSelectDatosEfiscal = function () {
    fetchDataArr(0, {}, 8, function (response) {
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
    fetchDataArr(1, { _txtEfiscal: txtEfiscal }, 8, function (response) {
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
    fetchDataArr(2, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 8, function (response) {
        if (response) {
            const select = $("#cboUp");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.Cve_Unidad_Presupuestal, text: item.Txt_Unidad_Presupuestal })); });
            if (cveUPd === '') {
                select.val(0);
            } else {
                if (tipo === 'cambio') {
                    if (txtOS === cveOSd) {
                        select.val(cveUPd);
                    } else {
                        select.val(0);

                    }
                } else {
                    select.val(cveUPd);
                }
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getReportesGA(eFiscal) {
    var html = '';
    fetchDataArr(3, { _eFiscal: eFiscal }, 8, function (response) {
        if (response) {
            logger.log(`%cDatos devueltos sobre REPORTES GLOBALES ENLACE DE RIESGOS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var sumHtml = "";
                        var disabledBtn = "";
                        if (item.FIRMA01 === null) {
                            sumHtml += "";
                        } else {
                            sumHtml += `<button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.IDRG01}' data-nivel='1'>Ver firma 01</button>`;
                        }

                        if (item.FIRMA02 === null) {
                            sumHtml += "";
                        } else {
                            sumHtml += `<button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.IDRG02}' data-nivel='2'>Ver firma 03</button>`;
                        }

                        if (item.FIRMA03 === null) {
                            sumHtml += "";
                        } else {
                            sumHtml += `<button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.IDRG03}' data-nivel='3'>Ver firma 02</button>`;
                        }

                        if (item.ID_ESTATUS === 1) {
                            disabledBtn = "";
                        } else {
                            disabledBtn = "disabled";
                        }

                        html += `<tr>
                                        <td class='text-1000'>${item.DESC_REPORTE}</td>
                                        <td class='text-end'>
                                            <div>
                                                <button class='btn btn-sm btn-falcon-warning btnSignReporte customButton m-1 ${disabledBtn}' type='button' 
                                                    data-ctrl-reporte='${item.ID_CTRL_REPORTE}' 
                                                    data-reporte='${item.ID_REPORTE}'
                                                    data-nivel='1'>Firmar reporte</button>
                                                ${sumHtml}
                                            </div>
                                        </td>
                                    </tr>`
                    });
                    recargarTabla("tableReporteGlobal", html);
                } else {
                    recargarTabla("tableReporteGlobal", null);
                    showMsg("Registre al menos un reporte para iniciar.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getReportesGAA(eFiscal) {
    var html = '';
    fetchDataArr(3, { _eFiscal: eFiscal }, 8, function (response) {
        if (response) {
            logger.log("%cDatos devueltos sobre REPORTES GLOBALES COORDINADOR DE RIESGOS", "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var sumHtml = "";
                        var disabledBtn = "";
                        if (item.FIRMA01 === null) {
                            sumHtml += "";
                        } else {
                            sumHtml += `<button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.IDRG01}' data-nivel='1'>Ver firma 01</button>`;
                        }

                        if (item.FIRMA02 === null) {
                            sumHtml += "";
                        } else {
                            sumHtml += `<button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.IDRG02}' data-nivel='2'>Ver firma 03</button>`;
                        }

                        if (item.FIRMA03 === null) {
                            sumHtml += "";
                        } else {
                            sumHtml += `<button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.IDRG03}' data-nivel='3'>Ver firma 02</button>`;
                        }

                        if (item.ID_ESTATUS === 6) {
                            disabledBtn = "";
                        } else {
                            disabledBtn = "disabled";
                        }

                        html += `<tr>
                                        <td class='text-1000'>${item.DESC_REPORTE}</td>
                                        <td class='text-end'>
                                            <div>
                                                <button class='btn btn-sm btn-falcon-warning btnSignReporte customButton m-1 ${disabledBtn}' type='button' 
                                                    data-ctrl-reporte='${item.ID_CTRL_REPORTE}' 
                                                    data-reporte='${item.ID_REPORTE}'
                                                    data-nivel='3'>Firmar reporte</button>
                                                ${sumHtml}
                                            </div>
                                        </td>
                                    </tr>`
                    });
                    recargarTabla("tableReporteGlobal", html);
                } else {
                    recargarTabla("tableReporteGlobal", null);
                    showMsg("Registre al menos un reporte para iniciar.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getReportesGAAA(eFiscal) {
    var html = '';
    fetchDataArr(3, { _eFiscal: eFiscal }, 8, function (response) {
        if (response) {
            logger.log("%cDatos devueltos sobre REPORTES GLOBALES SECRETARIA", "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var sumHtml = "";
                        var disabledBtn = "";
                        if (item.FIRMA01 === null) {
                            sumHtml += "";
                        } else {
                            sumHtml += `<button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.IDRG01}' data-nivel='1'>Ver firma 01</button>`;
                        }

                        if (item.FIRMA02 === null) {
                            sumHtml += "";
                        } else {
                            sumHtml += `<button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.IDRG02}' data-nivel='2'>Ver firma 03</button>`;
                        }

                        if (item.FIRMA03 === null) {
                            sumHtml += "";
                        } else {
                            sumHtml += `<button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.IDRG03}' data-nivel='3'>Ver firma 02</button>`;
                        }

                        if (item.ID_ESTATUS === 10) {
                            disabledBtn = "";
                        } else {
                            disabledBtn = "disabled";
                        }

                        html += `<tr>
                                        <td class='text-1000'>${item.DESC_REPORTE}</td>
                                        <td class='text-end'>
                                            <div>
                                                <button class='btn btn-sm btn-falcon-warning btnSignReporte customButton m-1 ${disabledBtn}' type='button' 
                                                    data-ctrl-reporte='${item.ID_CTRL_REPORTE}' 
                                                    data-reporte='${item.ID_REPORTE}'
                                                    data-nivel='2'>Firmar reporte</button>
                                                ${sumHtml}
                                            </div>
                                        </td>
                                    </tr>`
                    });
                    recargarTabla("tableReporteGlobal", html);
                } else {
                    recargarTabla("tableReporteGlobal", null);
                    showMsg("Registre al menos un reporte para iniciar.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function setSign(data) {
    const setSign = await new Promise((resolve, reject) => {
        $(".btn-close").attr("disabled", true);
        fetchDataArr(6, data, 8, (response) => {
            if (response) resolve(response);
            else reject(new Error("Error en fetchDataArr 6 Firma"));
        });
    });
    logger.error("RESULTADO OBTENIDO DE AWAIT SYNC FIRMA: ", setSign);
    if (setSign) {
        $(".btn-close").removeAttr("disabled");
        showMsg("Reportes firmados.", 'success');
        $("#btnFirmarReports").removeAttr("disabled");
        s03.hide();
        clearForms(1);
        if (idRolUser === '101') {
            getReportesGA(data._Efiscal);
        } else if (idRolUser === '102') {
            getReportesGAA(data._Efiscal);
        } else if (idRolUser === '103') {
            etReportesGAAA(data._Efiscal);
        }
        $("#txtRFCGet").text(0);
        $("#modalFormSign").modal("hide");
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    s03.hide();
    loadEndpoints(8);
    obtenerSelectDatosEfiscal();
    obtenerSelectDatosOS(cveEfiscald);
    obtenerSelectDatosUP(cveEfiscald, cveOSd, '')
    if (idRolUser === '101') {
        logger.log("Usuario Vero");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#btnGroupVerticalDrop1").show();

        getReportesGA(cveEfiscald);
    } else if (idRolUser === '102') {
        logger.log("Usuario Leo");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#btnGroupVerticalDrop1").hide();
        getReportesGAA(cveEfiscald);
    } else if (idRolUser === '103') {
        logger.log("Usuario Esther");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#btnGroupVerticalDrop1").hide();
        getReportesGAAA(cveEfiscald)
    }

    $(document).on("change", "#cboEfiscal, #cboOs, #cboUp", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (idRolUser === '101') {
            if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { getReportesGA(eFiscal); }
        } else if (idRolUser === '102') {
            if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { getReportesGAA(eFiscal); }
        } else if (idRolUser === '103') {
            if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { getReportesGAAA(eFiscal); }
        }
    });


    $(document).on("click", "#btnSearch", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (idRolUser === '101') {
            if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { getReportesGA(eFiscal); }
        } else if (idRolUser === '102') {
            if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { getReportesGAA(eFiscal); }
        } else if (idRolUser === '103') {
            if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { getReportesGAAA(eFiscal); }
        }
    });

    $(document).on("click", ".btnR", async function () {
        const idReturn = $(this)[0].dataset.ctrlId;
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataE(eFiscal)) {
            fetchDataArr(5, { _idReporte: idReturn, _idUser: idUser, _eFiscal: eFiscal }, 8, function (response) {
                if (response) {
                    logger.log(`%cDatos devueltos sobre INSERT NUEVO CTRL REPORTE ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    var responseS = response.split("|");
                    if (responseS[0] === "ok") {
                        showMsg("Se inserto correctamente los datos.", 'success');
                        $("#modalComentarioForm").modal("hide");
                    } else if (responseS[0] === "error") {
                        showMsg("Ocurrio un error al insertar los datos.", 'error');
                    } else if (responseS[0] === "existe") {
                        showMsg("Detectamos que existe datos similares.", 'error');
                    }
                    getReportesGA(eFiscal);
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                }
            });
        }
    });

    $(document).on("click", ".btnSignReporte", function () {
        const idReturn = $(this)[0].dataset.ctrlReporte;
        const idReturn2 = $(this)[0].dataset.reporte;
        const idReturn3 = $(this)[0].dataset.nivel;
        fetchDataArr(4, { _idUsuario: idUser, __idRol: idRolUser }, 8, function (reponseSign) {
            if (reponseSign) {
                logger.log(`%cRESPUESTA DE DATOS USUARIOO FIRMA: ${reponseSign}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                if (reponseSign !== 'error') {
                    $("#btnFirmarReports").attr("data-ctrl-reporte", idReturn);
                    $("#btnFirmarReports").attr("data-reporte", idReturn2);
                    $("#btnFirmarReports").attr("data-nivel", idReturn3);
                    $("#txtRFCGet").text(reponseSign[0].TXT_RFC);
                    $("#modalFormSign").modal("show");
                } else {
                    showMsg("Ocurrió un error al obtener los datos.", 'error');
                    return;
                }
            } else if (reponseSign === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", "#btnFirmarReports", function () {
        $("#btnFirmarReports").attr("disabled", true);
        const idReturn = $(this)[0].dataset.ctrlReporte;
        const idReturn2 = $(this)[0].dataset.reporte;
        const idReturn3 = $(this)[0].dataset.nivel;

        s03.show();
        var archivosBytes = [];
        const inputFile1 = $("#fileCer");
        const inputFile2 = $("#fileKey");
        var pass = $("#txtPassFiel").val();
        var rfc = $("#txtRFCGet").text();
        const file1 = inputFile1[0].files[0];
        const file2 = inputFile2[0].files[0];
        var eFiscal = $("#cboEfiscal").val();

        if (pass === "") {
            showMsg('Contraseña FIEL vacia.', 'error');
            $("#btnFirmarReports").removeAttr("disabled");
            s03.hide();
            clearForms(1);
            return;
        }

        if (rfc === "" || rfc === null) {
            showMsg('Ocurrio un error con su RFC, contacte al administrador.', 'error');
            $("#btnFirmarReports").removeAttr("disabled");
            s03.hide();
            clearForms(1);
            return;
        }

        if (file1 && file2) {
            let fileBytes1;
            let fileBytes2;

            var reader1 = new FileReader();
            var reader2 = new FileReader();

            reader1.onload = function (e) {
                fileBytes1 = new Uint8Array(e.target.result);
                reader2.readAsArrayBuffer(file2);
            };

            reader2.onload = function (e) {
                fileBytes2 = new Uint8Array(e.target.result);
                archivosBytes.push(fileBytes1, fileBytes2);
                const joinData = { listValue: "" + fileBytes1 + "", listValue2: "" + fileBytes2 + "", passFiel: pass, txtRFC: rfc, idUsuario: idUser, idRolUsuario: idRolUser, _Efiscal: eFiscal, _idReporte: idReturn2, _idCtrlReporte: idReturn, _idNivel: idReturn3 };
                setSign(joinData)
            };

            reader1.readAsArrayBuffer(file1);

        } else {
            showMsg('No ha insertado ningun archivo, favor de ingresarlo.', 'error');
            $("#btnFirmarReports").removeAttr("disabled");
            s03.hide();
            clearForms(1);
            return;
        }
    });

    $(document).on("click", ".btnDownloadFirma", function () {
        var idReturn1 = $(this)[0].dataset.ctrlWs;
        var idNivel = $(this)[0].dataset.nivel;
        if (idReturn1 === null) {
            showMsg("Ocurrió un error al obtener los datos.", 'error');
            return;
        }
        fetchDataArr(8, { _idCtrl: idReturn1, _idNivel: idNivel }, 8, function (response) {
            if (response) {
                logger.log(`%cRESPUESTA DE DATOS REPORTE FIRMA: ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                if (response !== 'error') {
                    var splitResponse = response.split("|");
                    if (splitResponse[1] === '2') {
                        showMsg('Respuesta del servidor: ' + splitResponse[0] + '', 'success');
                        var splitResult = splitResponse[2].split(",")
                        saveByteArray(splitResult[0] + splitResult[1], base64ToArrayBuffer(splitResult[2]), splitResult[3])
                    } else {
                        showMsg('Respuesta del servidor: ' + splitResponse[0] + '', 'error');
                    }
                } else {
                    showMsg("Ocurrió un error al obtener los datos.", 'error');
                    return;
                }
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearForms(type) {
    if (type === 1) {
        $("#fileCer").val('');
        $("#fileKey").val('');
        $("#txtPassFiel").val('');
    } else if (type === 2) {
    } else if (type === 3) {
    } else if (type === 4) {
    } else if (type === 5) {
    } else if (type === 6) {
    }
}