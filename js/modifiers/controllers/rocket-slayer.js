'use strict';

var idUser = $("#MainContent_hddnIdUsuario").val();
var idRolUser = $("#MainContent_hddnPage").val();
var cveOSd = $("#MainContent_hddnOS").val().trim();
var cveUPd = $("#MainContent_hddnUP").val().trim();
var cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();
const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"
];

const d = new Date();

const listaMedios = $("#listaMedios");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMonthName(monthNumber) {
    const date = new Date(2000, monthNumber - 1, 1);
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
    return monthName;
}

function getMonthNameFromArray(monthNumber) {
    logger.log(monthNumber);
    var newNumber = monthNumber - 1
    if (newNumber >= 0 && newNumber < 12) {
        return months[newNumber];
    } else {
        return "Invalid month number";
    }
}

function isNonLetterKey(event) {
    return !/^[a-zA-Z]$/.test(event.key);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gDao(cveOS, cveUP, eFiscal) {
    var html = '';
    blockUICustom();
    fetchDataArr(6, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, __idRol: idRolUser }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de AREAS OPORTUNIDAD [USUARIO]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var descSnTerminado = item.SN_TERMINA === false ? 'Insertar acciones de mejora' : 'Ver acciones de mejora'
                        //var colorSnTerminado = item.SN_TERMINA === false ? 'btn-falcon-danger' : 'btn-falcon-info'
                        var colorSnTerminado = item.SN_TERMINA === false ? 'text-danger' : 'text-info'
                        var dataCtrlInsertModal = item.SN_TERMINA === false ? 'data-ctrl-modal="0"' : 'data-ctrl-modal="1"'
                        var disabledBtnEnvia = item.SN_ENVIA === false ? '' : 'disabled';
                        var colorSnEnvia = '';
                        var disabledBtnValidate = item.SN_VALIDA === false ? '' : 'disabled';
                        var disabledBtnRaiz = item.SN_RAIZ === true ? '' : 'disabled';
                        var descTdEstado = '';
                        var colorTdEstado = '';

                        if (disabledBtnValidate === 'disabled') {
                            if (disabledBtnEnvia === '') {
                                colorSnEnvia = 'text-primary';
                            } else {
                                disabledBtnValidate = 'disabled'
                                disabledBtnEnvia = 'disabled'
                                colorSnEnvia = 'text-secondary';
                                descTdEstado = 'Validado'
                                colorTdEstado = 'badge-subtle-success';
                                if (disabledBtnRaiz === 'disabled') {
                                    disabledBtnEnvia = "disabled"
                                    colorSnEnvia = 'text-secondary';
                                } else {
                                    disabledBtnEnvia = "disabled"
                                    colorSnEnvia = 'text-secondary';
                                }
                            }
                        } else {
                            if (disabledBtnEnvia === '') {
                                disabledBtnEnvia = ''
                                colorSnEnvia = 'text-primary';
                                descTdEstado = 'Por enviar'
                                colorTdEstado = 'badge-subtle-danger';
                                if (disabledBtnRaiz === 'disabled') {
                                    disabledBtnEnvia = "disabled"
                                    colorSnEnvia = 'text-secondary';
                                } else {
                                    disabledBtnEnvia = ""
                                    colorSnEnvia = 'text-primary';
                                }
                            } else {
                                disabledBtnEnvia = 'disabled'
                                colorSnEnvia = 'text-secondary';
                                descTdEstado = 'Enviado a revisión'
                                colorTdEstado = 'badge-subtle-info';
                                if (disabledBtnRaiz === 'disabled') {
                                    disabledBtnEnvia = "disabled"
                                    colorSnEnvia = 'text-secondary';
                                } else {
                                    disabledBtnEnvia = "disabled"
                                    colorSnEnvia = 'text-secondary';
                                }
                            }
                        }
                        var splitAcciones = item.ACCIONES_MEJORAS === null ? [null] : item.ACCIONES_MEJORAS.split(",")
                        var htmlNums = "";
                        if (splitAcciones.length !== 0) {
                            splitAcciones.forEach(function (accion) {
                                htmlNums += `<div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-danger bg-danger-subtle fs-9'>
                                              <span>${accion === null ? 'ND' : accion}</span>
                                              </div>
                                            </div>`;
                            });
                        } else {
                            htmlNums += `<div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-danger bg-danger-subtle fs-9'>
                                              <span>${splitAcciones[0] === null ? 'ND' : splitAcciones[0]}</span>
                                              </div>
                                            </div>`;
                        }

                        html += `<tr class='btn-reveal-trigger'>
                                    <!--<td class='text-1000' style='width: 3%'>${item.NO_CONTROL}</td>-->
                                    <td>
                                      <div class='d-flex align-items-center position-relative'>
                                        <div class='avatar avatar-xl'>
                                          <div class='avatar-name rounded-circle text-primary bg-primary-subtle fs-9'>
                                          <span>${item.NO_CONTROL === null ? 'ND' : item.NO_CONTROL}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td class='text-1000'>${item.DESC_ELEMENTO_CONTROL}</td>
                                    <td class='text-1000'>${item.DESC_AREA_OPORTUNIDAD}</td>
                                    <td><span class='badge d-block p-2 ${colorTdEstado} fs-10-5 m-1'>${descTdEstado}<span></td>
                                    <td class='text-1000'><div class='d-flex align-items-center position-relative'>${htmlNums}</div></td>
                                    <td class='text-end'>
                                        <div class='dropdown font-sans-serif position-static d-inline-block'>
                                            <button class='btn btn-link text-600 btn-sm dropdown-toggle btn-reveal float-end' type='button' data-bs-toggle='dropdown' data-boundary='window' aria-haspopup='true' aria-expanded='false'>
                                                <span class='fas fa-ellipsis-h fs-10'></span>
                                            </button>
                                            <div class='dropdown-menu dropdown-menu-end border py-0'>
                                                <div class='py-2'>
                                                    <a class='dropdown-item ${colorSnTerminado} btnSeeDatosArea' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' ${dataCtrlInsertModal}>${descSnTerminado}</a>
                                                    <a class='dropdown-item ${disabledBtnEnvia} ${colorSnEnvia} btnEditDatosArea' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Editar área</a>
                                                    <a class='dropdown-item ${disabledBtnEnvia} ${colorSnEnvia} btnSendDataArea' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Enviar datos a revisión</a>
                                                    <a class='dropdown-item text-info btnSeeObservaciones' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Ver observaciones</a>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <!--<td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm ${colorSnTerminado} btnSeeDatosArea customButton m-1' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' ${dataCtrlInsertModal}>${descSnTerminado}</button>
                                            <button class='btn btn-sm btn-falcon-warning btnEditDatosArea customButton m-1 ${disabledBtnEnvia}' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Editar área</button>
                                            <button class='btn btn-sm btn-falcon-success btnSendDataArea customButton m-1 ${disabledBtnEnvia}' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Enviar datos a revisión</button>
                                            <button class='btn btn-sm btn-falcon-info btnSeeObservaciones customButton m-1' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Ver observaciones</button>
                                            <!--<button class='btn btn-sm btn-falcon-danger btnDeleteArea customButton m-1' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Eliminar</button>-->
                                        </div>
                                    </td>-->
                                </tr>`
                    });
                    recargarTabla("tableAreaOportunidad", html);
                } else {
                    recargarTabla("tableAreaOportunidad", null);
                    showMsg("El organismo aun no tiene areas de oportunidad.", 'info');
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

function gDaoA(cveOS, cveUP, eFiscal) {
    var html = '';
    blockUICustom();
    fetchDataArr(6, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, __idRol: idRolUser }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de AREAS OPORTUNIDAD [ADMIN]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var colorSnTerminado = item.SN_TERMINA === false ? 'text-danger' : 'text-primary'
                        var disabledBtnEnvia = item.SN_ENVIA === false ? 'disabled' : '';
                        var colorSnEnvia = '';
                        var disabledBtnValidate = item.SN_VALIDA === false ? 'disabled' : '';
                        var colorSnValidate = '';
                        var dataCtrlInsertModal = item.SN_TERMINA === false ? 'data-ctrl-modal="0"' : 'data-ctrl-modal="1"'
                        var descBtn = item.SN_TERMINA === false ? 'Insertar acciones de mejora' : 'Ver acciones de mejora'
                        var disabledBtnRaiz = item.SN_RAIZ === true ? '' : 'disabled';
                        var descTdEstado = '';
                        var colorTdEstado = '';

                        if (disabledBtnValidate === 'disabled') {
                            if (disabledBtnEnvia === '') {
                                descTdEstado = 'Por definir';
                                colorTdEstado = 'bg-dark dark__bg-dark';
                                disabledBtnValidate = 'disabled';
                                colorSnValidate = 'text-secondary';
                                if (disabledBtnRaiz === 'disabled') {
                                    disabledBtnEnvia = "disabled"
                                    colorSnEnvia = 'text-secondary';
                                } else {
                                    disabledBtnEnvia = "";
                                    colorSnEnvia = 'text-primary';
                                }
                            } else {
                                disabledBtnValidate = 'disabled'
                                colorSnValidate = 'text-secondary';
                                disabledBtnEnvia = 'disabled'
                                colorSnEnvia = 'text-secondary';
                                descTdEstado = 'Por enviar'
                                colorTdEstado = 'bg-warning';
                            }
                        } else {
                            disabledBtnEnvia = 'disabled'
                            colorSnEnvia = 'text-secondary';
                            descTdEstado = 'Validado'
                            colorTdEstado = 'bg-success';
                        }
                        var splitAcciones = item.ACCIONES_MEJORAS === null ? [null] : item.ACCIONES_MEJORAS.split(",")
                        var htmlNums = "";
                        if (splitAcciones.length !== 0) {
                            splitAcciones.forEach(function (accion) {
                                htmlNums += `<div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-danger bg-danger-subtle fs-9'>
                                              <span>${accion === null ? 'ND' : accion}</span>
                                              </div>
                                            </div>`;
                            });
                        } else {
                            htmlNums += `<div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-danger bg-danger-subtle fs-9'>
                                              <span>${splitAcciones[0] === null ? 'ND' : splitAcciones[0]}</span>
                                              </div>
                                            </div>`;
                        }

                        html += `<tr class='btn-reveal-trigger'>
                                    <td>
                                      <div class='d-flex align-items-center position-relative'>
                                        <div class='avatar avatar-xl'>
                                          <div class='avatar-name rounded-circle text-primary bg-primary-subtle fs-9'>
                                          <span>${item.NO_CONTROL === null ? 'ND' : item.NO_CONTROL}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <!--<td class='text-1000' style='width: 3%'>${item.NO_CONTROL_ASIGN === null ? 'ND' : item.NO_CONTROL_ASIGN}</td>-->
                                    <td class='text-1000'>${item.DESC_ELEMENTO_CONTROL}</td>
                                    <td class='text-1000'>${item.DESC_AREA_OPORTUNIDAD}</td>
                                    <td><span class='badge d-block p-2 ${colorTdEstado} fs-10-5 m-1'>${descTdEstado}<span></td>
                                    <td class='text-1000'><div class='d-flex align-items-center position-relative'>${htmlNums}</div></td>
                                    <td class='text-end'>
                                        <div class='dropdown font-sans-serif position-static d-inline-block'>
                                            <button class='btn btn-link text-600 btn-sm dropdown-toggle btn-reveal float-end' type='button' data-bs-toggle='dropdown' data-boundary='window' aria-haspopup='true' aria-expanded='false'>
                                                <span class='fas fa-ellipsis-h fs-10'></span>
                                            </button>
                                            <div class='dropdown-menu dropdown-menu-end border py-0'>
                                                <div class='py-2'>
                                                    <a class='dropdown-item ${colorSnTerminado} btnSeeDatosAreaAd' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' ${dataCtrlInsertModal}>${descBtn}</a>
                                                    <a class='dropdown-item ${disabledBtnEnvia} ${colorSnEnvia} btnValidateArea' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Validar</a>
                                                    <a class='dropdown-item ${disabledBtnEnvia} ${colorSnEnvia} btnRejectedArea' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Rechazar</a>
                                                    <a class='dropdown-item ${disabledBtnValidate} ${colorSnValidate} btnAsignNumberArea' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Asignar número</a>
                                                    <a class='dropdown-item text-info btnSeeObservaciones' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Ver observaciones</a>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <!--<td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm ${colorSnTerminado} btnSeeDatosAreaAd customButton m-1' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' ${dataCtrlInsertModal}>${descBtn}</button>
                                            <button class='btn btn-sm btn-falcon-success btnValidateArea customButton m-1 ${disabledBtnEnvia}' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Validar</button>
                                            <button class='btn btn-sm btn-falcon-danger btnRejectedArea customButton m-1 ${disabledBtnEnvia}' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Rechazar</button>
                                            <button class='btn btn-sm btn-falcon-info btnAsignNumberArea customButton m-1 ${disabledBtnValidate}' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Asignar número</button>
                                            <button class='btn btn-sm btn-falcon-info btnSeeObservaciones customButton m-1' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Ver observaciones</button>
                                            <!--<button class='btn btn-sm btn-falcon-warning btnEditDatosArea customButton m-1 ${disabledBtnEnvia}' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Editar área de oportunidad</button>-->
                                        </div>
                                    </td>-->
                                </tr>`
                    });
                    recargarTabla("tableAreaOportunidad", html);
                } else {
                    recargarTabla("tableAreaOportunidad", null);
                    showMsg("El organismo aun no tiene areas de oportunidad.", 'info');
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

function getAccionUnion(idAccion) {
    var html = '';
    blockUICustom();
    fetchDataArr(25, { _idCtrlAccion: idAccion }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de ACCIONES UNION`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var colorSnTerminado = item.SN_TERMINA === false ? 'btn-falcon-danger' : 'btn-falcon-info'
                        var disabledBtnEnvia = item.SN_ENVIA === false ? 'disabled' : '';
                        var disabledBtnValidate = item.SN_RAIZ === false ? '' : 'disabled';

                        html += `<tr>
                                    <td class='text-1000' style='width: 85%'>${item.UNIDAD}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-danger btnDeleteResp customButton m-1 ${disabledBtnValidate}' type='button' data-ctrl-acresponsable='${item.ID_CTRL_ACCION_RESPONSABLE_IMP}' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}'>Eliminar</button>
                                        </div>
                                    </td>
                                </tr>`
                    });
                    recargarTablaSinOpciones("tableAccionesUnion", html);
                } else {
                    recargarTablaSinOpciones("tableAccionesUnion", null);
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

function gDaoById(data) {
    blockUICustom();
    fetchDataArr(8, data, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de AREA OPORTUNIDAD BY ID`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length === 1) {
                    $("#cboElemento").val(response[0].ID_ELEMENTO_CONTROL);
                    $("#txtAreaOportunidad").val(response[0].DESC_AREA_OPORTUNIDAD);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
            Swal.close();
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDamCount(data) {
    fetchDataArr(10, data, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de ACCION MEJORA BY ID AREA CONTADOR`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    $("#txtNoControlAccion").val(response.length + 1);
                } else {
                    $("#txtNoControlAccion").val(response.length + 1);
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDamAllByIdArea(data) {
    var html = '';
    blockUICustom();
    fetchDataArr(11, data, 6, async function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de ACCIONES MEJORAS BY ID AREA [USUARIO]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    const itemPromises = response.map(async (item) => {
                        var descBtnMedios = '';
                        var colorBtnMedios = '';
                        var colorBtn = '';
                        var optionMedios = '';
                        const objetivosResponse = await new Promise((resolve, reject) => {
                            fetchDataArr(14, { _idCtrlAccionMejora: item.ID_CTRL_ACCION_MEJORA, __cveOS: data._OS, __cveUP: data._UP, __eFiscal: data.__eFiscal, __rolUsuario: data.__idRol }, 6, (response) => {
                                if (response) resolve(response);
                                else reject(new Error("Error en fetchDataArr 14"));
                            });
                        });

                        if (objetivosResponse.length !== 0) {
                            descBtnMedios = 'Ver medios de verificación';
                            colorBtnMedios = 'text-primary';
                            optionMedios = "data-at-modal-medios='1'";
                        } else {
                            descBtnMedios = 'Insertar medios de verificación';
                            colorBtnMedios = 'text-warning';
                            optionMedios = "data-at-modal-medios='0'";
                        }

                        const nDI = getMonthNameFromArray(parseInt(item.MES_INICIO_ID));
                        const nDF = getMonthNameFromArray(parseInt(item.MES_FINAL_ID));

                        var disabledBtn = item.SN_ENVIA === false ? '' : 'disabled';
                        var colorSnEnvia = '';
                        var setTypeEdit = item.SN_ENVIA === true ? 1 : 0;
                        var disabledBtnValidate = item.SN_VALIDA === false ? '' : 'disabled';
                        var disabledBtnRaiz = item.SN_RAIZ === true ? 'disabled' : '';

                        if (disabledBtn === 'disabled') {
                            if (disabledBtnRaiz === 'disabled') {
                                disabledBtn = "disabled"
                                colorBtn = 'text-secondary';
                                colorSnEnvia = 'text-secondary';
                            } else {
                                disabledBtn = "disabled";
                                colorBtn = 'text-secondary';
                                colorSnEnvia = 'text-secondary';
                            }
                        } else {
                            if (disabledBtnRaiz === 'disabled') {
                                disabledBtn = ""
                                colorBtn = 'text-primary';
                                colorSnEnvia = 'text-primary';
                            } else {
                                disabledBtn = "disabled";
                                colorBtn = 'text-secondary';
                                colorSnEnvia = 'text-secondary';
                            }
                        }

                        if (item.SN_RAIZ === true) {
                            $("#btnN_Medio").removeAttr("disabled");
                        } else {
                            $("#btnN_Medio").attr("disabled", true);
                        }

                        var splitAcciones = item.UNIDADES === null ? [null] : item.UNIDADES.split(",")
                        var htmlNums = "";
                        if (splitAcciones.length !== 0) {
                            splitAcciones.forEach(function (accion) {
                                var splitUnidad = accion.split("|");
                                if (splitUnidad[1] === '1') {
                                    htmlNums += `<span class='badge d-block p-2 badge-subtle-indigo fs-10-5 m-1 d-inline-block text-truncate' style='max-width: 200px;' data-bs-toggle="tooltip" data-bs-placement="top" title='${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}'>${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}</span>`;
                                } else {
                                    htmlNums += `<span class='badge d-block p-2 badge-subtle-warning fs-10-5 m-1 d-inline-block text-truncate' style='max-width: 200px;' data-bs-toggle="tooltip" data-bs-placement="top" title='${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}'>${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}</span>`;
                                }
                            });
                        } else {
                            htmlNums += `<span class='badge d-block p-2 badge-subtle-warning fs-10-5 m-1 d-inline-block text-truncate' style='max-width: 200px;' data-bs-toggle="tooltip" data-bs-placement="top" title='${splitAcciones[0] === null ? 'ND' : splitAcciones[0]}'>${splitAcciones[0] === null ? 'ND' : splitAcciones[0]}</span>`;
                        }

                        var newBtnProceso = ``;
                        if (item.ID_PROCESO === null || item.ID_PROCESO === undefined) {
                            newBtnProceso = `<a class='dropdown-item text-danger btnSetProceso' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Insertar proceso</a>`;
                        } else {
                            newBtnProceso = ``;
                        }

                        return `<tr class='btn-reveal-trigger'>
                                    <td>
                                      <div class='d-flex align-items-center position-relative'>
                                        <div class='avatar avatar-xl'>
                                          <div class='avatar-name rounded-circle text-danger bg-danger-subtle fs-9'>
                                          <span>${item.NO_CONTROL_ACCION === null ? 'ND' : item.NO_CONTROL_ACCION}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td class='text-1000 w-100'>${item.DESC_ACCION_MEJORA}</td>
                                    <td class='text-1000 w-100'>${item.DESC_UNIDAD_RESPONSABLE}</td>
                                    <td class='text-1000 w-100'>${item.DESC_RESPONSABLE_IMPLEMENTACION}</td>
                                    <td class='text-1000'>
                                        <span class='badge badge-subtle-primary d-block p-2 fs-10-5 m-1'>Inicio: ${nDI}</span>
                                        <span class='badge badge-subtle-primary d-block p-2 fs-10-5 m-1'>Termino: ${nDF}</span>
                                    </td>
                                    <td class='text-1000 w-100'>${htmlNums}</td>
                                    <td class='text-1000 w-100'>${item.MEDIOS === null ? 'Ingrese los medios de verificación' : item.MEDIOS}</td>
                                    <td class='text-end'>
                                        <div class='dropdown font-sans-serif position-static d-inline-block'>
                                            <button class='btn btn-link text-600 btn-sm dropdown-toggle btn-reveal float-end' type='button' data-bs-toggle='dropdown' data-boundary='window' aria-haspopup='true' aria-expanded='false'>
                                                <span class='fas fa-ellipsis-h fs-10'></span>
                                            </button>
                                            <div class='dropdown-menu dropdown-menu-end border py-0'>
                                                <div class='py-2'>
                                                    <a class='dropdown-item ${disabledBtn} ${colorSnEnvia} btnEditDatosAccion' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' data-ctrl-types='${setTypeEdit}'>Editar acción</a>
                                                    <a class='dropdown-item ${colorBtnMedios} btnInsertMedios' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' ${optionMedios}>${descBtnMedios}</a>
                                                    <a class='dropdown-item ${disabledBtn} ${colorSnEnvia} btnDeleteAccion' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Eliminar</a>
                                                    ${newBtnProceso}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>`
                    });

                    try {
                        const htmlParts = await Promise.all(itemPromises);
                        const html = htmlParts.join('');
                        recargarTabla("tableAcionesMejora", html);
                        Swal.close();
                    } catch (error) {
                        logger.log(`%cError procesando items ${error}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        showMsg("Ocurrió un error al procesar los datos.", 'error');
                        Swal.close();
                    }
                } else {
                    recargarTabla("tableAcionesMejora", null);
                    showMsg("El organismo aun no tiene acciones de mejora.", 'info');
                    Swal.close();
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
                Swal.close();
            }
        } else if (response === "error") {
            Swal.close();
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDamAllByIdAreaA(data) {
    var html = '';
    blockUICustom();
    fetchDataArr(11, data, 6, async function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de ACCIONES MEJORAS BY ID AREA [ADMIN]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    const itemPromises = response.map(async (item) => {
                        var descBtnMedios = '';
                        var colorBtn = '';
                        var optionMedios = '';

                        const nDI = getMonthNameFromArray(parseInt(item.MES_INICIO_ID));
                        const nDF = getMonthNameFromArray(parseInt(item.MES_FINAL_ID));

                        var disabledBtnEnvia = item.SN_ENVIA === false ? '' : 'disabled';
                        var colorBtnEnvia = '';
                        var setTypeEdit = item.SN_ENVIA === true ? 1 : 0;
                        var disabledBtnValidate = item.SN_VALIDA === false ? 'disabled' : '';
                        var colorBtnValidate = '';
                        var disabledBtnRaiz = item.SN_RAIZ === true ? '' : 'disabled';

                        const objetivosResponse = await new Promise((resolve, reject) => {
                            fetchDataArr(14, { _idCtrlAccionMejora: item.ID_CTRL_ACCION_MEJORA, __cveOS: data._OS, __cveUP: data._UP, __eFiscal: data.__eFiscal, __rolUsuario: data.__idRol }, 6, (response) => {
                                if (response) resolve(response);
                                else reject(new Error("Error en fetchDataArr 14"));
                            });
                        });

                        if (objetivosResponse.length !== 0) {
                            descBtnMedios = 'Ver medios de verificación';
                            colorBtn = 'text-primary';
                            optionMedios = "data-at-modal-medios='1'";
                        } else {
                            descBtnMedios = 'Insertar medios de verificación';
                            colorBtn = 'text-warning';
                            optionMedios = "data-at-modal-medios='0'";
                        }

                        if (disabledBtnValidate === 'disabled') {
                            if (disabledBtnEnvia === '') {
                                disabledBtnValidate = 'disabled';
                                colorBtnValidate = 'text-secondary';
                                if (disabledBtnRaiz === 'disabled') {
                                    disabledBtnEnvia = "disabled"
                                    colorBtnEnvia = 'text-secondary';
                                } else {
                                    if (disabledBtnEnvia === '') {
                                        disabledBtnEnvia = ""
                                        colorBtnEnvia = 'text-primary';
                                    } else {
                                        disabledBtnEnvia = "disabled"
                                        colorBtnEnvia = 'text-secondary';
                                    }
                                }
                            } else {
                                disabledBtnValidate = 'disabled'
                                colorBtnValidate = 'text-secondary';
                                disabledBtnEnvia = 'disabled'
                                colorBtnEnvia = 'text-secondary';
                            }
                        } else {
                            disabledBtnEnvia = ''
                            colorBtnValidate = 'text-primary';
                        }

                        var splitAcciones = item.UNIDADES === null ? [null] : item.UNIDADES.split(",")
                        var htmlNums = "";
                        if (splitAcciones.length !== 0) {
                            splitAcciones.forEach(function (accion) {
                                var splitUnidad = accion.split("|");
                                if (splitUnidad[1] === '1') {
                                    htmlNums += `<span class='badge d-block p-2 bg-indigo fs-10-5 m-1 d-inline-block text-truncate' style='max-width: 200px;' data-bs-toggle="tooltip" data-bs-placement="top" title='${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}'>${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}</span>`;
                                } else {
                                    htmlNums += `<span class='badge d-block p-2 bg-warning fs-10-5 m-1 d-inline-block text-truncate' style='max-width: 200px;' data-bs-toggle="tooltip" data-bs-placement="top" title='${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}'>${splitUnidad[0] === null ? 'ND' : splitUnidad[0]}</span>`;
                                }
                            });
                        } else {
                            htmlNums += `<span class='badge d-block p-2 bg-warning fs-10-5 m-1 d-inline-block text-truncate' style='max-width: 200px;' data-bs-toggle="tooltip" data-bs-placement="top" title='${splitAcciones[0] === null ? 'ND' : splitAcciones[0]}'>${splitAcciones[0] === null ? 'ND' : splitAcciones[0]}</span>`;
                        }

                        var newBtnProceso = ``;
                        if (item.ID_PROCESO === null || item.ID_PROCESO === undefined) {
                            newBtnProceso = `<a class='dropdown-item text-danger btnSetProceso' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Insertar proceso</a>`;
                        } else {
                            newBtnProceso = ``;
                        }

                        return `<tr class='btn-reveal-trigger'>
                                    <td>
                                          <div class='d-flex align-items-center position-relative'>
                                            <div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-danger bg-danger-subtle fs-9'>
                                              <span>${item.NO_CONTROL_ACCION === null ? 'ND' : item.NO_CONTROL_ACCION}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                    <!--<td class='text-1000'>${item.NO_CONTROL_ACCION === null ? 'ND' : item.NO_CONTROL_ACCION}</td>-->
                                    <td class='text-1000 w-100'>${item.DESC_ACCION_MEJORA}</td>
                                    <td class='text-1000 w-100'>${item.DESC_UNIDAD_RESPONSABLE}</td>
                                    <td class='text-1000 w-100'>${item.DESC_RESPONSABLE_IMPLEMENTACION}</td>
                                    <td class='text-1000'>
                                        <span class='badge bg-primary d-block p-2 fs-10-5 m-1'>Inicio: ${nDI}</span>
                                        <span class='badge bg-primary d-block p-2 fs-10-5 m-1'>Termino: ${nDF}</span>
                                    </td>
                                    <td class='text-1000 w-100'>${htmlNums}</td>
                                    <td class='text-1000 w-100'>${item.MEDIOS === null ? 'Hacen falta los medios de verificación' : item.MEDIOS}</td>
                                    <td class='text-end'>
                                        <div class='dropdown font-sans-serif position-static d-inline-block'>
                                            <button class='btn btn-link text-600 btn-sm dropdown-toggle btn-reveal float-end' type='button' data-bs-toggle='dropdown' data-boundary='window' aria-haspopup='true' aria-expanded='false'>
                                                <span class='fas fa-ellipsis-h fs-10'></span>
                                            </button>
                                            <div class='dropdown-menu dropdown-menu-end border py-0'>
                                                <div class='py-2'>
                                                    <a class='dropdown-item text-primary btnSeeMedios' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Ver medios</button>
                                                    <a class='dropdown-item ${disabledBtnEnvia} ${colorBtnEnvia} btnEditDatosAccion' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' data-ctrl-types='${setTypeEdit}'>Editar acción</a>
                                                    <!--<a class='dropdown-item ${disabledBtnEnvia} ${colorBtn} btnInsertMedios' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' ${optionMedios}>${descBtnMedios}</a>-->
                                                    <a class='dropdown-item ${disabledBtnEnvia} ${colorBtnEnvia} btnDeleteAccion' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Eliminar</a>
                                                    <a class='dropdown-item ${disabledBtnValidate} ${colorBtnValidate} btnAsignNumberAccion' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Asignar número</a>
                                                    ${newBtnProceso}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <!--<td class='text-end' style='width: 225px;'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-primary btnSeeMedios customButton m-1' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Ver medios</button>
                                            <button class='btn btn-sm btn-falcon-primary btnAsignNumberAccion customButton m-1 ${disabledBtnValidate}' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Asignar número</button>
                                            <!--<button class='btn btn-sm btn-falcon-warning btnEditDatosAccion customButton m-1 ${disabledBtnEnvia}' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' data-ctrl-types='${setTypeEdit}'>Editar acción de mejora</button>-->
                                            <button class='btn btn-sm btn-falcon-primary btnInsertMedios customButton m-1 ${disabledBtnEnvia}' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}' ${optionMedios}>${descBtnMedios}</button>
                                            <button class='btn btn-sm btn-falcon-danger btnDeleteAccion customButton m-1 ${disabledBtnEnvia}' type='button' data-ctrl-accion='${item.ID_CTRL_ACCION_MEJORA}' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Eliminar</button>
                                            ${newBtnProceso}
                                        </div>
                                    </td>-->
                                </tr>`
                    });

                    try {
                        const htmlParts = await Promise.all(itemPromises);
                        const html = htmlParts.join('');
                        recargarTabla("tableAcionesMejora", html);
                        Swal.close();
                    } catch (error) {
                        logger.log(`%cError procesando items ${error}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        Swal.close();
                        showMsg("Ocurrió un error al procesar los datos.", 'error');
                    }
                } else {
                    recargarTabla("tableAcionesMejora", null);
                    showMsg("El organismo aun no tiene acciones de mejora.", 'info');
                    Swal.close();
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDamById(data) {
    blockUICustom();
    fetchDataArr(12, data, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de ACCION MEJORA BY ID`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length === 1) {
                    // const nDI = new Date(+response[0].FECHA_INICIO.replace(/\D/g, '')).toISOString();
                    // const nDF = new Date(+response[0].FECHA_FINAL.replace(/\D/g, '')).toISOString();
                    $("#cboPeriodo").val(response[0].ID_TIPO_PERIODO);
                    //$("#txtNoControlAccion").val(response[0].NO_CONTROL_ACCION);
                    $("#txtAccionMejora").val(response[0].DESC_ACCION_MEJORA);
                    // $("#txtFechaI").val(nDI);
                    // $("#txtFechaF").val(nDF);
                    $("#cboMesInicio").val(response[0].MES_INICIO_ID);
                    $("#cboMesFinal").val(response[0].MES_FINAL_ID);
                    $("#txtAdminResp").val(response[0].DESC_UNIDAD_RESPONSABLE);
                    $("#txtRespImp").val(response[0].DESC_RESPONSABLE_IMPLEMENTACION);
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

function gDm(idCtrlAccion, cveOS, cveUP, eFiscal, idRol) {
    var html = '';
    blockUICustom();
    fetchDataArr(14, { _idCtrlAccionMejora: idCtrlAccion, __cveOS: cveOS, __cveUP: cveUP, __eFiscal: eFiscal, __rolUsuario: idRol }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de MEDIOS BY ID ACCION MEJORA [USUARIO]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var disabledBtn = item.SN_ENVIA === false ? '' : 'disabled';
                        var disabledBtn2 = item.SN_RAIZ === true ? '' : 'disabled';

                        html += `<tr>
                                    <td class='text-1000'>${item.DESC_MEDIO}</td>
                                    <td class='text-end'>
                                        <div>
                                            <button class='btn btn-sm btn-falcon-danger btnDeleteMedio customButton m-1 ${disabledBtn2}' type='button' data-ctrl-medio='${item.ID_CTRL_MEDIO}' data-ctrl-accion='${idCtrlAccion}'>Eliminar</button>
                                        </div>
                                    </td>
                                </tr>`
                    });
                    recargarTablaSinOpciones("tableMediosVerif", html);
                } else {
                    recargarTablaSinOpciones("tableMediosVerif", null);
                    showMsg("El organismo aun no tiene medios de verificación registrados.", 'info');
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

function gDmA(idCtrlAccion, cveOS, cveUP, eFiscal, idRol) {
    var html = '';
    blockUICustom();
    fetchDataArr(14, { _idCtrlAccionMejora: idCtrlAccion, __cveOS: cveOS, __cveUP: cveUP, __eFiscal: eFiscal, __rolUsuario: idRol }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de MEDIOS BY ID ACCION MEJORA [ADMIN]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        const hayEnviado = response.some(item => item.SN_ENVIA === true);
                        if (hayEnviado) {
                            $("#btnN_Medio").hide();
                        }
                        html += `<tr>
                                    <td class='text-1000'>${item.DESC_MEDIO}</td>
                                    <td class='text-1000'>Sin acciones</td>
                                </tr>`
                    });
                    recargarTablaSinOpciones("tableMediosVerif", html);
                } else {
                    recargarTablaSinOpciones("tableMediosVerif", null);
                    showMsg("El organismo aun no tiene medios de verificación registrados.", 'info');
                }
            } else {
                showMsg("Ocurrio un error al mostrar resultados.", 'error');
            }
            Swal.close();
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDo(idCtrlArea) {
    var html = '';
    blockUICustom();
    fetchDataArr(20, { _idCtrlArea: idCtrlArea }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de OBSERVACIONES BY ID AREA [USUARIO]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response.flag) {
                $("#divNew").html(response.html);
                Swal.close();
            } else {
                showMsg(response.msg, 'error');
                Swal.close();
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
            Swal.close();
        }
    });
}

function gDoA(idCtrlArea) {
    var html = '';
    blockUICustom();
    fetchDataArr(20, { _idCtrlArea: idCtrlArea }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de OBSERVACIONES BY ID AREA [ADMIN]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response.flag) {
                $("#divNew").html(response.html);
                Swal.close();
            } else {
                showMsg(response.msg, 'error');
                Swal.close();
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDaoList(eFiscal) {
    var html = '';
    blockUICustom();
    fetchDataArr(28, { _eFiscal: eFiscal }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de LISTA DE AREAS OPORTUNIDADES`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var sumHtml = "";
                        var sumHtml2 = "";
                        var disabledBtn = "";

                        if (idRolUser === '101') {
                            sumHtml = `<a class='dropdown-item ${disabledBtn} text-secondary' type='button'>Sin accesos</a>`;
                        } else {
                            sumHtml = `<a class='dropdown-item ${disabledBtn} text-warning btnEditDatosArea' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Editar área</a>`;
                            sumHtml2 = `<a class='dropdown-item ${disabledBtn} text-danger btnDeleteArea' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Eliminar área</a>`;
                        }

                        html += `<tr class='btn-reveal-trigger'>
                                        <td>
                                          <div class='d-flex align-items-center position-relative'>
                                            <div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-primary bg-primary-subtle fs-10'>
                                              <span>${item.NO_CONTROL === null ? 'ND' : item.NO_CONTROL}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td class='text-1000 w-100'>${item.DESC_AREA_OPORTUNIDAD}</td>
                                        <td class='text-end'>
                                        <div class='dropdown font-sans-serif position-static d-inline-block'>
                                            <button class='btn btn-link text-600 btn-sm dropdown-toggle btn-reveal float-end' type='button' data-bs-toggle='dropdown' data-boundary='window' aria-haspopup='true' aria-expanded='false'>
                                                <span class='fas fa-ellipsis-h fs-10'></span>
                                            </button>
                                            <div class='dropdown-menu dropdown-menu-end border py-0'>
                                                <div class='py-2'>
                                                    ${sumHtml}${sumHtml2}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                        <!--<td class='text-end'>
                                            <div>
                                                ${sumHtml}${sumHtml2}
                                                <!--<button class='btn btn-sm btn-falcon-warning btnEditDatosArea customButton m-1 ${disabledBtn}' type='button' data-ctrl-area='${item.ID_CTRL_AREA_OPORTUNIDAD}'>Editar área</button>-->
                                            </div>
                                        </td>-->
                                    </tr>`
                    });
                    recargarTablaSinOpciones("tableAreasOportunidadA", html);
                } else {
                    recargarTablaSinOpciones("tableAreasOportunidadA", null);
                    showMsg("Registre al menos un reporte para iniciar.", 'info');
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

function gDrp1(eFiscal) {
    var html = '';
    blockUICustom();
    fetchDataArr(30, { _eFiscal: eFiscal, _idReporte: 13 }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de LISTA DE REPORTES PTCI`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var sumHtml = "";
                        var disabledBtn = "";

                        if (item.ID_ESTATUS !== 7) {
                            disabledBtn = "";
                        } else if (item.ID_ESTATUS === 7) {
                            disabledBtn = "disabled";
                        } if (item.ID_ESTATUS >= 8) {
                            disabledBtn = "disabled";
                        }

                        html += `<tr>
                                        <td>
                                          <div class='d-flex align-items-center position-relative'>
                                            <div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-primary bg-primary-subtle fs-9'>
                                              <span>${item.ID_CTRL_REPORTE}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td class='text-1000 w-100'>${item.DESC_REPORTE}</td>
                                        <td class='text-1000 w-100'><span class='badge bg-primary d-block p-2 fs-10-5 m-1'>${item.estatus}</span></td>
                                        <td class='text-end'>
                                            <div>
                                                <button class='btn btn-sm btn-falcon-primary btnSeeReporte customButton m-1' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE}' data-reporte='${item.ID_REPORTE}' data-ctrl-trimestre='${item.ID_TRIMESTRE}'>Ver reporte</button>
                                                <button class='btn btn-sm btn-falcon-danger btnDeleteReporte customButton m-1 ${disabledBtn}' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE}'>Eliminar</button>
                                                <button class='btn btn-sm btn-falcon-primary btnSendRevision customButton m-1 ${disabledBtn}' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE}'>Enviar a revisión</button>
                                            </div>
                                        </td>
                                    </tr>`
                    });
                    recargarTabla("tableReportPtci", html);
                } else {
                    recargarTabla("tableReportPtci", null);
                    showMsg("Registre al menos un reporte para iniciar.", 'info');
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

function gDrp2(eFiscal) {
    var html = '';
    blockUICustom();
    fetchDataArr(30, { _eFiscal: eFiscal, _idReporte: 14 }, 6, function (response) {
        if (response) {
            logger.log(`%cDatos recibidos de LISTA DE REPORTES PTCI 2`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response !== 'error') {
                if (response.length !== 0) {
                    response.forEach(function (item) {
                        var sumHtml = "";
                        var disabledBtn = "";

                        html += `<tr>
                                        <td>
                                          <div class='d-flex align-items-center position-relative'>
                                            <div class='avatar avatar-xl'>
                                              <div class='avatar-name rounded-circle text-primary bg-primary-subtle fs-9'>
                                              <span>${item.ID_CTRL_REPORTE}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td class='text-1000 w-100'>${item.DESC_TRIMESTRE}</td>
                                        <td class='text-1000 w-100'>${item.DESC_REPORTE}</td>
                                        <td class='text-1000 w-100'><span class='badge bg-primary d-block p-2 fs-10-5 m-1'>${item.estatus}</span></td>
                                        <td class='text-end'>
                                            <div>
                                                <button class='btn btn-sm btn-falcon-primary btnSeeReporte customButton m-1' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE}' data-reporte='${item.ID_REPORTE}' data-ctrl-trimestre='${item.ID_TRIMESTRE}'>Ver reporte</button>
                                                <button class='btn btn-sm btn-falcon-danger btnDeleteReporte customButton m-1 ${disabledBtn}' type='button' data-ctrl-reporte='${item.ID_CTRL_REPORTE}'>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>`
                    });
                    recargarTabla("tableReportPtciTrimestral", html);
                } else {
                    recargarTabla("tableReportPtciTrimestral", null);
                    showMsg("Registre al menos un reporte para iniciar.", 'info');
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

function gDrp1See(idCtrlReporte, eFiscal) {
    blockUICustom({
        title: 'Descargando reporte',
        html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...</div></div>'
    });
    fetchDataArr(31, { _idCtrlReporte: idCtrlReporte, _eFiscal: eFiscal }, 6, function (response) {
        if (response) {
            logger.log(`%cRespuesta a DATOS REPORTE TRIMESTRE ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Mostrando reporte", 'success');
                window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
            } else {
                showMsg(responseS[0], 'error');
            }
            Swal.close();
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function gDrp2See(idCtrlReporte, eFiscal, idTrimestre) {
    blockUICustom({
        title: 'Descargando reporte',
        html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...</div></div>'
    });
    fetchDataArr(34, { _idCtrlReporte: idCtrlReporte, _eFiscal: eFiscal, _idTrimestre: idTrimestre }, 6, function (response) {
        if (response) {
            logger.log(`%cRespuesta a DATOS REPORTE TRIMESTRE ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Mostrando reporte", 'success');
                window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
            } else {
                showMsg(responseS[0], 'error');
            }
            Swal.close();
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sDao(data) {
    blockUICustom();
    fetchDataArr(7, data, 6, function (response) {
        if (response) {
            logger.log(`%cRespuesta a INSERT AREA OPORTUNIDAD ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto correctamente los datos.", 'success');
                clearForms(1);
                Swal.close();
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos.", 'error');
            } else if (responseS[0] === "existe") {
                showMsg("Detectamos que existe datos similares.", 'error');
            }
            if (idRolUser === '101') {
                gDao(data._OS, data._UP, data._eFiscal);
            } else if (idRolUser === '103' || idRolUser === '104') {
                gDaoA(data._OS, data._UP, data._eFiscal);
            }
            gDaoList(data._eFiscal);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function sDam(data, atModal, OS, UP) {
    blockUICustom();
    fetchDataArr(9, data, 6, function (response) {
        if (response) {
            logger.log(`%cRespuesta a INSERT ACCION MEJORA ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto correctamente los datos.", 'success');
                clearForms(2);
                gDfCproceso(0, data._cveOS, data._cveUP, data._eFiscal)
                Swal.close();
                if (parseInt(atModal) === 0) {
                    $("#btnS_Proceso").attr("data-ctrl-return-id", responseS[1]);
                    $("#modalProcesoSeleccion").modal("show");
                    $("#modalAccionMejoraForm").modal("hide");
                }
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos.", 'error');
            } else if (responseS[0] === "existe") {
                showMsg("Detectamos que existe datos similares.", 'error');
            }

            if (idRolUser === '101') {
                gDao(cveOSd, cveUPd, cveEfiscald);
            } else if (idRolUser === '103' || idRolUser === '104') {
                gDaoA(cveOSd, cveUPd, cveEfiscald);
            }

            if (parseInt(atModal) === 0) {

            } else {
                if (idRolUser === '101') {
                    gDao(cveOSd, cveUPd, cveEfiscald);
                    gDamAllByIdArea({ _idCtrlAreaOpo: data._idCtrl1, _OS: data._cveOS, _UP: data._cveUP, __eFiscal: data._eFiscal, __idRol: idRolUser })
                } else if (idRolUser === '103' || idRolUser === '104') {
                    gDaoA(cveOSd, cveUPd, cveEfiscald);
                    gDamAllByIdAreaA({ _idCtrlAreaOpo: data._idCtrl1, _OS: data._cveOS, _UP: data._cveUP, __eFiscal: data._eFiscal, __idRol: idRolUser })
                }

                $("#btnN_Accion").attr("data-ctrl-area", data._idCtrl1);
                $("#modalAccionMejora").modal("show");
                $("#modalAccionMejoraForm").modal("hide");
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function sDm(data, _idCtrlArea) {
    blockUICustom();
    fetchDataArr(13, data, 6, function (response) {
        if (response) {
            logger.log(`%cRespuesta a INSERT MEDIOS ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto correctamente los datos.", 'success');
                clearForms(3);
                Swal.close();
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos.", 'error');
            } else if (responseS[0] === "existe") {
                showMsg("Detectamos que existe datos similares.", 'error');
            }
            if (idRolUser === '101') {
                gDamAllByIdArea({ _idCtrlAreaOpo: _idCtrlArea, _OS: cveOSd, _UP: cveUPd, __eFiscal: cveEfiscald, __idRol: idRolUser })

            } else {
                gDamAllByIdAreaA({ _idCtrlAreaOpo: _idCtrlArea, _OS: cveOSd, _UP: cveUPd, __eFiscal: cveEfiscald, __idRol: idRolUser })

            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function uDa(data) {
    blockUICustom();
    fetchDataArr(19, data, 6, function (response) {
        if (response) {
            logger.log(`%cRespuesta a UPDATE REJECTED ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            if (response.flag) {
                showMsg(response.msg, 'success');
                clearForms(3);
                Swal.close();
            } else {
                showMsg(response.msg, 'error');
            }
            gDaoA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            $("#modalObservacionForm").modal("hide");
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function uDc(data) {
    blockUICustom();
    fetchDataArr(46, data, 6, function (response) {
        logger.log(`%cRespuesta a SEND COMENTARIO UNIDAD ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
        if (response.flag) {
            showMsg(response.msg, 'success');
            clearForms(3);
            Swal.close();
        } else {
            showMsg(response.msg, 'error');
        }
        gDao($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
        $("#modalComentarioForm").modal("hide");
        Swal.close();
    });
}

function sDrById(data, _cbo) {
    var url = 0;
    if (_cbo === 0) {
        url = 29
    } else {
        url = 33
    }
    blockUICustom();
    fetchDataArr(url, data, 6, function (response) {
        if (response) {
            logger.log(`%cRespuesta a INSERT NUEVO CTRL REPORTE ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto correctamente los datos.", 'success');
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos.", 'error');
            } else if (responseS[0] === "existe") {
                showMsg("Detectamos que existe datos similares.", 'error');
            }
            Swal.close();
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function uDam(data) {
    blockUICustom();
    fetchDataArr(38, data, 6, function (response) {
        if (response) {
            logger.log(`%cRespuesta a UPDATE ACCION MEJORA X PROCESO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            var responseS = response.split("|");
            if (responseS[0] === "ok") {
                showMsg("Se inserto correctamente el proceso.", 'success');
                Swal.close();
                $("#modalProcesoSeleccion").modal("hide");
            } else if (responseS[0] === "error") {
                showMsg("Ocurrio un error al insertar los datos.", 'error');
            } else if (responseS[0] === "existe") {
                showMsg("Detectamos que existe datos similares.", 'error');
            }
            if (idRolUser === '101') {
                gDao(cveOSd, cveUPd, cveEfiscald);
            } else if (idRolUser === '103' || idRolUser === '104') {
                gDaoA(cveOSd, cveUPd, cveEfiscald);
            }
            gDaoList(cveEfiscald);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

function sDNM(data) {
    blockUICustom();
    fetchDataArr(45, data, 6, function (response) {
        if (response) {
            logger.log(`%cRespuesta a INSERCION NUEVO MEDIO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            if (response.requesting === true) {
                showMsg(response.msg, 'success');
                $("#verifyMedio").val("");
                Swal.close();
            } else {
                showMsg(response.msg, 'error');
                Swal.close();
            }
            obtenerSelectDatosMedio();
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var obtenerSelectDatosEfiscal = function () {
    fetchDataArr(0, {}, 6, function (response) {
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
    fetchDataArr(1, { _txtEfiscal: txtEfiscal }, 6, function (response) {
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
    fetchDataArr(2, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 6, function (response) {
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

var obtenerSelectDatosElemento = function () {
    fetchDataArr(3, {}, 6, function (response) {
        if (response) {
            const select = $("#cboElemento");
            select.empty();
            select.append($("<option>", { text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.ID_ELEMENTO_CONTROL, text: item.DESC_ELEMENTO_CONTROL })); });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var obtenerSelectDatosPeriodo = function () {
    fetchDataArr(4, {}, 6, function (response) {
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

var obtenerSelectDatosMedio = function () {
    fetchDataArr(5, {}, 6, function (response) {
        if (response) {
            const select = $("#cboMedio");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.ID_MEDIO, text: item.DESC_MEDIO })); });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var obtenerSelectDatosResponsablesUp = function (eFiscal) {
    fetchDataArr(24, { _eFiscal: eFiscal }, 6, function (response) {
        if (response) {
            const selectI = $("#cboUPresponsablesImp");
            const selectR = $("#cboUPresponsablesRes");
            selectI.empty();
            selectR.empty();
            response.forEach(function (item) {
                selectI.append($("<option>", { value: item.CVES, text: item.Txt_Unidad_Presupuestal }));
                selectR.append($("<option>", { value: item.CVES, text: item.Txt_Unidad_Presupuestal }));
            });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var obtenerSelectDatosAreasOpos = function (id, fiscal) {
    fetchDataArr(27, { _Efiscal: fiscal }, 6, function (response) {
        if (response) {
            const select = $("#cboAreaOpo");
            select.empty();
            response.forEach(function (item) { select.append($("<option>", { value: item.ID_CTRL_AREA_OPORTUNIDAD, text: item.DESC_AREA_OPORTUNIDAD })); });
            select.val(id === 0 ? 0 : id);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var gDfCtrimestre = function (id) {
    fetchDataArr(32, {}, 6, function (response) {
        if (response) {
            const select = $("#cboTrimestreReporte");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.ID_TRIMESTRE, text: item.DESC_TRIMESTRE })); });
            switch (d.getMonth()) {
                case 0:
                case 1:
                case 2:
                    select.val(1);
                    break;
                case 3:
                case 4:
                case 5:
                    select.val(2);
                    break;
                case 6:
                case 7:
                case 8:
                    select.val(3);
                    break;
                case 9:
                case 10:
                case 11:
                    select.val(4);
                    break;
                default:
                    select.val(0);
                    break;
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var gDfCmeses = function (id) {
    fetchDataArr(36, {}, 6, function (response) {
        if (response) {
            const select = $("#cboMesInicio");
            const select2 = $("#cboMesFinal");
            select.empty();
            select2.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            select2.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) {
                select.append($("<option>", { value: item.ID_MES, text: item.DESC_MES }));
                select2.append($("<option>", { value: item.ID_MES, text: item.DESC_MES }));
            });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

var gDfCproceso = function (id, OS, UP, __eFiscal) {
    fetchDataArr(37, { _OS: OS, _UP: UP, _eFiscal: __eFiscal }, 6, function (response) {
        if (response) {
            const select = $("#cboProceso");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.forEach(function (item) { select.append($("<option>", { value: item.ProcesoID, text: item.NombreProceso })); });
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    loadEndpoints(6);
    listaMedios.hide();

    obtenerSelectDatosEfiscal();
    obtenerSelectDatosOS(cveEfiscald);
    obtenerSelectDatosUP(cveEfiscald, cveOSd, '')
    obtenerSelectDatosElemento();
    obtenerSelectDatosPeriodo();
    obtenerSelectDatosMedio();
    obtenerSelectDatosResponsablesUp(cveEfiscald);
    obtenerSelectDatosAreasOpos(0, cveEfiscald);
    gDfCtrimestre(0);
    gDfCmeses(0);
    gDfCproceso(0, cveOSd, cveUPd, cveEfiscald)
    if (idRolUser === '101') {
        logger.log("Usuario captura");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        //$("#btnN_AreaOportunidad").show();
        $("#btnN_Accion").show();
        $("#btnGroup01").hide();
        $("#tab-rpt-u-an").hide();
        $("#tab-rpt-a-tr").hide();
        //$("#btnN_Medio").show();

        gDao(cveOSd, cveUPd, cveEfiscald);
        //gDrp1(cveEfiscald);
        //gDrp2(cveEfiscald);
        gDaoList(cveEfiscald);
    } else if (idRolUser === '103' || idRolUser === '104') {
        logger.log("Usuario administrador");
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        //$("#btnN_AreaOportunidad").hide();
        //$("#btnN_Accion").hide();
        //$("#btnN_Medio").hide();
        $("#btnGroup01").show();
        $("#tab-rpt-u-an").show();
        $("#tab-rpt-a-tr").show();

        gDaoA(cveOSd, cveUPd, cveEfiscald);
        gDrp1(cveEfiscald);
        gDrp2(cveEfiscald);
        gDaoList(cveEfiscald);
    }

    $(document).on("change", "#cboUp, #cboEfiscal, #cboOs", function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (idRolUser === '101') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
                gDao(cveOS, cveUP, eFiscal);
                gDaoList(eFiscal);
            }
        } else if (idRolUser === '103' || idRolUser === '104') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
                gDaoA(cveOS, cveUP, eFiscal);
                gDrp1(eFiscal);
                gDrp2(eFiscal);
                gDaoList(eFiscal);
            }
        }
    });


    $(document).on("click", "#btnSearch", function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (idRolUser === '101') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
                gDao(cveOS, cveUP, eFiscal);
                gDaoList(eFiscal);
            }
        } else if (idRolUser === '103' || idRolUser === '104') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
                gDaoA(cveOS, cveUP, eFiscal);
                gDrp1(eFiscal);
                gDrp2(eFiscal);
                gDaoList(eFiscal);
            }
        }
    });

    $(document).on("click", "#btnN_AreaOportunidad", function () {
        $("#btnS_AreaOpo").attr("data-ctrl-area", 0);
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        $("#modalAreaOpoForm").modal("show");
        clearForms(1);
        if (idRolUser === '101') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
                gDao(cveOS, cveUP, eFiscal);
                gDaoList(eFiscal);
            }
        } else if (idRolUser === '103' || idRolUser === '104') {
            if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
                gDaoA(cveOS, cveUP, eFiscal);
                gDaoList(eFiscal);
            }
        }
    });

    $(document).on("click", "#btnN_AccionMejora", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var eFiscal = $("#cboEfiscal").val();
        $("#modalAccionMejoraForm").modal("show");
        $("#modalAccionMejora").modal("hide");
        $("#btnS_Accion").attr("data-ctrl-area", 0);
        $("#btnS_Accion").attr("data-ctrl-accion", 0);
        $("#btnS_Accion").attr("data-at-modal", 0);
        obtenerSelectDatosAreasOpos(0, eFiscal);
        clearForms(2);
        recargarTablaSinOpciones("tableAccionesUnion", null);
        //$("#txtNoControlAccion").val(0);
        //gDamCount({ _idCtrlAreaOpo: idReturn })
        $('#cboPreg').trigger('change');
    });

    $(document).on("click", ".btnEditDatosArea", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        $("#btnS_AreaOpo").attr("data-ctrl-area", idReturn);
        const data = { _idCtrlAreaOpo: idReturn };
        gDaoById(data);
        $("#modalAreaOpoForm").modal("show");
    });

    $(document).on("click", ".btnSeeDatosArea", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var idReturn2 = $(this)[0].dataset.ctrlModal;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (parseInt(idReturn2) === 0) {
            $("#modalAccionMejoraForm").modal("show");
            $("#btnCancel_Accion2").hide();
            $("#btnCancel_Accion").show();
            $("#btnS_Accion").attr("data-ctrl-area", idReturn);
            $("#btnS_Accion").attr("data-ctrl-accion", 0);
            $("#btnS_Accion").attr("data-at-modal", 0);
            clearForms(2);
            //gDamCount({ _idCtrlAreaOpo: idReturn })
        } else {
            gDamAllByIdArea({ _idCtrlAreaOpo: idReturn, _OS: cveOS, _UP: cveUP, __eFiscal: eFiscal, __idRol: idRolUser });
            $("#btnN_Accion").attr("data-ctrl-area", idReturn);
            $("#modalAccionMejora").modal("show");
        }
        $('#cboPreg').trigger('change');
    });

    $(document).on("click", ".btnSeeDatosAreaAd", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var idReturn2 = $(this)[0].dataset.ctrlModal;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (parseInt(idReturn2) === 0) {
            $("#modalAccionMejoraForm").modal("show");
            $("#btnCancel_Accion2").hide();
            $("#btnCancel_Accion").show();
            $("#btnS_Accion").attr("data-ctrl-area", idReturn);
            $("#btnS_Accion").attr("data-ctrl-accion", 0);
            $("#btnS_Accion").attr("data-at-modal", 0);
            obtenerSelectDatosAreasOpos(idReturn, eFiscal);
            recargarTablaSinOpciones("tableAccionesUnion", null);
            clearForms(2);
            //gDamCount({ _idCtrlAreaOpo: idReturn })
        } else {
            gDamAllByIdAreaA({ _idCtrlAreaOpo: idReturn, _OS: cveOS, _UP: cveUP, __eFiscal: eFiscal, __idRol: idRolUser });
            //gDamAllByIdAreaA({ _idCtrlAreaOpo: idReturn, _OS: '', _UP: '' });
            $("#btnN_Accion").attr("data-ctrl-area", idReturn);
            $("#modalAccionMejora").modal("show");
        }
        //$("#modalAccionMejora").modal("show");
        $('#cboPreg').trigger('change');
    });

    $(document).on("click", ".btnDeleteResp", function () {
        var idReturn = $(this)[0].dataset.ctrlAcresponsable;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        blockUICustom();
        fetchDataArr(26, { _idUnion: idReturn }, 6, function (response) {
            if (response) {
                logger.log(`%cRespuesta a DELETE UNION ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    gDamById({ _idCtrlAccionMejora: idReturn2 });
                    getAccionUnion(idReturn2);
                    Swal.close();
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al insertar los datos.", 'error');
                }
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", "#btnS_AreaOpo", function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        var idReturn = $(this)[0].dataset.ctrlArea;
        if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (validarFormularioAreaOportunidad()) {
                const cboElementoData = $("#cboElemento").val();
                //const txtNoControlData = $("#txtNoControl").val().trim();
                const txtAreaOportunidadData = $("#txtAreaOportunidad").val().trim();
                const idCtrl = idReturn;
                const data = { _OS: '', _UP: '', _eFiscal: eFiscal, _idUser: idUser, _idElemento: cboElementoData, _txtNoControl: null, _txtDescAreaOpor: txtAreaOportunidadData, _idCtrlAreaOportunidad: idCtrl };
                sDao(data);
            }
        }
    });

    $(document).on("click", "#btnS_Accion", async function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        var atModal = $(this)[0].dataset.atModal;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        var selectedResp = $("#cboPreg").val();
        const dataURI = getDataSelectedURI();
        const dataURR = getDataSelectedUR();
        logger.table(dataURR);
        logger.table(dataURI);
        const idReturnArea = parseInt(idReturn);

        if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (validarFormularioAccionMejora()) {
                if (dataURR.length === 0) {
                    showMsg("Elija al menos una unidad responsable.", 'error');
                    return;
                }
                if (selectedResp === "1") {
                    if (dataURI.length === 0) {
                        showMsg("Elija al menos una unidad responsable de la implementación.", 'error');
                        return;
                    }
                }

                const cboAreaOpoData = $("#cboAreaOpo").val();
                const cboAreaOpoDataInt = parseInt($("#cboAreaOpo").val());
                if (idReturnArea === 0) {
                    showMsg("Insertando nueva información.", 'alert');
                    const cboPeriodoData = $("#cboPeriodo").val();
                    //const txtNoControlAccionData = $("#txtNoControlAccion").val().trim();
                    const txtAccionMejoraData = $("#txtAccionMejora").val().trim();
                    // const txtFechaIData = $("#txtFechaI").val().trim();
                    // const txtFechaFData = $("#txtFechaF").val().trim();
                    const cboMesInicioData = $("#cboMesInicio").val();
                    const cboMesFinalData = $("#cboMesFinal").val();
                    const txtAdminRespData = $("#txtAdminResp").val().trim();
                    const txtRespImpData = $("#txtRespImp").val().trim();
                    const idCtrl1 = idReturn;
                    const idCtrl2 = idReturn2;
                    const newDataURI = JSON.stringify(dataURI);
                    const newDataURR = JSON.stringify(dataURR);
                    //const data = { _idTipo: cboPeriodoData, _idCtrl1: idCtrl1, _idUser: idUser, _txtNoControl: null, _txtAccionMejora: txtAccionMejoraData, _txtFechaI: txtFechaIData, _txtFechaF: txtFechaFData, _txtAdminResponsable: txtAdminRespData, _txtRespImplementacion: txtRespImpData, _idCtrlAccionMejora: idCtrl2, listUR: newDataURI, _eFiscal: eFiscal, _cveOS: cveOS, _cveUP: cveUP, listURR: newDataURR, _idAreaOpo: cboAreaOpoData, _typeSelected: selectedResp };
                    const data = { _idTipo: cboPeriodoData, _idCtrl1: idCtrl1, _idUser: idUser, _txtNoControl: null, _txtAccionMejora: txtAccionMejoraData, _txtFechaI: cboMesInicioData, _txtFechaF: cboMesFinalData, _txtAdminResponsable: txtAdminRespData, _txtRespImplementacion: txtRespImpData, _idCtrlAccionMejora: idCtrl2, listUR: newDataURI, _eFiscal: eFiscal, _cveOS: cveOS, _cveUP: cveUP, listURR: newDataURR, _idAreaOpo: cboAreaOpoData, _typeSelected: selectedResp };
                    sDam(data, atModal, cveOS, cveUP);
                } else if (idReturnArea === cboAreaOpoDataInt) {
                    showMsg("Enviando información sin editar area de oportunidad.", 'alert');
                    const cboPeriodoData = $("#cboPeriodo").val();
                    //const txtNoControlAccionData = $("#txtNoControlAccion").val().trim();
                    const txtAccionMejoraData = $("#txtAccionMejora").val().trim();
                    // const txtFechaIData = $("#txtFechaI").val().trim();
                    // const txtFechaFData = $("#txtFechaF").val().trim();
                    const cboMesInicioData = $("#cboMesInicio").val();
                    const cboMesFinalData = $("#cboMesFinal").val();
                    const txtAdminRespData = $("#txtAdminResp").val().trim();
                    const txtRespImpData = $("#txtRespImp").val().trim();
                    const idCtrl1 = idReturn;
                    const idCtrl2 = idReturn2;
                    const newDataURI = JSON.stringify(dataURI);
                    const newDataURR = JSON.stringify(dataURR);
                    //const data = { _idTipo: cboPeriodoData, _idCtrl1: idCtrl1, _idUser: idUser, _txtNoControl: null, _txtAccionMejora: txtAccionMejoraData, _txtFechaI: txtFechaIData, _txtFechaF: txtFechaFData, _txtAdminResponsable: txtAdminRespData, _txtRespImplementacion: txtRespImpData, _idCtrlAccionMejora: idCtrl2, listUR: newDataURI, _eFiscal: eFiscal, _cveOS: cveOS, _cveUP: cveUP, listURR: newDataURR, _idAreaOpo: cboAreaOpoData, _typeSelected: selectedResp };
                    const data = { _idTipo: cboPeriodoData, _idCtrl1: idCtrl1, _idUser: idUser, _txtNoControl: null, _txtAccionMejora: txtAccionMejoraData, _txtFechaI: cboMesInicioData, _txtFechaF: cboMesFinalData, _txtAdminResponsable: txtAdminRespData, _txtRespImplementacion: txtRespImpData, _idCtrlAccionMejora: idCtrl2, listUR: newDataURI, _eFiscal: eFiscal, _cveOS: cveOS, _cveUP: cveUP, listURR: newDataURR, _idAreaOpo: cboAreaOpoData, _typeSelected: selectedResp };
                    sDam(data, atModal, cveOS, cveUP);
                } else if (idReturnArea !== cboAreaOpoDataInt) {
                    const confirmado = await alertConfirmMessage("¿Está seguro de editar el área de oportunidad? Las demás unidades serán afectadas y actualizadas.");
                    if (!confirmado) {
                        return
                    } else {
                        showMsg("Actualizando, y enviando información.", 'alert');
                        const cboPeriodoData = $("#cboPeriodo").val();
                        //const txtNoControlAccionData = $("#txtNoControlAccion").val().trim();
                        const txtAccionMejoraData = $("#txtAccionMejora").val().trim();
                        // const txtFechaIData = $("#txtFechaI").val().trim();
                        // const txtFechaFData = $("#txtFechaF").val().trim();
                        const cboMesInicioData = $("#cboMesInicio").val();
                        const cboMesFinalData = $("#cboMesFinal").val();
                        const txtAdminRespData = $("#txtAdminResp").val().trim();
                        const txtRespImpData = $("#txtRespImp").val().trim();
                        const idCtrl1 = idReturn;
                        const idCtrl2 = idReturn2;
                        const newDataURI = JSON.stringify(dataURI);
                        const newDataURR = JSON.stringify(dataURR);
                        //const data = { _idTipo: cboPeriodoData, _idCtrl1: idCtrl1, _idUser: idUser, _txtNoControl: null, _txtAccionMejora: txtAccionMejoraData, _txtFechaI: txtFechaIData, _txtFechaF: txtFechaFData, _txtAdminResponsable: txtAdminRespData, _txtRespImplementacion: txtRespImpData, _idCtrlAccionMejora: idCtrl2, listUR: newDataURI, _eFiscal: eFiscal, _cveOS: cveOS, _cveUP: cveUP, listURR: newDataURR, _idAreaOpo: cboAreaOpoData, _typeSelected: selectedResp };
                        const data = { _idTipo: cboPeriodoData, _idCtrl1: idCtrl1, _idUser: idUser, _txtNoControl: null, _txtAccionMejora: txtAccionMejoraData, _txtFechaI: cboMesInicioData, _txtFechaF: cboMesFinalData, _txtAdminResponsable: txtAdminRespData, _txtRespImplementacion: txtRespImpData, _idCtrlAccionMejora: idCtrl2, listUR: newDataURI, _eFiscal: eFiscal, _cveOS: cveOS, _cveUP: cveUP, listURR: newDataURR, _idAreaOpo: cboAreaOpoData, _typeSelected: selectedResp };
                        sDam(data, atModal, cveOS, cveUP);
                    }
                    // alertConfirmMessage('¿Está seguro de editar el área de oportunidad? Las demás unidades serán afectadas y actualizadas.').then((confirmed) => {
                    //     if (confirmed) {

                    //     } else {
                    //         showMsg("Cancelando envio de información.", 'alert');
                    //     }
                    // });
                }
            }
        }
    });

    $(document).on("click", ".btnEditDatosAccion", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var idReturn2 = $(this)[0].dataset.ctrlAccion;
        var idReturn3 = $(this)[0].dataset.ctrlTypes;
        var eFiscal = $("#cboEfiscal").val();
        if (idReturn3 === 1) {
            showMsg("Iimposible editar.", 'error');
            return;
        }
        $("#btnS_Accion").attr("data-ctrl-area", idReturn);
        $("#btnS_Accion").attr("data-ctrl-accion", idReturn2);
        $("#btnS_Accion").attr("data-at-modal", 1);
        $("#btnCancel_Accion2").show();
        $("#btnCancel_Accion").hide();
        //gDamCount({ _idCtrlAreaOpo: idReturn })
        getAccionUnion(idReturn2);
        gDamById({ _idCtrlAccionMejora: idReturn2 });
        obtenerSelectDatosAreasOpos(idReturn, eFiscal);
        $("#modalAccionMejoraForm").modal("show");
        $("#modalAccionMejora").modal("hide");
    });

    $(document).on("click", "#btnN_Accion", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        $("#modalAccionMejoraForm").modal("show");
        $("#modalAccionMejora").modal("hide");
        $("#btnS_Accion").attr("data-ctrl-area", idReturn);
        $("#btnS_Accion").attr("data-ctrl-accion", 0);
        $("#btnS_Accion").attr("data-at-modal", 0);
        clearForms(2);
        recargarTablaSinOpciones("tableAccionesUnion", null);
        //gDamCount({ _idCtrlAreaOpo: idReturn })
    });

    $(document).on("click", "#btnCancel_Accion2", function () {
        $("#modalAccionMejoraForm").modal("hide");
        $("#modalAccionMejora").modal("show");
    });

    $(document).on("click", "#btnCancel_Medio", function () {
        $("#modalMediosForm").modal("hide");
        $("#modalAccionMejora").modal("show");
    });

    $(document).on("click", "#btnCancel_ViewMedio", function () {
        $("#modalMedios").modal("hide");
        $("#modalAccionMejora").modal("show");
    });

    $(document).on("click", ".btnInsertMedios", function () {
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var idReturn2 = $(this)[0].dataset.atModalMedios;
        var idReturn3 = $(this)[0].dataset.ctrlArea;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        listaMedios.hide();

        if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (parseInt(idReturn2) === 0) {
                clearForms(3);
                $("#btnS_Medio").attr("data-ctrl-accion", idReturn);
                $("#btnS_Medio").attr("data-ctrl-area", idReturn3);
                $("#modalAccionMejora").modal("hide");
                $("#modalMediosForm").modal("show");
            } else {
                $("#modalMedios").modal("show");
                $("#modalAccionMejora").modal("hide");
                $("#btnN_Medio").attr("data-ctrl-accion", idReturn);
                $("#btnN_Medio").attr("data-ctrl-area", idReturn3);
                gDm(idReturn, cveOS, cveUP, eFiscal, idRolUser);
            }
        }
    });

    $(document).on("click", ".btnSeeMedios", function () {
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var idReturn2 = $(this)[0].dataset.ctrlArea;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();

        if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            gDmA(idReturn, cveOS, cveUP, eFiscal, idRolUser);
            $("#btnN_Medio").attr("data-ctrl-accion", idReturn).attr("data-ctrl-area", idReturn2);
            $("#modalAccionMejora").modal("hide");
            $("#modalMedios").modal("show");
        }
    });

    $(document).on("click", "#btnS_Medio", function () {
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var idReturn2 = $(this)[0].dataset.ctrlArea;
        const dataMedios = getDataSelectedMedio(idReturn);

        if (dataMedios.length === 0) {
            showMsg("Elija sus medios de verificación.", 'error');
            return;
        }
        const newDataMedios = JSON.stringify(dataMedios);
        logger.table(newDataMedios);
        const data = { _listValues: newDataMedios, _idUsuario: idUser }
        sDm(data, idReturn2);
    });

    $(document).on("click", "#btnN_Medio", function () {
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var idReturn2 = $(this)[0].dataset.ctrlArea;
        clearForms(3);
        $("#btnS_Medio").attr("data-ctrl-accion", idReturn);
        $("#btnS_Medio").attr("data-ctrl-area", idReturn2);
        $("#modalMedios").modal("hide");
        $("#modalMediosForm").modal("show");
    });

    $(document).on("click", ".btnSendDataArea", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();

        if (verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (parseInt(idReturn) !== 0) {
                blockUICustom();
                fetchDataArr(15, { _idCtrlArea: idReturn, _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 6, function (response) {
                    if (response) {
                        logger.log(`%cDatos recibidos de VERIFICA DATOS AREAS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        logger.table(response)
                        if (response !== 'error') {
                            const algunoFalla01 = response.some(item => item.NUM_AREAS === 0);
                            const algunoFalla02 = response.some(item => item.NUM_ACCIONES === 0);
                            const algunoFalla03 = response.some(item => item.NUM_MEDIOS === 0);
                            const conNulos = response.some(item => item.HAY_NULL === 1);
                            const conNulos2 = response.some(item => item.HAY_NULL_2 === 1);
                            const contieneObserToResponder = response.some(item => item.CONTIENE_OBSERS >= 1);
                            logger.warn(algunoFalla01, algunoFalla02, algunoFalla03, conNulos, conNulos2);
                            if (conNulos || conNulos2) {
                                showMsg(`Verifique o revise con las demás áreas su información o la información ingresada esta incompleta.`, 'info');
                                Swal.close();
                                return;
                            }
                            if (algunoFalla01 || algunoFalla02 || algunoFalla03) {
                                showMsg("Detectamos que su area de oportunidad, le hacen falta datos. Verifique de favor.", 'error');
                                Swal.close();
                                return;
                            } else {
                                const algunoFalla04 = response.some(item => item.NUM_OBSERS !== 0);
                                if (algunoFalla04) {
                                    showMsg("Detectamos que su area de oportunidad, tiene observaciones. Verifique de favor.", 'alert');
                                    Swal.close();
                                    return;
                                }
                                if (contieneObserToResponder) {
                                    showMsg("Se mostrará una ventana, favor de responder las observaciones de esta área de oportunidad.", 'alert');
                                    $("#modalComentarioForm").modal("show");
                                    $("#btnSendComentario").attr("data-ctrl-area", idReturn);
                                    Swal.close();
                                    return;
                                }

                                fetchDataArr(16, { _idCtrlAreaById: idReturn, _idUser: idUser, __eFiscal: eFiscal }, 6, function (response) {
                                    logger.log(`%cNO RECUERDO QUE SEA... REVISAR ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                    if (response.flag) {
                                        showMsg(response.msg, 'success');
                                        gDao(cveOS, cveUP, eFiscal);
                                    } else {
                                        showMsg(response.msg, 'error');
                                    }
                                    Swal.close();
                                });
                            }
                        } else {
                            showMsg("Ocurrio un error al mostrar resultados.", 'error');
                        }
                    } else if (response === "error") {
                        showMsg("Error al cargar datos", 'error');
                    }
                });
            }
        }
    });

    $(document).on("click", ".btnValidateArea", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        blockUICustom();
        fetchDataArr(18, { _idCtrlAreaById: idReturn, _idUser: idUser, __eFiscal: eFiscal }, 6, function (response) {
            if (response) {
                logger.log(`%cRespuesta a UPDATE VALIDATE ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                if (response.flag === true) {
                    showMsg(response.msg, 'success');
                    clearForms(3);
                } else {
                    showMsg(response.msg, 'error');
                }
                gDaoA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                Swal.close();
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", ".btnRejectedArea", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        $("#modalObservacionForm").modal("show");
        $("#btnSendObserArea").attr("data-ctrl-area", idReturn)
    });

    $(document).on("click", "#btnSendObserArea", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if ($("#txtObservacion").val() === "") {
            showMsg("Favor de describir su observación.", 'success');
            return;
        }
        if (idReturn === undefined || idReturn === 0 || idReturn === null || idReturn === "0") { showMsg("Se perdieron algunos datos, favor de intentar de nuevo.", 'error'); return; }
        const txtObservacionData = $("#txtObservacion").val().trim();
        const data = { _idCtrlAreaById: idReturn, _idUser: idUser, _txtObser: txtObservacionData, __eFiscal: eFiscal }
        uDa(data);
        $("#txtObservacion").val("");
    });

    $(document).on("click", "#btnSendComentario", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if ($("#txtComentario").val() === "") {
            showMsg("Favor de describir su comentario, antes de enviar.", 'error');
            return;
        }
        if (idReturn === undefined || idReturn === 0 || idReturn === null || idReturn === "0") { showMsg("Se perdieron algunos datos, favor de intentar de nuevo.", 'error'); return; }
        const txtComentarioData = $("#txtComentario").val().trim();
        const data = { _idCtrlAreaById: idReturn, _idUser: idUser, _txtObser: txtComentarioData, __eFiscal: eFiscal }
        uDc(data);
        $("#txtComentario").val("");
    });

    $(document).on("click", ".btnSeeObservaciones", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        if (idRolUser === '101') {
            gDo(idReturn);
            $("#modalObservacionesReporte").modal("show");
        } else if (idRolUser === '103' || idRolUser === '104') {
            gDoA(idReturn);
            $("#modalObservacionesReporte").modal("show");
        }
    });

    $(document).on("click", ".btnSolventar", function () {
        var idReturn = $(this)[0].dataset.ctrlObser;
        var idReturn2 = $(this)[0].dataset.ctrlArea;
        blockUICustom();
        fetchDataArr(21, { _idCtrlObserv: idReturn }, 6, function (response) {
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
                gDo(idReturn2);
                Swal.close();
                $("#modalObservacionesReporte").modal("show")
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", ".btnAsignNumberArea", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        $("#modalNumeroInternoArea").modal("show");
        $("#btnS_ConsecutivoArea").attr("data-ctrl-area", idReturn);
    });

    $(document).on("click", ".btnAsignNumberAccion", function () {
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var idReturn2 = $(this)[0].dataset.ctrlArea;
        $("#modalNumeroInternoAccion").modal("show");
        $("#btnS_ConsecutivoAccion").attr("data-ctrl-accion", idReturn);
        $("#btnS_ConsecutivoAccion").attr("data-ctrl-area", idReturn2);
    });

    $(document).on("click", "#btnS_ConsecutivoArea", function () {
        var idReturn = $(this)[0].dataset.ctrlArea;
        var eFiscal = $("#cboEfiscal").val();
        if ($("#txtNoConsecutivoArea").val() === "") {
            showMsg("Defina un número de control.", 'success');
            return;
        }
        const txtNoConsecutivoAreaData = $("#txtNoConsecutivoArea").val().trim();
        blockUICustom();
        fetchDataArr(22, { _idCtrlArea: idReturn, _txtNumero: txtNoConsecutivoAreaData, _eFiscal: eFiscal }, 6, function (response) {
            if (response) {
                logger.log(`%cRespuesta a UPDATE AREA NUEVO NUMERO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    showMsg("Se inserto el nuevo numero de control.", 'success');
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al insertar los datos.", 'error');
                } else if (responseS[0] === "existe") {
                    showMsg("Detectamos que existe datos similares.", 'error');
                }
                gDaoA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                Swal.close();
                $("#modalNumeroInternoArea").modal("hide")
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", "#btnS_ConsecutivoAccion", function () {
        var idReturn = $(this)[0].dataset.ctrlAccion;
        var idReturn2 = $(this)[0].dataset.ctrlArea;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if ($("#txtNoConsecutivoAccion").val() === "") {
            showMsg("Defina un número de control.", 'success');
            return;
        }
        const txtNoConsecutivoAccionData = $("#txtNoConsecutivoAccion").val().trim();
        blockUICustom();
        fetchDataArr(23, { _idCtrlAccion: idReturn, _txtNumero: txtNoConsecutivoAccionData, _eFiscal: eFiscal }, 6, function (response) {
            if (response) {
                logger.log(`%cRespuesta a UPDATE ACCION NUEVO NUMERO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                var responseS = response.split("|");
                if (responseS[0] === "ok") {
                    showMsg("Se inserto el nuevo numero de control.", 'success');
                } else if (responseS[0] === "error") {
                    showMsg("Ocurrio un error al insertar los datos.", 'error');
                } else if (responseS[0] === "existe") {
                    showMsg("Detectamos que existe datos similares.", 'error');
                }
                gDamAllByIdAreaA({ _idCtrlAreaOpo: idReturn2, _OS: cveOS, _UP: cveUP, __eFiscal: eFiscal, __idRol: idRolUser });
                gDaoA($("#cboUp").val(), $("#cboOs").val(), $("#cboEfiscal").val());
                Swal.close();
                $("#modalNumeroInternoAccion").modal("hide")
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("change", "#cboPreg", function () {
        var selectedValue = $(this).val();
        if (selectedValue === "1") { //NO
            $("#cboUPresponsablesImp").removeAttr("disabled");
            $("#btnSelectAll").removeAttr("disabled");
            $("#btnCleanAll").removeAttr("disabled");
        } else if (selectedValue === "2") { // SI
            $("#cboUPresponsablesImp").prop('disabled', true);
            $('#btnSelectAll').prop('disabled', true);
            $('#btnCleanAll').prop('disabled', true);
        } else if (selectedValue === "0") { // SI
            $("#cboUPresponsablesImp").prop('disabled', true);
            $('#btnSelectAll').prop('disabled', true);
            $('#btnCleanAll').prop('disabled', true);
        }
    });

    $(document).on("click", ".btnR", function () {
        const idReturn = $(this)[0].dataset.ctrlId;
        var eFiscal = $("#cboEfiscal").val();
        const data = { _idReporte: idReturn, _idUser: idUser, _eFiscal: eFiscal }
        sDrById(data, 0);
    });

    $(document).on("click", ".btnSeeReporte", function () {
        const idReturn = $(this)[0].dataset.ctrlReporte;
        const idReturn2 = $(this)[0].dataset.reporte;
        const idReturn3 = $(this)[0].dataset.ctrlTrimestre;
        var eFiscal = $("#cboEfiscal").val();
        if (parseInt(idReturn2) === 13) {
            gDrp1See(idReturn, eFiscal);
        } else {
            gDrp2See(idReturn, eFiscal, idReturn3);
        }
    });

    $(document).on("click", "#btnSetPTCI_2", function () {
        const idReturn = $(this)[0].dataset.ctrlId;
        var eFiscal = $("#cboEfiscal").val();
        $("#modalReportTrimestralForm").modal("show")
        $("#btnS_ReportePtciTrimestral").attr("data-ctrl-id", idReturn);
    });

    $(document).on("click", "#btnS_ReportePtciTrimestral", function () {
        const idReturn = $(this)[0].dataset.ctrlId;
        var eFiscal = $("#cboEfiscal").val();
        const cboTrimestreData = $("#cboTrimestreReporte").val();
        if (cboTrimestreData === "" || cboTrimestreData === 0) {
            showMsg("Elija el trimestre", 'error');
            return;
        }
        const data = { _idReporte: idReturn, _idUser: idUser, _eFiscal: eFiscal, _idTrimestre: cboTrimestreData }
        sDrById(data, cboTrimestreData);
    });

    $('#btnSelectAll').on('click', function () {
        var allValues = [];
        $('#cboUPresponsablesImp option').each(function () {
            allValues.push($(this).val());
        });
        $('#cboUPresponsablesImp').val(allValues);
        $('#cboUPresponsablesImp').trigger('change');
    });

    $('#btnCleanAll').on('click', function () {
        var allValues = [];
        $('#cboUPresponsablesImp').val(allValues);
        $('#cboUPresponsablesImp').trigger('change');
    });

    $(document).on("click", ".btnSendRevision", function () {
        const idReturn = $(this)[0].dataset.ctrlReporte;
        blockUICustom();
        if (parseInt(idReturn) === 0 || parseInt(idReturn) === undefined) {
            showMsg("Error al cargar datos, intente de nuevo", 'error');
            Swal.close();
            return;
        } else {
            fetchDataArr(35, { _idCtrlReporte: idReturn }, 6, function (response) {
                if (response) {
                    logger.log(`%cRespuesta a UPDATE REPORTE ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    var responseS = response.split("|");
                    if (responseS[0] === "ok") {
                        showMsg("Se envio y actualizo el reporte.", 'success');
                    } else if (responseS[0] === "error") {
                        showMsg("Ocurrio un error al insertar los datos.", 'error');
                    } else if (responseS[0] === "existe") {
                        showMsg("Detectamos que existe datos similares.", 'error');
                    }
                    gDrp1(cveEfiscald);
                    Swal.close();
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                }
            });
        }
    });

    $(document).on("click", "#btnS_Proceso", function () {
        const idReturn = $(this)[0].dataset.ctrlReturnId;
        const cboProcesoData = $("#cboProceso").val();
        const cboText = $('#cboProceso option:selected').text();
        if (cboProcesoData === "" || cboProcesoData === null || cboProcesoData === undefined || cboText === "SELECCIONE") {
            showMsgForm("cboProcesoData", "Elija un proceso por favor.");
            return;
        }
        const data = { _idCtrlAM: idReturn, _idProceso: cboProcesoData }
        uDam(data);
    });

    $(document).on("click", ".btnSetProceso", function () {
        const idReturn = $(this)[0].dataset.ctrlAccion;
        $("#btnS_Proceso").attr("data-ctrl-return-id", idReturn);
        $("#modalProcesoSeleccion").modal("show");
        $("#modalAccionMejora").modal("hide");
    });

    $(document).on("click", ".btnDeleteArea", async function () {
        const idReturn = $(this)[0].dataset.ctrlArea;
        const confirmado = await alertConfirmMessage("¿Está seguro de eliminar el área de oportunidad?");
        if (!confirmado) { return }
        const data = { _idCtrlArea: idReturn };
        blockUICustom();
        fetchDataArr(39, data, 6, function (response) {
            if (response) {
                logger.log(`%cRespuesta de ELIMINAR AREA DE OPORTUNIDAD ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                if (response.requesting === true) {
                    fetchDataArr(40, data, 6, function (response) {
                        if (response) {
                            logger.log(`%cRespuesta de SE PUEDE ELIMINAR ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                            if (response.requesting === true) {
                                showMsg(response.msg, 'success');
                                gDaoList(cveEfiscald);
                            } else {
                                showMsg(response.msg, 'error');
                            }
                        } else if (response === "error") {
                            showMsg("Error al cargar datos", 'error');
                        }
                    });
                } else {
                    if (response.msg === "Con datos") {
                        showMsg("Imposible eliminar, el área contiene una o más acciones de mejora. Revise", 'error');
                    } else {
                        showMsg(response.msg, 'error');
                    }
                }
                Swal.close();
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", ".btnDeleteAccion", async function () {
        const idReturn = $(this)[0].dataset.ctrlAccion;
        const confirmado = await alertConfirmMessage("¿Está seguro de eliminar la acción de mejora?. Esto eliminara las referencias y medios también, por lo tanto, el área de oportunidad no se vera reflejado");
        if (!confirmado) { return }
        const data = { _idCtrlAccion: idReturn };
        blockUICustom();
        fetchDataArr(42, data, 6, function (response) {
            if (response) {
                logger.log(`%cRespuesta de ELIMINAR ACCION DE MEJORA ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                if (response.requesting === true) {
                    showMsg(response.msg, 'success');
                    $("#modalAccionMejora").modal("hide");
                } else {
                    showMsg(response.msg, 'error');
                }
                Swal.close();
                if (idRolUser === '101') {
                    gDao(cveOSd, cveUPd, cveEfiscald);
                } else {
                    gDaoA(cveOSd, cveUPd, cveEfiscald);
                }
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    $(document).on("click", ".btnDeleteMedio", async function () {
        const idReturn = $(this)[0].dataset.ctrlMedio;
        const idReturn2 = $(this)[0].dataset.ctrlAccion;
        const confirmado = await alertConfirmMessage("¿Está seguro de eliminar el medio de verificación?");
        if (!confirmado) { return }
        const data = { _idCtrlMedio: idReturn };
        blockUICustom();
        fetchDataArr(43, data, 6, function (response) {
            if (response) {
                logger.log(`%cRespuesta de ELIMINAR MEDIO DE VERIFICACION ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                if (response.requesting === true) {
                    showMsg(response.msg, 'success');
                    $("#modalAccionMejora").modal("hide");
                } else {
                    showMsg(response.msg, 'error');
                }
                Swal.close();
                if (idRolUser === '101') {
                    gDm(idReturn2, cveOSd, cveUPd, cveEfiscald);
                } else {
                    gDmA(idReturn2);
                }
            } else if (response === "error") {
                showMsg("Error al cargar datos", 'error');
            }
        });
    });

    var xTriggered = 0;
    $("#verifyMedio").on("keyup", function (event) {
        if (event.which == 13) {
            event.preventDefault();
        }
        xTriggered++;
        if ($(this).val() === "" || $(this).val() === null || $(this).val() === undefined) {
            listaMedios.hide().html("");
        } else {
            if (isNonLetterKey(event)) {
                return;
            }
            const data = { _txtSearch: $(this).val() }
            fetchDataArr(44, data, 6, function (response) {
                if (response) {
                    logger.log(`%cRespuesta de EXISTENCIA DE MEDIO DE VERIFICACION ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    if (response.requesting === true) {
                        listaMedios.show().html("Medios existentes: " + response.listaMedio);
                    } else {
                        listaMedios.show().html("El medio escrito, no esta registrado.");
                    }
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                }
            });
        }
    });

    $(document).on("click", "#btnSN_Medio", function () {
        const verifyMedioData = $("#verifyMedio").val();
        if (verifyMedioData === "" || verifyMedioData === null || verifyMedioData === undefined) {
            showMsgForm("cboProcesoData", "Escriba el nuevo medio de verificación.");
            return;
        }
        const data = { _txtNMedio: verifyMedioData }
        sDNM(data);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function validarFormularioAreaOportunidad() {
    let esValido = true;

    const cboElemento = $("#cboElemento").val();
    if (cboElemento === "" || cboElemento === 0 || cboElemento === "0") {
        showMsgForm("cboElemento", "Elija un elemento de control.", "error");
        esValido = false;
    }

    // const txtNoControl = $("#txtNoControl").val().trim();
    // if (txtNoControl === "" || txtNoControl === "0") {
    //     showMsgForm("txtNoControl", "Ocurrio un error con el número de control.");
    //     esValido = false;
    // }

    const txtAreaOportunidad = $("#txtAreaOportunidad").val().trim();
    if (txtAreaOportunidad === "") {
        showMsgForm("txtAreaOportunidad", "Ingrese su descripción de la área de oportunidad.", "error");
        esValido = false;
    }

    return esValido;
}

function validarFormularioAccionMejora() {
    let esValido = true;

    const cboPeriodo = $("#cboPeriodo").val();
    if (cboPeriodo === "" || cboPeriodo === 0 || cboPeriodo === "0") {
        showMsgForm("cboPeriodo", "Elija el tipo de periodo.", "error");
        esValido = false;
    }

    const cboAreaOpo = $("#cboAreaOpo").val();
    if (cboAreaOpo === "" || cboAreaOpo === 0 || cboAreaOpo === "0" || cboAreaOpo === null) {
        showMsgForm("cboAreaOpo", "Elija su area de oportunidad.", "error");
        esValido = false;
    }

    // const txtNoControlAccion = $("#txtNoControlAccion").val().trim();
    // if (txtNoControlAccion === "" || txtNoControlAccion === "0") {
    //     showMsgForm("txtNoControlAccion", "Ocurrio un error con el número de control.");
    //     esValido = false;
    // }

    const txtAccionMejora = $("#txtAccionMejora").val().trim();
    if (txtAccionMejora === "") {
        showMsgForm("txtAccionMejora", "Ingrese su descripción de la acción de mejora.", "error");
        esValido = false;
    }

    // const txtFechaI = $("#txtFechaI").val().trim();
    // if (txtFechaI === "") {
    //     showMsgForm("txtFechaI", "Seleccione la fecha de inicio.");
    //     esValido = false;
    // }

    // const txtFechaF = $("#txtFechaF").val().trim();
    // if (txtFechaF === "") {
    //     showMsgForm("txtFechaF", "Seleccione la fecha de termino.");
    //     esValido = false;
    // }

    const cboMesInicio = $("#cboMesInicio").val();
    if (cboMesInicio === "" || cboMesInicio === 0 || cboMesInicio === "0" || cboMesInicio === null) {
        showMsgForm("cboMesInicio", "Elija un mes de inicio.", "error");
        esValido = false;
    }

    const cboMesFinal = $("#cboMesFinal").val();
    if (cboMesFinal === "" || cboMesFinal === 0 || cboMesFinal === "0" || cboMesFinal === null) {
        showMsgForm("cboMesFinal", "Elija un mes de conclusión.", "error");
        esValido = false;
    }

    const txtAdminResp = $("#txtAdminResp").val().trim();
    if (txtAdminResp === "") {
        showMsgForm("txtAdminResp", "Ingrese la(s) unidades administrativas responsables.", "error");
        esValido = false;
    }

    const txtRespImp = $("#txtRespImp").val().trim();
    if (txtRespImp === "") {
        showMsgForm("txtRespImp", "Ingrese las(s) unidades administrativas que implmentarán la acción.", "error");
        esValido = false;
    }

    return esValido;
}

function getDataSelectedMedio(id) {
    const selectNumbers = document.getElementById('cboMedio');
    let numberSelected = [];

    numberSelected = Array.from(selectNumbers.selectedOptions)
        .filter(option => option.value !== "")
        .map(option => ({
            ID_MEDIO: option.value,
            NOMBRE: option.text,
            ID_CTRL_ACCION_MEJORA: id,
        }));
    return numberSelected;
}

function getDataSelectedURI() {
    const selectNumbers = document.getElementById('cboUPresponsablesImp');
    let numberSelected = [];

    numberSelected = Array.from(selectNumbers.selectedOptions)
        .filter(option => option.value !== "")
        .map(option => ({
            ID_UNIDAD: option.value,
            NOMBRE: option.text
        }));
    return numberSelected;
}

function getDataSelectedUR() {
    const selectNumbers = document.getElementById('cboUPresponsablesRes');
    let numberSelected = [];

    numberSelected = Array.from(selectNumbers.selectedOptions)
        .filter(option => option.value !== "")
        .map(option => ({
            ID_UNIDAD: option.value,
            NOMBRE: option.text
        }));
    return numberSelected;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearForms(type) {
    if (type === 1) {
        $("#cboElemento").val(0);
        $("#txtNoControl").val("");
        $("#txtAreaOportunidad").val("");
    } else if (type === 2) {
        $("#cboPeriodo").val(0);
        $("#txtNoControlAccion").val("");
        $("#txtAccionMejora").val("");
        $("#txtFechaI").val("");
        $("#txtFechaF").val("");
        $("#cboMesInicio").val(0);
        $("#cboMesFinal").val(0);
        $("#txtAdminResp").val("");
        $("#txtRespImp").val("");
        $('#cboUPresponsablesRes').select2("val", "");
        $('#cboUPresponsablesRes').val("");
        $('#select2-cboUPresponsablesRes-container').text("");
        $('#cboUPresponsablesImp').select2("val", "");
        $('#cboUPresponsablesImp').val("");
        $('#select2-cboUPresponsablesImp-container').text("");
        $("#cboPreg").val(0);
    } else if (type === 3) {
        $('#cboMedio').select2("val", "");
        $('#cboMedio').val("");
        $('#select2-cboMedio-container').text("");
    } else if (type === 4) {
    } else if (type === 5) {
    } else if (type === 6) {
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////