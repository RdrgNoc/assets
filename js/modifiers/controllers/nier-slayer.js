'use strict';

var idUser = $("#MainContent_hddnIdUsuario").val();
var idRolUser = $("#MainContent_hddnPage").val();
var cveOSd = $("#MainContent_hddnOS").val().trim();
var cveUPd = $("#MainContent_hddnUP").val().trim();
var cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();

const d = new Date();
const numberMonth = parseInt(d.getMonth()) + 1;
const numberDay = parseInt(d.getDate());

const divForFile = $("#divInputArchivo");
const inputFile = $("#customFile");
const divForLink = $("#divInputEnlace");
const inputLink = $("#txtUrl");
const divInfo = $("#divInfo");

const initDay = 2;
const unitDay = 13;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function resetUI() {
//     divInfo.hide();
//     divForFile.hide();
//     divForLink.hide();
//     inputFile.hide().val("").removeAttr("accept");
//     inputLink.hide().val("");
// }

// function getAccept(type) {
//     return FILE_CONFIGS[type]
//         ?.exts.map(ext => `.${ext}`)
//         .join(', ');
// }

// function showFileInput(type) {
//     divForFile.show();
//     inputFile
//         .show()
//         .attr("accept", getAccept(FILE_CONFIGS[type[0]]));
// }

// function showLinkInput() {
//     divForLink.show();
//     inputLink.show();
// }

// function validateFile(input, type) {
//     const file = input.files?.[0];

//     if (!file) {
//         showMsg('Por favor, seleccione un archivo.', 'error');
//         return false;
//     }

//     const config = FILE_CONFIGS[type];
//     if (!config) {
//         showMsg('Tipo de archivo no configurado.', 'error');
//         return false;
//     }

//     const fileName = file.name.toLowerCase();
//     const fileExt = fileName.split('.').pop();
//     const fileType = file.type;

//     const validExt = config.exts.includes(fileExt);
//     const validMime = config.mime.some(m =>
//         m.endsWith('/') ? fileType.startsWith(m) : fileType === m
//     );

//     if (!validExt && !validMime) {
//         showMsg(
//             `Formato no válido. Se permiten: ${config.exts.join(', ')}`,
//             'error'
//         );
//         input.value = '';
//         return false;
//     }

//     showMsg(`Archivo ${config.name} válido.`, 'success');
//     return true;
// }

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
        case '5':
            return numero >= 1 && numero <= 25;
        default:
            return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gDaxp(cveOS, cveUP, eFiscal) {
    var html = '';
    blockUICustom();
    fetchDataArr(4, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 7, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de ACCIONES MEJORAS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        html += `<tr>
                                    <td>
                                          <div class='d-flex align-items-center position-relative'>
                                            <div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-primary bg-primary-subtle fs-9'>
                                              <span>${item.NO_CONTROL === null ? 'ND' : item.NO_CONTROL}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td class='text-1000'>${item.DESC_AREA_OPORTUNIDAD}</td>
                                        <td>
                                          <div class='d-flex align-items-center position-relative'>
                                            <div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-danger bg-danger-subtle fs-9'>
                                              <span>${item.NO_CONTROL_ACCION === null ? 'ND' : item.NO_CONTROL_ACCION}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td class='text-1000'>${item.DESC_ACCION_MEJORA}</td>
                                        <td class='text-1000'>${item.DESC_UNIDAD_RESPONSABLE}</td>
                                        <td class='text-1000'>${item.DESC_RESPONSABLE_IMPLEMENTACION}</td>
                                        <td class='text-1000'>${item.MEDIOS}</td>
                                        <td class='text-end'>
                                            <div>
                                                <button class='btn btn-sm btn-falcon-primary btnSeePeriodo customButton m-1' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}'>Ver periodos</button>
                                            </div>
                                        </td>
                                    </tr>`
                    });
                    recargarTabla("tableAccionMejora", html);
                } else {
                    recargarTabla("tableAccionMejora", null);
                    showMsg("El organismo aun no tiene acciones de mejora.", 'info');
                }

            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
        Swal.close();
    });
}

