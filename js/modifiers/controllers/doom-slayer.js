'use strict';

const timingNoty = 3500;
var idUser = $("#MainContent_hddnIdUsuario").val();
var idRolUser = $("#MainContent_hddnPage").val();
var cveOSd = $("#MainContent_hddnOS").val().trim();
var cveUPd = $("#MainContent_hddnUP").val().trim();
var cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();

const columnAlineacion = $("#columnAlineacion");
const columnRiesgo = $("#columnRiesgo");
const columnFactor = $("#columnFactor");
const columnControl = $("#columnControl");
const columnAccion = $("#columnAccion");
const columnActividad = $("#columnActividad");

let mesesSeleccionados = [];

// function comboGD(index, data) {
//     fetchDataArr(index, data, 0, function (response) {
//         if (response) {
//             logger.log("Datos recibidos a combo:", index, response);
//             return response;
//         } else if (response === "error") {
//             showMsg("Error al cargar datos", 'error');
//             return;
//         }
//     });
// }

function gDalCount(cveOS, cveUP, _eFiscal) {
    fetchDataArr(0, { _OS: cveOS, _UP: cveUP, __eFiscal: _eFiscal }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a conteo ALINEACION:", response);
            if (response !== 'error') {
                if (response.length !== null) {
                    $("#txtNoFolio").val(`${cveUP}.${response.length + 1}`);
                } else {
                    $("#txtNoFolio").val(`${cveUP}.${response.length + 1}`);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDalById(idAlineacion) {
    fetchDataArr(41, { _idCtrlAlineacion: idAlineacion }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a ALINEACION BY ID:", response);
            if (response.length === 1) {
                // var html = `<div class='kanban-item mb-2'>
                //                     <div class='card kanban-item-card hover-actions-trigger text-bg-secondary'>
                //                         <div class='card-body'>
                //                             <p class='mb-0 fw-light font-sans-serif fs-11'>${response[0].CONSECUTIVO} - ${response[0].DESC_ALINEACION}</p>
                //                         </div>
                //                     </div>
                //                 </div>`;

                var html = `<div class='card mb-3 text-1000 fs-10'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative'>
                                                <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                                    <h6 class='mb-1'>
                                                        <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                            Alineación: ${response[0].DESC_ALINEACION}
                                                        </div>
                                                    </h6>
                                                    <div class='fs--1'>
                                                        <span class='fw-bold text-600 fs-11'>
                                                            No. de control interno: ${response[0].CONSECUTIVO}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

                $("#containerDataRiesgo_x_Alineacion").html(html);
                $("#txtNoFolio").val(response[0].CONSECUTIVO);
                $("#cboAlineacion").val(response[0].ID_ALINEACION);
                $("#txtAlineacion").val(response[0].DESC_ALINEACION);
                $("#btnS_Alineacion").attr("data-ctrl-alineacion", response[0].ID_CTRL_ALINEACION)
            } else {
                showMsg("Ocurrio un error al intentar obtener los datos de la alineación.", 'info');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDriById(idCtrlAlineacion) {

    fetchDataArr(16, { _idCtrlAlineacion: idCtrlAlineacion }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a RIESGO BY ID (ALINEACION):", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    $("#cboProceso").val(response[0].ID_PROCESO).removeAttr("disabled");
                    $("#cboNivelRiesgo").val(response[0].ID_NIVEL_RIESGO).removeAttr("disabled");
                    $("#cboClasRiesgo").val(response[0].ID_CLAS_RIESGO).removeAttr("disabled");
                    $("#txtOSProceso").val(response[0].CVE_OS);
                    $("#txtUPProceso").val(response[0].CVE_UP);
                    $("#txtNoFolio").val(response[0].NO_FOLIO_RIESGO);
                    $("#txtRiesgo").val(response[0].DESC_RIESGO).removeAttr("disabled");
                    $("#btnS_Riesgo").removeAttr("disabled");
                    $("#btnS_Riesgo").attr("data-ctrl-riesgo", response[0].ID_CTRL_RIESGO);
                } else {
                    showMsg("Su alineacion no contiene un riesgo, favor de ingresar los datos.", 'error');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDriByIdri(idRiesgo) {
    fetchDataArr(48, { _idCtrlRiesgo: idRiesgo }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a RIESGO BY ID (RIESGO):", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    // var html = `<div class='kanban-item mb-2'>
                    //                 <div class='card kanban-item-card hover-actions-trigger text-bg-secondary'>
                    //                     <div class='card-body'>
                    //                         <p class='mb-0 fw-light font-sans-serif fs-11'>${response[0].DESC_RIESGO}</p>
                    //                     </div>
                    //                 </div>
                    //             </div>`;

                    var html = `<div class='card mb-3 text-1000 fs-10'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative'>
                                                <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                                    <h6 class='mb-1'>
                                                        <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                            Riesgo: ${response[0].DESC_RIESGO}
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

                    $("#containerDataFactor_x_Riesgo").html(html);
                    if (response[0].ID_CUADRANTE === null && response[0].ID_IMPACTO === null && response[0].ID_PROBABILIDAD === null) {
                        $("#btnS_Factor").removeAttr("disabled");
                        $("#btnE_ValorInicial").removeAttr("disabled");
                        $("#valInit01").hide();
                        $("#valInit02").hide();
                        $("#valInit03").hide();
                        $("#btnDeleteValorInicial").hide();
                    } else {
                        $("#btnDeleteValorInicial").show().attr("data-ctrl-riesgo", response[0].ID_CTRL_RIESGO);
                        $("#valInit01").show().html(`Impacto inicial: ${response[0].VALOR_IMPACTO}`);
                        $("#valInit02").show().html(`Probabilidad inicial: ${response[0].VALOR_PROBABILIDAD}`);
                        $("#valInit03").show().html(`Cuadrante inicial: ${response[0].VALOR_CUADRANTE}`);
                        if (response[0].SN_ENVIADO === null) {
                            $("#btnS_Factor").attr("disabled", true);
                            $("#btnE_ValorInicial").attr("disabled", true);
                        } else {
                            if (response[0].SN_VALIDA === true) {
                                $("#btnS_Factor").attr("disabled", true);
                                $("#btnE_ValorInicial").attr("disabled", true);
                            } else {
                                if (response[0].SN_ENVIADO === false) {
                                    $("#btnS_Factor").removeAttr("disabled");
                                    $("#btnE_ValorInicial").removeAttr("disabled").text("Editar valoración inicial");
                                    $("#txtPosibleRiesgo").val(response[0].POSIBLE_EFECTO_RIESGO);
                                    $("#cboImpactoInicio").val(response[0].ID_IMPACTO);
                                    $("#cboProbabilidadInicio").val(response[0].ID_PROBABILIDAD);
                                    $("#cboCuadranteInicio").val(response[0].ID_CUADRANTE);

                                } else {
                                    $("#btnS_Factor").attr("disabled", true);
                                    $("#btnE_ValorInicial").attr("disabled", true);
                                }
                            }
                        }
                    }
                } else {
                    showMsg("Inserte factores", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDfaById(idFactor, Edit__) {
    fetchDataArr(22, { _idCtrlFactor: idFactor }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a FACTOR BY ID:", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    // var html = `<div class='kanban-item mb-2'>
                    //                 <div class='card kanban-item-card hover-actions-trigger text-bg-secondary'>
                    //                     <div class='card-body'>
                    //                         <p class='mb-0 fw-light font-sans-serif fs-11'>${response[0].FOLIO} - ${response[0].DESC_FACTOR}</p>
                    //                     </div>
                    //                 </div>
                    //             </div>`;

                    var html = `<div class='card mb-3 text-1000 fs-10'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative'>
                                                <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                                    <h6 class='mb-1'>
                                                        <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                            Factor: ${response[0].FOLIO} - ${response[0].DESC_FACTOR}
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    $("#containerDataControl_x_Factor").html(html);
                    $("#btnS_Control").attr("data-ctrl1", response[0].ID_CTRL_FACTOR);
                    $("#btnCancel_Control").attr("data-ctrl1", response[0].ID_CTRL_FACTOR);
                    if (Edit__ === 0) {
                        $("#cboClasFactor").val(0);
                        $("#cboControlFactor").val(0);
                        $("#cboTipoFactor").val(0);
                        $("#txtFactorRiesgo").val("")
                        $("#btnS_Factor").attr("data-ctrl-factor", 0);
                        $("#txtPosibleRiesgo").val("")
                    } else {
                        $("#cboClasFactor").val(response[0].ID_CLAS_FACTOR);
                        $("#cboControlFactor").val(response[0].ID_CONTROL);
                        $("#cboTipoFactor").val(response[0].ID_TIPO_FACTOR);
                        $("#txtFolioFactor").val(response[0].FOLIO);
                        $("#txtFactorRiesgo").val(response[0].DESC_FACTOR);
                        $("#txtPosibleRiesgo").val(response[0].POSIBLE_EFECTO)
                    }
                } else {
                    showMsg("Ocurrio un error al intentar obtener los datos del factor.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDcoById(idControl, Edit__) {
    fetchDataArr(27, { _idCtrlControl: idControl }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a CONTROL BY ID:", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    //$("#divTxtControl")[0].innerHTML = datos[0].NO_CONTROL + ' - ' + datos[0].DESC_CONTROL;
                    // var html = `<div class='kanban-item mb-2'>
                    //                 <div class='card kanban-item-card hover-actions-trigger text-bg-secondary'>
                    //                     <div class='card-body'>
                    //                         <p class='mb-0 fw-light font-sans-serif fs-11'>${response[0].NO_CONTROL} - ${response[0].DESC_CONTROL}</p>
                    //                     </div>
                    //                 </div>
                    //             </div>`;
                    var html = `<div class='card mb-3 text-1000 fs-10'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative'>
                                                <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                                    <h6 class='mb-1'>
                                                        <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                            Control: ${response[0].NO_CONTROL} - ${response[0].DESC_CONTROL}
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    $("#containerDataAccion_x_Control").html(html);
                    $("#btnS_Accion").attr("data-ctrl-control", response[0].ID_CTRL_CONTROL);
                    $("#btnCancel_Accion").attr("data-ctrl-control", response[0].ID_CTRL_CONTROL);
                    $("#btnS_Accion").attr("data-ctrl-accion", 0);
                    // if (response[0].SN_TERMINADO === 1) {
                    //     $("#btnS_Accion").attr("disabled", true);
                    // } else if (response[0].SN_TERMINADO === 0) {
                    //     $("#btnS_Accion").attr("data-ctrl-accion", 0);
                    //     $("#btnS_Accion").removeAttr("disabled");
                    // }
                    if (Edit__ === 0) {
                        clearForms(4);
                    } else {
                        $("#cboTipoControl").val(response[0].ID_TIPO_CONTROL);
                        $("#cboDeterminacion").val(response[0].ID_DETERMINACION);
                        $("#cboControlDocumentado").val(response[0].ESTA_DOCUMENTADO);
                        $("#cboControlFormalizado").val(response[0].ESTA_FORMALIZADO);
                        $("#cboControlAplica").val(response[0].SE_APLICA);
                        $("#cboControlEfectivo").val(response[0].ES_EFECTIVO);
                        $("#txtFolioControlFactor").val(response[0].NO_CONTROL);
                        $("#txtDescControlFactor").val(response[0].DESC_CONTROL);
                    }
                } else {
                    showMsg("Ocurrio un error al intentar obtener los datos del factor.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDacById(idAccion, Edit__) {
    fetchDataArr(29, { _idCtrlAccion: idAccion }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a ACCION BY ID:", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    var html = `<div class='card mb-3 text-1000 fs-10'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative'>
                                                <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                                    <h6 class='mb-1'>
                                                        <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                            Acción: ${response[0].DESC_ACCION}
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    $("#containerDataActividad_x_Accion").html(html);
                    $("#btnS_Actividad").attr("data-ctrl-accion", response[0].ID_CTRL_ACCION)
                    //$("#btnS_Actividad").attr("data-ctrl-actividad", 0);
                    $("#btnCancel_Actividad").attr("data-ctrl-accion", response[0].ID_CTRL_ACCION)
                    if (Edit__ === 0) {
                        $("#txtDescAccion").val("");
                    } else if (Edit__ === 1) {
                        $("#txtDescAccion").val(response[0].DESC_ACCION);
                    }
                } else {
                    showMsg("Ocurrio un error al intentar obtener los datos del factor.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDactById(idActividad, Edit__) {
    const arrReturnMeses = [];
    fetchDataArr(34, { _idCtrlActividad: idActividad }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a ACTIVIDAD BY ID:", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    if (Edit__ === 0) {
                        $("#txtDescActividad").val("");
                        $("#cboResponsable").val(0);
                        $("#cboMes").val(0);
                        $("#cboTrimestre").val(0);
                    } else if (Edit__ === 1) {
                        arrReturnMeses.push(response[0].ID_MES)
                        $("#txtDescActividad").val(response[0].DESC_ACTIVIDAD);//.attr("disabled", true);
                        $("#cboResponsable").val(response[0].ID_RESPONSABLE);
                        //$("#cboMes2").val(arrReturnMeses);//.attr("disabled", true);
                        $('#cboMes2').select2("val", arrReturnMeses);
                        $("#cboTrimestre").val(response[0].ID_TRIMESTRE);
                        $("#txtNoActividad").val(response[0].NO_ACTIVIDAD);
                        $("#txtNoMeta").val(response[0].META_PROGRAMADA);
                        $("#txtEvidencia").val(response[0].EVIDENCIA);//.attr("disabled", true);
                        //crearTextboxes();
                    }
                } else {
                    showMsg("Ocurrio un error al intentar obtener los datos del factor.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDdr(cveOS, cveUP, eFiscal) {
    fetchDataArr(72, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 0, function (response) {
        if (response) {
            logger.error("RESPUESTA DATOS PERSONAS REPORTE: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false
        }
    });
}

function gDdr2(cveOS, cveUP, eFiscal) {
    return new Promise((resolve, reject) => {
        fetchDataArr(72, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 0, function (response) {
            if (response) {
                logger.error("RESPUESTA DATOS PERSONAS REPORTE: ", response);
                if (response !== 'error') {
                    if (response.length !== 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            } else {
                resolve(false);
            }
        });
    });
}

function gDoaaById(idCtrlAlineacion) {
    var html = '';
    fetchDataArr(76, { _idCtrlAlineacion: idCtrlAlineacion }, 0, function (response) {
        if (response) {
            logger.error("RESPUESTA OBJETIVOS POR ALINEACION: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {

                        html += `<tr>
                                <td class='text-1000'>${item.NO}</td>
                                <td class='text-1000 w-50'>${item.DESC_OBJETIVO_SECTORIAL}</td>
                                <td class='text-1000'>${item.NO1}</td>
                                <td class='text-1000 w-50'>${item.DESC_ACCION_SECTORIAL}</td>
                                <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-danger btnDeleteObjetivoAccion customButton m-1' type='button' 
                                            data-ctrl-id-al='${item.ID_CTRL_ALINEACION}'
                                            data-ctrl-id-ob='${item.ID_OBJETIVO_SECTORIAL}'
                                            data-ctrl-id-ac='${item.ID_ACCION_SECTORIAL}'
                                            >Eliminar objetivo y acción</button>
                                        </div>
                                    </td>
                            </tr>`;
                    });
                    recargarTablaSinOpciones("tableObjetivoAcciones", html);
                    $("#tableObjetivos").show();
                } else {
                    recargarTablaSinOpciones("tableObjetivoAcciones", null);
                    $("#tableObjetivos").hide();
                    showMsg("Sin objetivos.", 'info');
                }
            } else {
                showMsg("Ocurrió un error al obtener los datos.", 'error');
                return;
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    loadInit($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
}

//function uPri(txtPosibleRiesgo, idImpacto, idProbabilidad, idCuadrante, idRiesgo) {
function uPri(idImpacto, idProbabilidad, idCuadrante, idRiesgo) {
    fetchDataArr(49, { _idImpacto: idImpacto, _idProbabilidad: idProbabilidad, _idCuadrante: idCuadrante, _idUsuario: idUser, _idCtrlRiesgo: idRiesgo }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a UPDATE RIESGO NIVEL INICIAL:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se insertaron los valores correctamente.", 'success');
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos del riesgo.", 'error');
            }
            //getChartData($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1);
            //getRiesgosTable($("#cboOs").val(), $("#cboUp").val());
            gDch($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
            //gDriT($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            gDfa(idRiesgo);
            gDriByIdri(idRiesgo);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#btnUpdateValoresRiesgoInicio").removeAttr("disabled");
}

//function uPri2(idControl, idImpacto, idProbabilidad, idCuadrante, idEstrategia, idRiesgo) {
function uPri2(idImpacto, idProbabilidad, idCuadrante, idRiesgo) {
    fetchDataArr(51, { _idImpactoFin: idImpacto, _idProbabilidadFin: idProbabilidad, _idCuadranteFin: idCuadrante, _idUsuario: idUser, _idCtrlRiesgo: idRiesgo }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a UPDATE RIESGO ... ... :", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se insertaron los valores correctamente.", 'success');
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos del riesgo.", 'error');
            }
            gDch($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
            //gDriT($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            gDfa(idRiesgo);
            ///gDco(idReturn2, txtFolioControlFactorData.substring(0, 6));
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function uPri3(cveOS, cveUP, idRiesgos) {
    fetchDataArr(53, { _OS: cveOS, _UP: cveUP, arrRiesgos: idRiesgos, _idUser: idUser }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a UPDATE RIESGO PARA VALIDACION:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se enviaron los riesgos a revisión.", 'success');
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos del riesgo.", 'error');
            } else if (responseS[0] === "empty") {
                showMsg("No puede enviar su información .", 'error');
            }
            loadInit($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function uPri4(idRiesgo) {
    fetchDataArr(78, { _idCtrlRiesgo: idRiesgo, _idUser: idUser }, 0, function (response) {
        logger.log("Respuesta a UPDATE RIESGO DELETE INITIAL VAL:", response);
        if (response.flag) {
            showMsg(response.msg, 'success');
        } else {
            showMsg(response.msg, 'error');
        }
        loadInit($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        gDriByIdri(idRiesgo);
        gDfa(idRiesgo);
    });
}

function sDal(idAlineacion, txtAlineacion, idCtrlAlineacion, cveOS, cveUP, eFiscal, Folio) {
    blockUICustom();
    fetchDataArr(5, { _idAlineacion: idAlineacion, _idUsuario: idUser, _txtAlineacion: txtAlineacion, _idCtrlAlineacion: idCtrlAlineacion, _OS: cveOS, _UP: cveUP, _Efiscal: eFiscal, _txtNoRiesgo: Folio }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a INSERT ALINEACION:", response);
            if (response.flag) {
                $("#btnS_Riesgo").attr("data-ctrl-alineacion", `${response.returID}`)
                $("#btnS_Riesgo").attr("data-termino", `${0}`)
                showMsg(response.msg, 'success');
            } else {
                showMsg(response.msg, 'error');
            }
            loadInit(cveOS, cveUP, eFiscal);
            gDalCount(cveOS, cveUP, eFiscal);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
        Swal.close();
    });
    $("#btnS_Alineacion").attr("disabled", false);
}

function sDri(idProceso, idCtrlAlineacion, idNivelRiesgo, idClasRiesgo, eFiscal, cveOS, cveUP, txtRiesgo, idCtrlRiesgo) {
    fetchDataArr(15, { _idProceso: idProceso, _idCtrlAlineacion: idCtrlAlineacion, _idNivelRiesgo: idNivelRiesgo, _idClasRiesgo: idClasRiesgo, _Efiscal: eFiscal, _OS: cveOS, _UP: cveUP, _txtRiesgo: txtRiesgo, _idUsuario: idUser, _idCtrlRiesgo: idCtrlRiesgo }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a INSERT RIESGO:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto el riesgo.", 'success');
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error.", 'error');
            }
            gDri(idCtrlAlineacion);
            gDch($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
            clearForms(2);
            //gDriT($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#modalRiesgoForm").modal("hide");
    $("#btnS_Riesgo").removeAttr("disabled");
}

//function sDfa(idRiesgo, idClasFactor, idControlFactor, idTipoFactor, txtNoFactor, txtDescFactor, idCtrlFactor, txtPosibleRiesgo) {
function sDfa(idRiesgo, idClasFactor, idTipoFactor, txtNoFactor, txtDescFactor, idCtrlFactor, txtPosibleRiesgo) {
    fetchDataArr(20, { _idCtrlRiesgo: idRiesgo, _idClasFactor: idClasFactor, _idTipoFactor: idTipoFactor, _txtNoFactor: txtNoFactor, _txtDescFactor: txtDescFactor, _idUsuario: idUser, _idCtrlFactor: idCtrlFactor, _txtPosibleRiesgo: txtPosibleRiesgo }, 0, function (response) {
        if (response) {
            logger.info("Respuesta a INSERT FACTOR:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto el factor.", 'success');
                clearForms(3);
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos del factor.", 'error');
            }
            gDfa(idRiesgo);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#btnS_Factor").removeAttr("disabled");
}

function sDco(idFactor, idTipoControl, idDeterminacion, id01, id02, id03, id04, folioControl, descControl, idControl) {
    fetchDataArr(25, { _idCtrlFactor: idFactor, _idTipoControl: idTipoControl, _idDeterminacion: idDeterminacion, _estaDocumen: id01, _estaForma: id02, _seAplica: id03, _esEfectivo: id04, _folioControl: folioControl, _descControl: descControl, _idUsuario: idUser, _idCtrlControl: idControl }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a INSERT CONTROL:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto el control.", 'success');
                clearForms(4)
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos del control.", 'error');
            }
            gDco(idFactor, folioControl.substring(0, 6));
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    //$("#modalControlForm").modal("hide");
    $("#btnS_Control").removeAttr("disabled");
}

function sDac(idControl, descAccion, idAccion) {
    fetchDataArr(28, { _idCtrlControl: idControl, _descAccion: descAccion, _idUsuario: idUser, _idCtrlAccion: idAccion }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a INSERT ACCION:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto la acción.", 'success');
                clearForms(5);
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos de la acción.", 'error');
            }
            gDac(idControl);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#modalAccionForm").modal("hide");
    $("#btnS_Accion").removeAttr("disabled");
}

//function sDact(idAccion, idResponsable, descActividad, idTrimestre, idMes, idActividad, noActividad) {
function sDact(idAccion, idResponsable, descActividad, listMeses, idActividad, noActividad, __tUI, txtMeta, txtEvidencia) {
    const listToString = JSON.stringify(listMeses);
    fetchDataArr(33, { _idCtrlAccion: idAccion, _idResponsable: idResponsable, _descActividad: descActividad, _idUsuario: idUser, _listMeses: listToString, _idCtrlActividad: idActividad, _noActividad: noActividad, _tyUpIn: __tUI, _txtMeta: txtMeta, _txtEvidencia: txtEvidencia }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a INSERT ACTIVIDAD:", response.split("|"));
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto la actividad.", 'success');
                //$("#txtResponsableActividad").val("")
                $("#txtDescActividad").val("")
                $("#cboResponsable").val(0);
                $("#txtNoMeta").val(0);
                $("#txtEvidencia").val("");
                $("#cboMes2").val([]);
                //$("#cboTrimestre").val(0);
                //$("#cboTipoReporte").val(0);
                clearForms(6);
                //$("#modalActividadForm").modal("hide");
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos de la actividad.", 'error');
            } else if (responseS[0] !== "error") {
                showMsg(responseS[0], 'info');
            }
            gDact(idAccion, noActividad.substring(0, 8));
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
    $("#btnS_Actividad").removeAttr("disabled");
}

function loadInit(cveOS, cveUP, _eFiscal) {
    fetchDataArr(0, { _OS: cveOS, _UP: cveUP, __eFiscal: _eFiscal }, 0, async function (response) {
        if (Array.isArray(response)) {
            logger.log("Datos recibidos INICIO:", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    const itemPromises = response.map(async (item) => {
                        let envio__ = item.SN_ENVIADO === true ? 'disabled' : '';
                        let snTermanado = item.SN_TERMINADO === 1 ? 'disabled' : '';
                        let linkColor = item.SN_TERMINADO === 1 ? 'text-info' : 'text-default';
                        let descRiesgo = item.SN_TERMINADO === 1 ? 'Ver riesgo' : 'Insertar riesgo';
                        let iconDescRiesgo = item.SN_TERMINADO === 1 ? 'fa-eye' : 'fa-square-plus';
                        let descRiesgo2 = item.DESC_RIESGO === null ? 'Inserte su riesgo' : item.DESC_RIESGO;
                        let snValida = item.SN_VALIDA === true ? 'bg-success-subtle' : item.SN_VALIDA === null ? 'bg-info-subtle' : 'bg-danger-subtle';
                        let seeData = '';
                        let htmlBtnOjbetivos = '';
                        let disDelete = '';

                        if (item.ID_ESTATUS === 1) {

                        }

                        if (item.SN_ENVIADO === null) {
                            if (snTermanado === "disabled") {
                                envio__ = '';
                                disDelete = 'disabled';
                            } else {
                                envio__ = '';
                                disDelete = '';
                            }
                        } else {
                            if (envio__ === 'disabled') {
                                if (item.SN_VALIDA === true) {
                                    if (item.SN_ENVIADO === true) {
                                        envio__ = 'disabled';
                                        disDelete = 'disabled';
                                    } else {
                                        envio__ = 'disabled';
                                        disDelete = 'disabled';
                                    }
                                } else {
                                    if (item.SN_ENVIADO === true) {
                                        envio__ = 'disabled';
                                        disDelete = 'disabled';
                                    } else {
                                        envio__ = '';
                                        disDelete = '';
                                    }
                                }
                            } else {
                                if (item.SN_ENVIADO === true) {
                                    envio__ = 'disabled';
                                    disDelete = 'disabled';
                                } else {
                                    if (item.SN_VALIDA === false) {
                                        envio__ = '';
                                        disDelete = '';
                                    } else {
                                        envio__ = 'disabled';
                                        disDelete = 'disabled';
                                    }
                                }
                            }
                        }

                        if (item.ID_ALINEACION === 2 || item.ID_ALINEACION === '2') {
                            try {
                                const objetivosResponse = await new Promise((resolve, reject) => {
                                    fetchDataArr(74, { _idCtrlAlineacion: item.ID_CTRL_ALINEACION }, 0, (response) => {
                                        if (response) resolve(response);
                                        else reject(new Error("Error en fetchDataArr 74"));
                                    });
                                });

                                logger.log("LLAMADA A LISTA OBJETIVOS: ", objetivosResponse);

                                if (objetivosResponse.length === 0) {
                                    seeData = 'disabled';
                                    htmlBtnOjbetivos = `<button type='button' class='btn btn-tertiary text-info-emphasis me-2 fs-10 btnSetObjetivosModal ${envio__ === 'disabled' ? snTermanado === 'disabled' ? 'disabled' : '' : snTermanado === 'disabled' ? 'disabled' : ''}'
                                                data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}'
                                                data-ctrl-de='0'>
                                                ${envio__ === 'disabled' ? snTermanado === 'disabled' ? 'disabled' : '' : snTermanado === 'disabled' ? 'Detectamos ya un riesgo' : 'Insertar objetivos'}
                                            </button>`;
                                } else {
                                    seeData = '';
                                    htmlBtnOjbetivos = `<button type='button' class='btn btn-tertiary text-warning-emphasis me-2 fs-10 btnSetObjetivosModal ${envio__ === 'disabled' ? snTermanado === 'disabled' ? 'disabled' : '' : snTermanado === 'disabled' ? 'disabled' : ''}'
                                                data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}'
                                                data-ctrl-de='1'>
                                                ${envio__ === 'disabled' ? snTermanado === 'disabled' ? 'Ya no se permiten ediciones' : '' : snTermanado === 'disabled' ? 'Detectamos ya un riesgo' : 'Editar objetivos'}
                                            </button>`;
                                }
                            } catch (error) {
                                logger.error("Error obteniendo objetivos:", error);
                                showMsg("Ocurrió un error al obtener objetivos.", 'error');
                                htmlBtnOjbetivos = '';
                                seeData = '';
                            }
                        } else {
                            htmlBtnOjbetivos = '';
                            seeData = '';
                        }

                        return `<div class='card mb-3 text-1000 fs-10 ${snValida}'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative' >
                                               <div class='shadow-none me-2 w-auto h-auto'>
                                                   <span class='fa-solid fa-asterisk'></span>
                                               </div>
                                               <div class='ms-3 flex-shrink-1 flex-grow-1' >
                                                   <h6 class='mb-1'>
                                                       <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>${item.CONSECUTIVO} - ${item.DESC_ALINEACION}</div>
                                                   </h6>
                                                   <div class='fs--1'>
                                                       <span class='fw-medium ${item.DESC_RIESGO === null ? 'badge rounded-pill badge-subtle-danger' : 'text-600'} fs-11'>${descRiesgo2}</span>
                                                   </div>
                                               </div>
                                            </div>
                                            <div class='d-flex justify-content-end align-items-center white-space-nowrap text-end'>
                                                <div class='hover-actions'>
                                                    <button class='btn btn-tertiary text-info-emphasis me-2 fs-10 btnSeeDatosAlineacion ${seeData}' type='button'
                                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}'
                                                        data-ctrl-alineacion2='${item.SN_TERMINADO}'>
                                                        <span class='fas fa fa-regular ${iconDescRiesgo}'></span> ${descRiesgo}
                                                    </button>
                                                    <button class="btn btn-tertiary text-danger-emphasis me-2 fs-10 ${disDelete} btnDeleteAlineacion" type='button'
                                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}'
                                                        data-ctrl-alineacion2='${item.SN_TERMINADO}'>
                                                        <span class='fas fa-trash'></span> Eliminar
                                                    </button>
                                                    <button class='btn btn-tertiary text-warning-emphasis me-2 fs-10 btnEditDatosAlineacion ${envio__}' type='button'
                                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}'
                                                        data-ctrl-alineacion2='${item.SN_TERMINADO}'>
                                                        <span class='fas fa-pen'></span> Editar
                                                    </button>
                                                    ${htmlBtnOjbetivos}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    });

                    try {
                        const htmlParts = await Promise.all(itemPromises);
                        const html = htmlParts.join('');
                        $("#containerDataAlineacion").html(html);

                        procesarEstados(response);
                        //loadListenersAlineacion();
                    } catch (error) {
                        logger.error("Error procesando items:", error);
                        showMsg("Ocurrió un error al procesar los datos.", 'error');
                    }
                } else {
                    $("#btnSendToValidate").attr("disabled", true);
                    $("#btnGroupVerticalDrop1").attr("disabled", true);
                    $("#containerDataAlineacion").html(null);
                    $("#btnN_Alineacion").removeAttr("disabled");
                    showMsg("Sin datos en la unidad presupuestal sobre la alineación, favor de registrar los datos restantes.", 'info');
                }
            } else {
                showMsg("Ocurrió un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function procesarEstados(response) {
    const enviadoARevision = response.some(item => item.SN_ENVIADO === true);
    const rechazados = response.some(item => item.SN_VALIDA === false);
    const validados = response.some(item => item.SN_VALIDA === true);
    const foliosSolventados = response.some(item => item.SN_SOLVENTA === true && item.SN_ENVIADO === false && item.SN_VALIDA === false);
    const foliosARechazo = response.filter(item => item.SN_ENVIADO === false && item.SN_VALIDA === false).map(item => item.CONSECUTIVO).join(', ');
    const foliosValidados = response.filter(item => item.SN_ENVIADO === false && item.SN_VALIDA === true).map(item => item.CONSECUTIVO).join(', ');
    const noEnviado = response.some(item => item.SN_ENVIADO === null);

    logger.log("Estados - Enviado a revisión:", enviadoARevision);
    logger.log("Estados - Rechazados:", rechazados);
    logger.log("Estados - Validados:", validados);
    logger.log("Estados - No enviado:", noEnviado);
    logger.log("Estados - Folios solventados:", foliosSolventados);

    if (enviadoARevision) {
        const foliosARevision = response.filter(item => item.SN_ENVIADO === true).map(item => item.CONSECUTIVO).join(', ');
        showMsg(`Los siguientes riesgos fueron sometidos a revisión: ${foliosARevision}.`, 'info');
        if (foliosARevision) {
            $("#btnSendToValidate").attr("disabled", true);
            $("#btnNewInsert").attr("disabled", true);
            $("#btnN_Alineacion").attr("disabled", true);
            $("#btnN_Alineacion2").attr("disabled", true);
            if (rechazados) {
                $("#btnSendToValidate").removeAttr("disabled");
                if (!foliosSolventados) {
                    showMsg(`Los siguientes riesgos fueron rechazados, favor de revisar: ${foliosARechazo}.`, 'warning');
                }
            } else {
                $("#btnSendToValidate").attr("disabled", true);
                $("#btnNewInsert").attr("disabled", true);
                $("#btnN_Alineacion").attr("disabled", true);
                $("#btnN_Alineacion2").attr("disabled", true);
            }
        } else {
            $("#btnSendToValidate").removeAttr("disabled");
        }
    } else {
        if (noEnviado) {
            $("#btnSendToValidate").attr("disabled", true);
            $("#btnNewInsert").removeAttr("disabled");
            $("#btnN_Alineacion").removeAttr("disabled");
            $("#btnN_Alineacion2").removeAttr("disabled");
            if (response.length !== 0) {
                $("#btnSendToValidate").removeAttr("disabled");
            }
        } else {
            $("#btnSendToValidate").removeAttr("disabled");
            $("#btnNewInsert").attr("disabled", true);
            $("#btnN_Alineacion").attr("disabled", true);
            $("#btnN_Alineacion2").attr("disabled", true);
            if (validados) {
                showMsg(`Los siguientes riesgos fueron validados: ${foliosValidados}.`, 'info');
                if (rechazados) {
                    $("#btnSendToValidate").removeAttr("disabled");
                } else {
                    $("#btnSendToValidate").attr("disabled", true);
                    $("#btnNewInsert").attr("disabled", true);
                    $("#btnN_Alineacion").attr("disabled", true);
                    $("#btnN_Alineacion2").attr("disabled", true);
                }
                $("#btnGetMatriz").attr("data-ctrl-validate", "V");
                $("#btnGetPtar").attr("data-ctrl-validate", "V");
                $("#btnGetMapa").attr("data-ctrl-validate", "V");
                $("#btnGetConcentrado").attr("data-ctrl-validate", "V");
            } else {
                if (rechazados) {
                    $("#btnSendToValidate").removeAttr("disabled");
                    if (!foliosSolventados) {
                        showMsg(`Los siguientes riesgos fueron rechazados, favor de revisar: ${foliosARechazo}.`, 'warning');
                    }
                } else {
                    $("#btnSendToValidate").attr("disabled", true);
                    $("#btnNewInsert").attr("disabled", true);
                    $("#btnN_Alineacion").attr("disabled", true);
                    $("#btnN_Alineacion2").attr("disabled", true);
                }
            }
        }
    }
}

async function gDri(idAlineacion) {
    let html = '';
    fetchDataArr(16, { _idCtrlAlineacion: idAlineacion }, 0, async function (response) {
        logger.log("RIESGO DEVUELTO: ", response)
        if (!response || response === 'error') {
            showMsg("Error al cargar datos", 'error');
            return;
        }
        if (response.length !== 1) {
            showMsg("La alineación no contiene el riesgo.", 'info');
            $("#containerDataRiesgo").html(null);
            $("#btnN_Riesgo").removeAttr("disabled");
            $("#modalRiesgoForm").modal("show");
            getDataProcesoCombo(0, $("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            return;
        }
        for (const item of response) {
            let conteoControlesPorFactor = [];
            try {
                conteoControlesPorFactor = await new Promise((resolve, reject) => {
                    fetchDataArr(19, { _idCtrlRiesgo: item.ID_CTRL_RIESGO }, 0, (r) => {
                        r ? resolve(r) : reject();
                    });
                });
            } catch {
                showMsg("Error al obtener factores", "error");
                return;
            }
            const sinControles = conteoControlesPorFactor.some(searchItem => searchItem.ID_CTRL_FACTOR === null);
            const disabledEdit = (item.SN_ENVIADO || item.SN_VALIDA) ? 'disabled' : '';
            let disabledDelete;

            if (!sinControles) {
                disabledDelete = 'disabled';
                $("#btnDeleteValorInicial").attr("disabled", true);
            } else {
                disabledDelete = '';
                $("#btnDeleteValorInicial").removeAttr("disabled");
            }

            html += `<div class='card mb-3 text-1000 fs-10'>
                        <div class='card-body'>
                            <div class='d-flex justify-content-between hover-actions-trigger'>
                                <div class='d-flex align-items-center position-relative'>
                                    <div class='shadow-none me-2 w-auto h-auto'>
                                        <span class='fa-solid fa-asterisk'></span>
                                    </div>
                                    <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                        <h6 class='mb-1'>
                                            <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                ${item.DESC_RIESGO}
                                            </div>
                                        </h6>
                                        <div class='fs--1'>
                                            <span class='fw-medium text-600 fs-11'>
                                                Proceso: ${item.NombreProceso === null ? 'Sin proceso' : item.NombreProceso}
                                            </span>
                                        </div>
                                        <div class='fs--1'>
                                            <span class='fw-bold text-600 fs-11'>
                                                Nivel de riesgo: ${item.DESC_NIVEL_RIESGO} |
                                                Clasificación de riesgo: ${item.DESC_CLAS_RIESGO}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class='d-flex justify-content-end align-items-center white-space-nowrap text-end'>
                                    <div class='hover-actions'>
                                        <button type='button'
                                            class='btn btn-tertiary text-info-emphasis me-2 fs-10 btnSeeDatosRiesgo' data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                            <span class='fas fa-eye'></span> Ver factores
                                        </button>
                                        <button type='button'
                                            class='btn btn-tertiary text-warning-emphasis fs-10 btnEditDatosRiesgo ${disabledEdit}' data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                            <span class='fas fa-pen'></span> Editar
                                        </button>
                                        <button type='button'
                                            class='btn btn-tertiary text-danger-emphasis me-2 fs-10 btnDeleteRiesgo ${disabledDelete}' data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                            <span class='fas fa-trash'></span> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        }

        $("#containerDataRiesgo").html(html);
        $("#btnN_Riesgo").attr("disabled", true);
    });
}

// function gDri(idAlineacion) {
//     var html = '';
//     var descButton = '';
//     var disabled = '';
//     var btnDisabledDelete = '';
//     fetchDataArr(16, { _idCtrlAlineacion: idAlineacion }, 0, function (response) {
//         if (response) {
//             logger.log("Datos recibidos a RIESGO:", response);
//             if (response !== 'error') {
//                 if (response.length === 1) {
//                     response.forEach(async function (item) {
//                         const conteoControlesPorFactor = await new Promise((resolve, reject) => {
//                             fetchDataArr(19, { _idCtrlRiesgo: item.ID_CTRL_RIESGO }, 0, (response) => {
//                                 if (response) resolve(response);
//                                 else reject(new Error("Error en fetchDataArr 19"));
//                             });
//                         });

//                         if (item.SN_ENVIADO === true || item.SN_VALIDA === true) {
//                             disabled = 'disabled';
//                             descButton = "Ver factores";
//                         } else {
//                             disabled = '';
//                             descButton = "Insertar factores para este riesgo";
//                         }

//                         if (conteoControlesPorFactor.length >= 0) {
//                             btnDisabledDelete = 'disabled';
//                         } else {
//                             btnDisabledDelete = '';
//                         }

//                         html += `<div class='card mb-3 text-1000 fs-10'>
//                                     <div class='card-body'>
//                                         <div class='d-flex justify-content-between hover-actions-trigger'>
//                                             <div class='d-flex align-items-center position-relative'>
//                                                 <div class='shadow-none me-2 w-auto h-auto'>
//                                                     <span class='fa-solid fa-asterisk'></span>
//                                                 </div>
//                                                 <div class='ms-3 flex-shrink-1 flex-grow-1'>
//                                                     <h6 class='mb-1'>
//                                                         <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
//                                                             ${item.DESC_RIESGO}
//                                                         </div>
//                                                     </h6>
//                                                     <div class='fs--1'>
//                                                         <span class='fw-medium text-600 fs-11'>
//                                                             Proceso: ${item.NombreProceso === null ? 'Sin proceso' : item.NombreProceso}
//                                                         </span>
//                                                     </div>
//                                                     <div class='fs--1'>
//                                                         <span class='fw-bold text-600 fs-11'>
//                                                             Nivel de riesgo: ${item.DESC_NIVEL_RIESGO} |
//                                                             Clasificación de riesgo: ${item.DESC_CLAS_RIESGO}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div class='d-flex justify-content-end align-items-center white-space-nowrap text-end'>
//                                                 <div class='hover-actions'>
//                                                     <button type='button'
//                                                         class='btn btn-tertiary text-info-emphasis me-2 fs-10 btnSeeDatosRiesgo''
//                                                         data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
//                                                         <span class='fas fa-eye'></span> Ver factores
//                                                     </button>
//                                                     <button type='button'
//                                                         class='btn btn-tertiary text-warning-emphasis fs-10 btnEditDatosRiesgo ${disabled}' data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
//                                                         <span class='fas fa-pen'></span> Editar
//                                                     </button>
//                                                     <button type='button'
//                                                         class='btn btn-tertiary text-danger-emphasis me-2 fs-10 btnDeleteRiesgo ${btnDisabledDelete}''
//                                                         data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
//                                                         <span class='fas fa-trash'></span> Eliminar
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>`;
//                     });
//                     $("#containerDataRiesgo").html(html);
//                     $("#btnN_Riesgo").attr("disabled", true);
//                 } else {
//                     showMsg("La alineación no contiene el riesgo.", 'info');
//                     $("#containerDataRiesgo").html(null);
//                     $("#btnN_Riesgo").removeAttr("disabled");
//                     $("#modalRiesgoForm").modal("show");
//                 }
//             } else {
//                 showMsg("Ocurrio un error al mostrar resultados.", 'error');
//             }
//         } else if (response === "error") {
//             showMsg("Error al cargar datos", 'error');
//         }
//     });
// }

function gDfa(idRiesgo) {
    $("#btnS_Control").attr("data-ctrl-control", 0);
    var html = "";
    var disabledSee = "";
    var disabledEdit = "";
    var snDisabledDelete = "";
    fetchDataArr(19, { _idCtrlRiesgo: idRiesgo }, 0, async function (response) {
        if (response) {
            logger.log("Datos recibidos a FACTOR:", response);
            if (response !== 'error') {
                if (response.length === 1 && response[0].ID_CTRL_FACTOR === null) {
                    showMsg("Sin datos para el riesgo.", 'info');
                    $("#txtFolioFactor").val(`${response[0].CONSECUTIVO}.${response.length}`);
                    $("#btnE_ValorInicial").attr("disabled", true);
                    $("#containerDataFactor").html(null);
                    $("#btnN_Factor").removeAttr("disabled");
                    $("#modalFactorForm").modal('show');
                } else {
                    response.forEach(async function (item) {
                        if (item.ID_CUADRANTE === null && item.ID_IMPACTO === null && item.ID_PROBABILIDAD === null) {
                            disabledSee = "disabled";
                            //$("#btnN_Factor").attr("disabled", true);
                            $("#btnN_Factor").removeAttr("disabled");
                        } else {
                            disabledEdit = "disabled";
                            if (item.SN_ENVIADO === null && item.SN_VALIDA === null) {
                                disabledEdit = "disabled";
                                $("#btnN_Factor").attr("disabled", true);
                            } else {
                                if (item.SN_VALIDA === true) {
                                    disabledEdit = "disabled";
                                    $("#btnN_Factor").attr("disabled", true);
                                } else if (item.SN_ENVIADO === true) {
                                    disabledEdit = "disabled";
                                    $("#btnN_Factor").attr("disabled", true);
                                } else if (item.SN_VALIDA === false) {
                                    if (item.SN_ENVIADO === false) {
                                        $("#btnN_Factor").attr("disabled", true);
                                        disabledEdit = "";
                                    } else {
                                        $("#btnN_Factor").removeAttr("disabled");
                                    }
                                }
                            }
                        }
                        // if (item.ID_CUADRANTE_VALORACION_FINAL === null && item.ID_IMPACTO_VALORACION_FINAL === null && item.ID_PROBABILIDAD_VALORACION_FINAL == null) {
                        //     $("#btnE_ValorFinal").removeAttr("disabled");
                        //     $("#btnS_Control").removeAttr("disabled");
                        //     $("#btnN_Control").removeAttr("disabled");
                        // } else {
                        //     $("#btnE_ValorFinal").attr("disabled", true);
                        //     $("#btnS_Control").attr("disabled", true);
                        //     $("#btnN_Control").attr("disabled", true);
                        //     if (item.SN_VALIDA === true) {
                        //         $("#btnE_ValorFinal").attr("disabled", true);
                        //         $("#btnS_Control").attr("disabled", true);
                        //         $("#btnN_Control").attr("disabled", true);
                        //     } else {
                        //         if (item.SN_ENVIADO === false) {
                        //             $("#btnS_Control").removeAttr("disabled");
                        //             $("#btnN_Control").removeAttr("disabled");
                        //             $("#btnE_ValorFinal").removeAttr("disabled").text("Editar valoración final");
                        //             $("#cboProbabilidadFin").val(item.ID_PROBABILIDAD_VALORACION_FINAL);
                        //             $("#cboImpactoFin").val(item.ID_IMPACTO_VALORACION_FINAL);
                        //             $("#cboCuadranteFin").val(item.ID_CUADRANTE_VALORACION_FINAL);
                        //             $("#cboControl").val(item.ID_CONTROL);
                        //             $("#cboEstrategia").val(item.ID_ESTRATEGIA);
                        //         } else {
                        //             $("#btnE_ValorFinal").attr("disabled", true);
                        //             $("#btnS_Control").attr("disabled", true);
                        //             $("#btnN_Control").attr("disabled", true);
                        //         }
                        //     }
                        //     // if (item.SN_ENVIADO === null && item.SN_VALIDA === null) {
                        //     //     $("#btnE_ValorFinal").attr("disabled", true);
                        //     //     $("#btnS_Control").attr("disabled", true);
                        //     // } else {
                        //     //     if (item.SN_VALIDA === true) {
                        //     //         $("#btnE_ValorFinal").attr("disabled", true);
                        //     //         $("#btnS_Control").attr("disabled", true);
                        //     //     } else if (item.ScN_VALIDA === false && item.SN_ENVIADO === false) {
                        //     //         $("#btnE_ValorFinal").removeAttr("disabled");
                        //     //         $("#btnS_Control").removeAttr("disabled");
                        //     //     }
                        //     // }
                        // }
                        $("#txtFolioFactor").val(`${item.CONSECUTIVO}.${response.length + 1}`);

                        html += `<div class='card mb-3 text-1000 fs-10'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative'>
                                                <div class='shadow-none me-2 w-auto h-auto'>
                                                    <span class='fa-solid fa-asterisk'></span>
                                                </div>
                                                <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                                    <h6 class='mb-1'>
                                                        <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                            ${item.FOLIO} - ${item.DESC_FACTOR}
                                                        </div>
                                                    </h6>
                                                    <div class='fs--1'>
                                                        <span class='fw-medium text-600 fs-11'>
                                                            Posible efecto de riesgo: ${item.POSIBLE_EFECTO}
                                                        </span>
                                                    </div>
                                                    <div class='fs--1'>
                                                        <span class='fw-medium text-600 fs-11'>
                                                            Tipo de factor: ${item.DESC_TIPO_FACTOR} |
                                                            Clasificación del factor: ${item.DESC_CLAS_FACTOR}
                                                        </span>
                                                    </div>
                                                    <div class='fs--1'>
                                                        <span class='fw-medium ${item.ID_CONTROL === null ? 'badge rounded-pill badge-subtle-danger' : 'text-600'} fs-11'>
                                                            ¿El factor esta controlado?: ${item.ID_CONTROL === null ? 'Favor de definir si esta controlado el factor' : item.DESC_CONTROL}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='d-flex justify-content-end align-items-center white-space-nowrap text-end'>
                                                <div class='hover-actions'>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-info-emphasis me-2 fs-10 btnSeeDatosFactor ${disabledSee}'
                                                        data-ctrl-factor='${item.ID_CTRL_FACTOR}' data-ctrl1='${item.FOLIO}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                                        <span class='fas fa-eye'></span> Ver controles
                                                    </button>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-warning-emphasis me-2 fs-10 btnEditDatosFactor ${disabledEdit}'
                                                        data-ctrl-factor='${item.ID_CTRL_FACTOR}' data-ctrl1='${item.FOLIO}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                                        <span class='fas fa-pen'></span> Editar
                                                    </button>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-danger-emphasis me-2 fs-10 btnDeleteFactor ${disabledEdit}'
                                                        data-ctrl-factor='${item.ID_CTRL_FACTOR}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                                        <span class='fas fa-trash'></span> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    });
                    $("#containerDataFactor").html(html);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDco(idFactor, numFolio) {
    gDfaById(idFactor, 0);
    var html = "";
    var disabledSee = "";
    var disabledEdit = "";
    fetchDataArr(21, { _idCtrlFactor: idFactor }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a CONTROL:", response);
            if (response !== 'error') {
                if (response.length === 1 && response[0].ID_CTRL_CONTROL === null) {
                    showMsg("Sin datos para su factor.", 'info');
                    $("#txtFolioControlFactor").val(`${numFolio}.${response.length}`);
                    $("#containerDataControl").html(null);
                    //$("#btnN_Control").removeAttr("disabled");
                    logger.error("CONTROLADOR DE BOTONES Y FORMULARIO: ", response[0].CONTROL_FACTOR)
                    if (response[0].CONTROL_FACTOR === null) {
                        $("#modalFactorXControl").modal("show");
                        $("#btnS_FactorXControl").attr("data-ctrl-factor", idFactor);
                        $("#btnS_FactorXControl").attr("data-ctrl-folio", numFolio);
                        $("#btnN_Control").attr("disabled", true);
                        $("#btnU_Control").attr("disabled", true);
                        $("#btnE_ValorFinal").attr("disabled", true);
                    } else {
                        $("#modalFactorXControl").modal("hide");
                        $("#modalControlForm").modal("show");
                    }
                    //$("#modalControlForm").modal("show");
                } else {
                    const algunoFalla = response.some(item => item.CONTROL_FACTOR === null);
                    const algunoFalla2 = response.some(item => item.CONTROL_RIESGO === null);
                    logger.error("PASANDO DATOS DE FACTOR", algunoFalla)
                    if (algunoFalla === false) {
                        $("#btnU_Control").removeAttr("disabled");
                        $("#btnN_Control").removeAttr("disabled");
                    } else {
                        //$("#btnE_ValorFinal").removeAttr("disabled");
                        $("#btnE_ValorFinal").attr("disabled", true);
                        $("#btnU_Control").attr("disabled", true);
                        $("#btnN_Control").attr("disabled", true);
                    }
                    $("#txtFolioControlFactor").val(`${numFolio}.${response.length + 1}`);
                    if (algunoFalla2 === false) {
                        $("#btnU_Control").attr("disabled", true);
                        disabledEdit = "disabled";
                        $("#btnN_Control").attr("disabled", true);
                    } else {
                        $("#btnU_Control").removeAttr("disabled");
                        disabledEdit = "";
                        $("#btnN_Control").removeAttr("disabled");
                    }
                    response.forEach(function (item) {
                        var envio__ = item.SN_ENVIADO === true ? 'disabled' : '';
                        if (item.ID_CUADRANTE_VALORACION_FINAL === null && item.ID_IMPACTO_VALORACION_FINAL === null && item.ID_PROBABILIDAD_VALORACION_FINAL === null) {
                            disabledSee = "disabled"
                            $("#btnE_ValorFinal").removeAttr("disabled");
                            $("#btnS_Control").removeAttr("disabled");
                        } else {
                            // if (envio__ === '' || item.ID_CUADRANTE_VALORACION_FINAL !== null) {
                            //     disabledEdit = 'disabled';
                            //     if (item.SN_VALIDA === false) {
                            //         disabledEdit = "";
                            //     } else {

                            //     }
                            // } else {
                            //     disabledEdit = "";
                            // }
                            disabledEdit = "disabled";
                            //$("#btnS_Control").attr("disabled", true);
                            $("#btnN_Control").attr("disabled", true);
                            $("#btnU_Control").attr("disabled", true);
                            $("#btnE_ValorFinal").attr("disabled", true);
                            if (item.SN_ENVIADO === null && item.SN_VALIDA === null) {
                                disabledEdit = "disabled";
                                $("#btnE_ValorFinal").attr("disabled", true);
                                $("#btnN_Control").attr("disabled", true);
                                $("#btnU_Control").attr("disabled", true);
                            } else {
                                if (item.SN_VALIDA === true) {
                                    disabledEdit = "disabled";
                                    $("#btnE_ValorFinal").attr("disabled", true);
                                    $("#btnS_Control").attr("disabled", true);
                                    $("#btnN_Control").attr("disabled", true);
                                } else if (item.SN_ENVIADO === true) {
                                    disabledEdit = "disabled";
                                    $("#btnN_Control").attr("disabled", true);
                                } else if (item.SN_VALIDA === false) {
                                    if (item.SN_ENVIADO === false) {
                                        $("#btnN_Control").attr("disabled", true);
                                        $("#btnU_Control").attr("disabled", true);
                                        disabledEdit = "";
                                    } else {
                                        $("#btnN_Control").removeAttr("disabled");
                                    }
                                } else if (item.SN_VALIDA === false) {
                                    $("#btnS_Control").removeAttr("disabled");
                                    $("#btnN_Control").removeAttr("disabled");
                                    $("#btnU_Control").attr("disabled", true);
                                    $("#btnE_ValorFinal").removeAttr("disabled").text("Editar valoración final");
                                    $("#cboProbabilidadFin").val(item.ID_PROBABILIDAD_VALORACION_FINAL);
                                    $("#cboImpactoFin").val(item.ID_IMPACTO_VALORACION_FINAL);
                                    $("#cboCuadranteFin").val(item.ID_CUADRANTE_VALORACION_FINAL);
                                    $("#cboControl").val(item.ID_CONTROL);
                                    $("#cboEstrategia").val(item.ID_ESTRATEGIA);
                                }
                            }
                        }

                        html += `<div class='card mb-3 text-1000 fs-10'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative'>
                                                <div class='shadow-none me-2 w-auto h-auto'>
                                                    <span class='fa-solid fa-asterisk'></span>
                                                </div>
                                                <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                                    <h6 class='mb-1'>
                                                        <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                            ${item.NO_CONTROL} - ${item.DESC_CONTROL}
                                                        </div>
                                                    </h6>
                                                    <div class='fs--1'>
                                                        <span class='fw-medium text-600 fs-11'>
                                                            Determinación: ${item.DESC_DETERMINACION} |
                                                            Tipo de control: ${item.DESC_TIPO_CONTROL}
                                                        </span>
                                                    </div>
                                                    <div class='fs--1'>
                                                        <span class='fw-medium text-600 fs-11'>
                                                            Esta documentado: ${item.DESC_CONTROL1} |
                                                            Esta formalizado: ${item.DESC_CONTROL2} |
                                                            Se aplica: ${item.DESC_CONTROL3} |
                                                            Es efectivo: ${item.DESC_CONTROL4} 
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='d-flex justify-content-end align-items-center white-space-nowrap text-end'>
                                                <div class='hover-actions'>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-info-emphasis me-2 fs-10 btnSeeDatosControl ${disabledSee}'
                                                        data-ctrl-control='${item.ID_CTRL_CONTROL}' data-ctrl1='${item.NO_CONTROL}' data-ctrl-factor='${item.ID_CTRL_FACTOR}'>
                                                        <span class='fas fa-eye'></span> Ver acciones
                                                    </button>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-warning-emphasis me-2 fs-10 btnEditDatosControl ${disabledEdit}'
                                                        data-ctrl-control='${item.ID_CTRL_CONTROL}' data-ctrl1='${item.NO_CONTROL}' data-ctrl-factor='${item.ID_CTRL_FACTOR}'>
                                                        <span class='fas fa-pen'></span> Editar
                                                    </button>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-danger-emphasis me-2 fs-10 btnDeleteControl ${disabledEdit}'
                                                        data-ctrl-control='${item.ID_CTRL_CONTROL}' data-ctrl1='${item.NO_CONTROL}' data-ctrl-factor='${item.ID_CTRL_FACTOR}'>
                                                        <span class='fas fa-trash'></span> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    });
                    $("#containerDataControl").html(html);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDac(idControl) {
    var html = '';
    gDcoById(idControl, 0);
    fetchDataArr(26, { _idCtrlControl: idControl }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a ACCION:", response);
            if (response !== 'error') {
                if (response.length === 1 && response[0].ID_CTRL_CONTROL === null) {
                    showMsg("Sin datos para su control.", 'info');
                    $("#containerDataAccion").html(null);
                    $("#btnN_Accion").removeAttr("disabled");
                    if (response[0].ID_ESTRATEGIA === null) {
                        $("#modalAccionXRiesgo").modal("show");
                        $("#btnN_Accion").attr("disabled", true);
                        $("#btnS_AccionXRiesgo").attr("data-ctrl-riesgo", response[0].ID_CTRL_RIESGO);
                    } else {
                        $("#modalAccionForm").modal("show");
                        $("#btnN_Accion").removeAttr("disabled");
                    }
                    //$("#modalAccionForm").modal("show");
                } else {
                    response.forEach(function (item) {
                        var envio__ = item.SN_ENVIADO === true || item.SN_VALIDA === true ? 'disabled' : '';

                        if (item.SN_ENVIADO === null) {
                            envio__ = '';
                            $("#btnN_Accion").removeAttr("disabled");
                        } else {
                            if (envio__ === 'disabled') {
                                if (item.SN_VALIDA === true || item.SN_ENVIADO === true) {
                                    envio__ = 'disabled';
                                    $("#btnN_Accion").attr("disabled", true);
                                } else {
                                    envio__ = '';
                                    $("#btnN_Accion").removeAttr("disabled");
                                }
                            } else {
                                if (item.SN_ENVIADO === true) {
                                    envio__ = 'disabled';
                                    $("#btnN_Accion").attr("disabled", true);
                                } else {
                                    if (item.SN_VALIDA === false) {
                                        envio__ = '';
                                        $("#btnN_Accion").attr("disabled", true);
                                    } else {
                                        envio__ = 'disabled';
                                        $("#btnN_Accion").removeAttr("disabled");
                                    }
                                }
                            }
                        }

                        html += `<div class='card mb-3 text-1000 fs-10'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative'>
                                                <div class='shadow-none me-2 w-auto h-auto'>
                                                    <span class='fa-solid fa-asterisk'></span>
                                                </div>
                                                <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                                    <h6 class='mb-1'>
                                                        <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                            ${item.DESC_ACCION}
                                                        </div>
                                                    </h6>
                                                </div>
                                            </div>
                                            <div class='d-flex justify-content-end align-items-center white-space-nowrap text-end'>
                                                <div class='hover-actions'>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-info-emphasis me-2 fs-10 btnSeeDatosAccion'
                                                        data-ctrl-accion='${item.ID_CTRL_ACCION}' data-ctrl-control='${item.ID_CTRL_CONTROL}' data-ctrl-no-control='${item.NO_CONTROL}'>
                                                        <span class='fas fa-eye'></span> Ver actividades
                                                    </button>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-warning-emphasis me-2 fs-10 btnEditDatosAccion ${envio__}'
                                                        data-ctrl-accion='${item.ID_CTRL_ACCION}' data-ctrl-control='${item.ID_CTRL_CONTROL}' data-ctrl-no-control='${item.NO_CONTROL}'>
                                                        <span class='fas fa-pen'></span> Editar
                                                    </button>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-danger-emphasis me-2 fs-10 btnDeleteAccion ${envio__}'
                                                        data-ctrl-accion='${item.ID_CTRL_ACCION}' data-ctrl-control='${item.ID_CTRL_CONTROL}'>
                                                        <span class='fas fa-trash'></span> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    });
                    $("#containerDataAccion").html(html);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDact(idAccion, numControlActividad) {
    gDacById(idAccion, 0);
    var html = "";
    var descMes = "";
    fetchDataArr(30, { _idCtrlAccion: idAccion }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a ACTIVIDAD:", response);
            if (response !== 'error') {
                if (response.length === 0) {
                    showMsg("Sin datos para la acción.", 'info');
                    $("#containerDataActividad").html(null);
                    $("#txtNoActividad").val(`${numControlActividad}.${response.length + 1}`);
                    $("#btnN_Actividad").removeAttr("disabled");
                    $("#modalActividadForm").modal("show");
                    $("#divInsertMeta").show();
                    $("#divUpdateMeta").hide();
                } else {
                    response.forEach(function (item) {
                        switch (item.ID_MES) {
                            case 1:
                                descMes = "Enero";
                                break;
                            case 2:
                                descMes = "Febrero";
                                break;
                            case 3:
                                descMes = "Marzo";
                                break;
                            case 4:
                                descMes = "Abril";
                                break;
                            case 5:
                                descMes = "Mayo";
                                break;
                            case 6:
                                descMes = "Junio";
                                break;
                            case 7:
                                descMes = "Julio";
                                break;
                            case 8:
                                descMes = "Agosto";
                                break;
                            case 9:
                                descMes = "Septiembre";
                                break;
                            case 10:
                                descMes = "Octubre";
                                break;
                            case 11:
                                descMes = "Noviembre";
                                break;
                            case 12:
                                descMes = "Diciembre";
                                break;
                            default:
                                descMes = "Error";
                                break;
                        }

                        var envio__ = item.SN_ENVIADO === true || item.SN_VALIDA === true ? 'disabled' : '';

                        if (item.SN_ENVIADO === null) {
                            envio__ = '';
                            $("#btnN_Actividad").removeAttr("disabled");
                        } else {
                            if (envio__ === 'disabled') {
                                if (item.SN_VALIDA === true || item.SN_ENVIADO === true) {
                                    envio__ = 'disabled';
                                    $("#btnN_Actividad").attr("disabled", true);
                                } else {
                                    envio__ = '';
                                    $("#btnN_Actividad").removeAttr("disabled");
                                }
                            } else {
                                if (item.SN_ENVIADO === true) {
                                    envio__ = 'disabled';
                                    $("#btnN_Actividad").attr("disabled", true);
                                } else {
                                    envio__ = '';
                                    $("#btnN_Actividad").removeAttr("disabled");
                                }
                            }
                        }

                        html += `<div class='card mb-3 text-1000 fs-10'>
                                    <div class='card-body'>
                                        <div class='d-flex justify-content-between hover-actions-trigger'>
                                            <div class='d-flex align-items-center position-relative'>
                                                <div class='shadow-none me-2 w-auto h-auto'>
                                                    <span class='fa-solid fa-asterisk'></span>
                                                </div>
                                                <div class='ms-3 flex-shrink-1 flex-grow-1'>
                                                    <h6 class='mb-1'>
                                                        <div class='stretched-link text-900 fw-semi-bold fs-10' href='#!'>
                                                            ${item.NO_ACTIVIDAD} - ${item.DESC_ACTIVIDAD}
                                                        </div>
                                                    </h6>
                                                    <div class='fs--1'>
                                                        <span class='fw-medium text-600 fs-11'>
                                                            Mes: ${descMes} |
                                                            Trimestre: ${item.DESC_TRIMESTRE}
                                                        </span>
                                                    </div>
                                                    <div class='fs--1'>
                                                        <span class='fw-medium text-600 fs-11'>
                                                            Responsable: ${item.NOMBRE_RESPONSABLE} |
                                                            Evidencias: ${item.EVIDENCIA}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class='d-flex justify-content-end align-items-center white-space-nowrap text-end'>
                                                <div class='hover-actions'>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-warning-emphasis me-2 fs-10 btnEditDatosActividad ${envio__}'
                                                        data-ctrl-actividad='${item.ID_CTRL_ACTIVIDAD}' data-ctrl-accion='${item.ID_CTRL_ACCION}' data-ctrl-no-actividad='${item.NO_ACTIVIDAD}'>
                                                        <span class='fas fa-pen'></span> Editar
                                                    </button>
                                                    <button type='button'
                                                        class='btn btn-tertiary text-danger-emphasis me-2 fs-10 btnDeleteActividad ${envio__}'
                                                        data-ctrl-actividad='${item.ID_CTRL_ACTIVIDAD}' data-ctrl-accion='${item.ID_CTRL_ACCION}' data-ctrl-no-actividad='${item.NO_ACTIVIDAD}'>
                                                        <span class='fas fa-trash'></span> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    });
                    $("#containerDataActividad").html(html);
                    $("#txtNoActividad").val(`${numControlActividad}.${response.length + 1}`);
                    gDtri(idAccion);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDpr(idProceso, OS, UP) {
    fetchDataArr(14, { idProceso: idProceso, _OS: OS, _UP: UP }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a PROCESO:", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    response.forEach(function (item) {
                        $("#txtOSProceso").val(item.CveOSResponsable)
                        $("#txtUPProceso").val(item.CveUPResponsable)
                    });
                } else {
                    showMsg("Ocurrio un error al obtener los resultados.", 'error');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    })
};

function gDob(idCtrlRiesgo) {
    var html = "";
    var html2 = "";
    var descBoton = "";
    var disabled = "";
    fetchDataArr(54, { _idCtrlRiesgo: idCtrlRiesgo }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a OBSERVACIONES:", response);
            if (response.length === 0) {
                html2 += `<div class='row g-3 timeline timeline-info timeline-current pb-x1'>
                                      <div class='col-auto ps-4 ms-2'>
                                        <div class='ps-2'>
                                          <div class='icon-item icon-item-sm rounded-circle bg-200 shadow-none'><span class='text-info fas fa-envelope'></span></div>
                                        </div>
                                      </div>
                                      <div class='col'>
                                        <div class='row gx-0 border-bottom pb-x1 d-flex'>
                                          <div class='col'>
                                            <h6 class='text-800 mb-1'>Envie a revisión</h6>
                                          </div>
                                        </div>
                                      </div>
                                    </div>`;

                $("#divNew").html(html2);
            } else {
                html2 += "<div class='card-body scrollbar recent-activity-body-height ps-2'>"
                var countUp = 0;
                response.forEach(function (item) {
                    var colorTimeline = '';
                    var colorIcon = '';
                    const nDI = new Date(+item.FEC_ACTUALIZA.replace(/\D/g, '')).toISOString();

                    if (item.SN_SOLVENTA === true) {
                        descBoton = "Solventado";
                        disabled = "disabled";
                    } else if (item.SN_SOLVENTA === false) {
                        descBoton = "Solventar";
                        disabled = "";
                    }

                    if (item.ID_ROL === 102 && item.SN_SOLVENTA === true) {
                        var htmlBtn = '';
                    } else {
                        var htmlBtn = `<button class='btn btn-tertiary border-300 btn-sm me-1 text-600 btnSolventarObser ${disabled}' type='button' data-ctrl-observacion='${item.ID_OBSERVACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                                                        ${descBoton}
                                                                    </button>`;
                    }

                    html += `<tr class='align-middle'>
                                <td class='text-1000 nowrap'>${item.DESC_OBSERVACION}</td>
                                <td class='text-end'>
                                    <div>
                                        <button class='btn btn-sm btn-falcon-info customButton btnSolventarObser ${disabled} m-1' type='button' data-ctrl-observacion='${item.ID_OBSERVACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>${descBoton}</button>
                                    </div>
                                </td>
                            </tr>`

                    countUp += 1;

                    if (countUp === 1) {
                        colorTimeline = "row g-3 timeline timeline-primary timeline-current pb-x1";
                        colorIcon = "text-primary";
                    } else if (countUp !== response.length) {
                        colorTimeline = "row g-3 timeline timeline-success timeline-past pb-x1";
                        colorIcon = "text-success";
                    } else if (countUp === response.length) {
                        colorTimeline = "row g-3 timeline timeline-danger timeline-past pb-x1";
                        colorIcon = "text-danger";
                    }
                    html2 += `<div class='${colorTimeline}'>
                                      <div class='col-auto ps-4 ms-2'>
                                        <div class='ps-2'>
                                          <div class='icon-item icon-item-sm rounded-circle bg-200 shadow-none'><span class='${colorIcon} fas fa-envelope'></span></div>
                                        </div>
                                      </div>
                                      <div class='col'>
                                        <div class='row gx-0 border-bottom pb-x1 d-flex hover-actions-trigger'>
                                          <div class='col'>
                                            <h6 class='text-800 mb-1'>${item.NOMBRES}</h6>
                                            <p class='fs-10 text-600 mb-0'>${item.DESC_OBSERVACION}</p>
                                          </div>
                                          <div class='col-auto'>
                                            <p class='fs-11 text-500 mb-0'>${nDI}</p>
                                          </div>
                                          <div class='d-flex mb-3 hover-actions-trigger align-items-center'>
                                                <div class='hover-actions end-0 top-50 translate-middle-y'>
                                                    ${htmlBtn}
                                                </div>
                                            </div>
                                        </div>
                                      </div>
                                    </div>`;
                });
                html2 += '</div>'
                if (html === '') {
                } else {
                    $("#divNew").html(html2);
                }
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDno(_eFiscal) {
    const rutaActual = window.location.pathname;
    const splitRuta = rutaActual.split("/")
    var rutaChange = '';
    // //SERVIDOR LOCAL
    // if (splitRuta[2] === "main" || splitRuta[2] === "Main") {
    //     rutaChange = 'WebFrmPTAR001.aspx/getN'
    // } else {
    //     rutaChange = 'Main/WebFrmPTAR001.aspx/getN'
    // }

    //SERVIDOR EN LINEA
    if (splitRuta[3] === "main" || splitRuta[3] === "Main") {
        rutaChange = 'WebFrmPTAR001.aspx/getN'
    } else {
        rutaChange = 'Main/WebFrmPTAR001.aspx/getN'
    }

    var html = '';
    var count = 0;
    $.ajax({
        url: rutaChange,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{ '_OS' : '" + cveOSd + "', '_UP' : '" + cveUPd + "', '_rolUser' : '" + idRolUser + "', '__eFiscal' : '" + cveEfiscald + "' }",
        //data: null,
        success: function (result) {
            var datos = result.d;
            if (datos !== 0) {
                datos.forEach(function (item) {
                    if (item.SN_SOLVENTA === null) {
                        html += `<div class='fs-10 mb-1'>
                                        <a class='notification bg-warning-subtle' href='#!'>
                                            <div class='notification-body'>
                                                <p class='mb-2'><strong>${item.NOMBRES}</strong> envió observaciones para su riesgo: ${item.CONSECUTIVO}</p>
                                                <p class='mb-0'>Observación: <strong>${item.DESC_OBSERVACION}</strong></p>
                                            </div>
                                        </a>
                                    </div>`
                        count += 1;

                    } else {
                        html = '';
                    }
                    if (count !== 0) {
                        $("#numberNotis").html(count);
                        $("#numberNotis").show();
                    } else {
                        $("#numberNotis").html(0);
                        $("#numberNotis").hide();
                    }
                });
                $("#notis").html(html);
            } else {
                showMsg("Error al obtener información...", 'error');
            }
        },
        error: function (error) {
            showMsg(error, 'alert');
        }
    });
}

function gDriT(cveOS, cveUP, _eFiscal) {
    var html = "";
    var html2 = "";
    fetchDataArr(46, { _OS: cveOS, _UP: cveUP, _TypePrint: 'printPage', _vt: 'null', __eFiscal: _eFiscal }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a RIESGOS TABLAS:", response);
            if (response.length === 0) {
                recargarTablaSinOpciones("tableResumenRiesgos", null);
                recargarTablaSinOpciones("tableResumenRiesgos2", null);
            } else {
                $("#divValoresInicial").hide();
                $("#divValoresFinales").hide();
                response.forEach(function (item) {
                    var badge = '';
                    if (item.VALOR_CUADRANTE === 'I') {
                        badge = 'badge-subtle-danger';
                    } else if (item.VALOR_CUADRANTE === 'II') {
                        badge = 'badge-subtle-warning';
                    } else if (item.VALOR_CUADRANTE === 'III') {
                        badge = 'badge-subtle-success';
                    } else if (item.VALOR_CUADRANTE === 'IV') {
                        badge = 'badge-subtle-primary';
                    } else {
                        badge = 'badge-subtle-ligth';
                    }

                    if (item.VALOR_CUADRANTE === null) {
                        html += ``;
                    } else {
                        html += `<tr class='align-middle'>
                                <td class='text-1000 nowrap'>${item.CONSECUTIVO}</td>
                                <td class='text-1000 nowrap'>${item.VALOR_IMPACTO}</td>
                                <td class='text-1000 nowrap'>${item.VALOR_PROBABILIDAD}</td>
                                <td><span class='badge badge rounded-pill d-block p-2 ${badge}'>${item.VALOR_CUADRANTE}</span></td>
                            </tr>`
                    }

                });
                recargarTablaSinOpciones("tableResumenRiesgos", html);

                response.forEach(function (item) {
                    var badge2 = '';
                    if (item.VALOR_CUADRANTE1 === 'I') {
                        badge2 = 'badge-subtle-danger';
                    } else if (item.VALOR_CUADRANTE1 === 'II') {
                        badge2 = 'badge-subtle-warning';
                    } else if (item.VALOR_CUADRANTE1 === 'III') {
                        badge2 = 'badge-subtle-success';
                    } else if (item.VALOR_CUADRANTE1 === 'IV') {
                        badge2 = 'badge-subtle-primary';
                    } else {
                        badge2 = 'badge-subtle-ligth';
                    }

                    if (item.VALOR_CUADRANTE1 === null) {
                        html2 += ``;
                    } else {
                        html2 += `<tr class='align-middle'>
                                <td class='text-1000 nowrap'>${item.CONSECUTIVO}</td>
                                <td class='text-1000 nowrap'>${item.VALOR_IMPACTO1}</td>
                                <td class='text-1000 nowrap'>${item.VALOR_PROBABILIDAD1}</td>
                                <td><span class='badge badge rounded-pill d-block p-2 ${badge2}'>${item.VALOR_CUADRANTE1}</span></td>
                            </tr>`
                    }
                });
                recargarTablaSinOpciones("tableResumenRiesgos2", html2);
            }
            const verifyData = response.filter(item => item.VALOR_CUADRANTE !== null);
            const verifyData2 = response.filter(item => item.VALOR_CUADRANTE1 !== null);
            logger.log(verifyData, verifyData2)
            if (verifyData.length !== 0) {
                $("#divValoresFinales").show();
            }
            if (verifyData2.length !== 0) {
                $("#divValoresInicial").show();
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

// function gDch(cveOS, cveUP, _type, __bytes, __class, _eFiscal) {
//     var data01 = [];
//     var data02 = [];
//     fetchDataArr(46, { _OS: cveOS, _UP: cveUP, _TypePrint: _type, _vt: __bytes, __eFiscal: _eFiscal, __doConfig: 1 }, 0, function (response) {
//         if (response) {
//             response.forEach(function (item) {
//                 var impValIni = item.VALOR_IMPACTO === null ? 0 : parseInt(item.VALOR_IMPACTO);
//                 var proValIni = item.VALOR_PROBABILIDAD === null ? 0 : parseInt(item.VALOR_PROBABILIDAD);
//                 data01.push([impValIni, proValIni])
//             });
//             response.forEach(function (item) {
//                 var impValFin = item.VALOR_IMPACTO1 === null ? 0 : parseInt(item.VALOR_IMPACTO1);
//                 var proValFin = item.VALOR_PROBABILIDAD1 === null ? 0 : parseInt(item.VALOR_PROBABILIDAD1);
//                 data02.push([impValFin, proValFin])
//             });

//             var chartDom = document.getElementById('divChartMapaF');
//             var myChart = echarts.init(chartDom);
//             var option;

//             var chartDom2 = document.getElementById('divChartMapaI');
//             var myChart2 = echarts.init(chartDom2);
//             var option2;

//             var option = {
//                 //   title: {
//                 //     text: 'Matriz de Riesgo'
//                 //   },
//                 xAxis: {
//                     type: 'value',
//                     name: 'Impacto',
//                     min: 0,
//                     max: 10,
//                     nameTextStyle: {
//                         color: getGrays()['1100'],  // Azul cielo, por ejemplo
//                         fontWeight: 'bold'
//                     },
//                     nameLocation: 'middle',
//                 },
//                 yAxis: {
//                     type: 'value',
//                     name: 'Probabilidad',
//                     min: 0,
//                     max: 10,
//                     nameTextStyle: {
//                         color: getGrays()['1100'],  // Azul cielo, por ejemplo
//                         fontWeight: 'bold'
//                     },
//                     nameLocation: 'middle',
//                 },
//                 visualMap: {
//                     show: false,
//                     pieces: [
//                         { gt: 0, lt: 10, color: getGrays()['1100'] },   // Verde
//                     ],
//                     dimension: 1
//                 },
//                 series: [{
//                     name: 'Riesgos',
//                     type: 'scatter',
//                     symbolSize: 20,
//                     data: data01,
//                     label: {
//                         show: true,
//                         formatter: function (param) {
//                             return `(${param.data[0]}, ${param.data[1]})`;
//                         },
//                         position: 'top',
//                         color: getGrays()['1100'],
//                     },
//                     markArea: {
//                         silent: true,
//                         data: [
//                             [{
//                                 xAxis: 0,
//                                 yAxis: 0,
//                                 itemStyle: { color: 'rgba(144, 238, 144, 0.45)' }
//                             }, {
//                                 xAxis: 5,
//                                 yAxis: 5
//                             }],
//                             [{
//                                 xAxis: 0,
//                                 yAxis: 5,
//                                 itemStyle: { color: 'rgba(255, 255, 150, 0.45)' }
//                             }, {
//                                 xAxis: 5,
//                                 yAxis: 10
//                             }],
//                             [{
//                                 xAxis: 5,
//                                 yAxis: 0,
//                                 itemStyle: { color: 'rgba(135, 206, 250, 0.45)' }
//                             }, {
//                                 xAxis: 10,
//                                 yAxis: 5
//                             }],
//                             [{
//                                 xAxis: 5,
//                                 yAxis: 5,
//                                 itemStyle: { color: 'rgba(240, 128, 128, 0.45)' }
//                             }, {
//                                 xAxis: 10,
//                                 yAxis: 10
//                             }]
//                         ]
//                     },
//                     markLine: {
//                         silent: true,
//                         lineStyle: {
//                             type: 'dashed',
//                             color: getGrays()['1100']
//                         },
//                         data: [
//                             { xAxis: 5 },
//                             { yAxis: 5 }
//                         ]
//                     }
//                 }],
//             };

//             var option2 = {
//                 //   title: {
//                 //     text: 'Matriz de Riesgo'
//                 //   },
//                 xAxis: {
//                     type: 'value',
//                     name: 'Impacto',
//                     min: 0,
//                     max: 10,
//                     nameTextStyle: {
//                         color: getGrays()['1100'],  // Azul cielo, por ejemplo
//                         fontWeight: 'bold'
//                     },
//                     nameLocation: 'middle',
//                 },
//                 yAxis: {
//                     type: 'value',
//                     name: 'Probabilidad',
//                     min: 0,
//                     max: 10,
//                     nameTextStyle: {
//                         color: getGrays()['1100'],  // Azul cielo, por ejemplo
//                         fontWeight: 'bold'
//                     },
//                     nameLocation: 'middle',
//                 },
//                 visualMap: {
//                     show: false,
//                     pieces: [
//                         { gt: 0, lt: 10, color: getGrays()['1100'] },   // Verde
//                     ],
//                     dimension: 1
//                 },
//                 series: [{
//                     name: 'Riesgos',
//                     type: 'scatter',
//                     symbolSize: 20,
//                     data: data02,
//                     label: {
//                         show: true,
//                         formatter: function (param) {
//                             return `(${param.data[0]}, ${param.data[1]})`;
//                         },
//                         position: 'top',
//                         color: getGrays()['1100'],
//                     },
//                     markArea: {
//                         silent: true,
//                         data: [
//                             [{
//                                 xAxis: 0,
//                                 yAxis: 0,
//                                 itemStyle: { color: 'rgba(144, 238, 144, 0.45)' }
//                             }, {
//                                 xAxis: 5,
//                                 yAxis: 5
//                             }],
//                             [{
//                                 xAxis: 0,
//                                 yAxis: 5,
//                                 itemStyle: { color: 'rgba(255, 255, 150, 0.45)' }
//                             }, {
//                                 xAxis: 5,
//                                 yAxis: 10
//                             }],
//                             [{
//                                 xAxis: 5,
//                                 yAxis: 0,
//                                 itemStyle: { color: 'rgba(135, 206, 250, 0.45)' }
//                             }, {
//                                 xAxis: 10,
//                                 yAxis: 5
//                             }],
//                             [{
//                                 xAxis: 5,
//                                 yAxis: 5,
//                                 itemStyle: { color: 'rgba(240, 128, 128, 0.45)' }
//                             }, {
//                                 xAxis: 10,
//                                 yAxis: 10
//                             }]
//                         ]
//                     },
//                     markLine: {
//                         silent: true,
//                         lineStyle: {
//                             type: 'dashed',
//                             color: getGrays()['1100']
//                         },
//                         data: [
//                             { xAxis: 5 },
//                             { yAxis: 5 }
//                         ]
//                     }
//                 }],
//             };

//             myChart.setOption(option);
//             myChart2.setOption(option2);

//             if (__class === 0) {
//                 _type = 'printReport';
//             }

//             if (_type === 'printReport') {
//                 var imgData = myChart.getDataURL({
//                     type: 'png',               // 'png' o 'jpeg'
//                     pixelRatio: 3,             // Aumenta la resolución de la imagen
//                     backgroundColor: '#fff',   // Color de fondo (transparente si no se define)
//                     excludeComponents: ['toolbox'], // Excluye elementos como leyendas o títulos
//                 })

//                 if (__class === 0) {
//                     gDch(cveOS, cveUP, 'printReport', imgData, 1, _eFiscal)
//                 } else {
//                     showMsg("Reporte creado.", 'success');
//                     window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
//                 }
//             }
//         } else if (response === "error") {
//             showMsg("Error al cargar datos", 'error');
//         }
//     });
// }

function gDch(cveOS, cveUP, _type, __bytes, __class, _eFiscal) {
    var data01 = [];
    var data02 = [];
    fetchDataArr(46, { _OS: cveOS, _UP: cveUP, _TypePrint: _type, _vt: __bytes, __eFiscal: _eFiscal, __doConfig: 1 }, 0, function (response) {
        if (response) {
            response.forEach(function (item) {
                var impValIni = item.VALOR_IMPACTO === null ? 0 : parseInt(item.VALOR_IMPACTO);
                var proValIni = item.VALOR_PROBABILIDAD === null ? 0 : parseInt(item.VALOR_PROBABILIDAD);
                data01.push([impValIni, proValIni])
            });
            response.forEach(function (item) {
                var impValFin = item.VALOR_IMPACTO1 === null ? 0 : parseInt(item.VALOR_IMPACTO1);
                var proValFin = item.VALOR_PROBABILIDAD1 === null ? 0 : parseInt(item.VALOR_PROBABILIDAD1);
                data02.push([impValFin, proValFin])
            });

            var chartDom = document.getElementById('divChartMapaF');
            var myChart = echarts.init(chartDom);
            var option;

            var chartDom2 = document.getElementById('divChartMapaI');
            var myChart2 = echarts.init(chartDom2);
            var option2;

            // Configuración base responsive
            var baseOption = {
                responsive: true,
                grid: {
                    left: '10%',
                    right: '10%',
                    top: '15%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    name: 'Impacto',
                    min: 0,
                    max: 10,
                    nameTextStyle: {
                        color: "#000000",
                        fontWeight: 'bold',
                        fontSize: 14
                    },
                    nameLocation: 'middle',
                    nameGap: 30,
                    axisLabel: {
                        fontSize: 11
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'Probabilidad',
                    min: 0,
                    max: 10,
                    nameTextStyle: {
                        color: "#000000",
                        fontWeight: 'bold',
                        fontSize: 14
                    },
                    nameLocation: 'middle',
                    nameGap: 35,
                    axisLabel: {
                        fontSize: 11
                    }
                },
                visualMap: {
                    show: false,
                    pieces: [
                        { gt: 0, lt: 10, color: "#000000" },
                    ],
                    dimension: 1
                },
                series: [{
                    name: 'Riesgos',
                    type: 'scatter',
                    symbolSize: 20,
                    label: {
                        show: true,
                        formatter: function (param) {
                            return `(${param.data[0]}, ${param.data[1]})`;
                        },
                        position: 'top',
                        color: "#000000",
                        fontSize: 11
                    },
                    markArea: {
                        silent: true,
                        data: [
                            [{
                                xAxis: 0,
                                yAxis: 0,
                                itemStyle: { color: 'rgba(144, 238, 144, 0.45)' }
                            }, {
                                xAxis: 5,
                                yAxis: 5
                            }],
                            [{
                                xAxis: 0,
                                yAxis: 5,
                                itemStyle: { color: 'rgba(255, 255, 150, 0.45)' }
                            }, {
                                xAxis: 5,
                                yAxis: 10
                            }],
                            [{
                                xAxis: 5,
                                yAxis: 0,
                                itemStyle: { color: 'rgba(135, 206, 250, 0.45)' }
                            }, {
                                xAxis: 10,
                                yAxis: 5
                            }],
                            [{
                                xAxis: 5,
                                yAxis: 5,
                                itemStyle: { color: 'rgba(240, 128, 128, 0.45)' }
                            }, {
                                xAxis: 10,
                                yAxis: 10
                            }]
                        ]
                    },
                    markLine: {
                        silent: true,
                        lineStyle: {
                            type: 'dashed',
                            color: "#000000",
                            width: 1
                        },
                        data: [
                            { xAxis: 5 },
                            { yAxis: 5 }
                        ]
                    }
                }],
                // Media queries para responsive
                media: [
                    {
                        query: {
                            maxWidth: 992 // lg
                        },
                        option: {
                            grid: {
                                left: '12%',
                                right: '12%',
                                top: '13%',
                                bottom: '16%'
                            },
                            xAxis: {
                                nameGap: 25,
                                nameTextStyle: { fontSize: 13 },
                                axisLabel: { fontSize: 10 }
                            },
                            yAxis: {
                                nameGap: 30,
                                nameTextStyle: { fontSize: 13 },
                                axisLabel: { fontSize: 10 }
                            },
                            series: [{
                                symbolSize: 18,
                                label: { fontSize: 10 }
                            }]
                        }
                    },
                    {
                        query: {
                            maxWidth: 768 // md
                        },
                        option: {
                            grid: {
                                left: '15%',
                                right: '15%',
                                top: '12%',
                                bottom: '18%'
                            },
                            xAxis: {
                                nameGap: 20,
                                nameTextStyle: { fontSize: 12 },
                                axisLabel: { fontSize: 9 }
                            },
                            yAxis: {
                                nameGap: 25,
                                nameTextStyle: { fontSize: 12 },
                                axisLabel: { fontSize: 9 }
                            },
                            series: [{
                                symbolSize: 16,
                                label: {
                                    fontSize: 9,
                                    position: function (point) {
                                        return point[1] > 7 ? 'bottom' : 'top';
                                    }
                                }
                            }]
                        }
                    },
                    {
                        query: {
                            maxWidth: 576 // sm
                        },
                        option: {
                            grid: {
                                left: '18%',
                                right: '18%',
                                top: '10%',
                                bottom: '20%'
                            },
                            xAxis: {
                                nameGap: 15,
                                nameTextStyle: { fontSize: 11 },
                                axisLabel: { fontSize: 8 }
                            },
                            yAxis: {
                                nameGap: 20,
                                nameTextStyle: { fontSize: 11 },
                                axisLabel: { fontSize: 8 }
                            },
                            series: [{
                                symbolSize: 14,
                                label: {
                                    fontSize: 8,
                                    position: function (point) {
                                        return point[1] > 6 ? 'bottom' : 'top';
                                    }
                                }
                            }]
                        }
                    }
                ]
            };

            // Crear opciones específicas para cada gráfico
            option = {
                ...baseOption,
                series: [{
                    ...baseOption.series[0],
                    data: data01
                }]
            };

            option2 = {
                ...baseOption,
                series: [{
                    ...baseOption.series[0],
                    data: data02
                }]
            };

            myChart.setOption(option);
            myChart2.setOption(option2);

            // Función para manejar el resize
            function handleResize() {
                myChart.resize();
                myChart2.resize();
            }

            // Agregar event listeners para resize
            window.addEventListener('resize', handleResize);

            // Usar ResizeObserver si está disponible
            if (typeof ResizeObserver !== 'undefined') {
                const resizeObserver = new ResizeObserver(handleResize);
                if (chartDom) resizeObserver.observe(chartDom);
                if (chartDom2) resizeObserver.observe(chartDom2);
            }

            // Resize inicial
            setTimeout(handleResize, 100);

            if (__class === 0) {
                _type = 'printReport';
            }

            if (_type === 'printReport') {
                // Esperar un momento para que los gráficos se rendericen completamente
                setTimeout(function () {
                    var imgData = myChart.getDataURL({
                        type: 'png',
                        pixelRatio: 3,
                        backgroundColor: '#fff',
                        excludeComponents: ['toolbox'],
                    })

                    if (__class === 0) {
                        gDch(cveOS, cveUP, 'printReport', imgData, 1, _eFiscal)
                    } else {
                        showMsg("Reporte creado.", 'success');
                        window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
                    }
                }, 500); // Esperar 500ms para asegurar el renderizado
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDma(cveOS, cveUP, eFiscal) {
    fetchDataArr(44, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, __doConfig: 1 }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a DATOS MATRIZ:", response.split("|"));
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

function getPtar(cveOS, cveUP, eFiscal) {
    fetchDataArr(45, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, __doConfig: 1 }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a DATOS PTAR:", response.split("|"));
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

function gDcon(cveOS, cveUP, eFiscal) {
    fetchDataArr(47, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, __doConfig: 1 }, 0, function (response) {
        if (response) {
            logger.log("Respuesta a DATOS CONCENTRADO:", response.split("|"));
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

function gDtri(idAccion) {
    var html = "";
    var sumProg = 0;
    var sumAlca = 0;
    fetchDataArr(57, { _idCtrlAccion: idAccion }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a ACTIVIDAD X TRIMESTRE:", response);
            if (response !== 'error') {
                if (response.length >= 1) {
                    response.forEach(function (item) {
                        sumProg += item.META_PROGRAMADA;
                        sumAlca += item.META_ALCANZADA;

                        html += `<tr class='align-middle'>
                                <td class='text-1000 nowrap'>${item.DESC_TRIMESTRE}</td>
                                <td class='text-1000 nowrap'>${item.NUM_ACTIVIDADES}</td>
                                <td class='text-1000 nowrap'>${item.META_PROGRAMADA}</td>
                                <td class='text-1000 nowrap'>${item.META_ALCANZADA}</td>
                            </tr>`
                    });
                    //$("#containerDataActividad_x_Trimestre").html(html);
                    $("#metaAnualProgramada").html(sumProg);
                    $("#metaAnualAlcanzada").html(sumAlca);
                    recargarTablaSinOpciones("containerDataActividad_x_Trimestre", html);
                } else {
                    //$("#containerDataActividad_x_Trimestre").html("Sin actividades");
                    recargarTablaSinOpciones("containerDataActividad_x_Trimestre", null);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    })
}

function gDr(cveOS, cveUP, _eFiscal) {
    var html = '';
    fetchDataArr(58, { _OS: cveOS, _UP: cveUP, __eFiscal: _eFiscal }, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos de REISGOS RESUMEN: ", response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var envio__ = item.SN_ENVIADO === true ? 'disabled' : '';
                        //var valid__ = item.SN_VALIDADO === true || item.SN_VALIDADO === false ? 'disabled' : '';}
                        const colorValidate = item.SN_VALIDA === null ? 'badge-subtle-primary' : item.SN_VALIDA === false ? 'badge-subtle-danger' : 'badge-subtle-success';
                        const colorSend = item.SN_ENVIADO === null ? 'badge-subtle-primary' : item.SN_ENVIADO === false ? 'badge-subtle-danger' : 'badge-subtle-success';
                        var valid__ = '';

                        if (item.SN_ENVIADO === true) {
                            if (item.SN_VALIDA === true || item.SN_VALIDA === false) {
                                valid__ = 'disabled';
                            } else if (item.SN_VALIDA === null) {
                                valid__ = '';
                            }
                        } else {
                            if (item.SN_VALIDA === true) {
                                valid__ = 'disabled';
                            } else if (item.SN_VALIDA === null) {
                                valid__ = '';
                            }
                        }

                        var badge = '';
                        if (item.VALOR_CUADRANTE === 'I') {
                            badge = 'badge-subtle-danger';
                        } else if (item.VALOR_CUADRANTE === 'II') {
                            badge = 'badge-subtle-warning';
                        } else if (item.VALOR_CUADRANTE === 'III') {
                            badge = 'badge-subtle-success';
                        } else if (item.VALOR_CUADRANTE === 'IV') {
                            badge = 'badge-subtle-primary';
                        } else {
                            badge = 'badge-subtle-light';
                        }

                        var badge2 = '';
                        if (item.VALOR_CUADRANTE2 === 'I') {
                            badge2 = 'badge-subtle-danger';
                        } else if (item.VALOR_CUADRANTE2 === 'II') {
                            badge2 = 'badge-subtle-warning';
                        } else if (item.VALOR_CUADRANTE2 === 'III') {
                            badge2 = 'badge-subtle-success';
                        } else if (item.VALOR_CUADRANTE2 === 'IV') {
                            badge2 = 'badge-subtle-primary';
                        } else {
                            badge2 = 'badge-subtle-light';
                        }

                        if (item.ID_ESTATUS === 3) {

                        }

                        html += `<tr>
                            <td>
                            <div class='d-flex align-items-center position-relative'>
                              <div class='avatar avatar-xl'>
                                <div class='avatar-name rounded-circle text-primary bg-primary-subtle fs-9'>
                                <span>${item.CONSECUTIVO_INTERNO === null ? 'na' : item.CONSECUTIVO_INTERNO}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class='w-50'>
                            <div class='d-flex align-items-center position-relative'>
                              <div class='flex-1 ms-3'>
                                <h6 class='mb-0 fw-semi-bold'><a class='stretched-link text-900' href='#'>${item.CONSECUTIVO} - ${item.DESC_ALINEACION}</a></h6>
                                <p class='text-1000 semi-bold fs-10 mb-0'>Riesgo: ${item.DESC_RIESGO}</p>
                                <p class='text-500 fs-11 mb-0'>Tipo de alineaación: ${item.DA2}</p>
                              </div>
                            </div>
                          </td>
                          <td class='w-50'>
                            <div class='d-flex align-items-center position-relative'>
                              <div class='flex-1 ms-3'>
                                <h6 class='mb-0 fw-semi-bold'>${item.NP === null ? 'N/A' : item.NP}</h6>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div class='d-flex align-items-center position-relative'>
                              <div class='flex-1 ms-3'>
                                <span class='m-1 badge badge rounded-pill d-block p-2 fs-10-5 badge-subtle-secondary'>${item.VALOR_IMPACTO === null ? 'Defina' : item.VALOR_IMPACTO}</span>
                                <span class='m-1 badge badge rounded-pill d-block p-2 fs-10-5 badge-subtle-secondary'>${item.VALOR_PROBABILIDAD === null ? 'Defina' : item.VALOR_PROBABILIDAD}</span>
                                <span class='m-1 badge badge rounded-pill d-block p-2 fs-10-5 ${badge}'>${item.VALOR_CUADRANTE === null ? 'Defina' : item.VALOR_CUADRANTE}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div class='d-flex align-items-center position-relative'>
                              <div class='flex-1 ms-3'>
                                <span class='m-1 badge badge rounded-pill d-block p-2 fs-10-5 badge-subtle-secondary'>${item.VALOR_IMPACTO2 === null ? 'Defina' : item.VALOR_IMPACTO2}</span>
                                <span class='m-1 badge badge rounded-pill d-block p-2 fs-10-5 badge-subtle-secondary'>${item.VALOR_PROBABILIDAD2 === null ? 'Defina' : item.VALOR_PROBABILIDAD2}</span>
                                <span class='m-1 badge badge rounded-pill d-block p-2 fs-10-5 ${badge2}'>${item.VALOR_CUADRANTE2 === null ? 'Defina' : item.VALOR_CUADRANTE2}</span>
                              </div>
                            </div>
                          </td>
                                    <td>
                                        <span class='badge badge rounded-pill d-block p-2 fs-10-5 ${colorValidate} m-1'>${item.SN_VALIDA === null ? 'Por validar' : item.SN_VALIDA === false ? 'Rechazado' : 'Validado'}</span>
                                        <span class='badge badge rounded-pill d-block p-2 fs-10-5 ${colorSend} m-1'>${item.SN_ENVIADO === null ? 'Por enviar' : item.SN_ENVIADO === false ? 'No enviado' : 'Enviado'}</span>
                                        <span class='badge badge rounded-pill d-block p-2 fs-10-5 badge-subtle-primary m-1'>${item.ESTATUS}</span>
                                    </td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-info btnSeeResumen customButton m-1' type='button' data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>Ver resumen</button>
                                            <button class='btn btn-sm btn-falcon-info btnSeeObservaciones customButton m-1' type='button' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>Ver observaciones</button>
                                        </div>
                                    </td>
                                </tr>`
                    });
                    recargarTabla("tableRiesgosXAlineacion", html);
                } else {
                    recargarTabla("tableRiesgosXAlineacion", null);
                    showMsg("El organismo aun no envia sus riesgos a validar.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function checkDelete(cveOS, cveUP, eFiscal, type, idCtrl, idCtrlAlt, altConfig) {
    fetchDataArr(64, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _tipoBusqueda: type, _idCtrl: idCtrl }, 0, function (response) {
        if (response) {
            logger.warn("RESPUESTA CHEQUEO DE DATOS", response);
            if (response.flag) {
                if (type === 'ALINEACION') {
                    const contieneRiesgos = response.listData.some(item => item.NUM_RIESGOS !== 0);
                    if (contieneRiesgos) {
                        showMsg("Lamentamos lo ocurrido, detectamos que contiene información dentro de la alineación.", 'error');
                        return;
                    } else {
                        fetchDataArr(65, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlData: idCtrl }, 0, function (response) {
                            if (response.flag) {
                                showMsg(response.msg, 'info');
                            } else {
                                showMsg(response.msg, 'error');
                            }
                        });
                    }
                    loadInit(cveOS, cveUP, eFiscal);
                    gDalCount(cveOS, cveUP, eFiscal);
                    gDr(cveOS, cveUP, eFiscal);
                } else if (type === 'RIESGO') {
                    const contieneFactores = response.listData.some(item => item.NUM_FACTORES !== 0);
                    if (contieneFactores) {
                        showMsg("Lamentamos lo ocurrido, detectamos que contiene información dentro del riesgo.", 'error');
                        return;
                    } else {
                        fetchDataArr(66, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlData: idCtrl }, 0, function (response) {
                            if (response.flag) {
                                showMsg(response.msg, 'info');
                            } else {
                                showMsg(response.msg, 'error');
                            }
                        });
                    }
                    gDri(idCtrlAlt);
                    gDr(cveOS, cveUP, eFiscal);
                } else if (type === 'FACTOR') {
                    const contieneControles = response.listData.some(item => item.NUM_CONTROLES !== 0);
                    if (contieneControles) {
                        showMsg("Lamentamos lo ocurrido, detectamos que contiene información dentro del factor.", 'error');
                        return;
                    } else {
                        fetchDataArr(67, { _idCtrlData: idCtrl, _idCtrlData2: idCtrlAlt }, 0, function (response) {
                            if (response.flag) {
                                showMsg(response.msg, 'info');
                            } else {
                                showMsg(response.msg, 'error');
                            }
                        });
                    }
                    gDfa(idCtrlAlt);
                } else if (type === 'CONTROL') {
                    const contieneAcciones = response.listData.some(item => item.NUM_ACCIONES !== 0);
                    if (contieneAcciones) {
                        showMsg("Lamentamos lo ocurrido, detectamos que contiene información dentro del control.", 'error');
                        return;
                    } else {
                        fetchDataArr(68, { _idCtrlData: idCtrl, _idCtrlData2: idCtrlAlt }, 0, function (response) {
                            if (response.flag) {
                                showMsg(response.msg, 'info');
                            } else {
                                showMsg(response.msg, 'error');
                            }
                        });
                    }
                    gDco(idCtrlAlt, altConfig.substring(0, 6));
                } else if (type === 'ACCION') {
                    const contieneActividades = response.listData.some(item => item.NUM_ACTIVIDADES !== 0);
                    if (contieneActividades) {
                        showMsg("Lamentamos lo ocurrido, detectamos que contiene información dentro de la acción.", 'error');
                        return;
                    } else {
                        fetchDataArr(69, { _idCtrlData: idCtrl, _idCtrlData2: idCtrlAlt }, 0, function (response) {
                            if (response.flag) {
                                showMsg(response.msg, 'info');
                            } else {
                                showMsg(response.msg, 'error');
                            }
                        });
                    }
                    gDac(idCtrlAlt);
                } else if (type === 'ACTIVIDAD') {
                    const contieneEvidencias = response.listData.some(item => item.NUM_EVIDENCIAS !== 0);
                    if (contieneEvidencias) {
                        showMsg("Lamentamos lo ocurrido, detectamos que contiene información dentro de la actividad.", 'error');
                        return;
                    } else {
                        fetchDataArr(70, { _idCtrlData: idCtrl, _idCtrlData2: idCtrlAlt }, 0, function (response) {
                            if (response.flag) {
                                showMsg(response.msg, 'info');
                            } else {
                                showMsg(response.msg, 'error');
                            }
                        });
                    }
                    gDact(idCtrlAlt, altConfig.substring(0, 8));
                }
            } else {
                showMsg(response.msg, 'error');
                return;
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function settingCount(cveOS, cveUP, eFiscal) {
    fetchDataArr(71, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 0, function (response) {
        if (response) {
            logger.log("RESPUESTA DE CONTEO DE DATOS: ", response);
            if (response !== 'error') {
                if (response.length === 1) {
                    $("#cRd").text(response[0].NUM_RIESGOS);
                    $("#cFd").text(response[0].NUM_FACTORES);
                    $("#cCd").text(response[0].NUM_CONTROLES);
                    $("#cAd").text(response[0].NUM_ACCIONES);
                    $("#cAcd").text(response[0].NUM_ACTIVIDADES);
                    $("#cEd").text(response[0].NUM_EVIDENCIAS);
                    $("#cARd").text(response[0].NUM_REPORTE_ACTIVIDAD);
                } else {
                    $("#cRd").text(0);
                    $("#cFd").text(0);
                    $("#cCd").text(0);
                    $("#cAd").text(0);
                    $("#cAcd").text(0);
                    $("#cEd").text(0);
                    $("#cARd").text(0);
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

$(document).ready(function () {
    loadEndpoints(0);
    columnAlineacion.hide();
    columnRiesgo.hide();
    columnFactor.hide();
    columnControl.hide();
    columnAccion.hide();
    columnActividad.hide();
    //getNewChart()

    if (idRolUser === '101') {
        //gRes(20)
        gDfCefiscal();
        gDfCos(cveEfiscald);
        gDfCup(cveEfiscald, cveOSd, '');
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#cboCuadrante").attr("disabled", true);
        $("#cboCuadranteFin").attr("disabled", true);
        $("#cboTrimestre").attr("disabled", true);

        getDataProcesoCombo(0, cveOSd, cveUPd, cveEfiscald);
        gDfCnivelRiesgo(0);
        gDfCclasificacionRiesgo(0);
        gDfCimpacto(0);
        gDfCprobabilidad(0);
        gDfCcuadrante(0);
        gDfCimpactoFin(0);
        gDfCprobabilidadFin(0);
        gDfCcuadranteFin(0);
        gDfCestrategia(0);
        gDfCcontrol(0);

        gDfCalineacion();
        gDfCclasificacionFactor(0);
        gDfCcontrolFactor(0);
        gDfCtipoFactor(0);
        gDfCtipoControl(0);
        gDfCdeterminacion(0);
        gDfCctrl01(0);
        gDfCctrl02(0);
        gDfCctrl03(0);
        gDfCctrl04(0);

        gDr(cveOSd, cveUPd, cveEfiscald);
        gDfCmeses(0);
        gDfCresponsable(0, cveOSd, cveUPd);
        gDfCtrimestre(0);
        gDch(cveOSd, cveUPd, 'printPage', 'null', 1, cveEfiscald);
        loadInit(cveOSd, cveUPd, cveEfiscald);
        //gDriT(cveOSd, cveUPd, cveEfiscald);
        //gDob(cveOSd, cveUPd, cveEfiscald);
        settingCount(cveOSd, cveUPd, cveEfiscald);
        $("#check1").prop('checked', true);
    } else if (idRolUser === '102' || idRolUser === '103') {
        logger.log("Usuario administrador")
    }

    // $(document).on("click", "*", function () {
    //     console.log("Click detectado en:", this);
    // });

    $(document).on("click", "#btnSearch", async function () {
        var cboOS = $("#cboOs").val();
        var cboUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!await verifyInitialDataOUE(cboOS, cboUP, eFiscal)) {
            return;
        }
        gDr($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        loadInit($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        gDch($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
        settingCount($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        getDataProcesoCombo(0, $("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());

        $("#containerDataRiesgo").html(null);
        $("#containerDataRiesgo_x_Alineacion").html(null);
        $("#containerDataFactor").html(null);
        $("#containerDataFactor_x_Riesgo").html(null);
        $("#containerDataControl").html(null);
        $("#containerDataControl_x_Factor").html(null);
        $("#containerDataAccion").html(null);
        $("#containerDataAccion_x_Control").html(null);
        $("#containerDataActividad").html(null);
        $("#containerDataActividad_x_Accion").html(null);
        columnAlineacion.show();
        columnRiesgo.hide();
        columnFactor.hide();
        columnControl.hide();
        columnAccion.hide();
        $("#check1").prop('checked', true);
        $("#check2").prop('checked', false);
        $("#check3").prop('checked', false);
        $("#check4").prop('checked', false);
        $("#check5").prop('checked', false);
        $("#check6").prop('checked', false);
    });

    $(document).on("change", "#cboUp, #cboEfiscal", async function () {
        var cboOS = $("#cboOs").val();
        var cboUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!await verifyInitialDataOUE(cboOS, cboUP, eFiscal)) {
            return;
        }
        gDr($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        loadInit($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        gDch($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
        settingCount($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        getDataProcesoCombo(0, $("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());

        $("#containerDataRiesgo").html(null);
        $("#containerDataRiesgo_x_Alineacion").html(null);
        $("#containerDataFactor").html(null);
        $("#containerDataFactor_x_Riesgo").html(null);
        $("#containerDataControl").html(null);
        $("#containerDataControl_x_Factor").html(null);
        $("#containerDataAccion").html(null);
        $("#containerDataAccion_x_Control").html(null);
        $("#containerDataActividad").html(null);
        $("#containerDataActividad_x_Accion").html(null);
        columnAlineacion.show();
        columnRiesgo.hide();
        columnFactor.hide();
        columnControl.hide();
        columnAccion.hide();
        $("#check1").prop('checked', true);
        $("#check2").prop('checked', false);
        $("#check3").prop('checked', false);
        $("#check4").prop('checked', false);
        $("#check5").prop('checked', false);
        $("#check6").prop('checked', false);
    });

    $(document).on("click", "#btnN_Alineacion, #btnN_Alineacion2", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            return;
        }
        clearForms(1);
        $("#btnS_Alineacion").attr("data-ctrl-alineacion", 0);
        $("#btnS_Alineacion").attr("data-set-data", 0);
        gDalCount(cveOS, cveUP, eFiscal);

        $("#modalAlineacionForm").modal("show");
    });

    $(document).on("click", "#btnS_Alineacion", async function () {
        $("#btnS_Alineacion").attr("disabled", true);
        var idInsert = $(this)[0].dataset.setData;
        var idReturn = $(this)[0].dataset.ctrlAlineacion;
        if (validarFormularioAlineacion() === true) {
            var os = $("#cboOs").val();
            var up = $("#cboUp").val();
            var _eFiscal = $("#cboEfiscal").val();
            var efiscal = $("#cboEfiscal").val();
            if (!await verifyInitialDataOUE(os, up, efiscal)) {
                return;
            }
            var idAlineacion = $("#cboAlineacion").val();
            var txtDesc01 = $("#txtAlineacion").val();
            var txtNoFolioData = $("#txtNoFolio").val();

            sDal(idAlineacion, txtDesc01, idReturn, os, up, efiscal, txtNoFolioData);
            gDr(os, up, _eFiscal);

            clearForms(1);
            $("#btnS_Alineacion").removeAttr("disabled");
            $("#check1").prop('checked', true);
            $("#check2").prop('checked', false);
            $("#check3").prop('checked', false);
            $("#check4").prop('checked', false);
            $("#check5").prop('checked', false);
            $("#check6").prop('checked', false);
        } else {
            $("#btnS_Alineacion").removeAttr("disabled");
        }
        $("#btnS_Alineacion").removeAttr("disabled");
    });

    $(document).on("click", ".btnEditDatosAlineacion", function () {
        var idReturn = $(this)[0].dataset.ctrlAlineacion;
        var tipoFin = $(this)[0].dataset.ctrlAlineacion2;
        $("#modalAlineacionForm").modal("show");
        gDalById(idReturn);
        //$("#btnS_Alineacion").attr("data-ctrl-alineacion", `${idReturn}`);
        $("#btnS_Alineacion").attr("data-set-data", 1);
    });

    $(document).on("click", ".btnSeeDatosAlineacion", function () { // VER RIESGO
        clearForms(2);
        $("#containerDataRiesgo").html(null);
        $("#containerDataRiesgo_x_Alineacion").html(null);
        $("#containerDataFactor").html(null);
        $("#containerDataFactor_x_Riesgo").html(null);
        $("#containerDataControl").html(null);
        $("#containerDataControl_x_Factor").html(null);
        $("#containerDataAccion").html(null);
        $("#containerDataAccion_x_Control").html(null);
        $("#containerDataActividad").html(null);
        $("#containerDataActividad_x_Accion").html(null);
        var idReturn = $(this)[0].dataset.ctrlAlineacion;
        var tipoFin = $(this)[0].dataset.ctrlAlineacion2;
        $("#btnN_Riesgo").attr("data-ctrl-alineacion", `${idReturn}`)
        $("#btnN_Riesgo").attr("data-ctrl_termino", `${tipoFin}`)
        $("#btnN_Riesgo").attr("data-ctrl-riesgo", 0);
        $("#btnS_Riesgo").attr("data-ctrl-alineacion", `${idReturn}`)
        $("#btnS_Riesgo").attr("data-ctrl_termino", `${tipoFin}`)
        $("#btnS_Riesgo").attr("data-ctrl-riesgo", 0);

        gDri(idReturn);
        gDalById(idReturn);
        $("#check1").prop('checked', false);
        $("#check2").prop('checked', true);
        columnRiesgo.show();
    });

    $(document).on("click", "#btnCancel_Alineacion", function () {
        $("#modalAlineacionForm").modal("hide");
        clearForms(1);
    });

    $(document).on("click", "#btnN_Riesgo", function () {
        clearForms(2);
        var idReturn = $(this)[0].dataset.ctrlAlineacion;
        logger.log(idReturn);
        var tipoFin = $(this)[0].dataset.ctrlTermino;
        $("#btnS_Riesgo").attr("data-ctrl-alineacion", `${idReturn}`)
        $("#btnS_Riesgo").attr("data-ctrl_termino", `${tipoFin}`)
        $("#btnS_Riesgo").attr("data-ctrl-riesgo", 0);
        if (idReturn !== undefined) {
            $("#modalRiesgoForm").modal("show");
        } else {
            showMsg('Necesita elegir primero a que alineación necesita insertar su riesgo.', 'alert');
            return;
        }
    });

    $(document).on("click", "#btnS_Riesgo", function () {
        $("#btnS_Riesgo").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlAlineacion;
        var tipoFin = $(this)[0].dataset.fin;
        var idCtrlRiesgo = $(this)[0].dataset.ctrlRiesgo;

        if (idReturn === 0 || idReturn === "0" || idReturn === null) {
            showMsg("Ocurrio un error al obtener información extra de la alineación y proceso", 'error');
            return;
        }

        if (validarFormularioRiesgo() === true) {
            const cboProcesoData = $("#cboProceso").val();
            const cboNivelRiesgoData = $("#cboNivelRiesgo").val();
            const cboClasRiesgoData = $("#cboClasRiesgo").val();
            const cboEfiscalData = $("#cboEfiscal").val();
            const txtOSProcesoData = $("#txtOSProceso").val().trim();
            const txtUPProcesoData = $("#txtUPProceso").val().trim();
            const txtRiesgoData = $("#txtRiesgo").val().trim();
            sDri(cboProcesoData, idReturn, cboNivelRiesgoData, cboClasRiesgoData, cboEfiscalData, txtOSProcesoData, txtUPProcesoData, txtRiesgoData, idCtrlRiesgo);
            gDalById(idReturn);
        } else {
            $("#btnS_Riesgo").removeAttr("disabled");
        }
    });

    $(document).on("click", ".btnEditDatosRiesgo", function () {
        var idReturn = $(this)[0].dataset.ctrlAlineacion;
        var idRiesgo = $(this)[0].dataset.ctrlRiesgo;
        $("#btnS_Riesgo").attr("data-ctrl-alineacion", `${idReturn}`)
        $("#btnS_Riesgo").attr("data-ctrl-riesgo", idRiesgo);

        gDriById(idReturn);
        $("#modalRiesgoForm").modal("show");
    });

    $(document).on("click", ".btnSeeDatosRiesgo", function () { // VER FACTORES
        clearForms(3);
        $("#containerDataFactor").html(null);
        $("#containerDataFactor_x_Riesgo").html(null);
        $("#containerDataControl").html(null);
        $("#containerDataControl_x_Factor").html(null);
        $("#containerDataAccion").html(null);
        $("#containerDataAccion_x_Control").html(null);
        $("#containerDataActividad").html(null);
        $("#containerDataActividad_x_Accion").html(null);
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        $("#btnS_Factor").attr("data-ctrl-riesgo", idReturn);
        $("#btnN_Factor").attr("data-ctrl-riesgo", idReturn);
        $("#btnS_Factor").attr("data-ctrl-factor", 0);
        $("#btnE_ValorInicial").attr("data-ctrl-riesgo", idReturn);
        $("#btnCancel_Factor").attr("data-ctrl-riesgo", idReturn);
        gDfa(idReturn);
        gDriByIdri(idReturn);

        $("#check2").prop('checked', false);
        $("#check3").prop('checked', true);

        columnFactor.show();
    });

    $(document).on("click", "#btnCancel_Riesgo", function () {
        clearForms(2);
        $("#modalRiesgoForm").modal("hide");
    });

    $(document).on("click", "#btnN_Factor", function () {
        clearForms(3);
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        $("#btnS_Factor").attr("data-ctrl-riesgo", idReturn);
        $("#btnS_Factor").attr("data-ctrl-factor", 0);
        $("#btnE_ValorInicial").attr("data-ctrl-riesgo", idReturn);
        $("#btnCancel_Factor").attr("data-ctrl-riesgo", idReturn);
        gDfa(idReturn);
        gDriByIdri(idReturn);
        if (idReturn !== undefined) {
            $("#modalFactorForm").modal("show");
        } else {
            showMsg('Necesita elegir primero a que riesgo necesita insertar sus factores.', 'alert');
            return;
        }
    });

    $(document).on("click", "#btnS_Factor", function () {
        $("#btnS_Factor").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        var idCtrlFactor = $(this)[0].dataset.ctrlFactor;
        if (idReturn === 0 || idReturn === "0" || idReturn === null) {
            showMsg("Ocurrio un error al obtener información extra del riesgo", 'error');
            return;
        }
        if (validarFormularioFactor() === true) {
            const cboClasFactorData = $("#cboClasFactor").val();
            //const cboControlFactorData = $("#cboControlFactor").val();
            const cboTipoFactorData = $("#cboTipoFactor").val();
            const txtFolioFactorData = $("#txtFolioFactor").val().trim();
            const txtFactorRiesgoData = $("#txtFactorRiesgo").val().trim();
            const txtPosibleRiesgoData = $("#txtPosibleRiesgo").val().trim();
            sDfa(idReturn, cboClasFactorData, cboTipoFactorData, txtFolioFactorData, txtFactorRiesgoData, idCtrlFactor, txtPosibleRiesgoData);
            $("#btnS_Factor").removeAttr("disabled");
        } else {
            $("#btnS_Factor").removeAttr("disabled");
        }
    });

    $(document).on("click", ".btnSeeDatosFactor", function () { // VER CONTROLES
        clearForms(4);
        $("#containerDataControl").html(null);
        $("#containerDataControl_x_Factor").html(null);
        $("#containerDataAccion").html(null);
        $("#containerDataAccion_x_Control").html(null);
        $("#containerDataActividad").html(null);
        $("#containerDataActividad_x_Accion").html(null);
        var idReturn = $(this)[0].dataset.ctrlFactor;
        var idCtrlRiesgo = $(this)[0].dataset.ctrlRiesgo;
        var numFolio = $(this)[0].dataset.ctrl1;
        $("#btnE_ValorFinal").attr("data-ctrl-riesgo", idCtrlRiesgo);
        $("#btnE_ValorFinal").attr("data-ctrl-factor", idReturn);
        $("#btnU_Control").attr("data-ctrl-riesgo", idCtrlRiesgo);
        $("#btnU_Control").attr("data-ctrl-factor", idReturn);
        $("#btnU_Control").attr("data-ctrl-folio", numFolio);
        $("#btnN_Control").attr("data-ctrl-riesgo", idCtrlRiesgo);
        $("#btnN_Control").attr("data-ctrl-factor", idReturn);
        $("#btnN_Control").attr("data-ctrl-folio", numFolio);
        $("#btnS_Control").attr("data-ctrl-riesgo", idCtrlRiesgo);
        $("#btnS_Control").attr("data-ctrl-factor", idReturn);
        $("#btnS_Control").attr("data-ctrl-folio", numFolio);
        gDfa(idCtrlRiesgo);
        gDco(idReturn, numFolio);
        $("#check3").prop('checked', false);
        $("#check4").prop('checked', true);
        columnControl.show();
    });

    $(document).on("click", ".btnEditDatosFactor", function () {
        var idReturn = $(this)[0].dataset.ctrlFactor;
        var idCtrlRiesgo = $(this)[0].dataset.ctrlRiesgo;
        var numFolio = $(this)[0].dataset.ctrl1;
        $("#btnS_Factor").attr("data-ctrl-factor", idReturn);
        gDfaById(idReturn, 1);
        $("#modalFactorForm").modal("show");
    });

    $(document).on("click", "#btnCancel_Factor", function () {
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        $("#btnS_Factor").attr("data-ctrl-factor", 0);
        clearForms(3);
        //gDfa(idReturn);
        $("#modalFactorForm").modal("hide");
    });

    $(document).on("click", "#btnE_ValorInicial", async function () {
        event.preventDefault();
        const confirm = await alertConfirmMessage('¿Está seguro de insertar los valores iniciales? Si lo hace ya no podrá editar o ingresar registros.');
        if (!confirm) {
            return
        } else {
            var idReturn = $(this)[0].dataset.ctrlRiesgo;
            if (idReturn === undefined) {
                showMsg('Primero registre, su alineación, riesgo, factores. O elija la alineación y siga el proceso.', 'alert');
                return;
            }
            fetchDataArr(56, { _idCtrlRiesgo: idReturn }, 0, function (response) {
                if (response) {
                    logger.log("Datos retornados para VALOR INICIAL", response);
                    if (response !== 'error') {
                        const algunoFallaFactor = response.some(item => item.NUM_FACTORES === 0);

                        if (algunoFallaFactor) {
                            showMsg(`Al menos debe de existir un factor para insertar los valores iniciales del riessgo..`, 'info');
                            return;
                        } else {
                            $("#modalVInicialForm").modal("show");
                            $("#btnUpdateValoresRiesgoInicio").attr("data-ctrl-riesgo", idReturn);
                        }
                    } else {
                        showMsg("Ocurrió un error al obtener los datos.", 'error');
                        return;
                    }
                }
            });
        }
    });

    $(document).on("click", "#btnUpdateValoresRiesgoInicio", function () {
        $("#btnUpdateValoresRiesgoInicio").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        if (idReturn !== 0) {
            if (validarFormularioValoresInicial() === true) {
                //const txtPosibleRiesgoData = $("#txtPosibleRiesgo").val().trim();
                const cboImpactoData = $("#cboImpactoInicio").val();
                const cboProbabilidadData = $("#cboProbabilidadInicio").val();
                const cboCuadranteData = $("#cboCuadranteInicio").val();
                uPri(cboImpactoData, cboProbabilidadData, cboCuadranteData, idReturn);
                $('#modalVInicialForm').modal('hide');
            }
            // gDfa(idReturn);
            // gDriByIdri(idReturn);
        } else {
            showMsg("Ocurrio un error al obtener información extra del riesgo", 'error');
            return;
        }
    });

    $(document).on("click", "#btnN_Control", function () {
        clearForms(4);
        var idReturn = $(this)[0].dataset.ctrlFactor;
        var idCtrlRiesgo = $(this)[0].dataset.ctrlRiesgo;
        var numFolio = $(this)[0].dataset.ctrlFolio;
        $("#btnS_Control").attr("data-ctrl-factor", idReturn);
        $("#btnS_Control").attr("data-ctrl-control", 0);
        gDfa(idCtrlRiesgo);
        gDco(idReturn, numFolio);
        if (idReturn !== undefined) {
            $("#modalControlForm").modal("show");
        } else {
            showMsg('Necesita elegir primero a que factor necesita insertar sus controles.', 'alert');
            return;
        }
    });

    $(document).on("click", "#btnS_Control", function () {
        $("#btnS_Control").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlFactor;
        var idCtrlControl = $(this)[0].dataset.ctrlControl;

        if (idReturn === 0 || idReturn === "0" || idReturn === null) {
            showMsg("Ocurrio un error al obtener información extra del factor", 'error');
            return;
        }

        if (validarFormularioControl() === true) {
            const cboTipoControlData = $("#cboTipoControl").val();
            const cboDeterminacionData = $("#cboDeterminacion").val();
            const cboControlDocumentadoData = $("#cboControlDocumentado").val();
            const cboControlFormalizadoData = $("#cboControlFormalizado").val();
            const cboControlAplicaData = $("#cboControlAplica").val();
            const cboControlEfectivoData = $("#cboControlEfectivo").val();
            const txtFolioControlFactorData = $("#txtFolioControlFactor").val().trim();
            const txtDescControlFactorData = $("#txtDescControlFactor").val().trim();
            sDco(idReturn, cboTipoControlData, cboDeterminacionData, cboControlDocumentadoData, cboControlFormalizadoData, cboControlAplicaData, cboControlEfectivoData, txtFolioControlFactorData, txtDescControlFactorData, idCtrlControl);
        } else {
            $("#btnS_Control").removeAttr("disabled");
        }
        $("#btnS_Control").attr("data-ctrl-control", 0);
    });

    $(document).on("click", ".btnSeeDatosControl", function () { // VER ACCION
        clearForms(4);
        clearForms(5);
        $("#containerDataAccion").html(null);
        $("#containerDataAccion_x_Control").html(null);
        $("#containerDataActividad").html(null);
        $("#containerDataActividad_x_Accion").html(null);
        var idReturn = $(this)[0].dataset.ctrlControl;
        var idCtrlFactor = $(this)[0].dataset.ctrlFactor;
        var numFolio = $(this)[0].dataset.ctrl1;
        $("#btnN_Accion").attr("data-ctrl-control", idReturn);
        $("#btnN_Accion").attr("data-ctrl-accion", 0);
        $("#btnS_AccionXRiesgo").attr("data-ctrl-control", idReturn);
        $("#btnS_AccionXRiesgo").attr("data-ctrl-accion", 0);
        gDac(idReturn);
        gDco(idCtrlFactor, numFolio.substring(0, 6));
        $("#check4").prop('checked', false);
        $("#check5").prop('checked', true);
        columnAccion.show();
    });

    $(document).on("click", ".btnEditDatosControl", function () {
        var idReturn = $(this)[0].dataset.ctrlControl;
        var idCtrlFactor = $(this)[0].dataset.ctrlFactor;
        var numFolio = $(this)[0].dataset.ctrl1;
        $("#btnS_Control").attr("data-ctrl-control", idReturn);
        $("#btnS_Control").attr("data-ctrl-factor", idCtrlFactor);
        gDcoById(idReturn, 1);
        //gDco(idCtrlFactor, numFolio.substring(0, 6));
        $("#modalControlForm").modal("show");
    });

    $(document).on("click", "#btnCancel_Control", function () {
        $("#btnS_Control").attr("data-ctrl-control", 0);
        const txtFolioControlFactorData = $("#txtFolioControlFactor").val().trim();
        var idReturn = $(this)[0].dataset.ctrl1;
        clearForms(4);
        //gDco(idReturn, txtFolioControlFactorData.substring(0, 6));
        $("#modalControlForm").modal("hide");
    });

    $(document).on("click", "#btnE_ValorFinal", async function () {
        const confirm = await alertConfirmMessage('¿Está seguro de insertar los valores finales? Si lo hace ya no podrá editar o ingresar registros.');
        if (!confirm) {
            return
        } else {
            var idReturn = $(this)[0].dataset.ctrlRiesgo;
            var idReturn2 = $(this)[0].dataset.ctrlFactor;
            $("#btnUpdateValoresRiesgoFin").attr("data-ctrl-riesgo", idReturn);
            $("#btnUpdateValoresRiesgoFin").attr("data-ctrl-factor", idReturn2);
            if (idReturn === undefined) {
                showMsg('Primero registre, su alineación, riesgo, factor y controles. O elija la alineación y siga el proceso.', 'alert');
                return;
            }
            fetchDataArr(48, { _idCtrlRiesgo: idReturn }, 0, function (response) {
                if (response) {
                    logger.log("Datos recibidos a RIESGO BY ID (RIESGO):", response);
                    if (response !== 'error') {
                        if (response[0].ID_CONTROL === null || response[0].ID_CONTROL === '0') {
                            showMsg('Defina primero si su riesgo esta controlado.', 'error');
                            return;
                        } else {
                            fetchDataArr(50, { _idCtrlRiesgo: idReturn }, 0, function (response) {
                                if (response) {
                                    logger.warn("Datos devueltos sobre VALOR INICIAL", response)
                                    if (response !== 'error') {
                                        const algunoFalla = response.some(item => item.PASA_ === 0);
                                        if (algunoFalla) {
                                            const foliosFallidos = response.filter(item => item.PASA_ === 0).map(item => item.FOLIO).join(', ');
                                            showMsg(`Los siguientes factores no cumplen: ${foliosFallidos}. Favor de insertar los controles para este factor`, 'warning');
                                        } else {
                                            const idImpacto = response.filter(item => item.PASA_ === 1).map(item => item.ID_IMPACTO);
                                            const idProbabilidad = response.filter(item => item.PASA_ === 1).map(item => item.ID_PROBABILIDAD);
                                            fetchDataArr(48, { _idCtrlRiesgo: idReturn }, 0, function (response) {
                                                if (response) {
                                                    logger.warn("Datos recibidos a RIESGO BY ID (RIESGO):", response);
                                                    if (response !== 'error') {
                                                        if (response.length === 1) {
                                                            $("#impactoLocal").text(response[0].ID_IMPACTO);
                                                            $("#probabilidadLocal").text(response[0].ID_PROBABILIDAD);
                                                            $("#modalVFinForm").modal("show");
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    } else {
                                        showMsg("Ocurrió un error al mostrar resultados.", 'error');
                                    }
                                } else if (response === "error") {
                                    showMsg("Error al cargar datos", 'error');
                                }
                            });
                        }
                    }
                }
            });
        }
    });

    $(document).on("click", "#btnUpdateValoresRiesgoFin", function () {
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        var idReturn2 = $(this)[0].dataset.ctrlFactor;
        if (idReturn !== 0) {
            if (validarFormularioValoresFinal() === true) {
                //const cboControlData = $("#cboControl").val();
                const cboImpactoFinData = $("#cboImpactoFin").val();
                const cboProbabilidadFinData = $("#cboProbabilidadFin").val();
                const cboCuadranteFinData = $("#cboCuadranteFin").val();
                //const cboEstrategiaData = $("#cboEstrategia").val();
                const txtFolioControlFactorData = $("#txtFolioControlFactor").val().trim();
                uPri2(cboImpactoFinData, cboProbabilidadFinData, cboCuadranteFinData, idReturn);
                $('#modalVFinForm').modal('hide');
                // gDfa(idReturn);
                gDco(idReturn2, txtFolioControlFactorData.substring(0, 6));
            }
        } else {
            showMsg("Ocurrio un error al obtener información extra del riesgo", 'error');
            return;
        }
    });

    $(document).on("click", "#btnN_Accion", function () {
        clearForms(5);
        var idReturn = $(this)[0].dataset.ctrlControl;
        var idAccion = $(this)[0].dataset.ctrlAccion;
        $("#btnS_Accion").attr("data-ctrl-control", idReturn);
        $("#btnS_Accion").attr("data-ctrl-accion", 0);
        gDac(idReturn);
        if (idReturn !== undefined) {
            $("#modalAccionForm").modal("show");
        } else {
            showMsg('Necesita elegir primero a que control necesita insertar su acción.', 'alert');
            return;
        }
    });

    $(document).on("click", "#btnS_Accion", function () {
        $("#btnS_Accion").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlControl;
        var idCtrlAccion = $(this)[0].dataset.ctrlAccion;
        if (idReturn === 0 || idReturn === "0" || idReturn === null) {
            showMsg("Ocurrio un error al obtener información extra del factor", 'error');
            return;
        }
        if (validarFormularioAccion() === true) {
            const txtDescAccionData = $("#txtDescAccion").val().trim();
            sDac(idReturn, txtDescAccionData, idCtrlAccion);
            $("#btnS_Accion").removeAttr("disabled");
        } else {
            $("#btnS_Accion").removeAttr("disabled");
        }
    });

    $(document).on("click", ".btnSeeDatosAccion", function () { // VER ACTIVIDADES
        clearForms(6);
        $("#containerDataActividad").html(null);
        $("#containerDataActividad_x_Accion").html(null);
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var numeroControlAccion = $(this)[0].dataset.ctrlNoControl;
        gDact(idReturn, numeroControlAccion);
        $("#btnS_Actividad").attr("data-ctrl-actividad", 0);
        $("#btnS_Actividad").attr("data-ctrl-accion", idReturn);
        $("#btnN_Actividad").attr("data-ctrl-accion", idReturn);
        $("#btnN_Actividad").attr("data-ctrl-no-control", numeroControlAccion);
        $("#check5").prop('checked', false);
        $("#check6").prop('checked', true);
        columnActividad.show();
    });

    $(document).on("click", ".btnEditDatosAccion", function () {
        var idCtrlAccion = $(this)[0].dataset.ctrlAccion;
        var idCtrlControl = $(this)[0].dataset.ctrlControl;
        var numeroControlAccion = $(this)[0].dataset.ctrlNoControl;
        $("#btnS_Accion").attr("data-ctrl-accion", idCtrlAccion);
        $("#btnS_Accion").attr("data-ctrl-control", idCtrlControl);
        //gDac(idCtrlControl);
        gDacById(idCtrlAccion, 1);
        $("#btnS_Accion").removeAttr("disabled");
        $("#modalAccionForm").modal("show");
    });

    $(document).on("click", "#btnCancel_Accion", function () {
        var idReturn = $(this)[0].dataset.ctrlControl;
        $("#btnS_Accion").attr("data-ctrl-accion", 0);
        $("#btnS_Accion").attr("data-ctrl-control", idReturn);
        clearForms(5);
        //gDac(idReturn);
        $("#modalAccionForm").modal("hide");
    });

    $(document).on("click", "#btnN_Actividad", function () {
        clearForms(6);
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var numeroControlAccion = $(this)[0].dataset.ctrlNoControl;
        gDact(idReturn, numeroControlAccion);
        $("#btnS_Actividad").attr("data-ctrl-actividad", 0);
        $("#btnS_Actividad").attr("data-ctrl-no-actividad", numeroControlAccion);
        $("#btnCancel_Actividad").attr("data-ctrl-no-actividad", numeroControlAccion);
        if (idReturn !== undefined) {
            $("#modalActividadForm").modal("show");
            $("#divInsertMeta").show();
            $("#divUpdateMeta").hide();
        } else {
            showMsg('Necesita elegir primero a que acción necesita insertar sus actividades.', 'alert');
            return;
        }
    });

    $(document).on("click", "#btnS_Actividad", function () {
        const valores = obtenerValores();
        $("#btnS_Actividad").attr("disabled", true);
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var idCtrlActividad = $(this)[0].dataset.ctrlActividad;
        if (idReturn === 0 || idReturn === "0" || idReturn === null) {
            showMsg("Ocurrio un error al obtener información extra de la acción", 'error');
            return;
        }
        if (validarFormularioActividad() === true) {
            if (idCtrlActividad === "0") {
                if (!validarTextboxes()) {
                    $("#btnS_Actividad").removeAttr("disabled");
                    return;
                }
                //const txtResponsableActividadData = $("#txtResponsableActividad").val().trim();
                const cboResponsableData = $("#cboResponsable").val();
                const listMesData = $("#cboMes2").val();
                //const cboMesData = $("#cboMes").val();
                const txtDescActividadData = $("#txtDescActividad").val().trim();
                //const cboTrimestreData = $("#cboTrimestre").val();
                const txtNoActividadData = $("#txtNoActividad").val().trim();
                const txtNoMetaData = $("#txtNoMeta").val().trim();
                const txtEvidenciaData = $("#txtEvidencia").val().trim();
                const valoresMeses = JSON.stringify(valores);
                //const cboTipoReporteData = $("#cboTipoReporte").val();
                //sDact(idReturn, cboResponsableData, txtDescActividadData, cboTrimestreData, cboMesData, idCtrlActividad, txtNoActividadData);
                //sDact(idReturn, cboResponsableData, txtDescActividadData, listMesData, idCtrlActividad, txtNoActividadData, 0, txtNoMetaData, txtEvidenciaData);
                sDact(idReturn, cboResponsableData, txtDescActividadData, valoresMeses, idCtrlActividad, txtNoActividadData, 0, txtNoMetaData, txtEvidenciaData);
                $("#btnS_Actividad").removeAttr("disabled");
                gDact(idReturn, txtNoActividadData.substring(0, 8));
            } else if (idCtrlActividad !== "0") {
                //const txtResponsableActividadData = $("#txtResponsableActividad").val().trim();
                const cboResponsableData = $("#cboResponsable").val();
                const listMesData = $("#cboMes2").val();
                //const cboMesData = $("#cboMes").val();
                const txtDescActividadData = $("#txtDescActividad").val().trim();
                //const cboTrimestreData = $("#cboTrimestre").val();
                const txtNoActividadData = $("#txtNoActividad").val().trim();
                const txtNoMetaData = $("#txtNoMeta").val().trim();
                const txtEvidenciaData = $("#txtEvidencia").val().trim();
                //const cboTipoReporteData = $("#cboTipoReporte").val();
                sDact(idReturn, cboResponsableData, txtDescActividadData, listMesData, idCtrlActividad, txtNoActividadData, 1, txtNoMetaData, txtEvidenciaData);
                $("#btnS_Actividad").removeAttr("disabled");
                gDact(idReturn, txtNoActividadData.substring(0, 8));
            }
        } else {
            $("#btnS_Actividad").removeAttr("disabled");
        }
    });

    $(document).on("click", ".btnEditDatosActividad", function () {
        var idCtrlActividad = $(this)[0].dataset.ctrlActividad;
        var idCtrlAccion = $(this)[0].dataset.ctrlAccion;
        var ctrlNoActividad = $(this)[0].dataset.ctrlNoActividad;
        $("#btnS_Actividad").attr("data-ctrl-actividad", idCtrlActividad);
        $("#btnCancel_Actividad").attr("data-ctrl-no-actividad", ctrlNoActividad);
        //gDact(idCtrlAccion, ctrlNoActividad.substring(8));
        gDactById(idCtrlActividad, 1);
        $("#modalActividadForm").modal("show");
        $("#divInsertMeta").hide();
        $("#divUpdateMeta").show();
    });

    $(document).on("click", "#btnCancel_Actividad", function () {
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var ctrlNoActividad = $(this)[0].dataset.ctrlNoActividad;
        $("#btnS_Actividad").attr("data-ctrl-actividad", 0);
        clearForms(6);
        //gDact(idReturn, ctrlNoActividad.substring(0, 8));
        $("#modalActividadForm").modal("hide");
    });

    $(document).on("change", "#cboImpactoFin", function () {
        var selectedValue = $(this).val();
        logger.info(parseInt($("#impactoLocal").text()));
        if (parseInt($("#impactoLocal").text()) > selectedValue) {
            showMsg("No puede ingresar un valor de impacto menor al inicial", 'error');
            $(this).val(0);
        }
    });

    $(document).on("change", "#cboProbabilidadFin", function () {
        var selectedValue = $(this).val();
        logger.info(parseInt($("#probabilidadLocal").text()));
        if (parseInt($("#probabilidadLocal").text()) > selectedValue) {
            showMsg("No puede ingresar un valor de probabilidad menor al inicial", 'error');
            $(this).val(0);
        }
    });

    $(document).on("change", "#cboEfiscal", function () {
        var selectedValue = $(this).val();
        gDfCos(selectedValue)
    });

    $(document).on("change", "#cboOs", function () {
        var selectedValue = $(this).val();
        gDfCup(cveEfiscald, selectedValue, 'cambio')
    });

    $(document).on("change", "#cboProceso", function () {
        var selectedValue = $(this).val();
        if (selectedValue === undefined || selectedValue === "") {
            $("#txtOSProceso").val("");
            $("#txtUPProceso").val("");
        } else if (selectedValue === 0 || selectedValue === "0") {
            var cveOS = $("#cboOs").val();
            var cveUP = $("#cboUp").val();
            var eFiscal = $("#cboEfiscal").val();
            const initialOk = verifyInitialDataOUE(cveOS, cveUP, eFiscal);
            if (!initialOk) return;
            $("#txtOSProceso").val(cveOS);
            $("#txtUPProceso").val(cveUP);
        } else {
            gDpr(selectedValue, $("#cboOs").val(), $("#cboUp").val());
        }
    });

    $(document).on("change", "#cboImpactoInicio, #cboProbabilidadInicio, #cboImpactoFin, #cboProbabilidadFin", function () {
        const grupo = $(this).data("grupo");
        setValores(grupo);
    });

    $(document).on("change", "#cboMes", function () {
        var selectedValue = $(this).val();
        if (selectedValue >= 1 && selectedValue <= 3) {
            $("#cboTrimestre").val(1);
        } else if (selectedValue >= 4 && selectedValue <= 6) {
            $("#cboTrimestre").val(2);
        } else if (selectedValue >= 7 && selectedValue <= 9) {
            $("#cboTrimestre").val(3);
        } else if (selectedValue >= 10 && selectedValue <= 12) {
            $("#cboTrimestre").val(4);
        } else {
            $("#cboTrimestre").val(0);
        }
    });

    $(document).on("click", "#btnGetMatriz", function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (cveOS === 0 && cveUP === 0 || cveOS === '0' && cveUP === '0' || cveOS === "null" && cveUP === "null" || cveOS === null && cveUP === null) {
            showMsg('Espere a obtener más datos...', 'alert');
            return;
        } else {
            fetchDataArr(72, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 0, function (response) {
                if (response) {
                    logger.error("RESPUESTA DATOS PERSONAS REPORTE: ", response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            gDma(cveOS, cveUP, eFiscal);
                        } else {
                            showMsg('Favor de ir a la pantalla de Control de Datos Reporte, y registre los encabezados. De lo contrario, no podrá continuar.', 'alert');
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            });
        }
    });

    $(document).on("click", "#btnGetPtar", function () {
        var configVal = $(this)[0].dataset.ctrlValidate;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (cveOS === 0 && cveUP === 0 || cveOS === '0' && cveUP === '0' || cveOS === "null" && cveUP === "null" || cveOS === null && cveUP === null) {
            showMsg('Espere a obtener más datos...', 'alert');
            return;
        } else {
            fetchDataArr(72, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 0, function (response) {
                if (response) {
                    logger.error("RESPUESTA DATOS PERSONAS REPORTE: ", response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            getPtar(cveOS, cveUP, eFiscal);
                        } else {
                            showMsg('Favor de ir a la pantalla de Control de Datos Reporte, y registre los encabezados. De lo contrario, no podrá continuar.', 'alert');
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            });
        }
    });

    $(document).on("click", "#btnGetMapa", function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (cveOS === 0 && cveUP === 0 || cveOS === '0' && cveUP === '0' || cveOS === "null" && cveUP === "null" || cveOS === null && cveUP === null) {
            showMsg('Espere a obtener más datos...', 'alert');
            return;
        } else {
            fetchDataArr(72, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 0, function (response) {
                if (response) {
                    logger.error("RESPUESTA DATOS PERSONAS REPORTE: ", response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            gDch(cveOS, cveUP, 'printPage', 'null', 0, eFiscal);
                        } else {
                            showMsg('Favor de ir a la pantalla de Control de Datos Reporte, y registre los encabezados. De lo contrario, no podrá continuar.', 'alert');
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            });
        }
    });

    $(document).on("click", "#btnGetConcentrado", function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (cveOS === 0 && cveUP === 0 || cveOS === '0' && cveUP === '0' || cveOS === "null" && cveUP === "null" || cveOS === null && cveUP === null) {
            showMsg('Espere a obtener más datos...', 'alert');
            return;
        } else {
            fetchDataArr(72, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 0, function (response) {
                if (response) {
                    logger.error("RESPUESTA DATOS PERSONAS REPORTE: ", response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            gDcon(cveOS, cveUP, eFiscal);
                        } else {
                            showMsg('Favor de ir a la pantalla de Control de Datos Reporte, y registre los encabezados. De lo contrario, no podrá continuar.', 'alert');
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            });
        }
    });

    $(document).on("click", "#btnSendToValidate", function (event) {
        event.preventDefault(); // importante mantenerlo para detener navegación u otras acciones
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (cveOS === 0 && cveUP === 0 || cveOS === '0' && cveUP === '0' || cveOS === "null" && cveUP === "null" || cveOS === null && cveUP === null) {
            showMsg('Espere a obtener más datos...', 'alert');
            return;
        }

        fetchDataArr(72, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 0, async function (response) {
            if (response) {
                logger.error("RESPUESTA DATOS PERSONAS REPORTE: ", response);
                if (response !== 'error') {
                    if (response.length !== 0) {
                        const confirm = await alertConfirmMessage('¿Está seguro de enviar su información a validación?');
                        if (!confirm) {
                            return
                        } else {
                            fetchDataArr(52, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: 0 }, 0, function (response) {
                                if (response) {
                                    logger.log("RESPUESTA DE ENVIO A VALIDACION DE RIESGOS", response);
                                    if (response !== 'error') {
                                        const algunoFallaFactor = response.some(item => item.NUM_FACTORES === 0);
                                        const algunoFallaControl = response.some(item => item.NUM_CONTROLES === 0);
                                        const algunoFallaAccion = response.some(item => item.NUM_ACCIONES === 0);
                                        const algunoFallaActividad = response.some(item => item.NUM_ACTIVIDADES === 0);
                                        const algunaObservacion = response.some(item => item.NUM_OBSERVACIONES !== 0);
                                        const sinMetaProgramada = response.some(item => item.META_PROGRAMA === 0);

                                        const algunaNoValidada = response.some(item => item.SN_VALIDA === null && item.SN_ENVIADO === true);
                                        const idCtrlRiesgos = response.filter(item => item.ID_CTRL_RIESGO !== 0 && (item.SN_VALIDA === false || item.SN_VALIDA === null)).map(item => item.ID_CTRL_RIESGO).join('|');

                                        if (algunaNoValidada) {
                                            showMsg(`Antes de continuar con el envio, necesita esperar a que validen o rechazen los demas riesgos enviados.`, 'info');
                                            return;
                                        }

                                        if (sinMetaProgramada) {
                                            showMsg(`Al parecer no ha establecido sus metas, verifique de favor.`, 'info');
                                            return;
                                        }

                                        if (algunoFallaFactor || algunoFallaControl || algunoFallaAccion || algunoFallaActividad) {
                                            showMsg(`Esta intentando enviar información incompleta. Verifique de favor antes de enviar.`, 'info');
                                            return;
                                        } else {
                                            if (algunaObservacion) {
                                                showMsg("No puede continuar con el envio, hasta que solvente sus observaciones.", 'error');
                                                return;
                                            } else {
                                                logger.log("Enviando información a validación");
                                                uPri3(cveOS, cveUP, idCtrlRiesgos);
                                            }
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
                    } else {
                        showMsg('Favor de ir a la pantalla de Control de Datos Reporte, y registre los encabezados. De lo contrario, no podrá continuar.', 'alert');
                        return;
                    }
                } else {
                    return;
                }
            } else {
                return;
            }
        });
    });

    $(document).on("click", ".btnSolventarObser", async function (event) {
        var idReturn1 = $(this)[0].dataset.ctrlObservacion;
        var idReturn2 = $(this)[0].dataset.ctrlRiesgo;
        const confirm = await alertConfirmMessage('¿Está seguro de solventar su observación?');
        if (!confirm) {
            return
        } else {
            if (idReturn1 !== 0) {
                fetchDataArr(55, { _idCtrlObservacion: idReturn1, _idCtrlRiesgo: idReturn2 }, 0, function (response) {
                    if (response) {
                        logger.log("Respuesta a UPDATE OBSERVACION:", response);
                        if (response === 'ok') {
                            gDob(idReturn2);
                            //gDno();
                            //$("#modalObservacionesReporte").modal("hide");
                        } else {
                            showMsg("Ocurrió un error al obtener los datos.", 'error');
                            return;
                        }
                    } else {
                        showMsg("Error al obtener información...", 'error');
                    }
                });
            } else {
                showMsg("Ocurrió un error al obtener los datos de la observación.", 'error');
                return;
            }
        }
    });

    $(document).on("change", "#cboMes2", function () {
        crearTextboxes();
    });

    $(document).on("click", ".btnSeeResumen", function () {
        var idReturn1 = $(this)[0].dataset.ctrlAlineacion;
        var idReturn2 = $(this)[0].dataset.ctrlRiesgo;
        gRes(idReturn1);
    });

    $(document).on("click", "#btnS_FactorXControl", function () {
        var idReturn = $(this)[0].dataset.ctrlFactor;
        var numFolio = $(this)[0].dataset.ctrlFolio;
        var cboImpacto = $("#cboControlFactor").val();
        if (idReturn !== 0) {
            if (cboImpacto !== "" || cboImpacto !== "0" || cboImpacto !== 0) {
                fetchDataArr(60, { _idCtrlFactor: idReturn, _idControlFactor: cboImpacto }, 0, function (response) {
                    if (response) {
                        logger.warn("Datos recibidos a UPDATE FACTOR:", response);
                        if (response !== 'error') {
                            $('#modalFactorXControl').modal('hide');
                            //gDfa(idReturn);
                            gDco(idReturn, numFolio);
                        }
                    }
                });

            } else {
                showMsg("Elija si se controla el factor, antes de continuar con la inserción de controles.", 'error');
                return;
            }
        } else {
            showMsg("Ocurrio un error al obtener información extra del riesgo", 'error');
            return;
        }
    });

    $(document).on("change", "#cboControlDocumentado, #cboControlFormalizado, #cboControlAplica, #cboControlEfectivo", function () {
        const id01 = $("#cboControlDocumentado").val();
        const id02 = $("#cboControlFormalizado").val();
        const id03 = $("#cboControlAplica").val();
        const id04 = $("#cboControlEfectivo").val();
        const arrSelects = [{ SELECT: id01 }, { SELECT: id02 }, { SELECT: id03 }, { SELECT: id04 }]
        //const algunoFalla = arrSelects.some(item => item.SELECT === '1');
        const algunoFalla = arrSelects.filter(item => item.SELECT === '1');
        logger.info(arrSelects);
        logger.error(algunoFalla);
        if (algunoFalla.length === 4) {
            $("#cboDeterminacion").val(1);
        } else {
            $("#cboDeterminacion").val(2);
        }
    });

    $(document).on("click", "#btnU_Control", function () {
        var idReturn = $(this)[0].dataset.ctrlFactor;
        var idReturn2 = $(this)[0].dataset.ctrlRiesgo;
        var idReturn3 = $(this)[0].dataset.ctrlFolio;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (cveOS === 0 && cveUP === 0 || cveOS === '0' && cveUP === '0' || cveOS === "null" && cveUP === "null" || cveOS === null && cveUP === null) {
            showMsg('Espere a obtener más datos...', 'alert');
            return;
        }

        fetchDataArr(61, { _cveOS: cveOS, _cveUP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: idReturn2 }, 0, function (response) {
            if (response) {
                logger.warn("Datos devueltos sobre VALOR INICIAL", response)
                if (response !== 'error') {
                    if (response.length === 0) {
                        showMsg("No existen controles.", 'info');
                        return;
                    }
                    const algunoFalla = response.some(item => item.NUMofCONTROLS === 0);
                    if (algunoFalla) {
                        $('#modalControlXRiesgo').modal('hide');
                        const foliosFallidos = response.filter(item => item.NUMofCONTROLS === 0).map(item => item.FOLIO).join(', ');
                        showMsg("No puede evaluar el riesgo, porque los factores [" + foliosFallidos + "] no contienen sus respectivos controles, favor de revisar.", 'info');
                    } else {
                        showMsg("Continuando evaluacion riesgo.", 'info');
                        $("#btnS_ControlXRiesgo").attr("data-ctrl-riesgo", idReturn2);
                        $("#btnS_ControlXRiesgo").attr("data-ctrl-factor", idReturn);
                        $("#btnS_ControlXRiesgo").attr("data-ctrl-folio", idReturn3);
                        $('#modalControlXRiesgo').modal('show');
                    }
                } else {
                    showMsg("Ocurrió un error al mostrar resultados.", 'error');
                }
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", "#btnS_ControlXRiesgo", function () {
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        var idReturn2 = $(this)[0].dataset.ctrlFactor;
        var idReturn3 = $(this)[0].dataset.ctrlFolio;
        var cboControl = $("#cboControl").val();
        if (idReturn !== 0) {
            if (cboControl !== "" || cboControl !== "0") {
                fetchDataArr(62, { _idCtrlRiesgo: idReturn, _idControlRiesgo: cboControl }, 0, function (response) {
                    if (response) {
                        logger.warn("Datos recibidos a UPDATE RIESGO:", response);
                        if (response !== 'error') {
                            $('#modalControlXRiesgo').modal('hide');
                            gDfa(idReturn);
                            gDco(idReturn2, idReturn3);
                        }
                    }
                });

            } else {
                showMsg("Elija si se controla del reisgo, antes de continuar con la inserción de acciones.", 'error');
            }
        } else {
            showMsg("Ocurrio un error al obtener información extra del riesgo", 'error');
            return;
        }
    });

    $(document).on("click", "#btnS_AccionXRiesgo", function () {
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        var idReturn2 = $(this)[0].dataset.ctrlControl;
        var idReturn3 = $(this)[0].dataset.ctrlAccion;
        var cboEstrategia = $("#cboEstrategia").val();
        if (idReturn !== 0) {
            if (cboEstrategia !== "" || cboEstrategia !== "0") {
                fetchDataArr(63, { _idCtrlRiesgo: idReturn, _idEstrategia: cboEstrategia }, 0, function (response) {
                    if (response) {
                        logger.warn("Datos recibidos a UPDATE RIESGO:", response);
                        if (response !== 'error') {
                            $('#modalAccionXRiesgo').modal('hide');
                            gDac(idReturn2);
                        }
                    }
                });

            } else {
                showMsg("Elija la estrategia.", 'error');
            }
        } else {
            showMsg("Ocurrio un error al obtener información extra del riesgo", 'error');
            return;
        }
    });

    $(document).on("click", ".btnDeleteAlineacion", async function () {
        var idReturn = $(this)[0].dataset.ctrlAlineacion;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!verifyInitialDataOUE(cveOS, cveUP, eFiscal)) return;
        if (!await alertConfirmMessage('¿Confirma la eliminación de la alineación?')) return;
        checkDelete(cveOS, cveUP, eFiscal, 'ALINEACION', idReturn, 0, '')
    });

    $(document).on("click", ".btnDeleteRiesgo", async function () {
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        var idReturn2 = $(this)[0].dataset.ctrlAlineacion;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!verifyInitialDataOUE(cveOS, cveUP, eFiscal)) return;
        if (!await alertConfirmMessage('¿Confirma la eliminación del riesgo?')) return;
        checkDelete(cveOS, cveUP, eFiscal, 'RIESGO', idReturn, idReturn2, '');
    });

    $(document).on("click", ".btnDeleteFactor", async function () {
        var idReturn = $(this)[0].dataset.ctrlFactor;
        var idReturn2 = $(this)[0].dataset.ctrlRiesgo;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!verifyInitialDataOUE(cveOS, cveUP, eFiscal)) return;
        if (!await alertConfirmMessage('¿Confirma la eliminación del factor?')) return;
        checkDelete(cveOS, cveUP, eFiscal, 'FACTOR', idReturn, idReturn2, '');
    });


    $(document).on("click", ".btnDeleteControl", async function () {
        var idReturn = $(this)[0].dataset.ctrlControl;
        var idReturn2 = $(this)[0].dataset.ctrlFactor;
        var numControl = $(this)[0].dataset.ctrl1;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!verifyInitialDataOUE(cveOS, cveUP, eFiscal)) return;
        if (!await alertConfirmMessage('¿Confirma la eliminación del control?')) return;
        checkDelete(cveOS, cveUP, eFiscal, 'CONTROL', idReturn, idReturn2, numControl);
    });

    $(document).on("click", ".btnDeleteAccion", async function () {
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var idReturn2 = $(this)[0].dataset.ctrlControl;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!verifyInitialDataOUE(cveOS, cveUP, eFiscal)) return;
        if (!await alertConfirmMessage('¿Confirma la eliminación de la acción?')) return;
        checkDelete(cveOS, cveUP, eFiscal, 'ACCION', idReturn, idReturn2, '');
    });

    $(document).on("click", ".btnDeleteActividad", async function () {
        var idReturn = $(this)[0].dataset.ctrlActividad;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        var noActividad = $(this)[0].dataset.ctrlNoActividad;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!verifyInitialDataOUE(cveOS, cveUP, eFiscal)) return;
        if (!await alertConfirmMessage('¿Confirma la eliminación de la actividad?')) return;
        checkDelete(cveOS, cveUP, eFiscal, 'ACTIVIDAD', idReturn, idReturn2, noActividad);
    });

    $(document).on("click", ".btnSetObjetivosModal", function () {
        var idReturn = $(this)[0].dataset.ctrlAlineacion;
        var toEdit = $(this)[0].dataset.ctrlDe;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (!verifyInitialDataOUE(cveOS, cveUP, eFiscal)) return;
        fetchDataArr(73, {}, 0, function (response) {
            if (response) {
                logger.log("LLAMADA A CATALOGO SECTORIAL", response);
                $("#btnS_AlineacionObjetivo").attr("data-ctrl-alineacion", idReturn);
                $("#modalAlineacionObjetivo").modal("show");
                inicializarSistemaAlineacion(response, parseInt(toEdit));
            } else {
                showMsg("Ocurrio un error.", 'error');
            }
        });
    });

    $(document).on("click", ".btnDeleteObjetivoAccion", function () {
        var idReturn = $(this)[0].dataset.ctrlIdAl;
        var idReturn2 = $(this)[0].dataset.ctrlIdOb;
        var idReturn3 = $(this)[0].dataset.ctrlIdAc;
        logger.error(idReturn, idReturn2, idReturn3)
        fetchDataArr(77, { _idCtrlAlineacion: idReturn, _idCtrlData1: idReturn2, _idCtrlData2: idReturn3 }, 0, function (response) {
            if (response) {
                logger.log("RESPUESTA DELETE OBJETIVO POR ALINEACION: ", response);
                showMsg(response, 'info');
                gDoaaById(idReturn);
            } else {
                showMsg("Ocurrio un error.", 'error');
            }
        });
    });

    $(document).on("click", ".btnSeeObservaciones", function () {
        var idReturn = $(this)[0].dataset.ctrlRiesgo;
        gDob(idReturn);
        $("#modalObservacionesReporte").modal("show");
        // fetchDataArr(77, { _idCtrlAlineacion: idReturn, _idCtrlData1: idReturn2, _idCtrlData2: idReturn3 }, 0, function (response) {
        //     if (response) {
        //         logger.log("RESPUESTA DELETE OBJETIVO POR ALINEACION: ", response);
        //         showMsg(response, 'info');
        //         gDoaaById(idReturn);
        //     } else {
        //         showMsg("Ocurrio un error.", 'error');
        //     }
        // });
    });

    $(document).on("click", "#btnDeleteValorInicial", async function () {
        try {
            var idReturn = $(this)[0].dataset.ctrlRiesgo;
            if (!await alertConfirmMessage('¿Confirma la eliminación de los valores iniciales para el riesgo?')) return;
            uPri4(idReturn);
        } catch (error) {
            showMsg(error, 'error');
        }
    });
});

function clearForms(type) {
    if (type === 1) {
        $("#cboAlineacion").val(0);
        $("#txtAlineacion").val("");
        $("#txtNoFolio").val("");
    } else if (type === 2) {
        $("#cboProceso").val(0);
        $("#cboNivelRiesgo").val(0);
        $("#cboClasRiesgo").val(0);
        // $("#cboImpactoInicio").val(0);
        // $("#cboProbabilidadInicio").val(0);
        // $("#cboCuadranteInicio").val(0)
        // $("#cboEstrategia").val(0);
        // $("#cboControl").val(0);
        // $("#cboImpactoFin").val(0);
        // $("#cboProbabilidadFin").val(0);
        // $("#cboCuadranteFin").val(0)
        $("#txtOSProceso").val("");
        $("#txtUPProceso").val("");
        // $("#txtNoFolio").val("");
        $("#txtRiesgo").val("");
        //$("#txtPosibleRiesgo").val("");
    } else if (type === 3) {
        $("#cboClasFactor").val(0);
        $("#cboControlFactor").val(0);
        $("#cboTipoFactor").val(0);
        $("#txtFolioFactor").val("");
        $("#txtFactorRiesgo").val("");
        $("#txtPosibleRiesgo").val("");
    } else if (type === 4) {
        $("#cboTipoControl").val(0);
        $("#cboDeterminacion").val(0);
        $("#cboControlDocumentado").val(0);
        $("#cboControlFormalizado").val(0);
        $("#cboControlAplica").val(0);
        $("#cboControlEfectivo").val(0);
        $("#txtDescControlFactor").val("");
    } else if (type === 5) {
        $("#txtDescAccion").val("");
    } else if (type === 6) {
        $("#txtDescActividad").val("");
        $("#cboResponsable").val(0);
        //$("#cboMes").val(0);
        //$("#cboMes2").val([]);
        $('#cboMes2').select2("val", "");
        $('#cboMes2').val("");
        $('#select2-cboMes2-container').text("");
        $("#cboTrimestre").val(0);
        $("#txtNoMeta").val(0);
        $("#txtEvidencia").val("");
    }
}

function setValores(grupo) {
    const impacto = parseInt($(`#cboImpacto${grupo}`).val()) || 0;
    const probabilidad = parseInt($(`#cboProbabilidad${grupo}`).val()) || 0;

    calCuadrante(probabilidad, impacto, `#cboCuadrante${grupo}`);
}

function calCuadrante(probabilidad, impacto, idCuadrante) {
    let cuadrante = '';

    if (probabilidad > 5 && impacto > 5) {
        cuadrante = 1;
    } else if (probabilidad > 5 && impacto >= 1 && impacto <= 5) {
        cuadrante = 2;
    } else if (probabilidad >= 1 && probabilidad <= 5 && impacto >= 1 && impacto <= 5) {
        cuadrante = 3;
    } else if (probabilidad >= 1 && probabilidad <= 5 && impacto > 5) {
        cuadrante = 4;
    } else {
        cuadrante = 0;
    }

    $(idCuadrante).val(cuadrante);
}

function validarFormularioRiesgo() {
    let esValido = true;

    const txtRiesgo = $("#txtRiesgo").val().trim();
    if (txtRiesgo === "") {
        showMsgForm("txtRiesgo", "Ingrese la descripción del riesgo.", "error");
        esValido = false;
    }

    // const txtPosibleRiesgo = $("#txtPosibleRiesgo").val().trim();
    // if (txtPosibleRiesgo === "") {
    //     showMsgForm("txtPosibleRiesgo", "Ingrese su posible efecto de riesgo.", "error");
    //     esValido = false;
    // }

    const cboProceso = $("#cboProceso").val();
    if (cboProceso === "") {
        showMsgForm("cboProceso", "Elija un proceso.", "error");
        esValido = false;
    }

    const cboNivelRiesgo = $("#cboNivelRiesgo").val();
    if (cboNivelRiesgo === "" || cboNivelRiesgo === "0") {
        showMsgForm("cboNivelRiesgo", "Elija un nivel de riesgo.", "error");
        esValido = false;
    }

    const cboClasRiesgo = $("#cboClasRiesgo").val();
    if (cboClasRiesgo === "" || cboClasRiesgo === "0") {
        showMsgForm("cboClasRiesgo", "Elija una clasificación de riesgo.", "error");
        esValido = false;
    }

    const txtOSProceso = $("#txtOSProceso").val().trim();
    if (txtOSProceso === "" || txtOSProceso.length !== 2) {
        showMsgForm("txtOSProceso", "No hay ningun valor para el organo superior responsable, elija su proceso de favor.", "error");
        esValido = false;
    }
    const txtUPProceso = $("#txtUPProceso").val().trim();
    if (txtUPProceso === "" || txtUPProceso.length !== 2) {
        showMsgForm("txtUPProceso", "No hay ningun valor para la unidad presupuestal responsable, elija su proceso de favor.", "error");
        esValido = false;
    }

    // const cboImpacto = $("#cboImpactoInicio").val();
    // if (cboImpacto === "" || cboImpacto === "0") {
    //     showMsgForm("cboImpacto", "Elija un impacto inicial para el riesgo.", "error");
    //     esValido = false;
    // }

    // const cboProbabilidad = $("#cboProbabilidadInicio").val();
    // if (cboProbabilidad === "" || cboProbabilidad === "0") {
    //     showMsgForm("cboProbabilidad", "Elija una probabilidad de ocurrencia inicial para el riesgo.", "error");
    //     esValido = false;
    // }

    // const cboCuadrante = $("#cboCuadranteInicio").val();
    // if (cboCuadrante === "" || cboCuadrante === "0") {
    //     showMsgForm("cboCuadrante", "Elija un cuadrante inicial para el riesgo.", "error");
    //     esValido = false;
    // }

    // const cboImpactoFin = $("#cboImpactoFin").val();
    // if (cboImpactoFin === "" || cboImpactoFin === "0") {
    //     showMsgForm("cboImpactoFin", "Elija un impacto final para el riesgo.", "error");
    //     esValido = false;
    // }

    // const cboProbabilidadFin = $("#cboProbabilidadFin").val();
    // if (cboProbabilidadFin === "" || cboProbabilidadFin === "0") {
    //     showMsgForm("cboProbabilidadFin", "Elija una probabilidad de ocurrencia final para el riesgo.", "error");
    //     esValido = false;
    // }

    // const cboCuadranteFin = $("#cboCuadranteFin").val();
    // if (cboCuadranteFin === "" || cboCuadranteFin === "0") {
    //     showMsgForm("cboCuadranteFin", "Elija un cuadrante final para el riesgo.", "error");
    //     esValido = false;
    // }

    // const cboControl = $("#cboControl").val();
    // if (cboControl === "" || cboControl === "0") {
    //     showMsgForm("cboControl", "Elija si el riesgo esta controlado o no.", "error");
    //     esValido = false;
    // }

    // const cboEstrategia = $("#cboEstrategia").val();
    // if (cboEstrategia === "" || cboEstrategia === "0") {
    //     showMsgForm("cboEstrategia", "Elija una estrategia para el riesgo.", "error");
    //     esValido = false;
    // }

    return esValido;
}

function validarFormularioFactor() {
    let esValido = true;

    const txtFolioFactor = $("#txtFolioFactor").val().trim();
    if (txtFolioFactor === "") {
        showMsgForm("txtFolioFactor", "Ocurrio un error con el folio, vuelve a ingresar desde un principio en los datos.", "error");
        esValido = false;
    }

    const txtFactorRiesgo = $("#txtFactorRiesgo").val().trim();
    if (txtFactorRiesgo === "") {
        showMsgForm("txtFactorRiesgo", "No puede ir vacio un factor de riesgo.", "error");
        esValido = false;
    }

    const cboClasFactor = $("#cboClasFactor").val();
    if (cboClasFactor === "" || cboClasFactor === "0") {
        showMsgForm("cboClasFactor", "Elija una clasificación para el factor.", "error");
        esValido = false;
    }

    // const cboControlFactor = $("#cboControlFactor").val();
    // if (cboControlFactor === "" || cboControlFactor === "0") {
    //     showMsgForm("cboControlFactor", "Elija un control para el factor.", "error");
    //     esValido = false;
    // }

    const cboTipoFactor = $("#cboTipoFactor").val();
    if (cboTipoFactor === "" || cboTipoFactor === "0") {
        showMsgForm("cboTipoFactor", "Elija un tipo de factor.", "error");
        esValido = false;
    }

    const txtPosibleRiesgo = $("#txtPosibleRiesgo").val().trim();
    if (txtPosibleRiesgo === "") {
        showMsgForm("txtPosibleRiesgo", "Ingrese su posible efecto de riesgo.", "error");
        esValido = false;
    }

    return esValido;
}

function validarFormularioControl() {
    let esValido = true;

    const txtFolioControlFactor = $("#txtFolioControlFactor").val().trim();
    if (txtFolioControlFactor === "") {
        showMsgForm("txtFolioControlFactor", "Ocurrio un error con el folio, vuelve a ingresar desde un principio en los datos.", "error");
        esValido = false;
    }

    const txtDescControlFactor = $("#txtDescControlFactor").val().trim();
    if (txtDescControlFactor === "") {
        showMsgForm("txtDescControlFactor", "No puede ir vacio la descripción del control.", "error");
        esValido = false;
    }

    const cboTipoControl = $("#cboTipoControl").val();
    if (cboTipoControl === "" || cboTipoControl === "0") {
        showMsgForm("cboTipoControl", "Elija un tipo de control.", "error");
        esValido = false;
    }

    const cboDeterminacion = $("#cboDeterminacion").val();
    if (cboDeterminacion === "" || cboDeterminacion === "0") {
        showMsgForm("cboDeterminacion", "Elija una determinacion para el control.", "error");
        esValido = false;
    }

    const cboControlDocumentado = $("#cboControlDocumentado").val();
    if (cboControlDocumentado === "" || cboControlDocumentado === "0") {
        showMsgForm("cboControlDocumentado", "Elija entre si y no, si está documentado el control.", "error");
        esValido = false;
    }

    const cboControlFormalizado = $("#cboControlFormalizado").val();
    if (cboControlFormalizado === "" || cboControlFormalizado === "0") {
        showMsgForm("cboControlFormalizado", "Elija entre si y no, si está formalizado el control.", "error");
        esValido = false;
    }

    const cboControlAplica = $("#cboControlAplica").val();
    if (cboControlAplica === "" || cboControlAplica === "0") {
        showMsgForm("cboControlAplica", "Elija entre si y no, si aplica el control.", "error");
        esValido = false;
    }

    const cboControlEfectivo = $("#cboControlEfectivo").val();
    if (cboControlEfectivo === "" || cboControlEfectivo === "0") {
        showMsgForm("cboControlEfectivo", "Elija entre si y no, si es efectivo el control.", "error");
        esValido = false;
    }

    return esValido;
}

function validarFormularioAccion() {
    let esValido = true;

    const txtDescAccion = $("#txtDescAccion").val().trim();
    if (txtDescAccion === "") {
        showMsgForm("txtDescAccion", "Describa su nueva acción.", "error");
        esValido = false;
    }

    return esValido;
}

function validarFormularioActividad() {
    let esValido = true;

    // const txtResponsableActividad = $("#txtResponsableActividad").val().trim();
    // if (txtResponsableActividad === "") {
    //     showMsgForm("txtResponsableActividad", "Ingrese el responsable de la actividad.", "error");
    //     esValido = false;
    // }

    const cboResponsable = $("#cboResponsable").val();
    if (cboResponsable === "" || cboResponsable === "0") {
        showMsgForm("cboResponsable", "Elija un responsable para la actividad.", "error");
        esValido = false;
    }

    const txtDescActividad = $("#txtDescActividad").val().trim();
    if (txtDescActividad === "") {
        showMsgForm("txtDescActividad", "Ingrese la descripción de la actividad.", "error");
        esValido = false;
    }

    const txtNoActividad = $("#txtNoActividad").val().trim();
    if (txtNoActividad === "") {
        showMsgForm("txtNoActividad", "Ocurrio un error con obtener el número de actividad.", "error");
        esValido = false;
    }

    // const cboTrimestre = $("#cboTrimestre").val();
    // if (cboTrimestre === "" || cboTrimestre === "0") {
    //     showMsgForm("cboTrimestre", "Elija el trimestre de la actividad.", "error");
    //     esValido = false;
    // }

    // const cboMes = $("#cboMes").val();
    // if (cboMes === "" || cboMes === "0") {
    //     showMsgForm("cboMes", "Elija un mes.", "error");
    //     esValido = false;
    // }

    const cboMes2 = $("#cboMes2").val();
    if (cboMes2.length === 0) {
        showMsgForm("cboMes2", "Elija sus meses a reportar.", "error");
        esValido = false;
    }

    // const txtNoMeta = $("#txtNoMeta").val().trim();
    // if (txtNoMeta === "") {
    //     showMsgForm("txtNoMeta", "Ocurrio un error con obtener el número de actividad.", "error");
    //     esValido = false;
    // }

    const txtEvidencia = $("#txtEvidencia").val().trim();
    if (txtEvidencia === "") {
        showMsgForm("txtEvidencia", "Ingrese la descripción de las evidencias que cargara posteriormente.", "error");
        esValido = false;
    }

    // const cboTipoReporte = $("#cboTipoReporte").val();
    // if (cboTipoReporte === "" || cboTipoReporte === "0") {
    //     showMsgForm("cboTipoReporte", "Elija el tipo de reporte.", "error");
    //     esValido = false;
    // }

    return esValido;
}

function validarFormularioAlineacion() {
    let esValido = true;

    const cboAlineacion = $("#cboAlineacion").val();
    if (cboAlineacion === "" || cboAlineacion === "0") {
        showMsgForm("cboAlineacion", "Seleccione una alineación.", "error");
        esValido = false;
    }

    const txtAlineacion = $("#txtAlineacion").val().trim();
    if (txtAlineacion === "") {
        showMsgForm("txtAlineacion", "Ingrese la descripción de la alineación.", "error");
        esValido = false;
    }

    const cboEfiscal = $("#cboEfiscal").val();
    if (cboEfiscal === "" || cboEfiscal === "0") {
        showMsgForm("cboEfiscal", "Seleccione el año fiscal.", "error");
        esValido = false;
    }

    const txtNoFolio = $("#txtNoFolio").val().trim();
    if (txtNoFolio === "") {
        showMsgForm("txtNoFolio", "No hay ningun valor para el número de riesgo, elija su proceso de favor.", "error");
        esValido = false;
    }

    const cboOs = $("#cboOs").val();
    if (cboOs === "" || cboOs === "0") {
        showMsgForm("cboOs", "El organo superior esta vacio, espere a que cargue los datos", "error");
        esValido = false;
    }

    const cboUp = $("#cboUp").val();
    if (cboUp === "" || cboUp === "0") {
        showMsgForm("cboUp", "La unidad presupuestal esta vacio, espere a que cargue los datos.", "error");
        esValido = false;
    }

    return esValido;
}

function validarFormularioValoresInicial() {
    let esValido = true;

    // const txtPosibleRiesgo = $("#txtPosibleRiesgo").val().trim();
    // if (txtPosibleRiesgo === "") {
    //     showMsgForm("txtPosibleRiesgo", "Ingrese su posible efecto de riesgo.", "error");
    //     esValido = false;
    // }

    const cboImpacto = $("#cboImpactoInicio").val();
    if (cboImpacto === "" || cboImpacto === "0") {
        showMsgForm("cboImpacto", "Elija un impacto inicial para el riesgo.", "error");
        esValido = false;
    }

    const cboProbabilidad = $("#cboProbabilidadInicio").val();
    if (cboProbabilidad === "" || cboProbabilidad === "0") {
        showMsgForm("cboProbabilidad", "Elija una probabilidad de ocurrencia inicial para el riesgo.", "error");
        esValido = false;
    }

    const cboCuadrante = $("#cboCuadranteInicio").val();
    if (cboCuadrante === "" || cboCuadrante === "0") {
        showMsgForm("cboCuadrante", "Elija un cuadrante inicial para el riesgo.", "error");
        esValido = false;
    }

    return esValido;
}

function validarFormularioValoresFinal() {
    let esValido = true;

    const cboImpactoFin = $("#cboImpactoFin").val();
    if (cboImpactoFin === "" || cboImpactoFin === "0") {
        showMsgForm("cboImpactoFin", "Elija un impacto final para el riesgo.", "error");
        esValido = false;
    }

    const cboProbabilidadFin = $("#cboProbabilidadFin").val();
    if (cboProbabilidadFin === "" || cboProbabilidadFin === "0") {
        showMsgForm("cboProbabilidadFin", "Elija una probabilidad de ocurrencia final para el riesgo.", "error");
        esValido = false;
    }

    const cboCuadranteFin = $("#cboCuadranteFin").val();
    if (cboCuadranteFin === "" || cboCuadranteFin === "0") {
        showMsgForm("cboCuadranteFin", "Elija un cuadrante final para el riesgo.", "error");
        esValido = false;
    }

    // const cboControl = $("#cboControl").val();
    // if (cboControl === "" || cboControl === "0") {
    //     showMsgForm("cboControl", "Elija si el riesgo esta controlado o no.", "error");
    //     esValido = false;
    // }

    // const cboEstrategia = $("#cboEstrategia").val();
    // if (cboEstrategia === "" || cboEstrategia === "0") {
    //     showMsgForm("cboEstrategia", "Elija una estrategia para el riesgo.", "error");
    //     esValido = false;
    // }

    return esValido;
}

var gDfCefiscal = function () {
    fetchDataArr(1, {}, 0, function (response) {
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
        } else {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var gDfCos = function (txtEfiscal) {
    fetchDataArr(2, { _txtEfiscal: txtEfiscal }, 0, function (response) {
        if (response) {
            const datos = JSON.parse(response);
            const select = $("#cboOs");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            datos.forEach(function (item) {
                select.append($("<option>", {
                    value: item.Cve_Organo_Superior,
                    text: item.Txt_Organo_Superior
                }));
            });
            select.val(cveOSd);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    })
}

var gDfCup = function (txtEfiscal, txtOS, tipo) {
    fetchDataArr(3, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 0, function (response) {
        if (response) {
            const datos = JSON.parse(response);
            const select = $("#cboUp");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            datos.forEach(function (item) {
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
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    })
}

var gDfCalineacion = function () {
    fetchDataArr(4, {}, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a combo ALINEACION:", response);
            const select = $("#cboAlineacion");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_ALINEACION,
                    text: item.DESC_ALINEACION
                }));
            });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var getDataProcesoCombo = function (id, OS, UP, __eFiscal) {
    fetchDataArr(6, { _OS: OS, _UP: UP, _eFiscal: __eFiscal }, 0, function (response) {
        if (response) {
            const select = $("#cboProceso");
            select.empty();
            select.append($("<option>", {
                value: "",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ProcesoID,
                    text: item.NombreProceso
                }));
            });
            // if (id !== 0) {
            //     select.val(id);
            //     select.attr("disabled", true)
            // } else {
            //     select.val(0);
            //     select.removeAttr("disabled");
            // }
        }
    });
}

var gDfCnivelRiesgo = function (id) {
    fetchDataArr(7, {}, 0, function (response) {
        if (response) {
            const select = $("#cboNivelRiesgo");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_NIVEL_RIESGO,
                    text: item.DESC_NIVEL_RIESGO
                }));
            });
        }
    });
}

var gDfCclasificacionRiesgo = function (id) {
    fetchDataArr(8, {}, 0, function (response) {
        if (response) {
            const select = $("#cboClasRiesgo");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CLAS_RIESGO,
                    text: item.DESC_CLAS_RIESGO
                }));
            });
        }
    });
}

var gDfCimpacto = function (id) {
    fetchDataArr(9, {}, 0, function (response) {
        if (response) {
            const select = $("#cboImpactoInicio");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_IMPACTO,
                    text: item.VALOR_IMPACTO
                }));
            });
        }
    });
}

var gDfCprobabilidad = function (id) {
    fetchDataArr(10, {}, 0, function (response) {
        if (response) {
            const select = $("#cboProbabilidadInicio");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_PROBABILIDAD,
                    text: item.VALOR_PROBABILIDAD
                }));
            });
        }
    });
}

var gDfCcuadrante = function (id) {
    fetchDataArr(11, {}, 0, function (response) {
        if (response) {
            const select = $("#cboCuadranteInicio");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CUADRANTE,
                    text: item.DESC_CUADRANTE
                }));
            });
        }
    });
}

var gDfCestrategia = function (id) {
    fetchDataArr(12, {}, 0, function (response) {
        if (response) {
            const select = $("#cboEstrategia");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_ESTRATEGIA,
                    text: item.DESC_ESTRATEGIA
                }));
            });
        }
    });
}

var gDfCcontrol = function (id) {
    fetchDataArr(13, {}, 0, function (response) {
        if (response) {
            const select = $("#cboControl");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CONTROL,
                    text: item.DESC_CONTROL
                }));
            });
        }
    });
}

