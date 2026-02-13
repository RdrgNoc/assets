'use strict';

const timingNoty = 3500;
var idUser = $("#MainContent_hddnIdUsuario").val();
var idRolUser = $("#MainContent_hddnPage").val();
var cveOSd = $("#MainContent_hddnOS").val().trim();
var cveUPd = $("#MainContent_hddnUP").val().trim();
var cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();

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
    fetchDataArr(1, {}, 4, function (response) {
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
    fetchDataArr(2, { _txtEfiscal: txtEfiscal }, 4, function (response) {
        if (response) {
            const datos = JSON.parse(response);
            const select = $("#cboOs");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            datos.forEach(function (item) { select.append($("<option>", { value: item.Cve_Organo_Superior, text: item.Txt_Organo_Superior })); });
            select.val(cveOSd);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    })
}

var obtenerSelectDatosUP = function (txtEfiscal, txtOS, tipo) {
    fetchDataArr(3, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 4, function (response) {
        if (response) {
            const datos = JSON.parse(response);
            const select = $("#cboUp");
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            datos.forEach(function (item) { select.append($("<option>", { value: item.Cve_Unidad_Presupuestal, text: item.Txt_Unidad_Presupuestal })); });
            select.val(cveUPd === '' ? 0 : tipo === 'cambio' ? txtOS === cveOSd ? cveUPd : 0 : cveUPd);
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDataRiesgos(cveOS, cveUP, _eFiscal) {
    var html = '';
    blockUICustom();
    fetchDataArr(0, { _OS: cveOS, _UP: cveUP, __eFiscal: _eFiscal }, 4, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA DATOS RIESGOS [USUARIO]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response.length !== 0) {
                response.forEach(function (item) {
                    var envio__ = item.SN_ENVIADO === true ? 'disabled' : '';
                    //var valid__ = item.SN_VALIDADO === true || item.SN_VALIDADO === false ? 'disabled' : '';}
                    var snValida = item.SN_VALIDA === true ? 'badge-subtle-success' : 'badge-subtle-danger';
                    var valid__ = '';
                    var strVal = '';
                    var snDefine = '';

                    if (item.SN_ENVIADO === true) {
                        if (item.SN_VALIDA === true) {
                            valid__ = 'disabled';
                            strVal = 'Validado';
                            snDefine = '';
                            if (item.CONSECUTIVO_INTERNO === null) {
                                snDefine = '';
                            } else {
                                snDefine = 'disabled';
                            }
                        } else if (item.SN_VALIDA === false) {
                            valid__ = 'disabled';
                            strVal = 'Rechazado';
                            snDefine = 'disabled';
                        } else if (item.SN_VALIDA === null) {
                            valid__ = '';
                            strVal = 'Enviado, falta validar/rechazar';
                            snDefine = 'disabled';
                        }
                    } else {
                        if (item.SN_VALIDA === true) {
                            valid__ = 'disabled';
                            strVal = 'Validado';
                            snDefine = '';
                        } else if (item.SN_VALIDA === null) {
                            valid__ = 'disabled';
                            strVal = 'Sin enviar y sin validar';
                            snDefine = 'disabled';
                        } else {
                            valid__ = 'disabled';
                            strVal = 'Rechazado';
                            snDefine = 'disabled';
                        }
                    }

                    var defineDisabledBtnAdmin = '';
                    if (item.ID_ESTATUS === 1) {
                        defineDisabledBtnAdmin = 'disabled';
                    } else if (item.ID_ESTATUS === 2) {
                        defineDisabledBtnAdmin = 'disabled';
                    } else if (item.ID_ESTATUS === 3) {
                        defineDisabledBtnAdmin = 'disabled';
                    } else if (item.ID_ESTATUS === 4) {
                        defineDisabledBtnAdmin = 'disabled';
                    } else if (item.ID_ESTATUS === 5) {
                        defineDisabledBtnAdmin = '';
                    } else if (item.ID_ESTATUS === 6) {
                        defineDisabledBtnAdmin = '';
                    } else if (item.ID_ESTATUS === 7) {
                        defineDisabledBtnAdmin = 'disabled';
                    } else if (item.ID_ESTATUS === 8) {
                        defineDisabledBtnAdmin = 'disabled';
                    } else if (item.ID_ESTATUS === 9) {
                        defineDisabledBtnAdmin = 'disabled';
                    }

                    var badge = '';
                    if (item.VALOR_CUADRANTE === 'I') {
                        badge = 'bg-danger';
                    } else if (item.VALOR_CUADRANTE === 'II') {
                        badge = 'bg-warning';
                    } else if (item.VALOR_CUADRANTE === 'III') {
                        badge = 'bg-success';
                    } else if (item.VALOR_CUADRANTE === 'IV') {
                        badge = 'bg-primary';
                    } else {
                        badge = 'bg-light';
                    }

                    var badge2 = '';
                    if (item.VALOR_CUADRANTE2 === 'I') {
                        badge2 = 'bg-danger';
                    } else if (item.VALOR_CUADRANTE2 === 'II') {
                        badge2 = 'bg-warning';
                    } else if (item.VALOR_CUADRANTE2 === 'III') {
                        badge2 = 'bg-success';
                    } else if (item.VALOR_CUADRANTE2 === 'IV') {
                        badge2 = 'bg-primary';
                    } else {
                        badge2 = 'bg-light';
                    }

                    const colorValidate = item.SN_VALIDA === null ? 'bg-primary' : item.SN_VALIDA === false ? 'bg-danger' : 'bg-success';
                    const colorSend = item.SN_ENVIADO === null ? 'bg-primary' : item.SN_ENVIADO === false ? 'bg-danger' : 'bg-success';

                    html += `<tr>
                                  <td style='width: 5%;'>
                                    <div class='d-flex align-items-center position-relative'>
                                      <div class='avatar avatar-xl'>
                                        <div class='avatar-name rounded-circle text-primary bg-primary-subtle fs-9'>
                                          <span>${item.CONSECUTIVO_INTERNO === null ? 'na' : item.CONSECUTIVO_INTERNO}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td style='width: 50%;'>
                                    <div class='d-flex align-items-center position-relative'>
                                      <div class='flex-1 ms-3'>
                                        <h6 class='mb-0 fw-semi-bold'><a class='stretched-link text-900' href='#'>${item.CONSECUTIVO} - ${item.DESC_ALINEACION}</a></h6>
                                        <p class='text-1000 semi-bold fs-10 mb-0'>Riesgo: ${item.DESC_RIESGO}</p>
                                        <p class='text-500 fs-11 mb-0'>Tipo de alineaación: ${item.DA2}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td style='width: 35%;'>
                                    <div class='d-flex align-items-center position-relative'>
                                      <div class='flex-1 ms-3'>
                                        <h6 class='mb-0 fw-semi-bold'>${item.NP === null ? 'N/A' : item.NP}</h6>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div class='d-flex align-items-center position-relative'>
                                      <div class='flex-1 ms-3'>
                                        <span class='m-1 badge d-block p-2 fs-10-5 bg-secondary'>${item.VALOR_IMPACTO === null ? 'Defina' : 'Impacto: ' + item.VALOR_IMPACTO}</span>
                                        <span class='m-1 badge d-block p-2 fs-10-5 bg-secondary'>${item.VALOR_PROBABILIDAD === null ? 'Defina' : 'Probabilidad: ' + item.VALOR_PROBABILIDAD}</span>
                                        <span class='m-1 badge d-block p-2 fs-10-5 ${badge}'>${item.VALOR_CUADRANTE === null ? 'Defina' : 'Cuadrante: ' + item.VALOR_CUADRANTE}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div class='d-flex align-items-center position-relative'>
                                      <div class='flex-1 ms-3'>
                                        <span class='m-1 badge d-block p-2 fs-10-5 bg-secondary'>${item.VALOR_IMPACTO2 === null ? 'Defina' : 'Impacto final: ' + item.VALOR_IMPACTO2}</span>
                                        <span class='m-1 badge d-block p-2 fs-10-5 bg-secondary'>${item.VALOR_PROBABILIDAD2 === null ? 'Defina' : 'Probabilidad final: ' + item.VALOR_PROBABILIDAD2}</span>
                                        <span class='m-1 badge d-block p-2 fs-10-5 ${badge2}'>${item.VALOR_CUADRANTE2 === null ? 'Defina' : 'Cuadrante final: ' + item.VALOR_CUADRANTE2}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span class='badge d-block p-2 fs-10-5 ${colorValidate} m-1'>${item.SN_VALIDA === null ? 'Por validar...' : item.SN_VALIDA === false ? 'Rechazado' : 'Validado'}</span>
                                    <span class='badge d-block p-2 fs-10-5 ${colorSend} m-1'>${item.SN_ENVIADO === null ? 'En espera...' : item.SN_ENVIADO === false ? 'No enviado' : 'Enviado'}</span>
                                    <span class='badge d-block p-2 fs-10-5 bg-primary m-1'>${item.ESTATUS}</span>
                                  </td>
                                  <td class='text-end'>
                                    <div>
                                      <button class='btn btn-sm btn-falcon-success btnValidateRiesgo_S customButton m-1 ${valid__}' 
                                        type='button'
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Validar</button>
                                      <button class='btn btn-sm btn-falcon-warning btnValidateRiesgo_N customButton m-1 ${valid__}' 
                                        type='button'
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Rechazar</button>
                                      <button class='btn btn-sm btn-falcon-info btnSetConsecutivoInterno customButton m-1 ${snDefine}' 
                                        type='button'
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}'>
                                        Definir número interno</button>
                                      <button class='btn btn-sm btn-falcon-info btnSeeResumen customButton m-1' 
                                        type='button'
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Ver resumen</button>
                                      <button class='btn btn-sm btn-falcon-info btnSendRevFirVal customButton m-1 ${defineDisabledBtnAdmin}'
                                        type='button' 
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Enviar a firma</button>
                                      <button class='btn btn-sm btn-falcon-info btnSeeObserva customButton m-1' 
                                        type='button'
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Ver observaciones</button>
                                    </div>
                                  </td>
                                </tr>`;
                });
                recargarTabla("tableRiesgosXAlineacion", html);
            } else {
                recargarTabla("tableRiesgosXAlineacion", null);
                showMsg("La unidad presupuestal aun no envia sus riesgos a validar, o no ha registrado ningun riesgo.", 'info');
            }
        }
        Swal.close();
    });
}

function getDataRiesgosA(cveOS, cveUP, _eFiscal) {
    var html = '';
    blockUICustom();
    fetchDataArr(0, { _OS: cveOS, _UP: cveUP, __eFiscal: _Efiscal }, 4, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA DATOS RIESGOS [ADMIN]`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response.length !== 0) {
                response.forEach(function (item) {
                    var envio__ = item.SN_ENVIADO === true ? 'disabled' : '';
                    //var valid__ = item.SN_VALIDADO === true || item.SN_VALIDADO === false ? 'disabled' : '';}
                    var snValida = item.SN_VALIDA === true ? 'badge-subtle-success' : 'badge-subtle-danger';
                    var valid__ = '';
                    var strVal = '';
                    var snDefine = '';

                    if (item.SN_ENVIADO === true) {
                        if (item.SN_VALIDA === true) {
                            valid__ = 'disabled';
                            strVal = 'Validado';
                            snDefine = '';
                            if (item.CONSECUTIVO_INTERNO === null) {
                                snDefine = '';
                            } else {
                                snDefine = 'disabled';
                            }
                        } else if (item.SN_VALIDA === false) {
                            valid__ = 'disabled';
                            strVal = 'Rechazado';
                            snDefine = 'disabled';
                        } else if (item.SN_VALIDA === null) {
                            valid__ = '';
                            strVal = 'Enviado, falta validar/rechazar';
                            snDefine = 'disabled';
                        }
                    } else {
                        if (item.SN_VALIDA === true) {
                            valid__ = 'disabled';
                            strVal = 'Validado';
                            snDefine = '';
                        } else if (item.SN_VALIDA === null) {
                            valid__ = 'disabled';
                            strVal = 'Sin enviar y sin validar';
                            snDefine = 'disabled';
                        } else {
                            valid__ = 'disabled';
                            strVal = 'Rechazado';
                            snDefine = 'disabled';
                        }
                    }

                    var defineDisabledBtnAdmin = '';
                    var defineDisabledBtn2Admin = '';
                    if (item.ID_ESTATUS === 1) {
                        defineDisabledBtnAdmin = 'disabled';
                        defineDisabledBtn2Admin = 'disabled';
                    } else if (item.ID_ESTATUS === 2) {
                        defineDisabledBtnAdmin = 'disabled';
                        defineDisabledBtn2Admin = 'disabled';
                    } else if (item.ID_ESTATUS === 3) {
                        defineDisabledBtnAdmin = 'disabled';
                        defineDisabledBtn2Admin = 'disabled';
                    } else if (item.ID_ESTATUS === 4) {
                        defineDisabledBtnAdmin = 'disabled';
                        defineDisabledBtn2Admin = 'disabled';
                    } else if (item.ID_ESTATUS === 5) {
                        defineDisabledBtnAdmin = 'disabled';
                        defineDisabledBtn2Admin = 'disabled';
                    } else if (item.ID_ESTATUS === 6) {
                        defineDisabledBtnAdmin = 'disabled';
                        defineDisabledBtn2Admin = 'disabled';
                    } else if (item.ID_ESTATUS === 7) {
                        defineDisabledBtnAdmin = '';
                        defineDisabledBtn2Admin = 'disabled';
                    } else if (item.ID_ESTATUS === 8) {
                        defineDisabledBtnAdmin = 'disabled';
                        defineDisabledBtn2Admin = '';
                    } else if (item.ID_ESTATUS === 9) {
                        defineDisabledBtnAdmin = 'disabled';
                        defineDisabledBtn2Admin = 'disabled';
                    }

                    var badge = '';
                    if (item.VALOR_CUADRANTE === 'I') {
                        badge = 'bg-danger';
                    } else if (item.VALOR_CUADRANTE === 'II') {
                        badge = 'bg-warning';
                    } else if (item.VALOR_CUADRANTE === 'III') {
                        badge = 'bg-success';
                    } else if (item.VALOR_CUADRANTE === 'IV') {
                        badge = 'bg-primary';
                    } else {
                        badge = 'bg-light';
                    }

                    var badge2 = '';
                    if (item.VALOR_CUADRANTE2 === 'I') {
                        badge2 = 'bg-danger';
                    } else if (item.VALOR_CUADRANTE2 === 'II') {
                        badge2 = 'bg-warning';
                    } else if (item.VALOR_CUADRANTE2 === 'III') {
                        badge2 = 'bg-success';
                    } else if (item.VALOR_CUADRANTE2 === 'IV') {
                        badge2 = 'bg-primary';
                    } else {
                        badge2 = 'bg-light';
                    }

                    const colorValidate = item.SN_VALIDA === null ? 'bg-primary' : item.SN_VALIDA === false ? 'bg-danger' : 'bg-success';
                    const colorSend = item.SN_ENVIADO === null ? 'bg-primary' : item.SN_ENVIADO === false ? 'bg-danger' : 'bg-success';

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
                                        <span class='m-1 badge d-block p-2 fs-10-5 bg-secondary'>${item.VALOR_IMPACTO === null ? 'Defina' : 'Impacto: ' + item.VALOR_IMPACTO}</span>
                                        <span class='m-1 badge d-block p-2 fs-10-5 bg-secondary'>${item.VALOR_PROBABILIDAD === null ? 'Defina' : 'Probabilidad: ' + item.VALOR_PROBABILIDAD}</span>
                                        <span class='m-1 badge d-block p-2 fs-10-5 ${badge}'>${item.VALOR_CUADRANTE === null ? 'Defina' : 'Cuadrante: ' + item.VALOR_CUADRANTE}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div class='d-flex align-items-center position-relative'>
                                      <div class='flex-1 ms-3'>
                                        <span class='m-1 badge d-block p-2 fs-10-5 bg-secondary'>${item.VALOR_IMPACTO2 === null ? 'Defina' : 'Impacto final: ' + item.VALOR_IMPACTO2}</span>
                                        <span class='m-1 badge d-block p-2 fs-10-5 bg-secondary'>${item.VALOR_PROBABILIDAD2 === null ? 'Defina' : 'Probabilidad final: ' + item.VALOR_PROBABILIDAD2}</span>
                                        <span class='m-1 badge d-block p-2 fs-10-5 ${badge2}'>${item.VALOR_CUADRANTE2 === null ? 'Defina' : 'Cuadrante final: ' + item.VALOR_CUADRANTE2}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span class='badge d-block p-2 fs-10-5 ${colorValidate} m-1'>${item.SN_VALIDA === null ? 'Por validar...' : item.SN_VALIDA === false ? 'Rechazado' : 'Validado'}</span>
                                    <span class='badge d-block p-2 fs-10-5 ${colorSend} m-1'>${item.SN_ENVIADO === null ? 'En espera...' : item.SN_ENVIADO === false ? 'No enviado' : 'Enviado'}</span>
                                    <span class='badge d-block p-2 fs-10-5 bg-primary m-1'>${item.ESTATUS}</span>
                                  </td>
                                  <td class='text-end'>
                                    <div>
                                      <button class='btn btn-sm btn-falcon-info btnSeeResumen customButton m-1' 
                                        type='button'
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Ver resumen</button>
                                      <!--<button class='btn btn-sm btn-falcon-info btnSendRevVal customButton m-1 ${defineDisabledBtnAdmin}'
                                        type='button' 
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Revisado</button>
                                      <button class='btn btn-sm btn-falcon-info btnSendRatVal customButton m-1 ${defineDisabledBtnAdmin}'
                                        type='button' 
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Ratificar</button>
                                      <button class='btn btn-sm btn-falcon-info btnSendAuth customButton m-1 ${defineDisabledBtn2Admin}'
                                        type='button' 
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Enviar para autorizar</button>-->
                                      <button class='btn btn-sm btn-falcon-info btnSeeObserva customButton m-1' 
                                        type='button'
                                        data-ctrl-alineacion='${item.ID_CTRL_ALINEACION}' 
                                        data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                        Ver observaciones</button>
                                    </div>
                                  </td>
                                </tr>`;
                });
                recargarTabla("tableRiesgosXAlineacion", html);
            } else {
                recargarTabla("tableRiesgosXAlineacion", null);
            }
        }
        Swal.close();
    });
}