function gDpa(idCtrlAccion, cveOS, cveUP, eFiscal) {
    var html = '';
    gDva(idCtrlAccion, eFiscal);
    blockUICustom();
    fetchDataArr(5, { _idCtrlAccion: idCtrlAccion, __OS: cveOS, __UP: cveUP, __idRol: idRolUser }, 7, async function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de PERIODOS BY ID ACCION [USUARIO]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    //response.forEach(function (item) {
                    const itemPromises = response.map(async (item) => {
                        const objetivosResponse = await new Promise((resolve, reject) => {
                            //fetchDataArr(6, { _idCtrlPeriodo: idCtrlPeriodo }, 7, function (response) {
                            fetchDataArr(6, { _idCtrlPeriodo: item.ID_CTRL_PERIODO }, 7, (response) => {
                                if (response) resolve(response);
                                else reject(new Error("Error en fetchDataArr 6"));
                            });
                        });

                        var descValida = item.SN_VALIDA === null ? 'Sin validar aún' : item.SN_VALIDA === true ? 'Validado' : 'Rechazado';
                        var colorValida = item.SN_VALIDA === null ? 'badge-subtle-secondary' : item.SN_VALIDA === true ? 'badge-subtle-success' : 'badge-subtle-danger';
                        var descEnvia = item.SN_ENVIA === null ? 'Sin enviar' : item.SN_ENVIA === true ? 'Enviado' : 'No enviado';
                        var colorEnvia = item.SN_ENVIA === null ? 'badge-subtle-secondary' : item.SN_ENVIA === true ? 'badge-subtle-success' : 'badge-subtle-danger';
                        var snValida = item.SN_VALIDA === null ? '' : item.SN_VALIDA === false ? '' : 'disabled';
                        var snEnvia = item.SN_ENVIA === null ? '' : item.SN_ENVIA === false ? '' : 'disabled';
                        var idTrimestre = parseInt(item.ID_TRIMESTRE);
                        var disabledBtn = '';
                        var strBtnSend = '';
                        var disabledBtnSend = '';
                        var descBtnEvidencias = '';

                        switch (numberMonth) {
                            //switch (1) {
                            case 1:
                            case 2:
                            case 3:
                                if (idTrimestre !== 1) {
                                    disabledBtn = 'disabled';
                                    disabledBtnSend = 'disabled';
                                } else {
                                    if (numberMonth !== 3) {
                                        disabledBtn = 'disabled';
                                        disabledBtnSend = 'disabled';
                                    } else {
                                        if (numberDay >= initDay && numberDay <= unitDay) {
                                            disabledBtn = '';
                                            disabledBtnSend = '';
                                        } else {
                                            disabledBtn = 'disabled';
                                            disabledBtnSend = 'disabled';
                                        }
                                    }
                                }
                                break;
                            case 4:
                            case 5:
                            case 6:
                                if (idTrimestre !== 2) {
                                    disabledBtn = 'disabled';
                                    disabledBtnSend = 'disabled';
                                } else {
                                    if (numberMonth !== 6) {
                                        disabledBtn = 'disabled';
                                        disabledBtnSend = 'disabled';
                                    } else {
                                        if (numberDay >= initDay && numberDay <= unitDay) {
                                            disabledBtn = '';
                                            disabledBtnSend = '';
                                        } else {
                                            disabledBtn = 'disabled';
                                            disabledBtnSend = 'disabled';
                                        }
                                    }
                                }
                                break;
                            case 7:
                            case 8:
                            case 9:
                                if (idTrimestre !== 3) {
                                    disabledBtn = 'disabled';
                                    disabledBtnSend = 'disabled';
                                } else {
                                    if (numberMonth !== 9) {
                                        disabledBtn = 'disabled';
                                        disabledBtnSend = 'disabled';
                                    } else {
                                        if (numberDay >= initDay && numberDay <= unitDay) {
                                            disabledBtn = '';
                                            disabledBtnSend = '';
                                        } else {
                                            disabledBtn = 'disabled';
                                            disabledBtnSend = 'disabled';
                                        }
                                    }
                                }
                                break;
                            case 10:
                            case 11:
                            case 12:
                                if (idTrimestre !== 4) {
                                    disabledBtn = 'disabled';
                                    disabledBtnSend = 'disabled';
                                } else {
                                    if (numberMonth !== 12) {
                                        disabledBtn = 'disabled';
                                        disabledBtnSend = 'disabled';
                                    } else {
                                        if (numberDay >= initDay && numberDay <= unitDay) {
                                            disabledBtn = '';
                                            disabledBtnSend = '';
                                        } else {
                                            disabledBtn = 'disabled';
                                            disabledBtnSend = 'disabled';
                                        }
                                    }
                                }
                                break;
                            default:
                                disabledBtn = 'disabled';
                                disabledBtnSend = 'disabled';
                                break;
                        }

                        //disabledBtn = '';

                        // if (snEnvia === '') {
                        //     if (snValida === '') {
                        //         disabledBtn = '';
                        //     } else {
                        //         disabledBtn = 'disabled';
                        //     }
                        // } else {
                        //     if (snValida === 'disabled') {
                        //         disabledBtn = 'disabled';
                        //     } else {
                        //         if (snValida === '') {
                        //             disabledBtn = 'disabled';
                        //         } else {
                        //             disabledBtn = '';
                        //         }
                        //     }
                        // }

                        if (disabledBtn === 'disabled') {
                            disabledBtn = 'disabled';
                            disabledBtnSend = 'disabled';
                        } else {
                            if (snEnvia === '') {
                                if (snValida === '') {
                                    if (item.SN_RAIZ === false) {
                                        disabledBtn = '';
                                        disabledBtnSend = 'disabled';
                                    } else {
                                        disabledBtn = '';
                                        disabledBtnSend = '';
                                    }
                                } else {
                                    if (item.SN_RAIZ === false) {
                                        disabledBtn = 'disabled';
                                        disabledBtnSend = 'disabled';
                                    } else {
                                        disabledBtn = '';
                                        disabledBtnSend = '';
                                    }
                                }
                            } else {
                                if (snValida === 'disabled') {
                                    disabledBtn = 'disabled';
                                    disabledBtnSend = 'disabled';
                                } else {
                                    if (snValida === '') {
                                        disabledBtn = '';
                                        disabledBtnSend = 'disabled';
                                    } else {
                                        disabledBtn = '';
                                        disabledBtnSend = '';
                                    }
                                }
                            }
                        }

                        logger.log(`%cRESPONSE EVIDENCIAS PERIODO`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        logger.table(objetivosResponse)
                        if (objetivosResponse.length !== 0) {
                            strBtnSend = `<button class='btn btn-sm btn-falcon-primary btnReportPeriodo customButton m-1 ${disabledBtnSend}' type='button' data-ctrl-periodo='${item.ID_CTRL_PERIODO}' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}'>Reportar</button>`;
                            descBtnEvidencias = "Ver evidencias";
                        } else if (objetivosResponse.length === 0) {
                            strBtnSend = ``;
                            descBtnEvidencias = "Insertar evidencias";
                        }

                        var splitAcciones = item.UNIDADES === null ? [null] : item.UNIDADES.split(",")
                        var htmlNums = "";
                        if (splitAcciones.length !== 0) {
                            splitAcciones.forEach(function (accion) {
                                var splitUnidad = accion.split("|");
                                if (splitUnidad[1] === '1') {
                                    htmlNums += `<span class='badge d-block p-2 badge-subtle-indigo fs-10-5 m-1'>${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}</span>`;
                                } else {
                                    htmlNums += `<span class='badge d-block p-2 badge-subtle-warning fs-10-5 m-1'>${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}</span>`;
                                }
                            });
                        } else {
                            htmlNums += `<span class='badge d-block p-2 badge-subtle-warning fs-10-5 m-1'>${splitAcciones[0] === null ? 'ND' : splitAcciones[0]}</span>`;
                        }

                        disabledBtn = '';

                        return `<tr>
                                    <td class='text-1000'>${item.DESC_ACCION_MEJORA}</td>
                                    <td class='text-1000'>${item.DESC_TRIMESTRE}</td>
                                    <td class='text-1000'>${item.DESC_COMENTARIO === null ? 'Envie a revisión, y espere a que validen su reporte' : item.DESC_COMENTARIO}</td>
                                    <td class='text-1000'>${htmlNums}</td>
                                    <td style='width: 50px !important;'>
                                      <div class='d-flex align-items-center position-relative'>
                                        <div class='avatar avatar-xl'>
                                          <div class='avatar-name rounded-circle text-warning bg-warning-subtle fs-10'>
                                          <span>${item.PORCENTAJE_TRIMESTRE === null ? 'ND' : item.PORCENTAJE_TRIMESTRE + '%'}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td class='text-1000'>
                                        <span class='badge badge rounded-pill d-block p-2 ${colorValida} fs-10-5 m-1'>Validación: ${descValida}</span>
                                        <span class='badge badge rounded-pill d-block p-2 ${colorEnvia} fs-10-5 m-1'>Envió: ${descEnvia}</span>
                                    </td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-primary btnInsertEvidencias customButton m-1 ${disabledBtn}' type='button' data-ctrl-periodo='${item.ID_CTRL_PERIODO}'>${descBtnEvidencias}</button>
                                            ${strBtnSend}
                                            <button class='btn btn-sm btn-falcon-info btnSeeObservacion customButton m-1' type='button' data-ctrl-periodo='${item.ID_CTRL_PERIODO}'>Ver observaciones</button>
                                        </div>
                                    </td>
                                </tr>`
                        //});
                    });
                    try {
                        const htmlParts = await Promise.all(itemPromises);
                        const html = htmlParts.join('');
                        recargarTabla("tablePeriodosAccion", html);
                        Swal.close();
                    } catch (error) {
                        logger.log(`%cOcurrió un error al procesar los datos ${error}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        showMsg("Ocurrió un error al procesar los datos.", 'error');
                        Swal.close();
                    }
                } else {
                    recargarTabla("tablePeriodosAccion", null);
                    Swal.close();
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
                Swal.close();
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
            Swal.close();
        }
    });
}

function gDpaA(idCtrlAccion, cveOS, cveUP, eFiscal) {
    var html = '';
    gDva(idCtrlAccion, eFiscal);
    blockUICustom();
    fetchDataArr(5, { _idCtrlAccion: idCtrlAccion, __OS: cveOS, __UP: cveUP, __idRol: idRolUser }, 7, async function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de PERIODOS BY ID ACCION [ADMIN]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    //response.forEach(function (item) {
                    const itemPromises = response.map(async (item) => {
                        const objetivosResponse = await new Promise((resolve, reject) => {
                            fetchDataArr(6, { _idCtrlPeriodo: item.ID_CTRL_PERIODO }, 7, (response) => {
                                if (response) resolve(response);
                                else reject(new Error("Error en fetchDataArr 6"));
                            });
                        });

                        var descValida = item.SN_VALIDA === null ? 'Sin validar aún' : item.SN_VALIDA === true ? 'Validado' : 'Rechazado';
                        var colorValida = item.SN_VALIDA === null ? 'bg-secondary' : item.SN_VALIDA === true ? 'bg-success' : 'bg-danger';
                        var descEnvia = item.SN_ENVIA === null ? 'Por enviar' : item.SN_ENVIA === true ? 'Enviado' : 'No enviado';
                        var colorEnvia = item.SN_ENVIA === null ? 'bg-secondary' : item.SN_ENVIA === true ? 'bg-success' : 'bg-danger';
                        var snValida = item.SN_VALIDA === true ? 'disabled' : '';
                        var snEnvia = item.SN_ENVIA === true ? '' : 'disabled';
                        var idTrimestre = parseInt(item.ID_TRIMESTRE);
                        var disabledBtn = '';
                        var strBtnSend = '';
                        var descBtnEvidencias = '';
                        var plusHtml = '';

                        if (snEnvia === '') {
                            disabledBtn = '';
                            if (snValida === '') {
                                disabledBtn = '';
                            } else {
                                disabledBtn = 'disabled';
                            }
                        } else {
                            disabledBtn = 'disabled';
                            // if (snValida === '') {
                            //     disabledBtn = '';
                            // } else {
                            //     disabledBtn = 'disabled';
                            // }
                        }

                        if (item.PORCENTAJE_TRIMESTRE !== null) {
                            plusHtml += `<button class='btn btn-sm btn-falcon-warning btnEditComentario customButton m-1' type='button' data-ctrl-periodo='${item.ID_CTRL_PERIODO}' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}'>Editar comentario</button>`;
                        }

                        var splitAcciones = item.UNIDADES === null ? [null] : item.UNIDADES.split(",")
                        var htmlNums = "";
                        logger.log(`%cUNIDADES`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        logger.table(splitAcciones)
                        if (splitAcciones.length !== 0) {
                            splitAcciones.forEach(function (accion) {
                                var splitUnidad = accion.split("|");
                                if (splitUnidad[1] === '1') {
                                    htmlNums += `<span class='badge d-block p-2 bg-indigo fs-10-5 m-1'>${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}</span>`;
                                } else {
                                    htmlNums += `<span class='badge d-block p-2 bg-warning fs-10-5 m-1'>${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}</span>`;
                                }
                            });
                        } else {
                            htmlNums += `<span class='badge d-block p-2 bg-warning fs-10-5 m-1'>${splitAcciones[0] === null ? 'ND' : splitAcciones[0]}</span>`;
                        }

                        return `<tr>
                                    <td class='text-1000' style='width: 380px !important;'>${item.DESC_ACCION_MEJORA}</td>
                                    <td class='text-1000'>${item.DESC_TRIMESTRE}</td>
                                    <td class='text-1000'>${item.DESC_COMENTARIO === null ? 'Cuando valide, inserte su comentario por favor.' : item.DESC_COMENTARIO}</td>
                                    <td class='text-1000'>${htmlNums}</td>
                                    <td style='width: 50px !important;'>
                                      <div class='d-flex align-items-center position-relative'>
                                        <div class='avatar avatar-xl'>
                                          <div class='avatar-name rounded-circle text-warning bg-warning-subtle fs-10'>
                                          <span>${item.PORCENTAJE_TRIMESTRE === null ? 'ND' : item.PORCENTAJE_TRIMESTRE + '%'}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td class='text-1000' style='width: 150px !important;'>
                                        <span class='badge d-block p-2 ${colorValida} fs-10-5 m-1'>Validación: ${descValida}</span>
                                        <span class='badge d-block p-2 ${colorEnvia} fs-10-5 m-1'>Envió: ${descEnvia}</span>
                                    </td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-primary btnSeeEvidencias customButton m-1' type='button' data-ctrl-periodo='${item.ID_CTRL_PERIODO}'>Ver evidencias</button>
                                            <button class='btn btn-sm btn-falcon-success btnSetValidate customButton m-1 ${disabledBtn}' type='button' data-ctrl-periodo='${item.ID_CTRL_PERIODO}' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}'>Validar</button>
                                            <button class='btn btn-sm btn-falcon-danger btnSetRejected customButton m-1 ${disabledBtn}' type='button' data-ctrl-periodo='${item.ID_CTRL_PERIODO}' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}'>Rechazar</button>
                                            ${plusHtml}
                                            <button class='btn btn-sm btn-falcon-info btnSeeObservacion customButton m-1' type='button' data-ctrl-periodo='${item.ID_CTRL_PERIODO}'>Ver observaciones</button>
                                        </div>
                                    </td>
                                </tr>`
                        //});
                    });
                    try {
                        const htmlParts = await Promise.all(itemPromises);
                        const html = htmlParts.join('');
                        recargarTabla("tablePeriodosAccion", html);
                        Swal.close();
                    } catch (error) {
                        logger.log(`%cOcurrió un error al procesar los datos ${error}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        showMsg("Ocurrió un error al procesar los datos.", 'error');
                        Swal.close();
                    }
                } else {
                    Swal.close();
                    recargarTabla("tablePeriodosAccion", null);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
                Swal.close();
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
            Swal.close();
        }
    });
}

function gDva(idCtrlAccion, eFiscal) {
    fetchDataArr(19, { _idCtrlAccion: idCtrlAccion, __eFiscal: eFiscal }, 7, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de DATA VIEW [${response}]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            if (response.flag) {
                $("#infoCardMejora").html(response.html);
            } else {
                $("#infoCardMejora").html("Vuelta a intentar");
                showMsg(response.msg, 'error');
            }
        }
    });
}

function gDeByIdp(idCtrlPeriodo) {
    var html = '';
    blockUICustom();
    fetchDataArr(6, { _idCtrlPeriodo: idCtrlPeriodo }, 7, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de EVIDENCIAS PERIODO [USUARIO]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        const algunoEnvia = response.some(item => item.SN_ENVIA === true);
                        const algunoValida = response.some(item => item.SN_VALIDA === true);
                        logger.log(algunoEnvia, algunoValida);
                        if (algunoEnvia) {
                            $("#btnS_Evidencia").attr("disabled", true);
                            $("#txtDescEvidencia").attr("disabled", true);
                            $("#cboDocumento").attr("disabled", true);
                            if (algunoValida) {
                                $("#btnS_Evidencia").attr("disabled", true);
                                $("#txtDescEvidencia").attr("disabled", true);
                                $("#cboDocumento").attr("disabled", true);
                            }
                        } else {
                            if (algunoValida) {
                                $("#btnS_Evidencia").attr("disabled", true);
                                $("#txtDescEvidencia").attr("disabled", true);
                                $("#cboDocumento").attr("disabled", true);
                            } else {
                                $("#btnS_Evidencia").removeAttr("disabled");
                                $("#txtDescEvidencia").removeAttr("disabled");
                                $("#cboDocumento").removeAttr("disabled");
                            }
                        }

                        if (item.ID_TIPO_DOCUMENTO === 1 || item.ID_TIPO_DOCUMENTO === 2 || item.ID_TIPO_DOCUMENTO === 4 || item.ID_TIPO_DOCUMENTO === 5) {
                            html += `<tr>
                                        <td class='text-1000'>${item.DESC_DOCUMENTO}</td>
                                        <td class='text-1000'>${item.NOMBRE_EVIDENCIA === null ? 'No se cargo correctamente su archivo' : item.NOMBRE_EVIDENCIA}</td>
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
                    recargarTablaSinOpciones("tableEvidenciasPeriodo", html);
                    Swal.close();
                } else {
                    recargarTablaSinOpciones("tableEvidenciasPeriodo", null);
                    $("#btnS_Evidencia").removeAttr("disabled");
                    $("#txtDescEvidencia").removeAttr("disabled");
                    $("#cboDocumento").removeAttr("disabled");
                    showMsg("El organismo aun no tiene evidencias almacenadas.", 'info');
                    Swal.close();
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
                Swal.close();
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
            Swal.close();
        }
    });
}