var gDfCimpactoFin = function (id) {
    fetchDataArr(9, {}, 0, function (response) {
        if (response) {
            const select = $("#cboImpactoFin");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_IMPACTO,
                    text: item.VALOR_IMPACTO
                }));
            });
        }
    });
}

var gDfCprobabilidadFin = function (id) {
    fetchDataArr(10, {}, 0, function (response) {
        if (response) {
            const select = $("#cboProbabilidadFin");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_PROBABILIDAD,
                    text: item.VALOR_PROBABILIDAD
                }));
            });
        }
    });
}

var gDfCcuadranteFin = function (id) {
    fetchDataArr(11, {}, 0, function (response) {
        if (response) {
            const select = $("#cboCuadranteFin");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CUADRANTE,
                    text: item.DESC_CUADRANTE
                }));
            });
        }
    });
}

var gDfCclasificacionFactor = function (id) {
    fetchDataArr(17, {}, 0, function (response) {
        if (response) {
            const select = $("#cboClasFactor");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CLAS_FACTOR,
                    text: item.DESC_CLAS_FACTOR
                }));
            });
        }
    });
}

var gDfCcontrolFactor = function (id) {
    fetchDataArr(13, {}, 0, function (response) {
        if (response) {
            const select = $("#cboControlFactor");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CONTROL,
                    text: item.DESC_CONTROL
                }));
            });
        }
    });
}