function gDdocMatriz(cveOS, cveUP, eFiscal) {
    blockUICustom();
    fetchDataArr(4, { _OS: cveOS, _UP: cveUP, __eFiscal: eFiscal, __doConfig: 2 }, 4, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA REPORTE MATRIZ`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response.length !== 0) {
                var splitResult = response.split("|");
                if (splitResult[0] === "ok") {
                    showMsg("Mostrando reporte", 'success');
                    window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
                } else {
                    showMsg(splitResult[0], 'error');
                }
            }
        }
        Swal.close();
    })
}

function gDdocPtar(cveOS, cveUP, eFiscal) {
    blockUICustom();
    fetchDataArr(4, { _OS: cveOS, _UP: cveUP, __eFiscal: eFiscal, __doConfig: 2 }, 4, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA REPORTE PTAR`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response.length !== 0) {
                var splitResult = response.split("|");
                if (splitResult[0] === "ok") {
                    showMsg("Mostrando reporte", 'success');
                    window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
                } else {
                    showMsg(splitResult[0], 'error');
                }
            }
        }
        Swal.close();
    })
}

function gDdocChart(cveOS, cveUP, _type, __bytes, __class, _eFiscal) {
    var data = [];
    blockUICustom();
    fetchDataArr(6, { _OS: cveOS, _UP: cveUP, _TypePrint: _type, _vt: __bytes, __eFiscal: _eFiscal, __doConfig: 2 }, 4, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA REPORTE MAPA ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");

            response.forEach(function (item) {
                data.push([item.VALOR_IMPACTO, item.VALOR_PROBABILIDAD])
            });

            var chartDom = document.getElementById('divChartMapaF');
            var myChart = echarts.init(chartDom);
            var option;

            var option = {
                //   title: {
                //     text: 'Matriz de Riesgo'
                //   },
                xAxis: {
                    type: 'value',
                    name: 'Impacto',
                    min: 0,
                    max: 10,
                    nameTextStyle: {
                        color: '#000000',  // Azul cielo, por ejemplo
                        fontWeight: 'bold'
                    },
                    nameLocation: 'middle',
                },
                yAxis: {
                    type: 'value',
                    name: 'Probabilidad',
                    min: 0,
                    max: 10,
                    nameTextStyle: {
                        color: '#000000',  // Azul cielo, por ejemplo
                        fontWeight: 'bold'
                    },
                    nameLocation: 'middle',
                },
                visualMap: {
                    show: false,
                    pieces: [
                        { gt: 0, lt: 10, color: '#000000' },   // Verde
                    ],
                    dimension: 1
                },
                series: [{
                    name: 'Riesgos',
                    type: 'scatter',
                    symbolSize: 20,
                    data: data,
                    label: {
                        show: true,
                        formatter: function (param) {
                            return `(${param.data[0]}, ${param.data[1]})`;
                        },
                        position: 'top',
                        color: '#000000',
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
                            color: '#000000'
                        },
                        data: [
                            { xAxis: 5 },
                            { yAxis: 5 }
                        ]
                    }
                }],
            };

            myChart.setOption(option);

            if (__class === 0) {
                _type = 'printReport';
            }

            if (_type === 'printReport') {
                var imgData = myChart.getDataURL({
                    type: 'png',               // 'png' o 'jpeg'
                    pixelRatio: 3,             // Aumenta la resolución de la imagen
                    backgroundColor: '#fff',   // Color de fondo (transparente si no se define)
                    excludeComponents: ['toolbox'], // Excluye elementos como leyendas o títulos
                })

                if (__class === 0) {
                    gDdocChart(cveOS, cveUP, 'printReport', imgData, 1, _eFiscal)
                } else {
                    showMsg("Reporte creado.", 'success');
                    window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
                }
            }
        }
        Swal.close();
    });
}

