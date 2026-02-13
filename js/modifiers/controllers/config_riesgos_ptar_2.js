'use strict';

const timingNoty = 3500;
var idUser = $("#MainContent_hddnIdUsuario").val();
var idRolUser = $("#MainContent_hddnPage").val();
var cveOSd = $("#MainContent_hddnOS").val().trim();
var cveUPd = $("#MainContent_hddnUP").val().trim();
var cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();

var cveOrg = $("#cboOs").val();
var cveUni = $("#cboUp").val();
var eFiscal = $("#cboEfiscal").val();

const d = new Date();

//const accord01 = $("#accordionInsert");

const divForFile = $("#divInputArchivo");
const inputFile = $("#customFile");
const divForLink = $("#divInputEnlace");
const inputLink = $("#txtUrl");
const divInfo = $("#divInfo");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDataRiesgos(cveOS, cveUP, idTrimestre, eFiscal) {
    var html = "";
    fetchDataArr(3, { _OS: cveOS, _UP: cveUP, _idTrimestre: idTrimestre, _eFiscal: eFiscal }, 1, function (response) {
        if (response) {
            logger.log("Datos recibidos a RIESGO EVIDENCIAS:", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        const textBtnSend = item.SN_ENVIA === true ? 'Reportado / Ver' : 'Reportar y enviar evidencias';
                        const classBtnSend = item.SN_ENVIA === true ? 'btn-falcon-info' : 'btn-falcon-danger';
                        const textColumnValidate = item.SN_VALIDA === null ? 'En espera de validación' : item.SN_VALIDA === true ? 'Validado, listo para reportar en trimestre' : 'Rechazado, verifique sus observaciones';
                        const colorBadgeValidate = item.SN_VALIDA === null ? 'badge badge-subtle-primary' : item.SN_VALIDA === true ? 'badge badge-subtle-success' : 'badge badge-subtle-danger';
                        //const valControlModal = item.SN_VALIDA === false && item.SN_ENVIA === false ? 1 : 0;
                        html += `<tr>
                                    <td class='text-1000'>${item.NO_ACTIVIDAD}</td>
                                    <td class='text-1000'>${item.DESC_ACTIVIDAD}</td>
                                    <td class='text-1000'>${item.ID_MES}</td>
                                    <td class=''><span class='${colorBadgeValidate} d-block p-2 m-1 fs-10-5'>${textColumnValidate}</span></td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm ${classBtnSend} btnSeeDatosRiesgoxEvidencia customButton m-1' type='button' data-ctrl-actividad='${item.ID_CTRL_ACTIVIDAD}' data-ctrl-trimestre='${item.ID_TRIMESTRE}' data-ctrl-modal='0'>${textBtnSend}</button>
                                            <button class='btn btn-sm btn-falcon-primary btnSeeObservaciones customButton m-1' type='button' data-ctrl-actividad='${item.ID_CTRL_ACTIVIDAD}'>Ver observaciones</button>
                                        </div>
                                    </td>
                                </tr>`
                    });
                    recargarTabla("containerDataActividad_x_Trimestre", html);
                } else {
                    recargarTabla("containerDataActividad_x_Trimestre", null);
                    showMsg("No existen actividades.", 'error');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataRiesgosA(cveOS, cveUP, idTrimestre, eFiscal) {
    var html = "";
    fetchDataArr(3, { _OS: cveOS, _UP: cveUP, _idTrimestre: idTrimestre, _eFiscal: eFiscal }, 1, function (response) {
        if (response) {
            logger.log("Datos recibidos a RIESGO EVIDENCIAS:", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        const textBtnSend = item.SN_ENVIA === true ? 'Reportado / Ver evidencias' : 'Ver evidencias';
                        const classBtnSend = item.SN_ENVIA === true ? 'btn-falcon-info' : 'btn-falcon-danger';
                        const textColumnValidate = item.SN_VALIDA === null ? 'En espera de validación' : item.SN_VALIDA === true ? 'Validado' : 'Rechazado';
                        const colorBadgeValidate = item.SN_VALIDA === null ? 'badge bg-primary' : item.SN_VALIDA === true ? 'badge bg-success' : 'badge bg-danger';
                        //const valControlModal = item.SN_VALIDA === false && item.SN_ENVIA === false ? 1 : 0;
                        var disabledBtn = item.SN_ENVIA === null ? 'disabled' : item.SN_ENVIA === true ? '' : 'disabled';
                        if (disabledBtn === 'disabled') {
                            disabledBtn = 'disabled';
                        } else if (disabledBtn === '') {
                            if (item.SN_VALIDA === true) {
                                disabledBtn = 'disabled';
                            } else {
                                disabledBtn = '';
                            }
                        }

                        html += `<tr>
                                    <td class='text-1000'>${item.NO_ACTIVIDAD}</td>
                                    <td class='text-1000'>${item.DESC_ACTIVIDAD}</td>
                                    <td class='text-1000'>${item.ID_MES}</td>
                                    <td class=''><span class='${colorBadgeValidate} d-block p-2 m-1 fs-10-5'>${textColumnValidate}</span></td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm ${classBtnSend} btnSeeDatosRiesgoxEvidencia customButton m-1' type='button' data-ctrl-actividad='${item.ID_CTRL_ACTIVIDAD}' data-ctrl-trimestre='${item.ID_TRIMESTRE}' data-ctrl-modal='1'>${textBtnSend}</button>
                                            <button class='btn btn-sm btn-falcon-primary btnSeeObservaciones customButton m-1' type='button' data-ctrl-actividad='${item.ID_CTRL_ACTIVIDAD}'>Ver observaciones</button>
                                            <button class='btn btn-sm btn-falcon-success btnSetValidate customButton m-1 ${disabledBtn}' type='button' data-ctrl-actividad='${item.ID_CTRL_ACTIVIDAD}' data-ctrl-trimestre='${item.ID_TRIMESTRE}' data-ctrl-modal='1'>Validar</button>
                                            <button class='btn btn-sm btn-falcon-danger btnSetRejected customButton m-1 ${disabledBtn}' type='button' data-ctrl-actividad='${item.ID_CTRL_ACTIVIDAD}' data-ctrl-trimestre='${item.ID_TRIMESTRE}' data-ctrl-modal='1'>Rechazar</button>
                                        </div>
                                    </td>
                                </tr>`
                    });
                    recargarTabla("containerDataActividad_x_Trimestre", html);
                } else {
                    recargarTabla("containerDataActividad_x_Trimestre", null);
                    showMsg("No existen actividades.", 'error');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataActividad(_idActividad, cveOS, cveUP) {
    fetchDataArr(4, { _idCtrlActividad: _idActividad, _OS: cveOS, _UP: cveUP }, 1, function (response) {
        if (response) {
            logger.log("Datos recibidos a ACTIVIDAD EVIDENCIAS:", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        $("#txtDescActividad").val(item.DESC_ACTIVIDAD);
                        $("#txtMedios").val(item.EVIDENCIA);
                        $("#txtTrimestre").val(item.DESC_TRIMESTRE);
                        $("#txtTrimestre").attr('data-ctrl-trimestre', item.ID_TRIMESTRE);
                        $("#txtMes").val(item.ID_MES);
                        getDataEvidencia(item.ID_CTRL_ACTIVIDAD);
                    });
                } else {
                    showMsg("No existen actividades.", 'error');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataActividadA(_idActividad, cveOS, cveUP) {
    fetchDataArr(4, { _idCtrlActividad: _idActividad, _OS: cveOS, _UP: cveUP }, 1, function (response) {
        if (response) {
            logger.log("Datos recibidos a ACTIVIDAD EVIDENCIAS ADMIN:", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        $("#txtDescActividadA").val(item.DESC_ACTIVIDAD);
                        $("#txtMediosA").val(item.EVIDENCIA);
                        $("#txtTrimestreA").val(item.DESC_TRIMESTRE).attr('data-ctrl-trimestre', item.ID_TRIMESTRE);
                        $("#txtMesA").val(item.ID_MES);
                        getDataEvidenciaA(item.ID_CTRL_ACTIVIDAD);
                    });
                } else {
                    showMsg("No existen actividades.", 'error');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataActividadByIdA(idActividad) {
    fetchDataArr(6, { _idCtrlActividad: idActividad }, 1, function (response) {
        if (response) {
            logger.error("Datos recibidos a DATA ACTIVIDAD ADMIN:", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    fetchDataArr(14, { _idCtrlActividad: idActividad }, 1, function (response) {
                        if (response) {
                            if (response.length === 1) {
                                logger.log("Datos recibidos a DATA REPORTE ACTIVIDAD ADMIN:", response);
                                $("#txtDescripcionEvidenciasA").val(response[0].DESC_EVIDENCIAS).attr("disabled", true);
                                $("#txtDescripcionReporteA").val(response[0].DESC_REPORTE).attr("disabled", true);
                            } else {
                                $("#txtDescripcionEvidenciasA").val("").attr("disabled", true);
                                $("#txtDescripcionReporteA").val("").attr("disabled", true);
                            }
                        }
                    });
                } else {
                    showMsg("Ocurrio un error al intentar obtener los datos de la actividad.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataEvidencia(idActividad) {
    getDataActividadById(idActividad);
    var html = "";
    fetchDataArr(5, { _idCtrlActividad: idActividad }, 1, function (response) {
        if (response) {
            logger.log("Datos recibidos a EVIDENCIAS:", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    showMsg("La actividad contiene evidencias. " + response.length + "", 'info');
                    response.forEach(function (item) {
                        if (item.ID_TIPO_DOCUMENTO === 1 || item.ID_TIPO_DOCUMENTO === 2 || item.ID_TIPO_DOCUMENTO === 4) {
                            html += `<tr>
                                        <td class='text-1000'>${item.DESC_DOCUMENTO}</td>
                                        <td class='text-1000'>${item.NOMBRE_EVIDENCIA}</td>
                                        <td class='text-1000'>${item.DESC_EVIDENCIA}</td>
                                        <td class='text-end'>
                                            <div>
                                                <button class='btn btn-link p-0 btnDownloadDoc' type='button' data-bs-toggle='tooltip' data-bs-placement='top' title='Documento' data-ctrl-evidencia='${item.ID_CTRL_EVIDENCIA}'><span class='text-500 fas fa-download'></span></button>
                                            </div>
                                        </td>
                                    </tr>`
                        } else if (item.ID_TIPO_DOCUMENTO === 3) {
                            html += `<tr>
                                        <td class='text-1000'>${item.DESC_DOCUMENTO}</td>
                                        <td class='text-1000'>${item.NOMBRE_EVIDENCIA}</td>
                                        <td class='text-1000'>${item.DESC_EVIDENCIA}</td>
                                        <td class='text-end'>
                                            <div>
                                                <a class='btn btn-link p-0' href="${item.URL_BUFALO}" target="_blank" type='button' data-bs-toggle='tooltip' data-bs-placement='top' title='Enlace'><span class='text-500 fas fa-link'></span></a>
                                            </div>
                                        </td>
                                    </tr>`
                        }
                    });
                    recargarTablaSinOpciones("containerDataActividad_x_Evidencia", html);
                } else {
                    recargarTablaSinOpciones("containerDataActividad_x_Evidencia", null);
                    showMsg("La actividad no contiene evidencias, favor de insertar al menos una evidencia.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataActividadById(idActividad) {
    fetchDataArr(6, { _idCtrlActividad: idActividad }, 1, function (response) {
        if (response) {
            logger.error("Datos recibidos a DATA ACTIVIDAD:", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    $("#btnS_Evidencia").attr("data-ctrl-actividad", response[0].ID_CTRL_ACTIVIDAD);
                    $("#btnS_DescEvidencia").attr("data-ctrl-actividad", response[0].ID_CTRL_ACTIVIDAD);
                    $("#btnR_EnviarActividad").attr("data-ctrl-actividad", response[0].ID_CTRL_ACTIVIDAD);
                    fetchDataArr(14, { _idCtrlActividad: idActividad }, 1, function (response) {
                        if (response) {
                            if (response.length === 1) {
                                logger.log("Datos recibidos a DATA REPORTE ACTIVIDAD:", response);
                                $("#btnS_DescEvidencia").attr("data-ctrl-report-actividad", response[0].ID_CTRL_REPORTE_ACTIVIDAD);
                                $("#btnR_EnviarActividad").attr("data-ctrl-report-actividad", response[0].ID_CTRL_REPORTE_ACTIVIDAD);
                                $("#txtDescripcionEvidencias").val(response[0].DESC_EVIDENCIAS);
                                $("#txtDescripcionReporte").val(response[0].DESC_REPORTE);
                                $("#btnS_DescEvidencia").text("Editar descripciones");
                                if (response[0].SN_ENVIA === false || response[0].SN_ENVIA === null) {
                                    $("#btnR_EnviarActividad").removeAttr("disabled");
                                    $("#btnS_DescEvidencia").removeAttr("disabled");
                                    if (response[0].SN_VALIDA === false || response[0].SN_VALIDA === null) {
                                        $("#btnS_Evidencia").removeAttr("disabled");
                                        $("#cboDocumento").removeAttr("disabled");
                                        $("#txtDescEvidencia").removeAttr("disabled");
                                        $("#txtDescripcionEvidencias").removeAttr("disabled");
                                        $("#txtDescripcionReporte").removeAttr("disabled");
                                    } else {
                                        $("#btnS_Evidencia").attr("disabled", true);
                                        $("#txtDescripcionEvidencias").attr("disabled", true);
                                        $("#txtDescripcionReporte").attr("disabled", true);
                                        $("#cboDocumento").attr("disabled", true);
                                        $("#txtDescEvidencia").attr("disabled", true);
                                    }
                                } else {
                                    $("#btnR_EnviarActividad").attr("disabled", true);
                                    $("#txtDescripcionEvidencias").attr("disabled", true);
                                    $("#txtDescripcionReporte").attr("disabled", true);
                                    $("#btnS_DescEvidencia").attr("disabled", true);
                                    $("#btnS_Evidencia").attr("disabled", true);
                                    $("#cboDocumento").attr("disabled", true);
                                    $("#txtDescEvidencia").attr("disabled", true);
                                }
                            } else {
                                clearForms(2);
                                $("#btnS_DescEvidencia").attr("data-ctrl-report-actividad", 0);
                                $("#btnR_EnviarActividad").attr("data-ctrl-report-actividad", 0);
                                $("#btnS_DescEvidencia").text("Guardar descripciones");
                                $("#btnS_DescEvidencia").removeAttr("disabled");
                                $("#btnS_Evidencia").removeAttr("disabled");
                                $("#btnR_EnviarActividad").removeAttr("disabled");
                                $("#txtDescripcionEvidencias").removeAttr("disabled");
                                $("#txtDescripcionReporte").removeAttr("disabled");
                                $("#cboDocumento").removeAttr("disabled");
                                $("#txtDescEvidencia").removeAttr("disabled");
                            }
                        }
                    });
                } else {
                    showMsg("Ocurrio un error al intentar obtener los datos de la actividad.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataEvidenciaA(idActividad) {
    getDataActividadByIdA(idActividad);
    var html = "";
    fetchDataArr(5, { _idCtrlActividad: idActividad }, 1, function (response) {
        if (response) {
            logger.log("Datos recibidos a EVIDENCIAS:", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    showMsg("La actividad contiene evidencias. " + response.length + "", 'info');
                    response.forEach(function (item) {
                        if (item.ID_TIPO_DOCUMENTO === 1 || item.ID_TIPO_DOCUMENTO === 2 || item.ID_TIPO_DOCUMENTO === 4) {
                            html += `<tr>
                                        <td class='text-1000'>${item.DESC_DOCUMENTO}</td>
                                        <td class='text-1000'>${item.NOMBRE_EVIDENCIA}</td>
                                        <td class='text-1000'>${item.DESC_EVIDENCIA}</td>
                                        <td class='text-end'>
                                            <div>
                                                <button class='btn btn-link p-0 btnDownloadDoc' type='button' data-bs-toggle='tooltip' data-bs-placement='top' title='Documento' data-ctrl-evidencia='${item.ID_CTRL_EVIDENCIA}'><span class='text-500 fas fa-download'></span></button>
                                            </div>
                                        </td>
                                    </tr>`
                        } else if (item.ID_TIPO_DOCUMENTO === 3) {
                            html += `<tr>
                                        <td class='text-1000'>${item.DESC_DOCUMENTO}</td>
                                        <td class='text-1000'>${item.NOMBRE_EVIDENCIA}</td>
                                        <td class='text-1000'>${item.DESC_EVIDENCIA}</td>
                                        <td class='text-end'>
                                            <div>
                                                <a class='btn btn-link p-0' href="${item.URL_BUFALO}" target="_blank" type='button' data-bs-toggle='tooltip' data-bs-placement='top' title='Enlace'><span class='text-500 fas fa-link'></span></a>
                                            </div>
                                        </td>
                                    </tr>`
                        }
                    });
                    recargarTablaSinOpciones("containerDataActividad_x_EvidenciaA", html);
                } else {
                    recargarTablaSinOpciones("containerDataActividad_x_EvidenciaA", null);
                    showMsg("La actividad no contiene evidencias, favor de insertar al menos una evidencia.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataEvidenciaById(idEvidencia) {
    fetchDataArr(11, { _idCtrlEvidencia: idEvidencia }, 1, function (response) {
        if (response) {
            logger.log("Datos recibidos a DESCARGA EVIDENCIAS:", response);
            var responseS = response.split("|");
            if (responseS[1] === '1') {
                showMsg('Respuesta del servidor: ' + responseS[0] + '', 'success');
                mostrarFichero(responseS[2]);
                // } else if (splitResponse[1] === '2') {
                //     showMsg('Respuesta del servidor: ' + splitResponse[0] + '', 'success');
                //     var splitResult = splitResponse[2].split(",")
                //     saveByteArray(splitResult[0] + splitResult[1], base64ToArrayBuffer(splitResult[2]), splitResult[3])
            } else {
                showMsg('Respuesta del servidor: ' + responseS[0] + '', 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataEvidencias(idActividad, idReporteActividad) {
    fetchDataArr(5, { _idCtrlActividad: idActividad }, 1, function (response) {
        if (response) {
            logger.info("Datos recibidos a EVIDENCIAS:", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    fetchDataArr(14, { _idCtrlActividad: idActividad }, 1, function (response) {
                        if (response) {
                            if (response.length === 1) {
                                fetchDataArr(15, { _idCtrlReporteActividad: idReporteActividad }, 1, function (response) {
                                    if (response) {
                                        logger.info("Datos recibidos a UPDATE REPORTE:", response);
                                        var responseS = response.split("|");
                                        if (responseS !== 'error') {
                                            showMsg("Se reporto la actividad y reporte de evidencia.", 'error');
                                        } else {
                                            showMsg("Ocurrió un error al mostrar resultados.", 'error');
                                        }
                                    } else if (response === "error") {
                                        showMsg("Error al cargar datos", 'error');
                                    }
                                });
                                showMsg("Enviando...", 'info');
                            } else {
                                showMsg("No se puede reportar, porque no existen las descripciones de su reporte y evidencias, favor de revisar.", 'warning');
                            }
                        } else if (response === "error") {
                            showMsg("Error al cargar datos", 'error');
                        }
                    });
                } else {
                    showMsg("No se puede reportar, porque no existe ninguna evidencia, favor de revisar.", 'warning');
                }
            } else {
                showMsg("Ocurrió un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#btnR_EnviarActividad").removeAttr("disabled");
}

function gDoByIda(idCtrlActividad) {
    var html = '';
    fetchDataArr(18, { _idCtrlActividad: idCtrlActividad }, 1, function (response) {
        if (response) {
            logger.error("Datos recibidos de OBSERVACIONES BY ID ACTIVIDAD: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        const nDI = new Date(+item.FEC_ACTUALIZA.replace(/\D/g, '')).toISOString();
                        var disabledBtn = item.SN_SOLVENTA === true ? 'disabled' : '';
                        html += `<tr>
                                    <td class='text-1000'>${item.DESC_OBSERVACION}</td>
                                    <td class='text-1000'>${item.NOMBRES}</td>
                                    <td class='text-1000'>${nDI}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-primary btnSolventar customButton m-1 ${disabledBtn}' type='button' data-ctrl-obser='${item.ID_OBSERVACION_ACTIVIDAD}' data-ctrl-actividad='${item.ID_CTRL_ACTIVIDAD}'>Solventar</button>
                                        </div>
                                    </td>
                                </tr>`
                    });
                    recargarTablaSinOpciones("tableObservacionesActividad", html);
                } else {
                    recargarTablaSinOpciones("tableObservacionesActividad", null);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDoByIdaA(idCtrlActividad) {
    var html = '';
    fetchDataArr(18, { _idCtrlActividad: idCtrlActividad }, 1, function (response) {
        if (response) {
            logger.error("Datos recibidos de OBSERVACIONES BY ID ACTIVIDAD: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        const nDI = new Date(+item.FEC_ACTUALIZA.replace(/\D/g, '')).toISOString();
                        var disabledBtn = item.SN_SOLVENTA === true ? 'disabled' : '';
                        html += `<tr>
                                    <td class='text-1000'>${item.DESC_OBSERVACION}</td>
                                    <td class='text-1000'>${item.NOMBRES}</td>
                                    <td class='text-1000'>${nDI}</td>
                                    <td class='text-end'>
                                        <div>
                                            Sin acciones
                                        </div>
                                    </td>
                                </tr>`
                    });
                    recargarTablaSinOpciones("tableObservacionesActividad", html);
                } else {
                    recargarTablaSinOpciones("tableObservacionesActividad", null);
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

function setDataEvidencia(dataLocal, idDocumento) {
    var urlsend = "";
    if (idDocumento === 1 || idDocumento === 2 || idDocumento === 4 || idDocumento === 5) {
        urlsend = 9
    } else if (idDocumento === 3) {
        urlsend = 10
    }
    blockUICustom({
        title: 'Guardando documento...',
        html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...</div></div>'
    });
    fetchDataArr(urlsend, dataLocal, 1, function (response) {
        if (response) {
            logger.log("Datos recibidos a ACTIVIDAD EVIDENCIAS:", response);
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto la evidencia.", 'success');
                Swal.close();
                clearForms(1)
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos de la acción.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
        Swal.close();
        $("#btnS_Evidencia").removeAttr("disabled");
    });
}

async function uploadFileInChunks(file, idCtrlActividad, idUsuario, idDocumento, txtDesc, fileExt, cveOS, cveUP, cveEfiscal) {
    blockUICustom({
        title: 'Guardando documento...',
        html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...<progress id="progressBar" value="0" max="100"></progress><span id="progressText"></span><span id="timeRemaining"></span></div></div>',
        allowOutsideClick: false,
        // didOpen: () => {
        //     window.progressBar = document.getElementById("progressBar");
        //     window.progressText = document.getElementById("progressText");
        //     window.timeRemaining = document.getElementById("timeRemaining");
        // }
    });
    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_SIZE = 100 * 1024 * 1024; // 2MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = crypto.randomUUID();

    logger.log("Subiendo:", file.name);
    logger.log("Tamaño:", file.size);
    logger.log("Chunks:", totalChunks);

    if (file && file.size > MAX_SIZE) {
        showMsg("El archivo es demasiado grande. Máximo 100MB.", 'error');
        Swal.close();
        $("#btnS_Evidencia").removeAttr("disabled");
        return;
    }

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("uploadId", uploadId);
        formData.append("chunkIndex", chunkIndex);
        formData.append("totalChunks", totalChunks);
        formData.append("fileName", file.name);
        formData.append("toServer", 1);

        formData.append("_idCtrlActividad", idCtrlActividad);
        formData.append("_idUsuario", idUsuario);
        formData.append("_idDocumento", idDocumento);
        formData.append("_txtDesc", txtDesc);
        formData.append("_fileExt", fileExt);
        formData.append("_cveOS", cveOS);
        formData.append("_cveUP", cveUP);
        formData.append("_eFiscal", cveEfiscal);
        await sendChunk(formData,
            function (response) {
                logger.error("RESPUESTA DEVUELTA A SERVIDOR LINEA 1: ", response);
                let objetoJS = JSON.parse(response);
                logger.error("DESPUES DE PARSE JSON: ", objetoJS);
                if (objetoJS.ok) {
                    showMsg(objetoJS.msg, 'success');
                    getDataEvidencia(idCtrlActividad);
                    clearForms(1);
                    Swal.close();
                } else {
                    if (objetoJS.msg === "Procesando") {
                    } else {
                        showMsg(objetoJS.msg, 'error');
                        Swal.close();
                    }
                }
            }
        );
        // await uploadChunkWithProgress(formData, function (progress) { },
        //     function (response) {
        //         logger.log("Carga completa", response);
        //         showMsg("El archivo fue ingresado correctamente.", 'info');
        //         Swal.close();
        //         getDataEvidencia(idCtrlActividad);
        //         clearForms(1);
        //         $("#btnS_Evidencia").removeAttr("disabled");
        //     }
        // );
    }
}

function setDataReporteEvidencia(dataLocal, idActividad) {
    fetchDataArr(13, dataLocal, 1, function (response) {
        if (response) {
            logger.log("Datos recibidos a INSERCION REPORTE EVIDENCIAS:", response);
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto el reporte.", 'success');
                getDataEvidencia(idActividad);
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos de la acción.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
        $("#btnS_DescEvidencia").removeAttr("disabled");
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    const modal01 = $('#modalActividadUpdate').modal();
    loadEndpoints(1);
    divForFile.hide();
    inputFile.hide();
    divForLink.hide();
    inputLink.hide();

    obtenerSelectDatosEfiscal();
    obtenerSelectDatosOS(cveEfiscald);
    obtenerSelectDatosUP(cveEfiscald, cveOSd, '');
    obtenerSelectDatosTipoDocumento(0);
    obtenerSelectDatosTipoReporte(0);
    gDfCtrimestre(0);
    if (idRolUser === '101') {
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", true);
        $("#bntDownload").hide();
        logger.log("Usuario captura");
        getDataRiesgos(cveOSd, cveUPd, 0, cveEfiscald);
    } else if (idRolUser === '102' || idRolUser === '103') {
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#bntDownload").show();
        logger.log("Usuario administrador");
        getDataRiesgosA(cveOSd, cveUPd, 0, cveEfiscald);
    }

    $(document).on("click", "#btnSearch", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        var idTrimestre = $("#cboTrimestre").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (idRolUser === '101') {
                getDataRiesgos(cveOS, cveUP, idTrimestre, eFiscal);
            } else if (idRolUser === '102' || idRolUser === '103') {
                getDataRiesgosA(cveOS, cveUP, idTrimestre, eFiscal);
            }
        }
    });

    $(document).on("change", "#cboEfiscal, #cboTrimestre", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        var idTrimestre = $("#cboTrimestre").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (idRolUser === '101') {
                getDataRiesgos(cveOS, cveUP, idTrimestre, eFiscal);
            } else if (idRolUser === '102' || idRolUser === '103') {
                getDataRiesgosA(cveOS, cveUP, idTrimestre, eFiscal);
            }
        }
    });

    $(document).on("click", ".btnSeeDatosRiesgoxEvidencia", function () {
        //$(".btnSeeDatosAlineacion").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlActividad;
        var idReturn2 = $(this)[0].dataset.ctrlTrimestre;
        var controlModal = $(this)[0].dataset.ctrlModal;
        $("#btnR_EnviarActividad").attr("data-ctrl-trimestre", idReturn2);
        if (idRolUser === '101') {
            $("#modalActividadEvidenciaForm").modal("show");
            getDataActividad(idReturn, $("#cboOs").val(), $("#cboUp").val());
        } else if (idRolUser === '102' || idRolUser === '103') {
            $("#modalActividadEvidencia").modal("show");
            getDataActividadA(idReturn, $("#cboOs").val(), $("#cboUp").val());
        }
    });

    $(document).on("click", ".btnSeeDatosActividad", function () {
        //$(".btnSeeDatosAlineacion").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlActividad;
        getDataEvidencia(idReturn);
    });

    $(document).on("click", "#btnS_Evidencia", async function () {
        $("#btnS_Evidencia").attr("disabled", true);
        var idReturn = $("#btnS_Evidencia")[0].dataset.ctrlActividad;
        var idDocumento = $("#btnS_Evidencia")[0].dataset.ctrlDocumento;
        const cval = parseInt(idDocumento);
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var cveEfiscal = $("#cboEfiscal").val();
        var archivosBytes = [];

        if (idReturn === 0 || idReturn === "0" || idReturn === null) {
            showMsg("Ocurrio un error al obtener información extra de la actividad", 'error');
            $("#btnS_Evidencia").removeAttr("disabled");
            return;
        }
        if (await verifyInitialDataOUE(cveOS, cveUP, cveEfiscal)) {
            if (validarFormularioEvidencia(cval) === true) {
                const txtDescEvidenciaData = $("#txtDescEvidencia").val().trim();
                //const txtNombreEvidenciaData = $("#txtNombreEvidencia").val().trim();
                if (cval === 1 || cval === 2 || cval === 4 || cval === 5) {
                    let file = $("#customFile")[0].files[0];
                    if (file) {
                        var fileName = file.name;
                        const ext = getFileExtension(fileName)
                        uploadFileInChunks(file, idReturn, idUser, cval, txtDescEvidenciaData, ext, cveOS, cveUP, cveEfiscal)
                    } else {
                        showMsg('No ha insertado ningun archivo, favor de ingresarlo.', 'error');
                        $("#btnS_Evidencia").removeAttr("disabled");
                        return;
                    }
                    // if (file) {
                    //     var fileName = file.name;
                    //     var reader = new FileReader();
                    //     const ext = getFileExtension(fileName)
                    //     reader.onload = function (e) {
                    //         var fileBytes = new Uint8Array(e.target.result);
                    //         archivosBytes.push(fileBytes);
                    //         const dataLocal = { _idCtrlActividad: idReturn, _idUsuario: idUser, _idDocumento: cval, _txtDescEvidencia: txtDescEvidenciaData, _extDoc: ext, _nameDoc: fileName, listValue: '"' + fileBytes + '"', _OS: cveOS, _UP: cveUP, _eFiscal: cveEfiscal };
                    //         setDataEvidencia(dataLocal, cval);
                    //         getDataEvidencia(idReturn);
                    //     };
                    //     reader.readAsArrayBuffer(file);
                    // } else {
                    //     showMsg('No ha insertado ningun archivo, favor de ingresarlo.', 'error');
                    //     $("#btnS_Evidencia").removeAttr("disabled");
                    //     return;
                    // }
                } else if (cval === 3) {
                    const txtUrlData = $("#txtUrl").val().trim();
                    const dataLocal = { _idCtrlActividad: idReturn, _idUsuario: idUser, _idDocumento: cval, _txtDescEvidencia: txtDescEvidenciaData, _txtUrl: txtUrlData };
                    setDataEvidencia(dataLocal, cval);
                    $("#btnS_Evidencia").removeAttr("disabled");
                    getDataEvidencia(idReturn);
                }
            } else {
                $("#btnS_Evidencia").removeAttr("disabled");
            }
        }
    });

    $(document).on("click", "#btnS_DescEvidencia", function () {
        $("#btnS_DescEvidencia").attr("disabled", true);
        const idReturn = $("#btnS_DescEvidencia")[0].dataset.ctrlActividad;
        const idReturn2 = $("#btnS_DescEvidencia")[0].dataset.ctrlReportActividad;
        const cveOS = $("#cboOs").val();
        const cveUP = $("#cboUp").val();

        if (cveOS === 0 && cveUP === 0 || cveOS === '0' && cveUP === '0' || cveOS === "null" && cveUP === "null" || cveOS === null && cveUP === null) {
            showMsg('Espere a obtener más datos...', 'alert');
            return;
        }

        if (validarFormularioEvidencias() === true) {
            const txtDescripcionEvidenciasData = $("#txtDescripcionEvidencias").val().trim();
            const txtDescripcionReporteData = $("#txtDescripcionReporte").val().trim();
            const idTrimestreData = $("#txtTrimestre")[0].dataset.ctrlTrimestre
            const idMesData = $("#txtMes").val().trim();
            const dataLocal = { _idCtrlActividad: idReturn, _idUsuario: idUser, _txtDescEvidencias: txtDescripcionEvidenciasData, _txtDescReporte: txtDescripcionReporteData, _idMes: idMesData, _idCtrlReporteActividad: idReturn2, _cveOS: cveOS, _cveUP: cveUP, _idTrimestre: idTrimestreData };
            setDataReporteEvidencia(dataLocal, idReturn)
        } else {
            $("#btnS_DescEvidencia").removeAttr("disabled");
        }
    });

    $(document).on("click", ".btnDownloadDoc", function () {
        //$(".btnSeeDatosAlineacion").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlEvidencia;
        logger.log(idReturn);

        getDataEvidenciaById(idReturn);
    });

    $(document).on("change", "#cboDocumento", function () {
        inputFile.val("");
        inputLink.val("");

        var selectedValue = $(this).val();
        const cval = parseInt(selectedValue);

        $("#btnS_Evidencia").attr("data-ctrl-documento", cval);
        if (cval === 1 || cval === 2 || cval === 4 || cval === 5) { //WORD O PDF
            divInfo.hide();
            divForFile.show();
            inputFile.show();
            divForLink.hide();
            inputLink.hide();
            if (cval === 1) {
                inputFile.attr("accept", ".doc, .docx");
                //inputFile.attr("onchange", "validateFileWord(this);");
                inputFile.attr("onchange", "validateFile(this, 'word');");
            } else if (cval === 2) {
                inputFile.attr("accept", ".pdf");
                //inputFile.attr("onchange", "validateFilePdf(this);");
                inputFile.attr("onchange", "validateFile(this, 'pdf');");
            } else if (cval === 4) {
                inputFile.attr("accept", ".zip, .rar")
                //inputFile.attr("onchange", "validateFilePackage(this);");
                inputFile.attr("onchange", "validateFile(this, 'package');");
            } else if (cval === 5) {
                inputFile.attr("accept", ".xlsx, .xls")
                inputFile.attr("onchange", "validateFile(this, 'excel');");
            }
        } else if (cval === 3) { //LINK [ENLACE]
            divInfo.hide();
            divForFile.hide();
            inputFile.hide();
            divForLink.show();
            inputLink.show();

            inputLink.attr("onchange", "validateUrl(this);");
        } else {
            divInfo.show();
            divForFile.hide();
            inputFile.hide();
            divForLink.hide();
            inputLink.hide();
        }
    });

    $(document).on("click", "#btnR_EnviarActividad", function () {
        $("#btnR_EnviarActividad").attr("disabled", true);
        logger.info($(this));
        var idReturn = $(this)[0].dataset.ctrlActividad;
        var idReturn3 = $(this)[0].dataset.ctrlTrimestre;
        var idReturn2 = $(this)[0].dataset.ctrlReportActividad;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var cveEfiscal = $("#cboEfiscal").val();
        fetchDataArr(20, { _idCtrlActividad: idReturn }, 1, function (response) {
            if (response) {
                logger.error("Datos recibidos de VERIFICA DATOS PERIODO: ", response);
                if (response !== 'error') {
                    const algunoFalla01 = response.some(item => item.NUM_OBSERS !== 0);
                    if (algunoFalla01) {
                        showMsg("Detectamos que su periodo, tiene observaciones. Verifique de favor.", 'alert');
                        return;
                    }

                    getDataEvidencias(idReturn, idReturn2);
                }
            }
            getDataEvidencia(idReturn);
            getDataRiesgos(cveOS, cveUP, idReturn3, cveEfiscal);
        });

    });

    $(document).on("click", ".btnSeeEditActividad", function () {
        var idReturn = $(this)[0].dataset.ctrlActividad;
        logger.log(idReturn);

        $("#btnUpdateActividad").attr("data-mctrl-actividad", idReturn);

        modal01.modal('show');
        modal01.modal('handleUpdate');
    });

    $(document).on("click", "#btnUpdateActividad", function () {
        $("#btnUpdateActividad").attr("disabled", true);
        var idReturn = $("#btnUpdateActividad")[0].dataset.mctrlActividad;
        logger.log(idReturn);
    });

    $(document).on("click", ".btnSetRejected", function () {
        var idReturn = $(this)[0].dataset.ctrlActividad;
        var idReturn2 = $(this)[0].dataset.ctrlTrimestre;
        var idReturn3 = $(this)[0].dataset.ctrlModal;
        $("#btnSendObserActividad").attr("data-ctrl-actividad", idReturn);
        $("#btnSendObserActividad").attr("data-ctrl-trimestre", idReturn2);
        $("#btnSendObserActividad").attr("data-ctrl-modal", idReturn3);
        $("#modalObservacionForm").modal("show");
    });

    $(document).on("click", "#btnSendObserActividad", function () {
        var idReturn = $(this)[0].dataset.ctrlActividad;
        var idReturn2 = $(this)[0].dataset.ctrlTrimestre;
        var idReturn3 = $(this)[0].dataset.ctrlModal;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var cveEfiscal = $("#cboEfiscal").val();
        if ($("#txtObservacion").val() === "") {
            showMsg("Escriba la observación antes de rechazar.", 'error');
            return;
        } else {
            const txtObservacionData = $("#txtObservacion").val().trim();
            fetchDataArr(16, { _idCtrlActividad: idReturn, _idUsuario: idUser, _txtDescObservacion: txtObservacionData }, 1, function (response) {
                if (response) {
                    logger.error("Respuesta a UPDATE REJECTED ACTIVIDAD:", response.split("|"));
                    var responseS = response.split("|");
                    if (responseS[0] === "ok") {
                        showMsg("Se actualizo correctamente los datos.", 'success');
                        $("#modalObservacionForm").modal("hide");
                    } else if (responseS[0] === "error") {
                        showMsg("Ocurrio un error al insertar los datos.", 'error');
                    } else if (responseS[0] === "existe") {
                        showMsg("Detectamos que existe datos similares.", 'error');
                    }
                    getDataRiesgosA(cveOS, cveUP, idReturn2, cveEfiscal);
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                }
            });
        }
    });

    $(document).on("click", ".btnSetValidate", function () {
        var idReturn = $(this)[0].dataset.ctrlActividad;
        var idReturn2 = $(this)[0].dataset.ctrlTrimestre;
        var idReturn3 = $(this)[0].dataset.ctrlModal;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var cveEfiscal = $("#cboEfiscal").val();
        fetchDataArr(17, { _idCtrlActividad: idReturn, _idUsuario: idUser }, 1, function (response) {
            if (response) {
                logger.error("Respuesta a UPDATE VALIDATED PERIODO:", response.split("|"));
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    showMsg("Se actualizo correctamente los datos.", 'success');
                    $("#modalComentarioForm").modal("hide");
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al insertar los datos.", 'error');
                } else if (responseS[0] === "existe") {
                    showMsg("Detectamos que existe datos similares.", 'error');
                }
                getDataRiesgosA(cveOS, cveUP, idReturn2, cveEfiscal);
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", ".btnSeeObservaciones", function () {
        var idReturn = $(this)[0].dataset.ctrlActividad;
        $("#modalObservacionesActividad").modal("show");
        if (idRolUser === '101') {
            gDoByIda(idReturn);
        } else if (idRolUser === '102' || idRolUser === '103') {
            gDoByIdaA(idReturn);
        }
    });

    $(document).on("click", ".btnSolventar", function () {
        var idReturn = $(this)[0].dataset.ctrlObser;
        var idReturn2 = $(this)[0].dataset.ctrlActividad;
        fetchDataArr(19, { _idCtrlObserv: idReturn }, 1, function (response) {
            if (response) {
                logger.error("Respuesta a UPDATE OBSERVACION:", response.split("|"));
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    showMsg("Se solvento correctamente la observación.", 'success');
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al insertar los datos.", 'error');
                } else if (responseS[0] === "existe") {
                    showMsg("Detectamos que existe datos similares.", 'error');
                }
                gDoByIda(idReturn2);
                $("#modalObservacionesReporte").modal("show")
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", "#bntDownload", function () {
        $("#modalDownloadDocumentos").modal("show");
        gDfCmeses($("#cboTrimestreDoc").val());
    });

    $(document).on("click", "#btnDownloadCarpeta", function () {
        const cboUPData = $("#cboUPD").val();
        const cboTrimestreData = $("#cboTrimestreDoc").val();
        const cboMes2Data = $("#cboMes2").val();
        const cveEfiscalData = $("#cboEfiscal").val();
        const data = { _idTrimestre: cboTrimestreData, _cveUP: cboUPData, _idMes: cboMes2Data, _eFiscal: cveEfiscalData };
        blockUICustom({
            title: 'Descargando comprimido',
            html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...</div></div>'
        });
        fetchDataArr(22, data, 1, function (response) {
            if (response) {
                if (response.ok) {
                    showMsg("Descargando comprimido, revise en sus <strong>descargas</strong>", 'success');
                    window.location.href = "Handler/DescargarZip.ashx?file=" + response.file;
                } else {
                    showMsg(response.msg, 'error');
                }
                Swal.close();
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("change", "#cboTrimestreDoc", function () {
        var selectedValue = $(this).val();
        gDfCmeses(selectedValue);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var obtenerSelectDatosEfiscal = function () {
    fetchDataArr(0, {}, 1, function (response) {
        if (response) {
            const select = $("#cboEfiscal");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.id_efiscal,
                    text: item.efiscal
                }));
            });
            select.val(cveEfiscald);
        }
    });
}

var obtenerSelectDatosOS = function (txtEfiscal) {
    fetchDataArr(1, { _txtEfiscal: txtEfiscal }, 1, function (response) {
        if (response) {
            const select = $("#cboOs");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.Cve_Organo_Superior,
                    text: item.Txt_Organo_Superior
                }));
            });
            select.val(cveOSd);

            const select2 = $("#cboOSD");
            select2.empty();
            select2.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select2.append($("<option>", {
                    value: item.Cve_Organo_Superior,
                    text: item.Txt_Organo_Superior
                }));
            });
            select2.val(cveOSd);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    })
}

var obtenerSelectDatosUP = function (txtEfiscal, txtOS, tipo) {
    fetchDataArr(2, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 1, function (response) {
        if (response) {
            const select = $("#cboUp");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.Cve_Unidad_Presupuestal,
                    text: item.Txt_Unidad_Presupuestal
                }));
            });
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

            const select2 = $("#cboUPD");
            select2.empty();
            select2.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select2.append($("<option>", {
                    value: item.Cve_Unidad_Presupuestal,
                    text: item.Txt_Unidad_Presupuestal
                }));
            });
            if (cveUPd === '') {
                select2.val(0);
            } else {
                if (tipo === 'cambio') {
                    if (txtOS === cveOSd) {
                        select2.val(cveUPd);
                    } else {
                        select2.val(0);

                    }
                } else {
                    select2.val(cveUPd);
                }
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var obtenerSelectDatosTipoReporte = function (id) {
    fetchDataArr(8, {}, 1, function (response) {
        if (response) {
            const select = $("#cboTipoReporte");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_TIPO_REPORTE,
                    text: item.DESC_TIPO_REPORTE
                }));
            });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    })
}

var obtenerSelectDatosTipoDocumento = function (id) {
    fetchDataArr(7, {}, 1, function (response) {
        if (response) {
            const select = $("#cboDocumento");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_TIPO_DOCUMENTO,
                    text: item.DESC_DOCUMENTO
                }));
            });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var gDfCtrimestre = function (id) {
    fetchDataArr(12, {}, 1, function (response) {
        if (response) {
            const select = $("#cboTrimestre");
            const select2 = $("#cboTrimestreDoc");
            select.empty();
            select2.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            select2.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_TRIMESTRE,
                    text: item.DESC_TRIMESTRE
                }));
                select2.append($("<option>", {
                    value: item.ID_TRIMESTRE,
                    text: item.DESC_TRIMESTRE
                }));
            });
            switch (d.getMonth()) {
                case 0:
                case 1:
                case 2:
                    select.val(1);
                    select2.val(1);
                    break;
                case 3:
                case 4:
                case 5:
                    select.val(2);
                    select2.val(2);
                    break;
                case 6:
                case 7:
                case 8:
                    select.val(3);
                    select2.val(3);
                    break;
                case 9:
                case 10:
                case 11:
                    select.val(4);
                    select2.val(4);
                    break;
                default:
                    select.val(0);
                    select2.val(0);
                    break;
            }
        }
    });
}

var gDfCmeses = function (id) {
    const idF = parseInt(id);
    fetchDataArr(21, {}, 1, function (response) {
        if (response) {
            var newData;
            logger.log("Datos recibidos a combo MESES:", response);
            const select2 = $("#cboMes2");
            select2.empty();
            select2.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            if (idF === 1) {
                newData = response.filter(item => item.ID_MES >= 1 && item.ID_MES <= 3).map(item => ({ idMes: item.ID_MES, descMes: item.DESC_MES }));
            } else if (idF === 2) {
                newData = response.filter(item => item.ID_MES >= 4 && item.ID_MES <= 6).map(item => ({ idMes: item.ID_MES, descMes: item.DESC_MES }));
            } else if (idF === 3) {
                newData = response.filter(item => item.ID_MES >= 7 && item.ID_MES <= 9).map(item => ({ idMes: item.ID_MES, descMes: item.DESC_MES }));
            } else if (idF === 4) {
                newData = response.filter(item => item.ID_MES >= 10 && item.ID_MES <= 12).map(item => ({ idMes: item.ID_MES, descMes: item.DESC_MES }));
            } else {
                newData = response.filter(item => item.ID_MES >= 1 && item.ID_MES <= 12).map(item => ({ idMes: item.ID_MES, descMes: item.DESC_MES }));
            }
            // response.forEach(function (item) {
            //     select2.append($("<option>", {
            //         value: item.ID_MES,
            //         text: item.DESC_MES
            //     }));
            // });
            newData.forEach(function (item) {
                select2.append($("<option>", {
                    value: item.idMes,
                    text: item.descMes
                }));
            });
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validarFormularioEvidencia(_idDocumento) {
    let esValido = true;

    const txtDescEvidencia = $("#txtDescEvidencia").val().trim();
    if (txtDescEvidencia === "") {
        showMsgForm("txtDescEvidencia", "Ingrese la descripción de la evidencia.", "error");
        esValido = false;
    }
    // const txtNombreEvidencia = $("#txtNombreEvidencia").val().trim();
    // if (txtNombreEvidencia === "") {
    //     showMsgForm("txtNombreEvidencia", "Ingrese el nombre de la evidencia.", "error");
    //     esValido = false;
    // }

    const cboDocumento = $("#cboDocumento").val();
    if (cboDocumento === "" || cboDocumento === "0") {
        showMsgForm("cboDocumento", "Elija el tipo de documento que desea cargar.", "error");
        esValido = false;
    }

    if (_idDocumento === 1 || _idDocumento === 2 || _idDocumento === 4 || _idDocumento === 5) {

    } else if (_idDocumento === 3) {
        const txtUrl = $("#txtUrl").val().trim();
        if (txtUrl === "") {
            showMsgForm("txtUrl", "Ingrese el enlace de la evidencia.", "error");
            esValido = false;
        }
    }

    return esValido;
}

function validarFormularioEvidencias() {
    let esValido = true;

    const txtDescripcionEvidencias = $("#txtDescripcionEvidencias").val().trim();
    if (txtDescripcionEvidencias === "") {
        showMsgForm("txtDescripcionEvidencias", "Ingrese la descripción de la evidencias a reportar.", "error");
        esValido = false;
    }
    const txtDescripcionReporte = $("#txtDescripcionReporte").val().trim();
    if (txtDescripcionReporte === "") {
        showMsgForm("txtDescripcionReporte", "Ingrese la descripción del reporte.", "error");
        esValido = false;
    }

    return esValido;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearForms(type) {
    if (type === 1) {
        $("#txtDescEvidencia").val("")
        $("#txtNombreEvidencia").val("")
        $("#txtUrl").val("")
        $("#cboDocumento").val(0);
        $("#customFile").val("");
    } else if (type === 2) {
        $("#txtDescripcionEvidencias").val("");
        $("#txtDescripcionReporte").val("");
    }
}