var gDfCtipoFactor = function (id) {
    fetchDataArr(18, {}, 0, function (response) {
        if (response) {
            const select = $("#cboTipoFactor");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_TIPO_FACTOR,
                    text: item.DESC_TIPO_FACTOR
                }));
            });
        }
    });
}

var gDfCtipoControl = function (id) {
    fetchDataArr(23, {}, 0, function (response) {
        if (response) {
            const select = $("#cboTipoControl");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_TIPO_CONTROL,
                    text: item.DESC_TIPO_CONTROL
                }));
            });
        }
    });
}

var gDfCdeterminacion = function (id) {
    fetchDataArr(24, {}, 0, function (response) {
        if (response) {
            const select = $("#cboDeterminacion");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_DETERMINACION,
                    text: item.DESC_DETERMINACION
                }));
            });
        }
    });
}

var gDfCctrl01 = function (id) {
    fetchDataArr(13, {}, 0, function (response) {
        if (response) {
            const select = $("#cboControlDocumentado");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CONTROL,
                    text: item.DESC_CONTROL
                }));
            });
        }
    });
}

var gDfCctrl02 = function (id) {
    fetchDataArr(13, {}, 0, function (response) {
        if (response) {
            const select = $("#cboControlFormalizado");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CONTROL,
                    text: item.DESC_CONTROL
                }));
            });
        }
    });
}