function gDeByIdpA(idCtrlPeriodo) {
    var html = '';
    blockUICustom();
    fetchDataArr(6, { _idCtrlPeriodo: idCtrlPeriodo }, 7, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de EVIDENCIAS PERIODO [ADMIN]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        if (item.ID_TIPO_DOCUMENTO === 1 || item.ID_TIPO_DOCUMENTO === 2 || item.ID_TIPO_DOCUMENTO === 4 || item.ID_TIPO_DOCUMENTO === 5) {
                            html += `<tr>
                                        <td class='text-1000'>${item.DESC_DOCUMENTO}</td>
                                        <td class='text-1000'>${item.NOMBRE_EVIDENCIA === null ? 'No se cargo correctamente su archivo' : item.NOMBRE_EVIDENCIA}</td>
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
                    recargarTabla("tableEvidenciasPeriodoA", html);
                } else {
                    recargarTabla("tableEvidenciasPeriodoA", null);
                    showMsg("El organismo aun no tiene evidencias almacenadas.", 'info');
                }
                Swal.close();
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDeById(idEvidencia) {
    blockUICustom({
        title: 'Descargando archivo',
        html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...</div></div>'
    });
    fetchDataArr(10, { _idCtrlEvidencia: idEvidencia }, 7, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos a DESCARGA EVIDENCIAS [${response}]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            var responseS = response.split("|");
            if (responseS[1] === '1') {
                showMsg('Respuesta del servidor: ' + responseS[0] + '', 'success');
                mostrarFichero(responseS[2]);
                // } else if (splitResponse[1] === '2') {
                //     showMsg('Respuesta del servidor: ' + splitResponse[0] + '', 'success');
                //     var splitResult = splitResponse[2].split(",")
                //     saveByteArray(splitResult[0] + splitResult[1], base64ToArrayBuffer(splitResult[2]), splitResult[3])
            } else if (responseS[1] === '2') {
                showMsg('No existe el archivo.', 'error');
            } else {
                showMsg('Respuesta del servidor: ' + responseS[0] + '', 'error');
            }
            Swal.close();
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDoByIdp(idCtrlPeriodo) {
    var html = '';
    blockUICustom();
    fetchDataArr(14, { _idCtrlPeriodo: idCtrlPeriodo }, 7, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de OBSERVACIONES BY ID PERIODO [USUARIO]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
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
                                            <button class='btn btn-sm btn-falcon-primary btnSolventar customButton m-1 ${disabledBtn}' type='button' data-ctrl-obser='${item.ID_OBSERVACION_PERIODO}' data-ctrl-periodo='${item.ID_CTRL_PERIODO}'>Solventar</button>
                                        </div>
                                    </td>
                                </tr>`
                    });
                    recargarTablaSinOpciones("tableObservacionesPeriodo", html);
                } else {
                    recargarTablaSinOpciones("tableObservacionesPeriodo", null);
                }
                Swal.close();
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDoByIdpA(idCtrlPeriodo) {
    var html = '';
    blockUICustom();
    fetchDataArr(14, { _idCtrlPeriodo: idCtrlPeriodo }, 7, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de OBSERVACIONES BY ID PERIODO [ADMIN]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
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
                    recargarTablaSinOpciones("tableObservacionesPeriodo", html);
                } else {
                    recargarTablaSinOpciones("tableObservacionesPeriodo", null);
                }
                Swal.close();
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function getDataPeriodoComentario(idPeriodo) {
    blockUICustom();
    fetchDataArr(17, { _idCtrlPeriodo: idPeriodo }, 7, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de ACCION MEJORA BY ID [USUARIO]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length === 1) {
                    $("#txtComentario").val(response[0].DESC_COMENTARIO);
                    $("#txtPorcentaje").val(response[0].PORCENTAJE_TRIMESTRE);
                } else {
                    showMsg("Error al obtener datos, o no existen.", 'error');
                }
                Swal.close();
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

function sDe(dataLocal, idDocumento) {
    var urlsend = "";
    if (idDocumento === 1 || idDocumento === 2 || idDocumento === 4 || idDocumento === 5) {
        urlsend = 8
    } else if (idDocumento === 3) {
        urlsend = 9
    }
    blockUICustom({
        title: 'Guardando documento...',
        html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...</div></div>'
    });
    fetchDataArr(urlsend, dataLocal, 7, function (response) {
        logger.log(`%cDatos recibidos a ACTIVIDAD EVIDENCIAS ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
        if (response.ok) {
            showMsg(response.msg, 'success');
            clearForms(1);
            Swal.close();
            gDeByIdp(dataLocal._idCtrlPeriodo);
        } else {
            showMsg(response.msg, 'error');
            Swal.close();
        }
        $("#btnS_Actividad").removeAttr("disabled");
    });
}

async function uploadFileInChunks(file, idPeriodo, idUsuario, idDocumento, txtDesc, fileExt, cveOS, cveUP, cveEfiscal) {
    blockUICustom({
        title: 'Guardando documento...',
        html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...</div></div>',
        allowOutsideClick: false,
    });
    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_SIZE = 100 * 1024 * 1024; // 2MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = crypto.randomUUID();

    logger.warn(file.name, file.size, totalChunks)

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
        formData.append("toServer", 2);

        formData.append("_idPeriodo", idPeriodo);
        formData.append("_idUsuario", idUsuario);
        formData.append("_idDocumento", idDocumento);
        formData.append("_txtDesc", txtDesc);
        formData.append("_fileExt", fileExt);
        formData.append("_cveOS", cveOS);
        formData.append("_cveUP", cveUP);
        formData.append("_eFiscal", cveEfiscal);
        await sendChunk(formData,
            function (response) {
                logger.error("RESPUESTA DEVUELTA A SERVIDOR LINEA 2: ", response);
                let objetoJS = JSON.parse(response);
                logger.error("DESPUES DE PARSE JSON: ", objetoJS);
                if (objetoJS.ok) {
                    showMsg(objetoJS.msg, 'success');
                    gDeByIdp(idPeriodo);
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
        //         gDeByIdp(idPeriodo);
        //         clearForms(1);
        //         $("#btnS_Evidencia").removeAttr("disabled");
        //     }
        // );
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var obtenerSelectDatosEfiscal = function () {
    fetchDataArr(0, {}, 7, function (response) {
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
    fetchDataArr(1, { _txtEfiscal: txtEfiscal }, 7, function (response) {
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
    fetchDataArr(2, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 7, function (response) {
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

var obtenerSelectDatosPeriodo = function () {
    fetchDataArr(3, {}, 7, function (response) {
        if (response) {
            const select = $("#cboPeriodo");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.ID_TIPO_PERIODO, text: item.DESC_TIPO_PERIODO })); });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var obtenerSelectDatosTipoDocumento = function (id) {
    fetchDataArr(7, {}, 7, function (response) {
        if (response) {
            const select = $("#cboDocumento");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.ID_TIPO_DOCUMENTO, text: item.DESC_DOCUMENTO })); });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    loadEndpoints(7);
    obtenerSelectDatosEfiscal();
    obtenerSelectDatosOS(cveEfiscald);
    obtenerSelectDatosUP(cveEfiscald, cveOSd, '');
    obtenerSelectDatosPeriodo();
    obtenerSelectDatosTipoDocumento();
    divForFile.hide();
    inputFile.hide();
    divForLink.hide();
    inputLink.hide();
    if (idRolUser === '101') {
        logger.log("Usuario captura");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        //$("#btnN_AreaOportunidad").show();

        gDaxp(cveOSd, cveUPd, cveEfiscald);

    } else if (idRolUser === '103' || idRolUser === '104') {
        logger.log("Usuario administrador");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        //$("#btnN_AreaOportunidad").hide();

        gDaxp(cveOSd, cveUPd, cveEfiscald);
    }

    $(document).on("click", "#btnSearch", function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        $("#btncollapse2")[0].classList.add("accordion-button", "collapsed")
        $("#collapse2")[0].classList.remove("show")
        $("#btncollapse1")[0].classList.remove("collapsed")
        $("#collapse1")[0].classList.add("show")
        recargarTabla("tablePeriodosAccion", null);
        if (idRolUser === '101') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { gDaxp(cveOS, cveUP, eFiscal) };
        } else if (idRolUser === '103' || idRolUser === '104') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { gDaxp(cveOS, cveUP, eFiscal) };
        }
    });

    $(document).on("change", "#cboUp, #cboEfiscal, #cboOs", function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        $("#btncollapse2")[0].classList.add("accordion-button", "collapsed")
        $("#collapse2")[0].classList.remove("show")
        $("#btncollapse1")[0].classList.remove("collapsed")
        $("#collapse1")[0].classList.add("show")
        if (idRolUser === '101') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { gDaxp(cveOS, cveUP, eFiscal) };
        } else if (idRolUser === '103' || idRolUser === '104') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) { gDaxp(cveOS, cveUP, eFiscal) };
        }
    });

    $(document).on("click", ".btnSeePeriodo", function () {
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (idRolUser === '101') {
            gDpa(idReturn, cveOS, cveUP, eFiscal);
        } else if (idRolUser === '103' || idRolUser === '104') {
            gDpaA(idReturn, cveOS, cveUP, eFiscal);
        }
        $("#btncollapse1")[0].classList.add("accordion-button", "collapsed")
        $("#collapse1")[0].classList.remove("show")
        $("#btncollapse2")[0].classList.remove("collapsed")
        $("#collapse2")[0].classList.add("show")
    });

    $(document).on("click", ".btnInsertEvidencias", function () {
        var idReturn = $(this)[0].dataset.ctrlPeriodo;
        $("#btnS_Evidencia").attr("data-ctrl-periodo", idReturn);
        gDeByIdp(idReturn);
        clearForms(1);
        $("#modalPeriodoEvidenciaForm").modal("show")
    });

    $(document).on("click", ".btnSeeEvidencias", function () {
        var idReturn = $(this)[0].dataset.ctrlPeriodo;
        gDeByIdpA(idReturn);
        $("#modalPeriodoEvidencia").modal("show")
    });

    $(document).on("change", "#cboDocumento", function () {
        inputFile.val("");
        inputLink.val("");

        var selectedValue = $(this).val();
        const cval = parseInt(selectedValue);

        $("#btnS_Evidencia").attr("data-ctrl-documento", `${cval}`);
        if (cval === 1 || cval === 2 || cval === 4 || cval === 5) { //WORD O PDF O ZIP/RAR
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
            inputFile.removeAttr("onchange").removeAttr("accept");
            $("#customFile").val("");
            inputLink.attr("onchange", "validateUrl(this);");
        } else {
            divInfo.show();
            divForFile.hide();
            inputFile.hide();
            divForLink.hide();
            inputLink.hide();
            inputFile.removeAttr("onchange").removeAttr("accept");
            $("#customFile").val("");
        }
    });

    // $(document).on("change", "#cboDocumento", function () {
    //     const cval = Number(this.value);

    //     resetUI();
    //     $("#btnS_Evidencia").data("ctrl-documento", cval);

    //     if (cval !== 3) {
    //         showFileInput(cval);
    //     } else if (cval === 3) {
    //         showLinkInput();
    //     } else {
    //         divInfo.show();
    //     }
    // });

    $(document).on("click", ".btnDownloadDoc", function () {
        var idReturn = $(this)[0].dataset.ctrlEvidencia;
        gDeById(idReturn);
    });

    $(document).on("click", "#btnS_Evidencia", function () {
        $("#btnS_Evidencia").attr("disabled", true);
        var idReturn = $("#btnS_Evidencia")[0].dataset.ctrlPeriodo;
        var idDocumento = $("#btnS_Evidencia")[0].dataset.ctrlDocumento;
        const cval = parseInt(idDocumento);
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var cveEfiscal = $("#cboEfiscal").val();

        if (verifyInitialDataOUE(cveOS, cveUP, cveEfiscal)) {
            if (validarFormularioEvidencia(cval) === true) {
                const txtDescEvidenciaData = $("#txtDescEvidencia").val().trim();
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
                } else if (cval === 3) {
                    const txtUrlData = $("#txtUrl").val().trim();
                    const data = { _idCtrlPeriodo: idReturn, _idUsuario: idUser, _idDocumento: cval, _txtDescEvidencia: txtDescEvidenciaData, _txtUrl: txtUrlData };
                    sDe(data, cval);
                    gDeByIdp(idReturn);
                    $("#btnS_Evidencia").removeAttr("disabled");
                }
            } else {
                $("#btnS_Evidencia").removeAttr("disabled");
            }
        }
    });

    $(document).on("click", ".btnReportPeriodo", function () {
        var idReturn = $(this)[0].dataset.ctrlPeriodo;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var cveEfiscal = $("#cboEfiscal").val();
        blockUICustom();
        fetchDataArr(16, { _idCtrlPeriodo: idReturn }, 7, function (response) {
            if (response) {
                logger.log(`%cDatos recibidos de VERIFICA DATOS PERIODO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                if (response !== 'error') {
                    const algunoFalla01 = response.some(item => item.NUM_OBSERS !== 0);
                    if (algunoFalla01) {
                        showMsg("Detectamos que su periodo, tiene observaciones. Verifique de favor.", 'alert');
                        Swal.close();
                        return;
                    }

                    fetchDataArr(18, { _idCtrlPeriodo: idReturn }, 7, function (response) {
                        if (response) {
                            logger.log(`%cDatos recibidos de VERIFICA DATOS PERIODO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                            if (response !== 'error') {
                                const algunoFalla01 = response.some(item => item.SUM_EVIS === 0);
                                const archivosNulos = response.some(item => item.NULLS_EVIS !== 0);
                                if (algunoFalla01) {
                                    showMsg("Detectamos que hace faltan que los demas organismos inserten evidencias.", 'alert');
                                    Swal.close();
                                    return;
                                }
                                if (archivosNulos) {
                                    showMsg("Detectamos que este periodo que esta mandando a reportar, contiene registros de archivos sin datos, favor de cargar / reemplazar / eliminar el registro. Para poder continuar con el envio.", 'alert');
                                    Swal.close();
                                    return;
                                }

                                fetchDataArr(11, { _idCtrlPeriodo: idReturn }, 7, function (response) {
                                    if (response) {
                                        logger.log(`%cRespuesta a UPDATE SEND PERIODO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                        var responseS = response.split("|");
                                        if (responseS[0] === "ok") {
                                            showMsg("Se actualizo correctamente los datos.", 'success');
                                        } else if (responseS[0] === "error") {
                                            showMsg("Ocurrio un error al insertar los datos.", 'error');
                                        } else if (responseS[0] === "existe") {
                                            showMsg("Detectamos que existe datos similares.", 'error');
                                        }
                                        gDpa(idReturn2, cveOS, cveUP, cveEfiscal);
                                        Swal.close();
                                    } else if (response === "error") {
                                        showMsg("Error al cargar datos", 'error');
                                    }
                                });
                            }
                        }
                    });
                } else {
                    showMsg("Ocurrio un error al mostrar resultados.", 'error');
                }
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });


    });

    $(document).on("click", ".btnSetRejected", function () {
        var idReturn = $(this)[0].dataset.ctrlPeriodo;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        $("#btnSendObserPeriodo").attr("data-ctrl-periodo", idReturn);
        $("#btnSendObserPeriodo").attr("data-ctrl-accion", idReturn2);
        $("#modalObservacionForm").modal("show");
    });

    $(document).on("click", "#btnSendObserPeriodo", function () {
        var idReturn = $(this)[0].dataset.ctrlPeriodo;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var cveEfiscal = $("#cboEfiscal").val();
        if ($("#txtObservacion").val() === "") {
            showMsg("Escriba la observación antes de rechazar.", 'error');
            return;
        } else {
            const txtObservacionData = $("#txtObservacion").val().trim();
            blockUICustom();
            fetchDataArr(13, { _idCtrlPeriodo: idReturn, _idUsuario: idUser, _txtDescObservacion: txtObservacionData }, 7, function (response) {
                if (response) {
                    logger.log(`%cRespuesta a UPDATE REJECTED PERIODO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    var responseS = response.split("|");
                    if (responseS[0] === "ok") {
                        showMsg("Se actualizo correctamente los datos.", 'success');
                        $("#modalObservacionForm").modal("hide");
                    } else if (responseS[0] === "error") {
                        showMsg("Ocurrio un error al insertar los datos.", 'error');
                    } else if (responseS[0] === "existe") {
                        showMsg("Detectamos que existe datos similares.", 'error');
                    }
                    Swal.close();
                    gDpaA(idReturn2, cveOS, cveUP, cveEfiscal);
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                }
            });
        }
    });

    $(document).on("click", ".btnSetValidate", function () {
        var idReturn = $(this)[0].dataset.ctrlPeriodo;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        $("#btnSendComenPeriodo").attr("data-ctrl-periodo", idReturn);
        $("#btnSendComenPeriodo").attr("data-ctrl-accion", idReturn2);
        clearForms(2);
        $("#modalComentarioForm").modal("show");
    });

    $(document).on("click", ".btnEditComentario", function () {
        var idReturn = $(this)[0].dataset.ctrlPeriodo;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        $("#btnSendComenPeriodo").attr("data-ctrl-periodo", idReturn);
        $("#btnSendComenPeriodo").attr("data-ctrl-accion", idReturn2);
        getDataPeriodoComentario(idReturn);
        $("#modalComentarioForm").modal("show");
    });

    $(document).on("click", "#btnSendComenPeriodo", function () {
        var idReturn = $(this)[0].dataset.ctrlPeriodo;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var cveEfiscal = $("#cboEfiscal").val();
        if (validarFormularioComentario()) {
            const txtComentarioData = $("#txtComentario").val().trim();
            const txtPorcentajeData = $("#txtPorcentaje").val().trim();
            if (validarMedida(txtPorcentajeData, '5') !== false) {
                blockUICustom();
                fetchDataArr(12, { _idCtrlPeriodo: idReturn, _idUsuario: idUser, _txtComentario: txtComentarioData, __txtPor: txtPorcentajeData }, 7, function (response) {
                    if (response) {
                        logger.log(`%cRespuesta a UPDATE VALIDATED PERIODO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        var responseS = response.split("|");
                        if (responseS[0] === "ok") {
                            showMsg("Se actualizo correctamente los datos.", 'success');
                            $("#modalComentarioForm").modal("hide");
                            clearForms(2);
                        } else if (responseS[0] === "error") {
                            showMsg("Ocurrio un error al insertar los datos.", 'error');
                        } else if (responseS[0] === "existe") {
                            showMsg("Detectamos que existe datos similares.", 'error');
                        }
                        gDpaA(idReturn2, cveOS, cveUP, cveEfiscal);
                        Swal.close();
                    } else if (response === "error") {
                        showMsg("Error al cargar datos", 'error');
                    }
                });
            } else {
                showMsg("Defina su porcentaje de 1% a 25%", 'error');
            }
        }
    });

    $(document).on("click", ".btnSeeObservacion", function () {
        var idReturn = $(this)[0].dataset.ctrlPeriodo;
        $("#modalObservacionesReporte").modal("show");
        if (idRolUser === '101') {
            gDoByIdp(idReturn);
        } else if (idRolUser === '103' || idRolUser === '104') {
            gDoByIdpA(idReturn);
        }
    });

    $(document).on("click", ".btnSolventar", function () {
        var idReturn = $(this)[0].dataset.ctrlObser;
        var idReturn2 = $(this)[0].dataset.ctrlPeriodo;
        blockUICustom();
        fetchDataArr(15, { _idCtrlObserv: idReturn }, 7, function (response) {
            if (response) {
                logger.log(`%cRespuesta a UPDATE OBSERVACION ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    showMsg("Se solvento correctamente la observación.", 'success');
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al insertar los datos.", 'error');
                } else if (responseS[0] === "existe") {
                    showMsg("Detectamos que existe datos similares.", 'error');
                }
                gDoByIdp(idReturn2);
                Swal.close();
                $("#modalObservacionesReporte").modal("show")
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });
});

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

function validarFormularioComentario() {
    let esValido = true;

    const txtComentario = $("#txtComentario").val().trim();
    if (txtComentario === "") {
        showMsgForm("txtComentario", "Escriba su comentario antes de validar.", "error");
        esValido = false;
    }

    const txtPorcentaje = $("#txtPorcentaje").val();
    if (txtPorcentaje === "" || txtPorcentaje === "0") {
        showMsgForm("txtPorcentaje", "Defina el porcentaje.", "error");
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
        $("#txtComentario").val("")
        $("#txtPorcentaje").val("")
    } else if (type === 3) {
    } else if (type === 4) {
    } else if (type === 5) {
    } else if (type === 6) {
    }
}