function gDdocCon(cveOS, cveUP, eFiscal) {
    blockUICustom();
    fetchDataArr(7, { _OS: cveOS, _UP: cveUP, __eFiscal: eFiscal, __doConfig: 2 }, 4, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA REPORTE CONCENTRADO ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            if (response.length !== 0) {
                var splitResult = result.split("|");
                if (splitResult[0] === "ok") {
                    showMsg("Mostrando reporte", 'success');
                    window.open('../../Reportes/WebFrmRpt.aspx', 'REPORTE', 'width=650,height=600,scrollbars=yes,toolbar=no,left=10,top=10,resizable=yes');
                } else {
                    showMsg(splitResult[0], 'error');
                }
            }
        }
        Swal.close();
    });
}

function gRes(idAlineacion) {
    blockUICustom();
    fetchDataArr(11, { _idCtrlAlineacion: idAlineacion }, 4, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA RESUMEN ALINEACION ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            if (response.length !== 0) {
                logger.log(`%cRESPUESTA RESUMEN DE LA ALINEACION ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                $("#divResumen").html(response);
                $("#modalResumen").modal("show");
            } else {
                $("#modalResumen").modal("hide");
            }
        }
        Swal.close();
    });
}

function gDob(idCtrlRiesgo) {
    var html2 = "";
    var descBoton = "";
    blockUICustom();
    fetchDataArr(14, { _idCtrlRiesgo: idCtrlRiesgo }, 4, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA OBSERVACIONES`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
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
                        descBoton = "Por solventar";
                        disabled = "";
                    }

                    if (item.ID_ROL === 102 && item.SN_SOLVENTA === true) {
                        var htmlBtn = '';
                    } else {
                        var htmlBtn = `<button class='btn btn-tertiary border-300 btn-sm me-1 text-1000 btnSolventarObser disabled' type='button' data-ctrl-observacion='${item.ID_OBSERVACION}' data-ctrl-riesgo='${item.ID_CTRL_RIESGO}'>
                                                                        ${descBoton}
                                                                    </button>`;
                    }

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
                if (html2 === '') {
                } else {
                    $("#divNew").html(html2);
                }
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
        Swal.close();
    });
}