var gDfCctrl03 = function (id) {
    fetchDataArr(13, {}, 0, function (response) {
        if (response) {
            const select = $("#cboControlAplica");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CONTROL,
                    text: item.DESC_CONTROL
                }));
            });
        }
    });
}

var gDfCctrl04 = function (id) {
    fetchDataArr(13, {}, 0, function (response) {
        if (response) {
            const select = $("#cboControlEfectivo");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_CONTROL,
                    text: item.DESC_CONTROL
                }));
            });
        }
    });
}

var gDfCresponsable = function (id, OS, UP) {
    fetchDataArr(42, { _OS: OS, _UP: UP }, 0, function (response) {
        if (response) {
            logger.log("RESPONSABLES", response)
            const select = $("#cboResponsable");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_RESPONSABLE,
                    text: item.NOMBRE_RESPONSABLE
                }));
            });
        }
    });
}

var gDfCmeses = function (id) {
    fetchDataArr(43, {}, 0, function (response) {
        if (response) {
            logger.log("Datos recibidos a combo MESES:", response);
            // const select = $("#cboMes");
            // select.empty();
            // select.append($("<option>", {
            //     value: "0",
            //     text: "SELECCIONE"
            // }));
            const select2 = $("#cboMes2");
            select2.empty();
            // select2.append($("<option>", {
            //     value: "0",
            //     text: "SELECCIONE"
            // }));
            response.forEach(function (item) {
                // select.append($("<option>", {
                //     value: item.ID_MES,
                //     text: item.DESC_MES
                // }));
                select2.append($("<option>", {
                    value: item.ID_MES,
                    text: item.DESC_MES
                }));
            });
        }
    });
}

