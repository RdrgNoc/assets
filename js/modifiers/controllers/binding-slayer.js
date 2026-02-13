'use strict';

let timingNoty = 3500;
let idUser = $("#MainContent_hddnIdUsuario").val();
let idRolUser = $("#MainContent_hddnPage").val();
let cveOSd = $("#MainContent_hddnOS").val().trim();
let cveUPd = $("#MainContent_hddnUP").val().trim();
let cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();

const d = new Date();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gDrt(cveOS, cveUP, eFiscal, __rol) {
    var html = '';
    fetchDataArr(4, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 3, function (response) {
        if (response) {
            logger.error("RESPUESTA REPORTES TRIMESTRALES: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        //var snValida = '';
                        var snDelete = '';
                        var snDisabled = '';
                        var descVal = '';
                        var snValida = ''; //item.SN_VALIDA === true ? 'badge-subtle-success' : 'badge-subtle-danger';
                        //var snDisabled = item.SN_ENVIA === true ? 'disabled' : '';
                        //var snDisabledDelete = item.SN_DELETE === true ? 'disabled' : '';

                        // if (item.SN_ENVIA === null) {
                        //     snDisabled = '';
                        //     descVal = 'En espera de envio';
                        //     snValida = 'badge-subtle-secondary'
                        //     if (item.SN_DELETE === true) {
                        //         snDelete = 'disabled';
                        //         snDisabled = 'disabled';
                        //         descVal = 'Reporte eliminado';
                        //         snValida = 'badge-subtle-danger'
                        //     } else if (item.SN_DELETE === false || item.SN_DELETE === null) {
                        //         snDelete = '';
                        //         snDisabled = '';
                        //     }
                        // } else if (item.SN_ENVIA === true) {
                        //     snDisabled = 'disabled';
                        //     snDelete = 'disabled';
                        //     descVal = 'Enviado a revisión';
                        //     snValida = 'badge-subtle-info'
                        //     if (item.SN_VALIDA === true) {
                        //         descVal = 'Validado';
                        //         snValida = 'badge-subtle-success'
                        //     } else if (item.SN_VALIDA === false) {
                        //         descVal = 'Rechazado';
                        //         snValida = 'badge-subtle-danger'
                        //     }
                        // } else if (item.SN_ENVIA === false) {
                        //     snDisabled = '';
                        //     snDelete = 'disabled';
                        //     if (item.SN_VALIDA === false) {
                        //         descVal = 'Rechazado';
                        //         snValida = 'badge-subtle-danger'
                        //     }
                        // }

                        if (__rol === '101') {
                            if (item.SN_ENVIA === null) {
                                snDisabled = '';
                                descVal = 'En espera de envio';
                                snValida = 'badge-subtle-secondary'
                                if (item.SN_DELETE === true) {
                                    snDelete = 'disabled';
                                    snDisabled = 'disabled';
                                    descVal = 'Reporte eliminado';
                                    snValida = 'badge-subtle-danger'
                                } else if (item.SN_DELETE === false || item.SN_DELETE === null) {
                                    snDelete = '';
                                    snDisabled = '';
                                }
                            } else if (item.SN_ENVIA === true) {
                                snDisabled = 'disabled';
                                snDelete = 'disabled';
                                descVal = 'Enviado a revisión';
                                snValida = 'badge-subtle-info'
                                if (item.SN_VALIDA === true) {
                                    descVal = 'Validado';
                                    snValida = 'badge-subtle-success'
                                } else if (item.SN_VALIDA === false) {
                                    descVal = 'Rechazado';
                                    snValida = 'badge-subtle-danger'
                                }
                            } else if (item.SN_ENVIA === false) {
                                snDisabled = '';
                                snDelete = 'disabled';
                                if (item.SN_VALIDA === false) {
                                    descVal = 'Rechazado';
                                    snValida = 'badge-subtle-danger'
                                }
                            }

                            html += `<tr>
                                    <td class='text-1000'>${item.ID_CTRL_REPORTE_TRIMESTRE}</td>
                                    <td class='text-1000'>${item.DESC_TRIMESTRE}</td>
                                    <td class='text-1000 w-50'>${item.DESC_PROBLEMATICAS}</td>
                                    <td class='text-1000 w-50'>${item.DESC_PROPUESTA}</td>
                                    <td class='text-1000 w-50'>${item.DESC_CONCLUSION}</td>
                                    <td><span class='badge rounded-pill d-block p-2 fs-10-5 ${snValida}'>${descVal}</span></td>
                                    <td class='text-1000 w-50'>${item.DESC_OBSERVACION === null ? 'Sin observaciones' : item.DESC_OBSERVACION}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-info btnEditReporteT customButton ${snDisabled} m-1' type='button' data-ctrl-reporte-trimestre='${item.ID_CTRL_REPORTE_TRIMESTRE}'>Editar reporte</button>
                                            <button class='btn btn-sm btn-falcon-success btnReporteTrimestral customButton ${snDisabled} m-1' type='button' data-ctrl-reporte-trimestre='${item.ID_CTRL_REPORTE_TRIMESTRE}'>Reportar</button>
                                            <button class='btn btn-sm btn-falcon-success btnSeeReporteTrimestral customButton m-1' type='button' data-ctrl-trimestre='${item.ID_TRIMESTRE}'>Ver reporte</button>
                                            <button class='btn btn-sm btn-falcon-info btnSeeObserReporte customButton m-1' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_TRIMESTRE}' data-ctrl-tipo='1'>Ver historial de observaciones</button>
                                            <button class='btn btn-sm btn-falcon-danger btnDeleteReporteTrimestral customButton ${snDelete} m-1' type='button' data-ctrl-reporte-trimestre='${item.ID_CTRL_REPORTE_TRIMESTRE}'>Eliminar reporte</button>
                                        </div>
                                    </td>
                                </tr>`;
                        } else if (__rol === '103' || __rol === '104') {
                            if (item.SN_ENVIA === null) {
                                snDisabled = '';
                                descVal = 'En espera de envio';
                                snValida = 'badge-subtle-secondary'
                                if (item.SN_DELETE === true) {
                                    snDelete = 'disabled';
                                    snDisabled = 'disabled';
                                    descVal = 'Reporte eliminado';
                                    snValida = 'badge-subtle-danger'
                                } else if (item.SN_DELETE === false || item.SN_DELETE === null) {
                                    snDelete = '';
                                    snDisabled = 'disabled';
                                }
                            } else if (item.SN_ENVIA === true) {
                                snDisabled = 'disabled';
                                snDelete = 'disabled';
                                descVal = 'Enviado a revisión';
                                snValida = 'badge-subtle-info'
                                if (item.SN_VALIDA === true) {
                                    snDisabled = 'disabled';
                                    descVal = 'Validado';
                                    snValida = 'badge-subtle-success'
                                } else if (item.SN_VALIDA === false) {
                                    descVal = 'Rechazado';
                                    snValida = 'badge-subtle-danger'
                                    snDisabled = '';
                                } else {
                                    snDisabled = '';
                                }
                            } else if (item.SN_ENVIA === false) {
                                snDisabled = '';
                                snDelete = 'disabled';
                                if (item.SN_VALIDA === false) {
                                    descVal = 'Rechazado';
                                    snDisabled = 'disabled';
                                    snValida = 'badge-subtle-danger'
                                }
                            }

                            html += `<tr>
                                    <td class='text-1000'>${item.ID_CTRL_REPORTE_TRIMESTRE}</td>
                                    <td class='text-1000'>${item.DESC_TRIMESTRE}</td>
                                    <td class='text-1000 w-50'>${item.DESC_PROBLEMATICAS}</td>
                                    <td class='text-1000 w-50'>${item.DESC_PROPUESTA}</td>
                                    <td class='text-1000 w-50'>${item.DESC_CONCLUSION}</td>
                                    <td><span class='badge rounded-pill d-block p-2 fs-10-5 ${snValida}'>${descVal}</span></td>
                                    <td class='text-1000 w-50'>${item.DESC_OBSERVACION === null ? 'Sin observaciones' : item.DESC_OBSERVACION}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-danger btnSeeReporteTrimestral customButton m-1' type='button' data-ctrl-trimestre='${item.ID_TRIMESTRE}'>Ver reporte</button>
                                            <button class='btn btn-sm btn-falcon-danger btnSetReporte customButton m-1 ${snDisabled}' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_TRIMESTRE}' data-ctrl-set='0' data-ctrl-tipo='1'>Rechazar</button>
                                            <button class='btn btn-sm btn-falcon-success btnSetReporte customButton m-1 ${snDisabled}' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_TRIMESTRE}' data-ctrl-set='1' data-ctrl-tipo='1'>Validar</button>
                                            <button class='btn btn-sm btn-falcon-info btnSeeObserReporte customButton m-1' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_TRIMESTRE}' data-ctrl-tipo='1'>Ver historial de observaciones</button>
                                        </div>
                                    </td>
                                </tr>`;
                        }

                    });
                    recargarTabla("tableReportTrimestre", html);
                } else {
                    recargarTabla("tableReportTrimestre", null);
                    showMsg("Sin reportes trimestrales de la unidad presupuestal.", 'info');
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

function gDra(cveOS, cveUP, eFiscal, __rol) {
    var html = '';
    fetchDataArr(7, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 3, function (response) {
        if (response) {
            logger.error("RESPUESTA REPORTES ANUALES: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var snDelete = '';
                        var snDisabled = '';
                        var descVal = '';
                        var snValida = ''; //item.SN_VALIDA === true ? 'badge-subtle-success' : 'badge-subtle-danger';
                        // if (item.SN_ENVIA === null) {
                        //     snDisabled = '';
                        //     descVal = 'En espera de envio';
                        //     snValida = 'badge-subtle-secondary'
                        //     if (item.SN_DELETE === true) {
                        //         snDelete = 'disabled';
                        //         snDisabled = 'disabled';
                        //         descVal = 'Reporte eliminado';
                        //         snValida = 'badge-subtle-danger'
                        //     } else if (item.SN_DELETE === false || item.SN_DELETE === null) {
                        //         snDelete = '';
                        //         snDisabled = '';
                        //     }
                        // } else if (item.SN_ENVIA === true) {
                        //     snDisabled = 'disabled';
                        //     snDelete = 'disabled';
                        //     descVal = 'Enviado a revisión';
                        //     snValida = 'badge-subtle-info'
                        //     if (item.SN_VALIDA === true) {
                        //         descVal = 'Validado';
                        //         snValida = 'badge-subtle-success'
                        //     }
                        // } else if (item.SN_ENVIA === false) {
                        //     snDisabled = '';
                        //     snDelete = 'disabled';
                        //     if (item.SN_VALIDA === false) {
                        //         descVal = 'Rechazado';
                        //         snValida = 'badge-subtle-danger'
                        //     }
                        // }

                        if (__rol === '101') {
                            if (item.SN_ENVIA === null) {
                                snDisabled = '';
                                descVal = 'En espera de envio';
                                snValida = 'badge-subtle-secondary'
                                if (item.SN_DELETE === true) {
                                    snDelete = 'disabled';
                                    snDisabled = 'disabled';
                                    descVal = 'Reporte eliminado';
                                    snValida = 'badge-subtle-danger'
                                } else if (item.SN_DELETE === false || item.SN_DELETE === null) {
                                    snDelete = '';
                                    snDisabled = '';
                                }
                            } else if (item.SN_ENVIA === true) {
                                snDisabled = 'disabled';
                                snDelete = 'disabled';
                                descVal = 'Enviado a revisión';
                                snValida = 'badge-subtle-info'
                                if (item.SN_VALIDA === true) {
                                    descVal = 'Validado';
                                    snValida = 'badge-subtle-success'
                                }
                            } else if (item.SN_ENVIA === false) {
                                snDisabled = '';
                                snDelete = 'disabled';
                                if (item.SN_VALIDA === false) {
                                    descVal = 'Rechazado';
                                    snValida = 'badge-subtle-danger'
                                }
                            }

                            html += `<tr>
                                    <td class='text-1000'>${item.ID_CTRL_REPORTE_ANUAL}</td>
                                    <td class='text-1000 w-100'>${item.DESC_CONCLUSION}</td>
                                    <td><span class='badge rounded-pill d-block p-2 fs-10-5 ${snValida}'>${descVal}</span></td>
                                    <td class='text-1000 w-50'>${item.DESC_OBSERVACION === null ? 'Sin observaciones' : item.DESC_OBSERVACION}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-info btnEditReporteA customButton ${snDisabled} m-1' type='button' data-ctrl-reporte-anual='${item.ID_CTRL_REPORTE_ANUAL}'>Editar reporte</button>
                                            <button class='btn btn-sm btn-falcon-success btnReporteAnual customButton ${snDisabled} m-1' type='button' data-ctrl-reporte-anual='${item.ID_CTRL_REPORTE_ANUAL}'>Reportar</button>
                                            <button class='btn btn-sm btn-falcon-success btnSeeReporteAnual customButton m-1' type='button' data-ctrl-anual='${item.ID_CTRL_REPORTE_ANUAL}'>Ver reporte</button>
                                            <button class='btn btn-sm btn-falcon-info btnSeeObserReporte customButton m-1' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_ANUAL}' data-ctrl-tipo='2'>Ver historial de observaciones</button>
                                            <!--<button class='btn btn-sm btn-falcon-danger btnDeleteReporteAnual customButton ${snDelete} m-1' type='button' data-ctrl-reporte-anual='${item.ID_CTRL_REPORTE_ANUAL}'>Eliminar reporte</button>-->
                                        </div>
                                    </td>
                                </tr>`;
                        } else if (__rol === '103' || __rol === '104') {
                            if (item.SN_ENVIA === null) {
                                snDisabled = '';
                                descVal = 'En espera de envio';
                                snValida = 'badge-subtle-secondary'
                                if (item.SN_DELETE === true) {
                                    snDelete = 'disabled';
                                    snDisabled = 'disabled';
                                    descVal = 'Reporte eliminado';
                                    snValida = 'badge-subtle-danger'
                                } else if (item.SN_DELETE === false || item.SN_DELETE === null) {
                                    snDelete = '';
                                    snDisabled = 'disabled';
                                }
                            } else if (item.SN_ENVIA === true) {
                                snDisabled = 'disabled';
                                snDelete = 'disabled';
                                descVal = 'Enviado a revisión';
                                snValida = 'badge-subtle-info'
                                if (item.SN_VALIDA === true) {
                                    snDisabled = 'disabled';
                                    descVal = 'Validado';
                                    snValida = 'badge-subtle-success'
                                } else if (item.SN_VALIDA === false) {
                                    descVal = 'Rechazado';
                                    snValida = 'badge-subtle-danger'
                                    snDisabled = '';
                                } else {
                                    snDisabled = '';
                                }
                            } else if (item.SN_ENVIA === false) {
                                snDisabled = '';
                                snDelete = 'disabled';
                                if (item.SN_VALIDA === false) {
                                    descVal = 'Rechazado';
                                    snDisabled = 'disabled';
                                    snValida = 'badge-subtle-danger'
                                }
                            }

                            html += `<tr>
                                    <td class='text-1000'>${item.ID_CTRL_REPORTE_ANUAL}</td>
                                    <td class='text-1000 w-100'>${item.DESC_CONCLUSION}</td>
                                    <td><span class='badge rounded-pill d-block p-2 fs-10-5 ${snValida}'>${descVal}</span></td>
                                    <td class='text-1000 w-50'>${item.DESC_OBSERVACION === null ? 'Sin observaciones' : item.DESC_OBSERVACION}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-success btnSeeReporteAnual customButton m-1' type='button' data-ctrl-anual='${item.ID_CTRL_REPORTE_ANUAL}'>Ver reporte</button>
                                            <button class='btn btn-sm btn-falcon-danger btnSetReporte customButton m-1 ${snDisabled}' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_ANUAL}' data-ctrl-set='0' data-ctrl-tipo='2'>Rechazar</button>
                                            <button class='btn btn-sm btn-falcon-success btnSetReporte customButton m-1 ${snDisabled}' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_ANUAL}' data-ctrl-set='1' data-ctrl-tipo='2'>Validar</button>
                                            <button class='btn btn-sm btn-falcon-info btnSeeObserReporte customButton m-1' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_ANUAL}' data-ctrl-tipo='2'>Ver historial de observaciones</button>
                                        </div>
                                    </td>
                                </tr>`;
                        }
                    });
                    recargarTabla("tableReportAnual", html);
                } else {
                    recargarTabla("tableReportAnual", null);
                    showMsg("Sin reporte anual de la unidad presupuestal.", 'info');
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

function gDrtAd(eFiscal) {
    var html = '';
    fetchDataArr(20, { _eFiscal: eFiscal }, 3, function (response) {
        if (response) {
            logger.error("RESPUESTA REPORTES TRIMESTRALES GLOBAL: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        //var snValida = '';
                        var snDelete = '';
                        var snDisabled = '';
                        var descVal = '';
                        var snValida = '';

                        if (item.SN_ENVIA === null) {
                            snDisabled = '';
                            descVal = 'En espera de envio';
                            snValida = 'badge-subtle-secondary'
                            if (item.SN_DELETE === true) {
                                snDelete = 'disabled';
                                snDisabled = 'disabled';
                                descVal = 'Reporte eliminado';
                                snValida = 'badge-subtle-danger'
                            } else if (item.SN_DELETE === false || item.SN_DELETE === null) {
                                snDelete = '';
                                snDisabled = 'disabled';
                            }
                        } else if (item.SN_ENVIA === true) {
                            snDisabled = 'disabled';
                            snDelete = 'disabled';
                            descVal = 'Enviado a revisión';
                            snValida = 'badge-subtle-info'
                            if (item.SN_VALIDA === true) {
                                snDisabled = 'disabled';
                                descVal = 'Validado';
                                snValida = 'badge-subtle-success'
                            } else if (item.SN_VALIDA === false) {
                                descVal = 'Rechazado';
                                snValida = 'badge-subtle-danger'
                                snDisabled = '';
                            } else {
                                snDisabled = '';
                            }
                        } else if (item.SN_ENVIA === false) {
                            snDisabled = '';
                            snDelete = 'disabled';
                            if (item.SN_VALIDA === false) {
                                descVal = 'Rechazado';
                                snDisabled = 'disabled';
                                snValida = 'badge-subtle-danger'
                            }
                        }

                        html += `<tr>
                                    <td class='text-1000'>${item.ID_CTRL_REPORTE_TRIMESTRE}</td>
                                    <td class='text-1000'>${item.DESC_TRIMESTRE}</td>
                                    <td class='text-1000 w-50'>${item.DESC_CONCLUSION}</td>
                                    <td><span class='badge rounded-pill d-block p-2 fs-10-5 ${snValida}'>${descVal}</span></td>
                                    <td class='text-1000 w-50'>${item.DESC_OBSERVACION === null ? 'Sin observaciones' : item.DESC_OBSERVACION}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-danger btnSeeReporteTrimestralG customButton m-1' type='button' data-ctrl-trimestre='${item.ID_TRIMESTRE}'>Ver reporte</button>
                                            <button class='btn btn-sm btn-falcon-info btnSeeObserReporte customButton m-1' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_TRIMESTRE}' data-ctrl-tipo='1'>Ver historial de observaciones</button>
                                        </div>
                                    </td>
                                </tr>`;
                    });
                    recargarTabla("tableReportTrimestreG", html);
                } else {
                    recargarTabla("tableReportTrimestreG", null);
                    showMsg("Sin reportes trimestrales globales.", 'info');
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

function gDraAd(eFiscal) {
    var html = '';
    fetchDataArr(22, { _eFiscal: eFiscal }, 3, function (response) {
        if (response) {
            logger.error("RESPUESTA REPORTES ANUALES GLOBAL: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var snDelete = '';
                        var snDisabled = '';
                        var descVal = '';
                        var snValida = '';

                        if (item.SN_ENVIA === null) {
                            snDisabled = '';
                            descVal = 'En espera de envio';
                            snValida = 'badge-subtle-secondary'
                            if (item.SN_DELETE === true) {
                                snDelete = 'disabled';
                                snDisabled = 'disabled';
                                descVal = 'Reporte eliminado';
                                snValida = 'badge-subtle-danger'
                            } else if (item.SN_DELETE === false || item.SN_DELETE === null) {
                                snDelete = '';
                                snDisabled = 'disabled';
                            }
                        } else if (item.SN_ENVIA === true) {
                            snDisabled = 'disabled';
                            snDelete = 'disabled';
                            descVal = 'Enviado a revisión';
                            snValida = 'badge-subtle-info'
                            if (item.SN_VALIDA === true) {
                                snDisabled = 'disabled';
                                descVal = 'Validado';
                                snValida = 'badge-subtle-success'
                            } else if (item.SN_VALIDA === false) {
                                descVal = 'Rechazado';
                                snValida = 'badge-subtle-danger'
                                snDisabled = '';
                            } else {
                                snDisabled = '';
                            }
                        } else if (item.SN_ENVIA === false) {
                            snDisabled = '';
                            snDelete = 'disabled';
                            if (item.SN_VALIDA === false) {
                                descVal = 'Rechazado';
                                snDisabled = 'disabled';
                                snValida = 'badge-subtle-danger'
                            }
                        }

                        html += `<tr>
                                    <td class='text-1000'>${item.ID_CTRL_REPORTE_ANUAL}</td>
                                    <td class='text-1000 w-100'>${item.DESC_CONCLUSION}</td>
                                    <td><span class='badge rounded-pill d-block p-2 fs-10-5 ${snValida}'>${descVal}</span></td>
                                    <td class='text-1000 w-50'>${item.DESC_OBSERVACION === null ? 'Sin observaciones' : item.DESC_OBSERVACION}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-success btnSeeReporteAnualG customButton m-1' type='button' data-ctrl-anual='${item.ID_CTRL_REPORTE_ANUAL}'>Ver reporte</button>
                                            <button class='btn btn-sm btn-falcon-info btnSeeObserReporte customButton m-1' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE_ANUAL}' data-ctrl-tipo='2'>Ver historial de observaciones</button>
                                        </div>
                                    </td>
                                </tr>`;
                    });
                    recargarTabla("tableReportAnualG", html);
                } else {
                    recargarTabla("tableReportAnualG", null);
                    showMsg("Sin reporte anual.", 'info');
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

function gDrta(cveOS, cveUP, eFiscal, idTrimestre) {
    fetchDataArr(14, { _idTrimestre: idTrimestre, _cveOS: cveOS, _cveUP: cveUP, _eFiscal: eFiscal }, 2, function (response) {
        if (response) {
            logger.log("Respuesta a DATOS REPORTE TRIMESTRE:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Mostrando reporte", 'success');
                window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
            } else {
                showMsg(responseS[0], 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDrtag(cveOS, cveUP, eFiscal, idTrimestre) {
    fetchDataArr(24, { _idTrimestre: idTrimestre, _eFiscal: eFiscal }, 2, function (response) {
        if (response) {
            logger.log("Respuesta a DATOS REPORTE TRIMESTRE GLOBAL:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Mostrando reporte", 'success');
                window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
            } else {
                showMsg(responseS[0], 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDraa(cveOS, cveUP, eFiscal, idReporte) {
    fetchDataArr(15, { _idReporteAnual: idReporte, _cveOS: cveOS, _cveUP: cveUP, _eFiscal: eFiscal }, 2, function (response) {
        if (response) {
            logger.log("Respuesta a DATOS REPORTE ANUAL:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Mostrando reporte", 'success');
                window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
            } else {
                showMsg(responseS[0], 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDraag(cveOS, cveUP, eFiscal, idReporte) {
    fetchDataArr(25, { _idReporteAnual: idReporte, _eFiscal: eFiscal }, 2, function (response) {
        if (response) {
            logger.log("Respuesta a DATOS REPORTE ANUAL GLOBAL:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Mostrando reporte", 'success');
                window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
            } else {
                showMsg(responseS[0], 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDorById(idCtrlReporte, tipoReporte) {
    var html = '';
    fetchDataArr(17, { _idCtrlReporte: idCtrlReporte, _idTipoReporte: tipoReporte }, 3, function (response) {
        if (response) {
            logger.error("RESPUESTA OBSERVACIONES POR REPORTE: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {

                        html += `<tr>
                                <td class='text-1000'>${item.DESC_OBSERVACION}</td>
                                <td class='text-1000'>${item.NOMBRE_COMP}</td>
                                <td class='text-1000'>${item.FEC_ACTUALIZA}</td>
                            </tr>`;
                    });
                    recargarTablaSinOpciones("tableObservacionesReporte", html);
                } else {
                    recargarTablaSinOpciones("tableObservacionesReporte", null);
                    showMsg("Sin observaciones.", 'info');
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

function sDrt(cveOS, cveUP, idUser, cboEfiscalReporteData, cboTrimestreReporteData, txtProblematicaData, txtPropuestaData, txtConclusionData, idCtrlReporteTrimestre) {
    fetchDataArr(5, { _OS: cveOS, _UP: cveUP, _eFiscal: cboEfiscalReporteData, _idUser: idUser, _idTrimestre: cboTrimestreReporteData, _txtProblematica: txtProblematicaData, _txtPropuesta: txtPropuestaData, _txtConclusion: txtConclusionData, _idCtrlReporteTrimestral: idCtrlReporteTrimestre }, 3, function (response) {
        if (response) {
            logger.log("Respuesta a INSERT REPORTE TRIMESTRAL:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto el reporte.", 'success');
                clearForms(1);
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos del reporte.", 'error');
            } else if (responseS[0] === "existe") {
                showMsg("Detectamos que existe un reporte con el mismo trimestre. Elimine el actual, o actualice los datos", 'error');
            }
            gDrt(cveOS, cveUP, cboEfiscalReporteData, idRolUser);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#btnS_ReporteTrimestral").removeAttr("disabled");
    $("#modalReportTrimestralForm").modal("hide")
}

function sDrtAd(cveOS, cveUP, idUser, cboEfiscalReporteData, cboTrimestreReporteData, txtProblematicaData, txtPropuestaData, txtConclusionData, idCtrlReporteTrimestre) {
    fetchDataArr(21, { _OS: cveOS, _UP: cveUP, _eFiscal: cboEfiscalReporteData, _idUser: idUser, _idTrimestre: cboTrimestreReporteData, _txtProblematica: txtProblematicaData, _txtPropuesta: txtPropuestaData, _txtConclusion: txtConclusionData, _idCtrlReporteTrimestral: idCtrlReporteTrimestre }, 3, function (response) {
        if (response) {
            logger.log("Respuesta a INSERT REPORTE TRIMESTRAL GLOBAL:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto el reporte.", 'success');
                clearForms(1);
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos del reporte.", 'error');
            } else if (responseS[0] === "existe") {
                showMsg("Detectamos que existe un reporte con el mismo trimestre. Elimine el actual, o actualice los datos", 'error');
            }
            gDrtAd(cboEfiscalReporteData);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#btnS_ReporteTrimestralG").removeAttr("disabled");
    $("#modalReportTrimestralGForm").modal("hide")
}

function sDra(cveOS, cveUP, idUser, cboEfiscalReporteData, txtConclusionData, idCtrlReporteAnual) {
    fetchDataArr(8, { _OS: cveOS, _UP: cveUP, _eFiscal: cboEfiscalReporteData, _idUser: idUser, _txtConclusion: txtConclusionData, _idCtrlReporteAnual: idCtrlReporteAnual }, 3, function (response) {
        if (response) {
            logger.log("Respuesta a INSERT REPORTE ANUAL:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto el reporte.", 'success');
                clearForms(2);
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos del reporte.", 'error');
            } else if (responseS[0] === "existe") {
                showMsg("Detectamos que existe un reporte con el mismo año. Elimine el actual, o actualice los datos", 'error');
            }
            gDraAd(cveOS, cveUP, cboEfiscalReporteData, idRolUser);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#btnS_ReporteAnual").removeAttr("disabled");
    $("#modalReportAnualForm").modal("hide")
}

function sDraAd(cveOS, cveUP, idUser, cboEfiscalReporteData, txtConclusionData, idCtrlReporteAnual) {
    fetchDataArr(23, { _OS: cveOS, _UP: cveUP, _eFiscal: cboEfiscalReporteData, _idUser: idUser, _txtConclusion: txtConclusionData, _idCtrlReporteAnual: idCtrlReporteAnual }, 3, function (response) {
        if (response) {
            logger.log("Respuesta a INSERT REPORTE ANUAL GLOBAL:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto el reporte.", 'success');
                clearForms(2);
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos del reporte.", 'error');
            } else if (responseS[0] === "existe") {
                showMsg("Detectamos que existe un reporte con el mismo año. Elimine el actual, o actualice los datos", 'error');
            }
            gDraAd(cboEfiscalReporteData);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#modalReportAnualGForm").removeAttr("disabled");
    $("#btnS_ReporteAnualG").modal("hide")
}

function vE(cveOS, cveUP, eFiscal, idTrimestre) {
    fetchDataArr(19, { _idTrimestre: idTrimestre, _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 3, function (response) {
        if (response) {
            logger.error("RESPUESTA DE VERIFICACIÓN DE EVIDENCIAS POR TRIMESTRE EN ACTIVIDADES: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    const algunoNoTieneEvidencias = response.some(item => item.NUM_EVI === 0);
                    const algunoNoTieneReporteValidado = response.some(item => item.SN_VALIDA === 0 || SN_VALIDA === null);
                    if (algunoNoTieneEvidencias && algunoNoTieneReporteValidado) {
                        return false;
                    } else {
                        return true
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else if (response === "error") {
            return false;
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gDrepTri(idCtrlReporteT, Edit__) {
    const arrReturnMeses = [];
    fetchDataArr(11, { _idCtrlReporteTrimestral: idCtrlReporteT }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a REPORTE TRIMESTRAL BY ID:", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    if (Edit__ === 0) {
                        $("#cboTrimestreReporte").removeAttr("disabled");
                        clearForms(1)
                    } else if (Edit__ === 1) {
                        $("#cboTrimestreReporte").val(response[0].ID_TRIMESTRE).attr("disabled", true);
                        $("#txtProblematica").val(response[0].DESC_PROBLEMATICAS);
                        $("#txtPropuesta").val(response[0].DESC_PROPUESTA);
                        //$("#txtConclusion").val(response[0].DESC_CONCLUSION);
                    }
                } else {
                    showMsg("Ocurrio un error al intentar obtener los datos del reporte trimestral.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDrepAnu(idCtrlReporteA, Edit__) {
    const arrReturnMeses = [];
    fetchDataArr(12, { _idCtrlReporteAnual: idCtrlReporteA }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a REPORTE TRIMESTRAL BY ID:", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    if (Edit__ === 0) {
                        clearForms(2)
                    } else if (Edit__ === 1) {
                        $("#txtConclusionA").val(response[0].DESC_CONCLUSION);
                    }
                } else {
                    showMsg("Ocurrio un error al intentar obtener los datos del reporte anual.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function upReporte(idCtrlReporte, idUsuario, descObservacion, setReporte, setTipoReporte) {
    const arrReturnMeses = [];
    fetchDataArr(16, { _idCtrlReporte: idCtrlReporte, _idUsuario: idUsuario, _descObservacion: descObservacion, _setReporte: setReporte, _setTipoReporte: setTipoReporte }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a REPORTE VALIDACION:", response);
            var responseS = response.split("|");
            if (responseS[0] === 'ok') {
                showMsg("Se actualizo el estado del reporte.", 'info');
            } else {
                showMsg("Ocurrio un error al intentar obtener los datos.", 'info');
            }
            if (setTipoReporte === '1') {
                gDrt($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val(), idRolUser);
            } else {
                gDra($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val(), idRolUser);
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var obtenerSelectDatosEfiscal = function () {
    fetchDataArr(0, {}, 1, function (response) {
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
    fetchDataArr(1, { _txtEfiscal: txtEfiscal }, 1, function (response) {
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
    fetchDataArr(2, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 1, function (response) {
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

var gDfCtrimestre = function (id) {
    fetchDataArr(3, {}, 1, function (response) {
        if (response) {
            const select = $("#cboTrimestreReporte");
            const select2 = $("#cboTrimestreReporteG");
            select.empty();
            select2.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            select2.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) {
                select.append($("<option>", { value: item.ID_TRIMESTRE, text: item.DESC_TRIMESTRE }));
                select2.append($("<option>", { value: item.ID_TRIMESTRE, text: item.DESC_TRIMESTRE }));
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
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    loadEndpoints(2);
    obtenerSelectDatosEfiscal();
    obtenerSelectDatosOS(cveEfiscald);
    obtenerSelectDatosUP(cveEfiscald, cveOSd, '')
    gDfCtrimestre(0);
    if (idRolUser === '101') {
        logger.log("Usuario captura");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", true);
        $("#btnN_ReporteTrimestral").show();
        $("#btnN_ReporteAnual").show();
        $("#btnReporteGlobalTrimestre").hide();
        $("#btnReporteGlobalAnual").hide();
        $("#tab-rpt-a-tr").hide();
        $("#div-tab-atr").hide();
        $("#tab-rpt-a-an").hide();
        $("#div-tab-aan").hide();

        gDrt(cveOSd, cveUPd, cveEfiscald, idRolUser);
        gDra(cveOSd, cveUPd, cveEfiscald, idRolUser);
    } else if (idRolUser === '103' || idRolUser === '104') {
        logger.log("Usuario administrador");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#btnN_ReporteTrimestral").hide();
        $("#btnN_ReporteAnual").hide();
        $("#btnReporteGlobalTrimestre").show();
        $("#btnReporteGlobalAnual").show();
        $("#tab-rpt-a-tr").show();
        $("#div-tab-atr").show();
        $("#tab-rpt-a-an").show();
        $("#div-tab-aan").show();

        gDrt(cveOSd, cveUPd, cveEfiscald, idRolUser);
        gDra(cveOSd, cveUPd, cveEfiscald, idRolUser);
        gDrtAd(cveEfiscald);
        gDraAd(cveEfiscald);
    }

    $(document).on("click", "#btnSearch", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();

        if (cveOS === 0 && cveUP === 0 || cveOS === '0' && cveUP === '0' || cveOS === "null" && cveUP === "null" || cveOS === null && cveUP === null) {
            showMsg('Espere a obtener más datos...', 'alert');
            return;
        }

        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (idRolUser === '101') {
                gDrt(cveOS, cveUP, eFiscal, idRolUser);
                gDra(cveOS, cveUP, eFiscal, idRolUser);

            } else if (idRolUser === '103' || idRolUser === '104') {
                gDrtAd(eFiscal);
                gDraAd(eFiscal);
            }
        }
    });

    $(document).on("click", "#btnN_ReporteTrimestral", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        $("#btnS_ReporteTrimestral").attr("data-ctrl-reporte-trimestre", 0);
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            clearForms(1);
            $("#cboTrimestreReporte").removeAttr("disabled");
            $("#modalReportTrimestralForm").modal("show");
        }
    });

    $(document).on("click", "#btnS_ReporteTrimestral", async function () {
        $("#btnS_ReporteTrimestral").attr("disabled", true);
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        var idReturn = $(this)[0].dataset.ctrlReporteTrimestre;

        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            // var flag = vE(cveOS, cveUP, eFiscal, $("#cboTrimestreReporte").val());

            // if (flag === false) {
            //     showMsg('Al parecer, alguna de sus actividades sobre este cuatrimestre, no contiene su reporte y evidencias', 'alert');
            //     return;
            // }

            fetchDataArr(18, { _idTrimestre: $("#cboTrimestreReporte").val(), _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 3, function (response) {
                if (response) {
                    logger.error("RESPUESTA DE VERIFICACIÓN DE EVIDENCIAS POR TRIMESTRE EN ACTIVIDADES: ", response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            const algunoNoTieneEvidencias = response.some(item => item.NUM_EVI === 0);
                            const algunoNoTieneReporteValidado = response.some(item => (item.SN_VALIDA === 0 || item.SN_VALIDA === null));
                            if (algunoNoTieneEvidencias) {
                                showMsg('Al parecer, alguna de sus actividades sobre este cuatrimestre, no contiene su reporte y evidencias', 'alert');
                                return;
                            } else {
                                if (algunoNoTieneReporteValidado) {
                                    showMsg('Revise si han validado sus actividades antes de reportar.', 'alert');
                                    return;
                                } else {
                                    if (validarFormularioReporteTrimestral() === true) {
                                        const cboTrimestreReporteData = $("#cboTrimestreReporte").val();
                                        const txtProblematicaData = $("#txtProblematica").val().trim();
                                        const txtPropuestaData = $("#txtPropuesta").val().trim();
                                        //const txtConclusionData = $("#txtConclusion").val().trim();
                                        const idCtrlReporteTrimestre = idReturn
                                        //sDrt(cveOS, cveUP, idUser, eFiscal, cboTrimestreReporteData, txtProblematicaData, txtPropuestaData, txtConclusionData, idCtrlReporteTrimestre);
                                        sDrt(cveOS, cveUP, idUser, eFiscal, cboTrimestreReporteData, txtProblematicaData, txtPropuestaData, '', idCtrlReporteTrimestre);
                                    }
                                }
                            }
                            // if (validarFormularioReporteTrimestral() === true) {
                            //     const cboTrimestreReporteData = $("#cboTrimestreReporte").val();
                            //     const txtProblematicaData = $("#txtProblematica").val().trim();
                            //     const txtPropuestaData = $("#txtPropuesta").val().trim();
                            //     //const txtConclusionData = $("#txtConclusion").val().trim();
                            //     const idCtrlReporteTrimestre = idReturn
                            //     //sDrt(cveOS, cveUP, idUser, eFiscal, cboTrimestreReporteData, txtProblematicaData, txtPropuestaData, txtConclusionData, idCtrlReporteTrimestre);
                            //     sDrt(cveOS, cveUP, idUser, eFiscal, cboTrimestreReporteData, txtProblematicaData, txtPropuestaData, '', idCtrlReporteTrimestre);
                            // }
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                } else if (response === "error") {
                    return;
                }
            });
        }
        $("#btnS_ReporteTrimestral").removeAttr("disabled");
    });

    $(document).on("click", ".btnEditReporteT", function () {
        var idReturn = $(this)[0].dataset.ctrlReporteTrimestre;
        $("#btnS_ReporteTrimestral").attr("data-ctrl-reporte-trimestre", idReturn);
        gDrepTri(idReturn, 1)
        $("#modalReportTrimestralForm").modal("show");
    });

    $(document).on("click", ".btnReporteTrimestral", function () {
        var idReturn = $(this)[0].dataset.ctrlReporteTrimestre;
        fetchDataArr(6, { _idCtrlReporteTrimestral: idReturn, _idUsuario: idUser }, 2, function (response) {
            if (response) {
                logger.log("Respuesta a UPDATE REPORTE TRIMESTRAL ENVIO:", response.split("|"));
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    showMsg("Se reporto el trimestre.", 'success');
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al insertar los datos del riesgo.", 'error');
                }
                gDrt($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val(), idRolUser);
                //gDra($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", ".btnDeleteReporteTrimestral", function () {
        var idReturn = $(this)[0].dataset.ctrlReporteTrimestre;
        fetchDataArr(10, { _idCtrlReporteTrimestral: idReturn, _idUsuario: idUser }, 2, function (response) {
            if (response) {
                logger.log("Respuesta a UPDATE REPORTE TRIMESTRAL DELETE:", response.split("|"));
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    showMsg("Se elimino el trimestre.", 'success');
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al eliminar el reporte.", 'error');
                }
                gDrt($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val(), idRolUser);
                //gDra($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    // $(document).on("click", "#btnN_ReporteAnual", function () {
    //     var cveOS = $("#cboOs").val();
    //     var cveUP = $("#cboUp").val();
    //     var eFiscal = $("#cboEfiscal").val();
    //     $("#btnS_ReporteAnual").attr("data-ctrl-reporte-anual", 0);
    //     if (cveOS === 0 && cveUP === 0 || cveOS === '0' && cveUP === '0' || cveOS === "null" && cveUP === "null" || cveOS === null && cveUP === null) {
    //         showMsg('Espere a obtener más datos...', 'alert');
    //         return;
    //     }
    //     //$("#modalReportAnualForm").modal("show");
    // });

    //$(document).on("click", "#btnS_ReporteAnual", function () {
    $(document).on("click", "#btnN_ReporteAnual", async function () {
        $("#btnS_ReporteAnual").attr("disabled", true);
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        //var idReturn = $(this)[0].dataset.ctrlReporteAnual;
        var idReturn = $(this)[0].dataset.ctrlReporteAnual;
        if (idReturn === undefined) {
            idReturn = 0
        }
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            fetchDataArr(19, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 3, function (response) {
                if (response) {
                    logger.error("RESPUESTA DE VERIFICACIÓN DE REPORTES TRIMESTRALES: ", response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            const algunoNoTieneReporteValidado = response.some(item => (item.SN_VALIDA === 0 || item.SN_VALIDA === null));
                            if (algunoNoTieneReporteValidado) {
                                showMsg('Sus reportes trimestrales, estan sin validar.', 'alert');
                                return;
                            } else {
                                //if (validarFormularioReporteAnual() === true) {
                                //const txtConclusionAData = $("#txtConclusionA").val().trim();
                                const idCtrlReporteAnual = idReturn
                                //sDra(cveOS, cveUP, idUser, eFiscal, txtConclusionAData, idCtrlReporteAnual);
                                sDra(cveOS, cveUP, idUser, eFiscal, '', idCtrlReporteAnual);
                                //}
                            }
                        } else {
                            showMsg('Revise sus reportes trimestrales.', 'alert');
                            return;
                        }
                        // const idCtrlReporteAnual = idReturn
                        // //sDra(cveOS, cveUP, idUser, eFiscal, txtConclusionAData, idCtrlReporteAnual);
                        // sDra(cveOS, cveUP, idUser, eFiscal, '', idCtrlReporteAnual);
                    } else {
                        return;
                    }
                } else if (response === "error") {
                    return;
                }
            });
        }
        $("#btnS_ReporteAnual").removeAttr("disabled");
    });

    $(document).on("click", ".btnEditReporteA", function () {
        var idReturn = $(this)[0].dataset.ctrlReporteAnual;
        $("#btnS_ReporteAnual").attr("data-ctrl-reporte-anual", idReturn);
        gDrepAnu(idReturn, 1)
        $("#modalReportAnualForm").modal("show");
    });

    $(document).on("click", ".btnReporteAnual", function () {
        var idReturn = $(this)[0].dataset.ctrlReporteAnual;
        fetchDataArr(9, { _idCtrlReporteAnual: idReturn, _idUsuario: idUser }, 2, function (response) {
            if (response) {
                logger.log("Respuesta a UPDATE REPORTE ANUAL ENVIO:", response.split("|"));
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    showMsg("Se reporto el reporte anual.", 'success');
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al actualizar el reporte.", 'error');
                }
                gDra($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val(), idRolUser);
                //gDra($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", ".btnDeleteReporteAnual", function () {
        var idReturn = $(this)[0].dataset.ctrlReporteAnual;
        fetchDataArr(13, { _idCtrlReporteAnual: idReturn, _idUsuario: idUser }, 2, function (response) {
            if (response) {
                logger.log("Respuesta a UPDATE REPORTE ANUAL DELETE:", response.split("|"));
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    showMsg("Se elimino el reporte.", 'success');
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al eliminar el reporte.", 'error');
                }
                gDra($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val(), idRolUser);
                //gDra($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", ".btnSeeReporteTrimestral", async function () {
        var idReturn = $(this)[0].dataset.ctrlTrimestre;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            gDrta(cveOS, cveUP, eFiscal, idReturn);
        }
    });

    $(document).on("click", ".btnSeeReporteAnual", async function () {
        var idReturn = $(this)[0].dataset.ctrlAnual;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            gDraa(cveOS, cveUP, eFiscal, idReturn);
        }
    });

    $(document).on("click", ".btnSetReporte", async function () {
        var idReturn = $(this)[0].dataset.ctrlReporte;
        var idReturn2 = $(this)[0].dataset.ctrlSet;
        var idReturn3 = $(this)[0].dataset.ctrlTipo;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (idReturn2 === 0 || idReturn2 === '0') {
                $("#modalObservacionReporte").modal("show");
                $("#btnSendObserReporte").attr("data-ctrl-reporte", idReturn);
                $("#btnSendObserReporte").attr("data-ctrl-set", idReturn2);
                $("#btnSendObserReporte").attr("data-ctrl-tipo", idReturn3);
            } else {
                upReporte(idReturn, idUser, '', idReturn2, idReturn3);
            }
        }
    });

    $(document).on("click", "#btnSendObserReporte", function () {
        var idReturn = $(this)[0].dataset.ctrlReporte;
        var idReturn2 = $(this)[0].dataset.ctrlSet;
        var idReturn3 = $(this)[0].dataset.ctrlTipo;
        if ($("#txtObservacion").val() === '') {
            showMsg('Defina su observación, no puede rechazar sin ninguna observación.', 'error');
            return;
        } else {
            if (isNaN(idReturn)) {
                showMsg('Lo sentimos, no pede rechazar, sucedio algo inesperado.', 'error');
                return;
            } else {
                upReporte(idReturn, idUser, $("#txtObservacion").val().trim(), idReturn2, idReturn3);
            }
            //$("#modalObservacionReporte").modal("hide");
        }
    });

    $(document).on("click", ".btnSeeObserReporte", function () {
        var idReturn = $(this)[0].dataset.ctrlReporte;
        var idReturn2 = $(this)[0].dataset.ctrlTipo;
        $("#modalObservacionesReporte").modal("show");
        gDorById(idReturn, idReturn2)
    });

    $(document).on("click", "#btnReporteGlobalTrimestre", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        $("#btnS_ReporteTrimestralG").attr("data-ctrl-reporte-trimestral", 0);
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            $("#modalReportTrimestralGForm").modal("show");
        }
    });

    $(document).on("click", "#btnReporteGlobalAnual", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        $("#btnS_ReporteAnualG").attr("data-ctrl-reporte-anual", 0);
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            $("#modalReportAnualGForm").modal("show");
        }
    });

    $(document).on("click", "#btnS_ReporteTrimestralG", async function () {
        $("#btnS_ReporteTrimestralG").attr("disabled", true);
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        var idReturn = $(this)[0].dataset.ctrlReporteTrimestral;

        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            // fetchDataArr(18, { _idTrimestre: $("#cboTrimestreReporte").val(), _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 3, function (response) {
            //     if (response) {
            //         logger.error("RESPUESTA DE VERIFICACIÓN DE EVIDENCIAS POR TRIMESTRE EN ACTIVIDADES: ", response);
            //         if (response !== 'error') {
            //             if (response.length !== 0) {
            //                 const algunoNoTieneEvidencias = response.some(item => item.NUM_EVI === 0);
            //                 const algunoNoTieneReporteValidado = response.some(item => (item.SN_VALIDA === 0 || item.SN_VALIDA === null));
            //                 if (algunoNoTieneEvidencias) {
            //                     showMsg('Al parecer, alguna de sus actividades sobre este cuatrimestre, no contiene su reporte y evidencias', 'alert');
            //                     return;
            //                 } else {
            //                     if (algunoNoTieneReporteValidado) {
            //                         showMsg('Revise si han validado sus actividades antes de reportar.', 'alert');
            //                         return;
            //                     } else {
            if ($("#txtConclusionGT").val() !== "") {
                const cboTrimestreReporteData = $("#cboTrimestreReporte").val();
                const txtConclusionData = $("#txtConclusionGT").val().trim();
                const idCtrlReporteTrimestre = idReturn
                //sDrt(cveOS, cveUP, idUser, eFiscal, cboTrimestreReporteData, txtProblematicaData, txtPropuestaData, txtConclusionData, idCtrlReporteTrimestre);
                sDrtAd(cveOS, cveUP, idUser, eFiscal, cboTrimestreReporteData, '', '', txtConclusionData, idCtrlReporteTrimestre);
            } else {
                showMsg('Inserte su conclusión', 'alert');
                return;
            }
            //                     }
            //                 }
            //             } else {
            //                 return;
            //             }
            //         } else {
            //             return;
            //         }
            //     } else if (response === "error") {
            //         return;
            //     }
            // });
        }
        $("#btnS_ReporteTrimestralG").removeAttr("disabled");
    });

    $(document).on("click", "#btnS_ReporteAnualG", async function () {
        $("#btnS_ReporteAnualG").attr("disabled", true);
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        var idReturn = $(this)[0].dataset.ctrlReporteAnual;

        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            // fetchDataArr(19, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 3, function (response) {
            //     if (response) {
            //         logger.error("RESPUESTA DE VERIFICACIÓN DE REPORTES TRIMESTRALES: ", response);
            //         if (response !== 'error') {
            //             if (response.length !== 0) {
            //                 const algunoNoTieneReporteValidado = response.some(item => (item.SN_VALIDA === 0 || item.SN_VALIDA === null));
            //                 if (algunoNoTieneReporteValidado) {
            //                     showMsg('Sus reportes trimestrales, estan sin validar.', 'alert');
            //                     return;
            //                 } else {
            //if (validarFormularioReporteAnual() === true) {
            if ($("#txtConclusionGA").val() !== "") {
                const txtConclusionAData = $("#txtConclusionGA").val().trim();
                const idCtrlReporteAnual = idReturn
                sDraAd(cveOS, cveUP, idUser, eFiscal, txtConclusionAData, idCtrlReporteAnual);
            } else {
                showMsg('Inserte su conclusión', 'alert');
                return;
            }
            //}
            //                 }
            //             } else {
            //                 showMsg('Revise sus reportes trimestrales.', 'alert');
            //                 return;
            //             }
            //         } else {
            //             return;
            //         }
            //     } else if (response === "error") {
            //         return;
            //     }
            // });
        } else {
            showMsg('Espere a obtener más datos...', 'alert');
            return;
        }
        $("#btnS_RepbtnS_ReporteAnualGorteAnual").removeAttr("disabled");
    });

    $(document).on("click", ".btnSeeReporteTrimestralG", async function () {
        var idReturn = $(this)[0].dataset.ctrlTrimestre;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            gDrtag(cveOS, cveUP, eFiscal, idReturn);
        }
    });

    $(document).on("click", ".btnSeeReporteAnualG", async function () {
        var idReturn = $(this)[0].dataset.ctrlAnual;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            gDraag(cveOS, cveUP, eFiscal, idReturn);
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validarFormularioReporteTrimestral() {
    let esValido = true;

    const cboTrimestreReporte = $("#cboTrimestreReporte").val();
    if (cboTrimestreReporte === "" || cboTrimestreReporte === "0") {
        showMsgForm("cboTrimestreReporte", "Elija el trimestre.", "error");
        esValido = false;
    }

    const txtProblematica = $("#txtProblematica").val().trim();
    if (txtProblematica === "") {
        showMsgForm("txtProblematica", "Ingrese la problematica."), "error";
        esValido = false;
    }

    const txtPropuesta = $("#txtPropuesta").val().trim();
    if (txtPropuesta === "") {
        showMsgForm("txtPropuesta", "Ingrese la propuesta de solución.", "error");
        esValido = false;
    }

    // const txtConclusion = $("#txtConclusion").val().trim();
    // if (txtConclusion === "") {
    //     showMsgForm("txtConclusion", "Ingrese su conclusión.", "error");
    //     esValido = false;
    // }

    return esValido;
}

function validarFormularioReporteAnual() {
    let esValido = true;

    const txtConclusionA = $("#txtConclusionA").val().trim();
    if (txtConclusionA === "") {
        showMsgForm("txtConclusionA", "Ingrese su conclusión.", "error");
        esValido = false;
    }

    return esValido;
}

function clearForms(type) {
    if (type === 1) {
        $("#cboTrimestreReporte").val(0);
        $("#txtProblematica").val("");
        $("#txtPropuesta").val("");
        //$("#txtConclusion").val("");
    } else if (type === 2) {
        $("#txtConclusionA").val("");
    } else if (type === 3) {
    } else if (type === 4) {
    } else if (type === 5) {
    } else if (type === 6) {
    }
}