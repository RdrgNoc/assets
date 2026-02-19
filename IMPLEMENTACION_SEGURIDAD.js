// IMPLEMENTACIÓN_SEGURIDAD.js - integración segura para automata-slayer
// Requiere: securityHelper.js, apiHelper.js

/* global AUTOMATA_SLAYER_VERSION, fetchDataArr, prepareSecureData, sanitizeInput, isValidNumber, encodeHTML, encodeAttribute, recargarTabla, showMsg, logger, cveEfiscald, loadEndpoints, verifyInitialDataE */

// Variables iniciales que la página puede proporcionar
var idUser = undefined;
var idRolUser = undefined;
var cveEfiscal = undefined;
var cveOS = undefined;
var cveUP = undefined;
try { idUser = document.getElementById('MainContent_hddnIdUsuario')?.value; } catch (e) { }
try { idRolUser = document.getElementById('MainContent_hddnPage')?.value; } catch (e) { }
try { cveEfiscal = document.getElementById('MainContent_hddnEfiscal')?.value; } catch (e) { }
try { cveOS = document.getElementById('MainContent_hddnOS')?.value; } catch (e) { }
try { cveUP = document.getElementById('MainContent_hddnUP')?.value; } catch (e) { }
const AUTOMATA_SLAYER_VERSION = '1.0.0.A0005';
/**
 * Obtener select años fiscales (versión segura)
 */
function obtenerSelectDatosEfiscalSecure() {
    fetchDataArr(0, {}, 9, function (response) {
        if (!response.flag) {
            showMsg(response.msg, 'error');
            return;
        }

        var select = document.getElementById('cboEfiscal'); if (!select) return;
        select.innerHTML = '';
        var opt = document.createElement('option'); opt.value = '0'; opt.text = 'SELECCIONE'; select.appendChild(opt);

        response.listData.forEach(function (item) {
            var o = document.createElement('option');
            o.value = item.id_efiscal;
            o.text = item.efiscal;
            select.appendChild(o);
        });

        try { if (typeof cveEfiscal !== 'undefined' && cveEfiscal) select.value = cveEfiscal; } catch (e) { }
    });
}

/**
 * Obtener validación de JS en servidor
 */
function gettinValidatePage(v) {
    return new Promise(function (resolve) {
        try {
            blockUICustom();
            fetchDataArr(2, { _jsVersion: v }, 9, function (responsePage) {
                logger.log(responsePage)
                if (!responsePage || responsePage === 'error') {
                    resolve(false);
                    return;
                }
                var flag = (typeof responsePage.flagVersion !== 'undefined') ? responsePage.flagVersion : false;
                // var flag = (typeof responsePage.flagVersion !== 'undefined') ? responsePage.flagVersion
                //     : (responsePage.d && typeof responsePage.d.flagVersion !== 'undefined') ? responsePage.d.flagVersion
                //         : false;
                resolve(Boolean(flag));
            });
        } catch (e) {
            resolve(false);
        }
    });
}

/**
 * gDaoSecure: obtiene y muestra áreas de oportunidad (usa security helpers)
 */
function gDaoSecure(eFiscal) {
    var html = '';
    var secureData = prepareSecureData({ _eFiscal: sanitizeInput(eFiscal) }, AUTOMATA_SLAYER_VERSION);
    blockUICustom();
    fetchDataArr(1, secureData, 9, function (response) {
        if (!response.flag) {
            showMsg(response.msg, 'error');
            Swal.close();
            return;
        }

        if (!Array.isArray(response.listData) || response.listData.length === 0) {
            if (typeof recargarTabla === 'function') recargarTabla('tableAreasOportunidadA', null);
            showMsg('Registre al menos una área de oportunidad.', 'info');
            Swal.close();
            return;
        }

        response.listData.forEach(function (row) {
            var disabledBtn = '';
            var efiscalSeguro = encodeHTML(row.EFISCAL);
            var descripcionSegura = encodeHTML(row.Descripcion_elemento);
            var controlSeguro = encodeHTML(row.NO_CONTROL_ASIGN == null ? 'Por asignar' : row.NO_CONTROL_ASIGN);
            var areaSegura = encodeHTML(row.DESC_AREA_OPORTUNIDAD);
            var idCtrlSeguro = encodeAttribute((row.ID_CTRL_AREA_OPORTUNIDAD || '').toString());

            html += '<tr>' +
                '<td class="text-1000">' + efiscalSeguro + '</td>' +
                '<td class="text-1000">' + descripcionSegura + '</td>' +
                '<td class="text-1000">' + controlSeguro + '</td>' +
                '<td class="text-1000">' + areaSegura + '</td>' +
                '<td class="text-end"><div>' +
                '<button class="btn btn-sm btn-falcon-warning btnEditArea customButton m-1 ' + disabledBtn + '" type="button" data-ctrl-reporte="' + idCtrlSeguro + '">Editar área</button>' +
                '</div></td>' +
                '</tr>';
        });

        if (typeof recargarTabla === 'function') recargarTabla('tableAreasOportunidadA', html);
        else { var table = document.getElementById('tableAreasOportunidadA'); if (table) table.innerHTML = html; }
        Swal.close();
    });
}

// Integración en document.ready si se usa jQuery
if (typeof jQuery !== 'undefined') {
    jQuery(async function () {
        const val = await gettinValidatePage(AUTOMATA_SLAYER_VERSION);
        if (!val) {
            showMsg('La pantalla esta obsoleta, favor de actualizar o dar clic <a href="#" onclick="location.reload(); return false;">aquí</a>. Si persiste el problema, contacte al administrador del sistema.', 'alert');
            return;
        }

        if (typeof loadEndpoints === 'function') loadEndpoints(9);
        try { obtenerSelectDatosEfiscalSecure(); } catch (e) { }

        var role = (function () { try { return idRolUser; } catch (e) { return null; } })();
        var currentEfiscal = (function () { try { return cveEfiscal; } catch (e) { return null; } })();

        if (role === '101') {
            if (currentEfiscal) gDaoSecure(currentEfiscal);
        }

        $(document).on('change', '#cboEfiscal', function () {
            var eFiscal = $(this).val();
            if (role === '101') { if (typeof verifyInitialDataE === 'function' ? verifyInitialDataE(eFiscal) : true) gDaoSecure(eFiscal); }
        });

        $(document).on('click', '#btnSearch', function () {
            var eFiscal = $('#cboEfiscal').val();
            if (role === '101') { if (typeof verifyInitialDataE === 'function' ? verifyInitialDataE(eFiscal) : true) gDaoSecure(eFiscal); }
        });
    });
}

// export
// window.gDao = gDaoSecure;
// window.obtenerSelectDatosEfiscal = obtenerSelectDatosEfiscalSecure;