var gDfCtrimestre = function (id) {
    fetchDataArr(31, {}, 0, function (response) {
        if (response) {
            const select = $("#cboTrimestre");
            select.empty();
            select.append($("<option>", {
                value: "0",
                text: "SELECCIONE"
            }));
            response.forEach(function (item) {
                select.append($("<option>", {
                    value: item.ID_TRIMESTRE,
                    text: item.DESC_TRIMESTRE
                }));
            });
        }
    });
}

function crearTextboxes() {
    const selectMeses = document.getElementById('cboMes2');
    const contenedor = document.getElementById('contenedorTextboxes');

    mesesSeleccionados = Array.from(selectMeses.selectedOptions)
        .filter(option => option.value !== "")
        .map(option => ({
            valor: option.value,
            nombre: option.text
        }));

    contenedor.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row g-0';

    mesesSeleccionados.forEach(mes => {
        const div = document.createElement('div');
        div.className = 'col-3 mb-2';

        const label = document.createElement('label');
        label.textContent = `${mes.nombre}: `;
        label.htmlFor = `txtMes_${mes.valor}`;

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `txtMes_${mes.valor}`;
        input.className = 'form-control form-control-sm disabled';
        input.setAttribute("disabled", true)
        input.placeholder = 'Ingrese el valor a programar';
        input.dataset.mesValor = mes.valor;
        input.value = 100

        div.appendChild(label);
        div.appendChild(input);
        row.appendChild(div);
        contenedor.appendChild(row);
    });
}