function getFirmasReportes(cveOS, cveUP, _eFiscal) {
    var html = "";
    blockUICustom();
    fetchDataArr(23, { _OS: cveOS, _UP: cveUP, _eFiscal: _eFiscal }, 4, function (response) {
        if (response) {
            logger.log(`%cRESPUESTA FIRMAS REPORTES`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
            logger.table(response);
            if (response.length === 0) {
                recargarTablaSinOpciones("tableReportesFirmados", null);
            } else {
                $("#divValoresInicial").hide();
                $("#divValoresFinales").hide();
                response.forEach(function (item) {
                    html += `<tr class='align-middle'>
                                <td class='text-1000 nowrap'>${item.DESC_REPORTE}</td>
                                <td class='text-end'>
                                    <div>
                                        <button class='btn btn-sm btn-falcon-success btnDownloadFirma customButton m-1' type='button' data-ctrl-ws='${item.ID_CTRL_FIRMA_REPORTE}'>Ver</button>
                                    </div>
                                </td>
                            </tr>`

                });

                recargarTablaSinOpciones("tableReportesFirmados", html);
            }
        } else if (response === "error") {
            showMsg("Error al cargar datos", 'error');
        }
        Swal.close();
    });
}

async function setSign(data) {
    blockUICustom();
    const setSign = await new Promise((resolve, reject) => {
        $(".btn-close").attr("disabled", true);
        fetchDataArr(21, data, 4, (response) => {
            if (response) resolve(response);
            else reject(new Error("Error en fetchDataArr 21 Firma"));
        });
    });
    logger.log(`%cRESPUESTA FIRMAS REPORTES ${setSign}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
    if (setSign) {
        $(".btn-close").removeAttr("disabled");
        showMsg("Reportes firmados.", 'success');
        $("#btnFirmarReports").removeAttr("disabled");
        s03.hide();
        clearForms(1);
        getDataRiesgosA(data._OS, data._UP, data._Efiscal);
        gDdocChart(data._OS, data._UP, 'printPage', 'null', 1, data._Efiscal);
        getFirmasReportes(data._OS, data._UP, data._Efiscal);
        $("#txtRFCGet").text(0);
        $("#modalFormSign").modal("hide");
    }
    Swal.close();
}

//FUNCION SIN UTILIZAR
function getNotifications(_eFiscal) {
    const rutaActual = window.location.pathname;
    const splitRuta = rutaActual.split("/")
    var rutaChange = '';

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
                logger.log(datos);
                datos.forEach(function (item) {
                    if (item.SN_SOLVENTA === null && item.SN_PASADO === false) {
                        html += `<div class='fs-10 mb-1'>
                                        <a class='notification bg-warning-subtle' href='#!'>
                                            <div class='notification-body'>
                                                <p class='mb-0'><strong>${item.NOMBRES}</strong> envió su riesgo <strong>${item.CONSECUTIVO}</strong> a revisión</p>
                                            </div>
                                        </a>
                                    </div>`
                        count += 1;
                    } else {
                        html += '';
                    }
                });

                if (count !== 0) {
                    $("#numberNotis").html(count);
                    $("#numberNotis").show();
                } else {
                    $("#numberNotis").html(0);
                    $("#numberNotis").hide();
                }
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(async function () {
    s03.hide();
    loadEndpoints(4);
    obtenerSelectDatosEfiscal();
    obtenerSelectDatosOS(cveEfiscald);
    obtenerSelectDatosUP(cveEfiscald, cveOSd, '');
    if (idRolUser === '101') { //ENLACE REVISION
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#btnSignReports").hide();
        getDataRiesgos(cveOSd, cveUPd, cveEfiscald);
        gDdocChart(cveOSd, cveUPd, 'printPage', 'null', 1, cveEfiscald);
        getFirmasReportes(cveOSd, cveUPd, cveEfiscald);
        //getRiesgosTable(cveOSd, cveUPd, cveEfiscald);
        //getNotifications();
        //setInterval(getNotifications, 10000);
    } else if (idRolUser === '102') { //TITULAR DEPENDENCIA
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#btnSignReports").show();
        getDataRiesgosA(cveOSd, cveUPd, cveEfiscald);
        gDdocChart(cveOSd, cveUPd, 'printPage', 'null', 1, cveEfiscald);
        getFirmasReportes(cveOSd, cveUPd, cveEfiscald);
    } else if (idRolUser === '103') {  //ENLACE LEONARDO
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#btnSignReports").show();
        //getDataRiesgosAA(cveOSd, cveUPd, cveEfiscald);
        //gDdocChart(cveOSd, cveUPd, 'printPage', 'null', 1, cveEfiscald);
    } else if (idRolUser === '104') { //ENLACE ESTHER
        $("#cboOs").attr("disabled", true);
        $("#cboUp").attr("disabled", false);
        $("#btnSignReports").show();
    }

    $(document).on("click", "#btnSearch", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            if (idRolUser === '101') {
                getDataRiesgos($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                gDdocChart($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
                getFirmasReportes(cveOS, cveUP, eFiscal);
            } else if (idRolUser === '102') {
                getDataRiesgosA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                gDdocChart($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
                getFirmasReportes(cveOS, cveUP, eFiscal);
            } else if (idRolUser === '103') {
                //getDataRiesgosAA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                gDdocChart($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
            } else if (idRolUser === '104') {
                //getDataRiesgosAAA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                gDdocChart($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
            }
        }
    });

    $(document).on("change", "#cboUp, #cboOs, #cboEfiscal", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            gDdocChart($("#cboOs").val(), $("#cboUp").val(), 'printPage', 'null', 1, $("#cboEfiscal").val());
            if (idRolUser === '101') {
                getDataRiesgos($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                getFirmasReportes(cveOS, cveUP, eFiscal);
            } else if (idRolUser === '102') {
                getDataRiesgosA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                getFirmasReportes(cveOS, cveUP, eFiscal);
            } else if (idRolUser === '103') {
                //getDataRiesgosAA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            } else if (idRolUser === '104') {
                //getDataRiesgosAAA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
            }
        }
    });

    $(document).on("click", "#btnGetMatriz", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(13, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DATOS PERSONAS REPORTE`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: 0 }, 4, function (response) {
                                if (response) {
                                    logger.log(`%cRESPUESTA DE ENVIO A REVISIÓN DE RIESGOS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                    logger.table(response);
                                    if (response !== 'error') {
                                        const conNulos = response.some(item => item.HAY_NULL === 1);
                                        if (conNulos) {
                                            showMsg(`Valide e inserte sus numeros de control, antes de enviar o generar cualquier reporte.`, 'info');
                                            return;
                                        }
                                        gDdocMatriz(cveOS, cveUP, eFiscal);
                                    }
                                }
                            });
                        } else {
                            showMsg('Al organismo le hace falta registrar los encabezados para los reportes. De lo contrario, no podrá visualizar.', 'alert');
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
                Swal.close();
            });
        }
    });

    $(document).on("click", "#btnGetPtar", async function () {
        var configVal = $("#btnGetPtar")[0].dataset.ctrlValidate;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(13, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DATOS PERSONAS REPORTE`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: 0 }, 4, function (response) {
                                if (response) {
                                    logger.log(`%cRESPUESTA DE ENVIO A REVISIÓN DE RIESGOS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                    logger.table(response);
                                    if (response !== 'error') {
                                        const conNulos = response.some(item => item.HAY_NULL === 1);
                                        if (conNulos) {
                                            showMsg(`Valide e inserte sus numeros de control, antes de enviar o generar cualquier reporte.`, 'info');
                                            return;
                                        }
                                        gDdocPtar(cveOS, cveUP, eFiscal);
                                    }
                                }
                            });
                        } else {
                            showMsg('Al organismo le hace falta registrar los encabezados para los reportes. De lo contrario, no podrá visualizar.', 'alert');
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
                Swal.close();
            });
        }
    });

    $(document).on("click", "#btnGetMapa", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(13, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DATOS PERSONAS REPORTE`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: 0 }, 4, function (response) {
                                if (response) {
                                    logger.log(`%cRESPUESTA DE ENVIO A REVISIÓN DE RIESGOS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                    logger.table(response);
                                    if (response !== 'error') {
                                        const conNulos = response.some(item => item.HAY_NULL === 1);
                                        if (conNulos) {
                                            showMsg(`Valide e inserte sus numeros de control, antes de enviar o generar cualquier reporte.`, 'info');
                                            return;
                                        }
                                        gDdocChart(cveOS, cveUP, 'printPage', 'null', 0, eFiscal);
                                    }
                                }
                            });
                        } else {
                            showMsg('Al organismo le hace falta registrar los encabezados para los reportes. De lo contrario, no podrá visualizar.', 'alert');
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
                Swal.close();
            });
        }
    });

    $(document).on("click", "#btnGetConcentrado", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(13, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DATOS PERSONAS REPORTE`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        if (response.length !== 0) {
                            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: 0 }, 4, function (response) {
                                if (response) {
                                    logger.log(`%cRESPUESTA DE ENVIO A REVISIÓN DE RIESGOS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                    logger.table(response);
                                    if (response !== 'error') {
                                        const conNulos = response.some(item => item.HAY_NULL === 1);
                                        if (conNulos) {
                                            showMsg(`Valide e inserte sus numeros de control, antes de enviar o generar cualquier reporte.`, 'info');
                                            return;
                                        }
                                        gDdocCon(cveOS, cveUP, eFiscal);
                                    }
                                }
                            });
                        } else {
                            showMsg('Al organismo le hace falta registrar los encabezados para los reportes. De lo contrario, no podrá visualizar.', 'alert');
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
                Swal.close();
            });
        }
    });

    $(document).on("click", ".btnValidateRiesgo_S", async function () {
        var idAlineacion = $(this)[0].dataset.ctrlAlineacion;
        var idRiesgo = $(this)[0].dataset.ctrlRiesgo;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        const confirmado = await alertConfirmMessage("¿Está seguro de validar este riesgo?");
        if (!confirmado) {
            return
        } else {
            if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
                blockUICustom();
                fetchDataArr(8, { _idRiesgo: idRiesgo, _idUser: idUser }, 4, function (response) {
                    if (response) {
                        logger.log(`%cRESPUESTA DE ENVIO A REVISIÓN DE RIESGOS ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        const datos = response;
                        if (datos === "ok") {
                            showMsg("Se valido el riesgo.", 'success');
                            getDataRiesgos($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                        }
                    }
                    Swal.close();
                });
            }
        }
    });

    $(document).on("click", ".btnValidateRiesgo_N", async function () {
        var idAlineacion = $(this)[0].dataset.ctrlAlineacion;
        var idRiesgo = $(this)[0].dataset.ctrlRiesgo;
        const confirmado = await alertConfirmMessage("¿Está seguro de rechazar este riesgo? Si es así, se mostrará una ventana para que ingrese sus observaciones respecto al riesgo.");
        if (!confirmado) {
            return
        } else {
            $("#btnSendObserRiesgo").attr("data-ctrl-riesgo", idRiesgo)
            $("#modalObservacionForm").modal("show");
        }
    });

    $(document).on("click", "#btnSendObserRiesgo", function () {
        var idReturn = $("#btnSendObserRiesgo")[0].dataset.ctrlRiesgo;
        var txtObservacionData = $("#txtObservacion").val().trim();
        if (txtObservacionData === "") {
            showMsg("Agregue su observación, su rechazo no puede ir sin la observación respecto al riesgo.", 'error');
            return;
        } else {
            blockUICustom();
            fetchDataArr(9, { _idRiesgo: idReturn, _descObservacion: txtObservacionData, _idUser: idUser }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DE ENVIO OBSERVACION ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    const datos = response;
                    if (datos === "ok") {
                        showMsg("Se rechazo el riesgo.", 'success');
                        getDataRiesgos($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                        $("#txtObservacion").val("");
                        $('#staticBackdrop1').modal('hide');
                        $("#btnSendObserRiesgo").attr("data-ctrl-riesgo", 0)
                    } else {
                        showMsg("Sucedio un error inesperado.", 'success');
                    }
                }
                Swal.close();
            });
        }
    });

    $(document).on("change", "#cboOs", function () {
        var selectedValue = $(this).val();
        obtenerSelectDatosUP(cveEfiscald, selectedValue, 'cambio')
    });

    $(document).on("click", ".btnSeeResumen", function () {
        var idReturn1 = $(this)[0].dataset.ctrlAlineacion;
        var idReturn2 = $(this)[0].dataset.ctrlRiesgo;
        gRes(idReturn1);
    });

    $(document).on("click", ".btnSetConsecutivoInterno", async function () {
        var idAlineacion = $(this)[0].dataset.ctrlAlineacion;
        $("#btnS_Consecutivo").attr("data-ctrl-alineacion", idAlineacion);
        const confirmado = await alertConfirmMessage("¿Está seguro insertar un número de control interno? Si lo hace, ya no podrá alterar el número.");
        if (!confirmado) {
            return
        } else {
            $("#modalNumeroInterno").modal("show")
        }
    });

    $(document).on("click", ".btnSeeObserva", function () {
        var idRiesgo = $(this)[0].dataset.ctrlRiesgo;
        gDob(idRiesgo);
        $("#modalObservaciones").modal("show");
    });

    $(document).on("click", "#btnS_Consecutivo", async function () {
        var idAlineacion = $(this)[0].dataset.ctrlAlineacion;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal) === false) { return }
        if (isNaN(idAlineacion)) {
            showMsg('Ocurrio un error inesperado, vuelva a intentar.', 'error');
            return;
        } else {
            const txtNoConsecutivoData = $("#txtNoConsecutivo").val().trim();
            if (txtNoConsecutivoData === "") {
                showMsg('Defina el número interno.', 'error');
                return;
            } else {
                if (isNaN(parseInt(txtNoConsecutivoData))) {
                    showMsg('Esta ingresando caracteres que no son números.', 'error');
                    return;
                } else {
                    blockUICustom();
                    fetchDataArr(12, { _idCtrlAlineacion: idAlineacion, _idUser: idUser, _txtConsecutivo: txtNoConsecutivoData, _eFiscal, eFiscal }, 4, function (response) {
                        if (response) {
                            logger.log(`%cRESPUESTA DE INSERCION NUMERO DE CONTROL ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                            var splitResult = response.split("|");
                            if (splitResult[0] === "ok") {
                                showMsg("Se inserto correctamente el número de control interno.", 'success');
                                $("#modalNumeroInterno").modal("hide");
                                getDataRiesgos($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                            } else if (splitResult[0] === "existe") {
                                showMsg("El número de control interno que ingreso, existe en alguna dependencia, revise.", 'error');
                            } else if (splitResult[0] === "error") {
                                showMsg("Ocurrio un error, vuelva a intentar de favor.", 'error');
                            }
                        }
                        Swal.close();
                    });
                }
            }
        }
    });

    $(document).on("click", ".btnSendRevFirVal", async function () {
        var idReturn1 = $(this)[0].dataset.ctrlAlineacion;
        var idReturn2 = $(this)[0].dataset.ctrlRiesgo;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: idReturn2 }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DE ENVIO A REVISION DE RIESGOS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        const conNulos = response.some(item => item.HAY_NULL === 1);

                        const algunaNoValidada = response.some(item => (item.SN_VALIDA === null || item.SN_VALIDA === false));
                        const noEstaEn6 = response.some(item => item.ID_ESTATUS === 6);
                        const noEstaEn5 = response.some(item => item.ID_ESTATUS === 5);
                        const idCtrlRiesgos = response.filter(item => item.ID_CTRL_RIESGO !== 0 && item.SN_VALIDA === true).map(item => item.ID_CTRL_RIESGO).join('|');

                        logger.log(conNulos, algunaNoValidada, noEstaEn5, noEstaEn6, idCtrlRiesgos)

                        if (algunaNoValidada) {
                            showMsg(`Antes de continuar con el envio, necesita esperar a que validen o rechazen los demas riesgos enviados.`, 'info');
                            return;
                        }

                        if (noEstaEn6) {
                            if (conNulos) {
                                showMsg(`Defina primero el orden de los riesgos.`, 'info');
                                return;
                            }
                        }

                        fetchDataArr(16, { arrRiesgos: idCtrlRiesgos }, 4, function (response) {
                            if (response) {
                                logger.log(`%cRESPUESTA DE ENVIO REVISION RIESGOS ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                var responseS = response.split("|");
                                if (responseS[0] === "ok") {

                                } else if (responseS[0] === "error") {
                                    showMsg("Ocurrio un error.", 'error');
                                }

                                getDataRiesgos($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                            } else if (response === "error") {
                                showMsg("Error al cargar datos", 'error');
                            }
                        });
                    } else {
                        showMsg("Ocurrió un error al obtener los datos.", 'error');
                        return;
                    }
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                }
                Swal.close();
            });
        }
    });

    $(document).on("click", ".btnSendRatVal", async function () {
        var idReturn1 = $(this)[0].dataset.ctrlAlineacion;
        var idReturn2 = $(this)[0].dataset.ctrlRiesgo;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: idReturn2 }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DE ENVIO A RATIFICAR DE RIESGOS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        const noEstaEn7 = response.some(item => item.ID_ESTATUS !== 7);
                        const idCtrlRiesgos = response.filter(item => item.ID_CTRL_RIESGO !== 0 && item.ID_ESTATUS === 7).map(item => item.ID_CTRL_RIESGO).join('|');

                        if (noEstaEn7) {
                            showMsg(`Antes de continuar con el envio, necesita esperar a que validen o rechazen los demas riesgos enviados.`, 'info');
                            return;
                        }

                        $("#btnSendRatificacion").attr("data-ctrl-riesgo", idReturn2);
                        $("#modalObservacionRat").modal("show");
                    } else {
                        showMsg("Ocurrió un error al obtener los datos.", 'error');
                        return;
                    }
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                }
                Swal.close();
            });
        } else {
            $("#modalObservacionRat").modal("hide");
        }
    });

    $(document).on("click", ".btnSendRevVal", async function () {
        var idReturn1 = $(this)[0].dataset.ctrlAlineacion;
        var idReturn2 = $(this)[0].dataset.ctrlRiesgo;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: idReturn2 }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DE RIESGOS SET REVISION INTERNO`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        const noEstaEn7 = response.some(item => item.ID_ESTATUS !== 7);
                        const idCtrlRiesgos = response.filter(item => item.ID_CTRL_RIESGO !== 0 && item.ID_ESTATUS === 7).map(item => item.ID_CTRL_RIESGO).join('|');

                        if (noEstaEn7) {
                            showMsg(`Antes de continuar con el envio, el riesgo debe de estar en estado de Para Revisar.`, 'info');
                            return;
                        }

                        fetchDataArr(18, { arrRiesgos: idCtrlRiesgos }, 4, function (response) {
                            if (response) {
                                logger.log(`%cRESPUESTA DE SEND REVISION RIESGOS ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                var responseS = response.split("|");
                                if (responseS[0] === "ok") {

                                } else if (responseS[0] === "error") {
                                    showMsg("Ocurrio un error.", 'error');
                                }

                                getDataRiesgosA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                            } else if (response === "error") {
                                showMsg("Error al cargar datos", 'error');
                            }
                        });
                    } else {
                        showMsg("Ocurrió un error al obtener los datos.", 'error');
                        return;
                    }
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                }
                Swal.close();
            });
        } else {

        }
    });

    $(document).on("click", ".btnSendAuth", async function () {
        var idReturn1 = $(this)[0].dataset.ctrlAlineacion;
        var idReturn2 = $(this)[0].dataset.ctrlRiesgo;
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: idReturn2 }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DE RIESGOS SET REVISION INTERNO`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        const noEstaEn8 = response.some(item => item.ID_ESTATUS !== 8);
                        const idCtrlRiesgos = response.filter(item => item.ID_CTRL_RIESGO !== 0 && item.ID_ESTATUS === 8).map(item => item.ID_CTRL_RIESGO).join('|');

                        if (noEstaEn8) {
                            showMsg(`Antes de continuar con el envio, el riesgo debe de estar en estado de Para Revisar.`, 'info');
                            return;
                        }

                        fetchDataArr(19, { arrRiesgos: idCtrlRiesgos }, 4, function (response) {
                            if (response) {
                                logger.log(`%cRESPUESTA DE SEND AUTORIZAR RIESGOS ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                var responseS = response.split("|");
                                if (responseS[0] === "ok") {

                                } else if (responseS[0] === "error") {
                                    showMsg("Ocurrio un error.", 'error');
                                }

                                getDataRiesgosA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                            } else if (response === "error") {
                                showMsg("Error al cargar datos", 'error');
                            }
                        });
                    } else {
                        showMsg("Ocurrió un error al obtener los datos.", 'error');
                        return;
                    }
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                }
                Swal.close();
            });
        }
    });

    $(document).on("click", "#btnSendRatificacion", function () {
        var idRiesgo = $(this)[0].dataset.ctrlRiesgo;
        if (isNaN(idRiesgo)) {
            showMsg('Ocurrio un error inesperado, vuelva a intentar.', 'error');
            return;
        } else {
            const txtRatificacionData = $("#txtRatificacion").val().trim();
            if (txtRatificacionData === "") {
                showMsg('Defina su comentario antes de enviar.', 'error');
                return;
            } else {
                blockUICustom();
                fetchDataArr(17, { arrRiesgos: idRiesgo, _idUsuario: idUser, _descRatificacion: txtRatificacionData }, 4, function (response) {
                    if (response) {
                        logger.log(`%cRESPUESTA DE SEND RATIFICAR RIESGOS ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                        var responseS = response.split("|");
                        if (responseS[0] === "ok") {

                        } else if (responseS[0] === "error") {
                            showMsg("Ocurrio un error.", 'error');
                        }

                        getDataRiesgosA($("#cboOs").val(), $("#cboUp").val(), $("#cboEfiscal").val());
                    } else if (response === "error") {
                        showMsg("Error al cargar datos", 'error');
                    }
                    Swal.close();
                });
            }
        }
    });

    $(document).on("click", "#btnSignReports", async function () {
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: 0 }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DE ENVIO A REVISION DE RIESGOS`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        const conNulos = response.some(item => item.HAY_NULL === 1);
                        const noEstatus7 = response.some(item => item.ID_ESTATUS !== 7);
                        if (conNulos) {
                            showMsg(`Espere a que asignen completamente los números de riesgos.`, 'info');
                            return;
                        }
                        if (noEstatus7) {
                            showMsg(`Se ha firmado los reportes, lo sentimos.`, 'info');
                            return;
                        }
                        fetchDataArr(22, { _idUsuario: idUser, __idRol: idRolUser }, 4, function (reponseSign) {
                            if (reponseSign) {
                                logger.log(`%cRESPUESTA DE DATOS USUARIO FIRMA`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                logger.table(reponseSign);
                                if (reponseSign !== 'error') {
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
                    }
                }
                Swal.close();
            });
        }
    });

    $(document).on("click", "#btnFirmarReports", async function () {
        $("#btnFirmarReports").attr("disabled", true);
        s03.show();
        var archivosBytes = [];
        const inputFile1 = $("#fileCer");
        const inputFile2 = $("#fileKey");
        var pass = $("#txtPassFiel").val();
        var rfc = $("#txtRFCGet").text();
        const file1 = inputFile1[0].files[0];
        const file2 = inputFile2[0].files[0];
        var cveOS = $("#cboOs").val();
        var cveUP = $("#cboUp").val();
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

        if (await verifyInitialDataOUE(cveOS, cveUP, eFiscal)) {
            blockUICustom();
            fetchDataArr(15, { _OS: cveOS, _UP: cveUP, _eFiscal: eFiscal, _idCtrlRiesgo: 0 }, 4, function (response) {
                if (response) {
                    logger.log(`%cRESPUESTA DE RIESGOS COLOCAR REVISION INTERNO`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                    logger.table(response);
                    if (response !== 'error') {
                        const noEstaEn7 = response.some(item => item.ID_ESTATUS !== 7);
                        const idCtrlRiesgos = response.filter(item => item.ID_CTRL_RIESGO !== 0 && item.SN_VALIDA === true).map(item => item.ID_CTRL_RIESGO).join('|');

                        if (noEstaEn7) {
                            showMsg(`Antes de continuar con el envio, el riesgo debe de estar en estado de <strong>Revisado</strong>.`, 'info');
                            $("#btnFirmarReports").removeAttr("disabled");
                            s03.hide();
                            clearForms(1);
                            return;
                        }
                        var data = [];
                        fetchDataArr(6, { _OS: cveOS, _UP: cveUP, _TypePrint: 'printPage', _vt: 'null', __eFiscal: eFiscal, __doConfig: 1 }, 4, function (response) {
                            if (response) {
                                logger.log(`%cRESPUESTA DE DATOS GRAFICA`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
                                logger.table(response);

                                response.forEach(function (item) {
                                    data.push([item.VALOR_IMPACTO, item.VALOR_PROBABILIDAD])
                                });

                                var chartDom = document.getElementById('divChartMapaF');
                                var myChart = echarts.init(chartDom);
                                var option;

                                var option = {
                                    //   title: {
                                    //     text: 'Matriz de Riesgo'
                                    //   },
                                    xAxis: {
                                        type: 'value',
                                        name: 'Impacto',
                                        min: 0,
                                        max: 10,
                                        nameTextStyle: {
                                            color: '#000000',  // Azul cielo, por ejemplo
                                            fontWeight: 'bold'
                                        },
                                        nameLocation: 'middle',
                                    },
                                    yAxis: {
                                        type: 'value',
                                        name: 'Probabilidad',
                                        min: 0,
                                        max: 10,
                                        nameTextStyle: {
                                            color: '#000000',  // Azul cielo, por ejemplo
                                            fontWeight: 'bold'
                                        },
                                        nameLocation: 'middle',
                                    },
                                    visualMap: {
                                        show: false,
                                        pieces: [
                                            { gt: 0, lt: 10, color: '#000000' },   // Verde
                                        ],
                                        dimension: 1
                                    },
                                    series: [{
                                        name: 'Riesgos',
                                        type: 'scatter',
                                        symbolSize: 20,
                                        data: data,
                                        label: {
                                            show: true,
                                            formatter: function (param) {
                                                return `(${param.data[0]}, ${param.data[1]})`;
                                            },
                                            position: 'top',
                                            color: '#000000',
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
                                                color: '#000000'
                                            },
                                            data: [
                                                { xAxis: 5 },
                                                { yAxis: 5 }
                                            ]
                                        }
                                    }],
                                };

                                myChart.setOption(option);

                                var imgData = myChart.getDataURL({
                                    type: 'png',               // 'png' o 'jpeg'
                                    pixelRatio: 3,             // Aumenta la resolución de la imagen
                                    backgroundColor: '#fff',   // Color de fondo (transparente si no se define)
                                    excludeComponents: ['toolbox'], // Excluye elementos como leyendas o títulos
                                })

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
                                        ///     { _OS: cveOS, _UP: cveUP, _TypePrint: _type, _vt: __bytes, __eFiscal: _eFiscal, __doConfig: 1 }
                                        const joinData = { listValue: "" + fileBytes1 + "", listValue2: "" + fileBytes2 + "", passFiel: pass, txtRFC: rfc, idUsuario: idUser, idRolUsuario: idRolUser, _OS: cveOS, _UP: cveUP, _Efiscal: eFiscal, _imageGraphc: imgData, arrRiesgos: idCtrlRiesgos };
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
                            }
                        });
                    } else {
                        showMsg("Ocurrió un error al obtener los datos.", 'error');
                        $("#btnFirmarReports").removeAttr("disabled");
                        s03.hide();
                        clearForms(1);
                        return;
                    }
                } else if (response === "error") {
                    showMsg("Error al cargar datos", 'error');
                    $("#btnFirmarReports").removeAttr("disabled");
                    s03.hide();
                    clearForms(1);
                }
                Swal.close();
            });
        } else {
            $("#btnFirmarReports").removeAttr("disabled");
            s03.hide();
            clearForms(1);
        }
    });

    $(document).on("click", ".btnDownloadFirma", function () {
        var idReturn1 = $(this)[0].dataset.ctrlWs;
        blockUICustom();
        fetchDataArr(24, { _idCtrl: idReturn1 }, 4, function (response) {
            if (response) {
                logger.log(`%cRESPUESTA DE DATOS REPORTE FIRMA ${response}`, "color: rgba(255, 50, 50, 0.2); font-weight: bold; background: #111; padding: 4px;");
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
            Swal.close();
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