function obtenerValores() {
    const inputs = document.querySelectorAll('#contenedorTextboxes input[type="number"]');
    const valores = [];

    inputs.forEach(input => {
        valores.push({
            mes: input.dataset.mesValor,
            nombre: mesesSeleccionados.find(m => m.valor === input.dataset.mesValor)?.nombre || '',
            valor: input.value ? parseFloat(input.value) : 0
        });
    });

    logger.log('Valores obtenidos:', valores);
    return valores;
}

function validarTextboxes() {
    const inputs = document.querySelectorAll('#contenedorTextboxes input[type="number"]');
    let hayVacios = false;
    let mensaje = "Los siguientes campos están vacíos:\n";

    inputs.forEach(input => {
        if (input.value.trim() === "" || input.value.trim() === 0 || input.value.trim() === "0") {
            hayVacios = true;
            const label = document.querySelector(`label[for="${input.id}"]`);
            const mes = label ? label.textContent.replace(':', '') : 'Mes desconocido';
            mensaje += `- ${mes}\n`;

            input.style.border = "2px solid red";
        } else {
            input.style.border = "";
        }
    });

    if (hayVacios) {
        Swal.fire({
            icon: 'error',
            title: 'Campos requeridos',
            text: 'Debes completar todos los valores',
            html: mensaje,
            confirmButtonText: 'Entendido'
        });
        return false;
    }
    return true;
}

function getNewChart() {
    var chartDom = document.getElementById('resumenRiesgos');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
        series: [{
            type: 'treemap',
            data: [{
                name: 'Alineación',
                value: 100,
                desc: 'Fortalecer las finanzas  y la hacienda pública estatal, para mantener una política fiscal  que contribuya a mejorar la distribución de los recursos públicos en beneficio de la sociedad hidalguense.',
                descShort: 'Fortalecimiento financiero',
                meta: {
                    Categoría: 'Financiero',
                    Impacto: 'Alto',
                    Probabilidad: 'Media',
                    'Fecha inicio': '2025-01-15',
                    Responsable: 'Hacienda'
                },
                children: [{
                    name: 'Riesgo 23.1',
                    value: 60,
                    desc: 'Sistemas de Información comprometidos críticamente por fallas y/o contingencias.',
                    meta: {
                        Estado: 'Crítico',
                        Responsable: 'TI'
                    },
                    children: [{
                        name: 'Factor: 23.1.1 - Infraestructura Tecnológica funcionando incorrectamente con relación a sus especificaciones técnicas por falta de mantenimiento preventivo y/o correctivo.',
                        value: 60,
                        desc: 'Infraestructura Tecnológica funcionando incorrectamente con relación a sus especificaciones técnicas por falta de mantenimiento.',
                        meta: {
                            Estado: 'Crítico',
                            Responsable: 'TI'
                        }
                    }, {
                        name: 'Factor: 23.1.2 - Los respaldos de bases de datos y código fuente son insuficientes o no están actualizados, lo que compromete la restauración de los sistemas de información en caso de fallas o desastres.',
                        value: 40,
                        desc: 'Los respaldos de base de datos y código interno son insuficientes o no están actualizados.',
                        meta: {
                            Estado: 'Alerta',
                            Responsable: 'Base de Datos'
                        }
                    }]
                }]
            }],
            label: {
                show: true,
                height: 10,
                formatter: function (params) {
                    return `{name|${params.name}}\n{value|${params.data.desc}}`;
                },
                rich: {
                    name: {
                        fontSize: 28,
                        fontWeight: 'bold'
                    },
                    value: {
                        fontSize: 20,
                        color: '#555'
                    }
                }
            },
            upperLabel: {
                show: true,
                height: 50,
                formatter: function (params) {
                    return `{title|${params.name}}\n{subtitle|${params.data.desc || ''}}`;
                },
                rich: {
                    title: {
                        fontSize: 26,
                        fontWeight: 'bold',
                        color: '#333'
                    },
                    subtitle: {
                        fontSize: 18,
                        color: '#666'
                    }
                }
            },
            levels: [
                {
                    itemStyle: {
                        borderColor: '#ddd',
                        borderWidth: 1,
                        gapWidth: 1
                    }
                },
                {
                    itemStyle: {
                        borderColor: '#ccc'
                    }
                }
            ]
        }],
        tooltip: {
            trigger: 'item',
            formatter: function (info) {
                const data = info.data;
                let tooltip = `<div style="font-weight:bold;margin-bottom:5px;width:500px">${info.name}</div>`;
                //tooltip += `<div>Valor: <strong>${data.value}</strong></div>`;

                if (data.desc) {
                    tooltip += `<div style="margin-top:8px;padding-top:8px;border-top:1px dashed #ccc">${data.desc}</div>`;
                }

                if (data.meta) {
                    tooltip += `<div style="margin-top:8px;color:#666">`;
                    Object.entries(data.meta).forEach(([key, val]) => {
                        tooltip += `<div><span style="display:inline-block;width:80px">${key}:</span> <strong>${val}</strong></div>`;
                    });
                    tooltip += `</div>`;
                }

                return tooltip;
            }
        },
    };
    myChart.setOption(option);
}

function gRes(idAlineacion) {
    fetchDataArr(59, { _idCtrlAlineacion: idAlineacion }, 0, function (response) {
        if (response) {
            logger.log("Llamada a resumen de la alineación", response)
            $("#divResumen").html(response);
            $("#modalResumen").modal("show");
        } else {
            $("#modalResumen").modal("hide");
        }
    });
}

function renderizarCheckboxesAlineacion(datosConsulta) {
    const selecciones = {
        objetivos: [],
        acciones: []
    };

    const contenedor = document.getElementById('contenedorCheckboxes');
    if (!contenedor) {
        logger.error('No se encontró el contenedor con id "contenedorCheckboxes"');
        return selecciones;
    }

    contenedor.innerHTML = '';

    const objetivosAgrupados = agruparPorObjetivo(datosConsulta);

    objetivosAgrupados.forEach(objetivo => {
        const cardObjetivo = crearCardObjetivo(objetivo);
        contenedor.appendChild(cardObjetivo);
    });

    configurarEventListeners(selecciones);

    return selecciones;
}

function agruparPorObjetivo(datos) {
    const agrupados = {};

    datos.forEach(fila => {
        const idObjetivo = fila.ID_OBJETIVO_SECTORIAL;

        if (!agrupados[idObjetivo]) {
            agrupados[idObjetivo] = {
                ID_OBJETIVO_SECTORIAL: idObjetivo,
                NO: fila.NO,
                DESC_OBJETIVO_SECTORIAL: fila.DESC_OBJETIVO_SECTORIAL,
                SN_ACTIVO: fila.SN_ACTIVO,
                acciones: []
            };
        }

        agrupados[idObjetivo].acciones.push({
            ID_ACCION_SECTORIAL: fila.ID_ACCION_SECTORIAL,
            NO: fila.NO1, // Asumiendo que la columna se llama así
            DESC_ACCION_SECTORIAL: fila.DESC_ACCION_SECTORIAL,
            SN_ACTIVO: fila.SN_ACTIVO_ACCION // Asumiendo que la columna se llama así
        });
    });

    return Object.values(agrupados);
}

function crearCardObjetivo(objetivo) {
    const card = document.createElement('div');
    card.className = 'card-objetivo';
    card.innerHTML = `
        <div class="objetivo-header">
        <div class="form-check">
            <input type="checkbox" 
                   id="obj_${objetivo.ID_OBJETIVO_SECTORIAL}" 
                   class="checkbox-objetivo form-check-input" 
                   data-id="${objetivo.ID_OBJETIVO_SECTORIAL}">
            <label for="obj_${objetivo.ID_OBJETIVO_SECTORIAL}" class="form-check-label">
                <strong>Objetivo ${objetivo.NO}:</strong> ${objetivo.DESC_OBJETIVO_SECTORIAL}
            </label>
        </div>
        </div>
        <div class="acciones-container" id="acciones_${objetivo.ID_OBJETIVO_SECTORIAL}" style="display: none;">
            ${objetivo.acciones.map(accion => `
                <div class="accion-item ps-4">
                <div class="form-check">
                    <input type="checkbox" 
                           id="acc_${accion.ID_ACCION_SECTORIAL}" 
                           class="checkbox-accion form-check-input" 
                           data-objetivo="${objetivo.ID_OBJETIVO_SECTORIAL}"
                           data-id="${accion.ID_ACCION_SECTORIAL}">
                    <label for="acc_${accion.ID_ACCION_SECTORIAL}" class="form-check-label">
                        Accion ${accion.NO}: ${accion.DESC_ACCION_SECTORIAL}
                    </label>
                </div>
                </div>
            `).join('')}
        </div>
        <hr />
    `;

    return card;
}

function configurarEventListeners(selecciones) {
    // Event listener para checkboxes de objetivos
    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('checkbox-objetivo')) {
            manejarSeleccionObjetivo(e.target, selecciones);
        }

        if (e.target.classList.contains('checkbox-accion')) {
            manejarSeleccionAccion(e.target, selecciones);
        }
    });
}

function manejarSeleccionObjetivo(checkbox, selecciones) {
    const objetivoId = parseInt(checkbox.dataset.id);
    const accionesContainer = document.getElementById(`acciones_${objetivoId}`);

    if (checkbox.checked) {
        // Agregar objetivo a selecciones
        if (!selecciones.objetivos.includes(objetivoId)) {
            selecciones.objetivos.push(objetivoId);
        }

        // Mostrar acciones
        accionesContainer.style.display = 'block';

        // Marcar todas las acciones (opcional)
        accionesContainer.querySelectorAll('.checkbox-accion').forEach(accCheckbox => {
            accCheckbox.checked = true;
            manejarSeleccionAccion(accCheckbox, selecciones);
        });
    } else {
        // Remover objetivo de selecciones
        selecciones.objetivos = selecciones.objetivos.filter(id => id !== objetivoId);

        // Ocultar acciones
        accionesContainer.style.display = 'none';

        // Desmarcar todas las acciones
        accionesContainer.querySelectorAll('.checkbox-accion').forEach(accCheckbox => {
            accCheckbox.checked = false;
            manejarSeleccionAccion(accCheckbox, selecciones);
        });
    }

    actualizarResumen(selecciones);
}

function manejarSeleccionAccion(checkbox, selecciones) {
    const accionId = parseInt(checkbox.dataset.id);
    const objetivoId = parseInt(checkbox.dataset.objetivo);

    if (checkbox.checked) {
        // Agregar acción a selecciones
        if (!selecciones.acciones.some(acc => acc.id === accionId)) {
            selecciones.acciones.push({
                id: accionId,
                objetivoId: objetivoId
            });
        }

        // Asegurar que el objetivo padre esté seleccionado
        const objCheckbox = document.getElementById(`obj_${objetivoId}`);
        if (objCheckbox && !objCheckbox.checked) {
            objCheckbox.checked = true;
            manejarSeleccionObjetivo(objCheckbox, selecciones);
        }
    } else {
        // Remover acción de selecciones
        selecciones.acciones = selecciones.acciones.filter(acc => acc.id !== accionId);
    }

    actualizarResumen(selecciones);
}

function actualizarResumen(selecciones) {
    const resumen = document.getElementById('resumenSelecciones');
    if (!resumen) return;

    resumen.innerHTML = `
        <h5>Resumen de Selección</h5>
        <p><strong>Objetivos seleccionados:</strong> ${selecciones.objetivos.join(', ') || 'Ninguno'}</p>
        <p><strong>Acciones seleccionadas:</strong> ${selecciones.acciones.map(acc => acc.id).join(', ') || 'Ninguna'}</p>
    `;
}

function obtenerArraysParaBD(selecciones, id) {
    return {
        arrayObjetivos: [...selecciones.objetivos],
        arrayAcciones: selecciones.acciones.map(acc => ({
            ID_ACCION_SECTORIAL: acc.id,
            ID_OBJETIVO_SECTORIAL: acc.objetivoId,
            ID_CTRL_ALINEACION: id
        }))
    };
}

function limpiarSelecciones(selecciones) {
    selecciones.objetivos = [];
    selecciones.acciones = [];

    // Desmarcar todos los checkboxes
    document.querySelectorAll('.checkbox-objetivo, .checkbox-accion').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Ocultar todos los contenedores de acciones
    document.querySelectorAll('[id^="acciones_"]').forEach(container => {
        container.style.display = 'none';
    });

    actualizarResumen(selecciones);
}

function inicializarSistemaAlineacion(datosConsulta, ___toEdit) {
    const selecciones = renderizarCheckboxesAlineacion(datosConsulta);
    const btn = $("#btnS_AlineacionObjetivo")[0];
    const idCtrlAlineacion = btn.dataset.ctrlAlineacion
    btn.onclick = function () {
        $("#btnS_AlineacionObjetivo").attr("disabled", true);
        const datosBD = obtenerArraysParaBD(selecciones, parseInt(idCtrlAlineacion));
        logger.log("OBTENIENDO ARR DE DATOS  ACCIONES: ", datosBD.arrayAcciones)
        if (datosBD.arrayAcciones.length !== 0) {
            showMsg("Enviando datos a base de datos.", 'info');
            //guardarEnBaseDeDatos(datosBD);
            const valoresObjetivos = JSON.stringify(datosBD.arrayAcciones);
            logger.log("VALORES PROCESADOS OBJETIVOS: ", valoresObjetivos)
            fetchDataArr(75, { __listObjetivos: valoresObjetivos }, 0, function (response) {
                if (response.flag) {
                    showMsg(response.msg, 'success');
                    loadInit($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                    $("#modalAlineacionObjetivo").modal("hide");
                } else {
                    showMsg(response.msg, 'error');
                }
            });
            $("#btnS_AlineacionObjetivo").removeAttr("disabled");
            gDoaaById(idCtrlAlineacion);
        } else if (datosBD.arrayAcciones.length === 0) {
            showMsg("Favor de elegir sus objetivos y respectivas acciones sectoriales.", 'error');
            $("#btnS_AlineacionObjetivo").removeAttr("disabled");
            loadInit($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        }
    };
    if (___toEdit === 1) {
        var html = '';
        $("#tableObjetivos").show();
        gDoaaById(idCtrlAlineacion);
    } else {
        $("#tableObjetivos").hide();
    }
    $("#btnS_AlineacionObjetivo").removeAttr("disabled");
}