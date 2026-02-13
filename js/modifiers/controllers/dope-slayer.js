'use strict';

const idUser = $("#MainContent_hddnIdUsuario").val();
const idRolUser = $("#MainContent_hddnPage").val();
const cveOSd = $("#MainContent_hddnOS").val().trim();
const cveUPd = $("#MainContent_hddnUP").val().trim();
const cveEfiscald = $("#MainContent_hddnEfiscal").val().trim();

const d = new Date();
let startTime = new Date().getTime();
const numberMonth = parseInt(d.getMonth()) + 1;

const s03 = $("#alertSpin");
const divNombreArchivo = $("#divNombreArchivo");
let uploadedBytes = 0;

var selectedUrl = "";

var obtenerSelectDatosEfiscal = function () {
    fetchDataArr(0, {}, 11, function (response) {
        const select = $("#cboEfiscal");
        if (!response) { showMsg("Error al cargar datos", 'error'); return; }
        if (response.flag) {
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.listData.forEach(function (item) { select.append($("<option>", { value: item.id_efiscal, text: item.efiscal })); });
            select.val(cveEfiscald === undefined ? select.prop("disabled") : cveEfiscald);
        } else {
            showMsg(response.msg, 'error');
            select.prop("disabled");
        }
    });
}

var obtenerSelectDatosOS = function (txtEfiscal) {
    fetchDataArr(1, { _txtEfiscal: txtEfiscal }, 11, function (response) {
        const select = $("#cboOs");
        if (!response) { showMsg("Error al cargar datos", 'error'); return; }
        if (response.flag) {
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.listData.forEach(function (item) { select.append($("<option>", { value: item.Cve_Organo_Superior, text: item.Txt_Organo_Superior })); });
            select.val(cveOSd === undefined ? select.prop("disabled") : cveOSd);
        } else {
            showMsg(response.msg, 'error');
            select.prop("disabled")
        }
    })
}

var obtenerSelectDatosUP = function (txtEfiscal, txtOS, tipo) {
    fetchDataArr(2, { _txtEfiscal: txtEfiscal, _txtOS: txtOS }, 11, function (response) {
        const select = $("#cboUp");
        if (!response) { showMsg("Error al cargar datos", 'error'); return; }
        if (response.flag) {
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));
            response.listData.forEach(function (item) { select.append($("<option>", { value: item.Cve_Unidad_Presupuestal, text: item.Txt_Unidad_Presupuestal })); });
            select.val(cveUPd === undefined ? select.prop("disabled") : tipo === 'cambio' ? txtOS === cveOSd ? cveUPd : 0 : cveUPd);
        } else {
            showMsg(response.msg, 'error');
            select.prop("disabled")
        }
    });
}

var obtenerSelectDatosArchivo = function () {
    fetchDataArr(7, {}, 11, function (response) {
        const select = $("#cboArchivo");
        const select2 = $("#cboArchivoFilter");
        if (!response) { showMsg("Error al cargar datos", 'error'); return; }
        if (response.flag) {
            select.empty();
            select.append($("<option>", { value: "0", text: "SELECCIONE" }));

            select2.empty();
            select2.append($("<option>", { value: "0", text: "TODO" }));

            response.listData.forEach(function (item) {
                select.append($("<option>", { value: item.ID_ARCHIVO, text: item.DESC_ARCHIVO, 'data-ctrl-url': item.URL_RAIZ_CORTA }));
                select2.append($("<option>", { value: item.ID_ARCHIVO, text: item.DESC_ARCHIVO }));
            });
        } else {
            showMsg(response.msg, 'error');
            select.prop("disabled");
            select2.prop("disabled");
        }
    });
}

function getArchivero(eFiscal, idArchivo) {
    var html = '';
    blockUICustom();
    fetchDataArr(3, { _eFiscal: eFiscal, _idArchivo: idArchivo }, 11, function (response) {
        if (!response) { showMsg("Error al cargar datos", 'error'); return; }
        if (response.flag) {
            recargarTabla("tableArchivero", response.html);
        } else {
            recargarTabla("tableArchivero", null);
            showMsg(response.msg, 'error');
        }
        Swal.close();
    });
}

function seeHistorico(eFiscal) {
    var html = '';
    blockUICustom();
    fetchDataArr(5, { _eFiscal: eFiscal }, 11, function (response) {
        if (response.flag) {
            showMsg(response.msg, 'success');
            $("#innerHistorico").html(response.html);
        } else {
            showMsg(response.msg, 'error');
            $("#innerHistorico").html(null);
        }
        Swal.close();
    });
}

function gDeById(idArc) {
    blockUICustom({
        title: 'Descargando archivo',
        html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...</div></div>'
    });
    fetchDataArr(6, { _idCtrlArchivo: idArc }, 11, function (response) {
        if (response.flag) {
            showMsg(response.msg, 'success');
            mostrarFichero(response.pathFile);
        } else if (response === "error") {
            showMsg(response.msg, 'error');
        }
        Swal.close();
    });
}

async function uploadFileInChunks(file, idUsuario, txtDesc, idDocumento, fileExt, txtUrl, confirmNewName, txtNewName, eFiscal) {
    // blockUICustom({
    //     title: 'Guardando documento...',
    //     html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere...<progress id="progressBar" value="0" max="100"></progress><span id="progressText"></span><span id="timeRemaining"></span></div></div>',
    //     allowOutsideClick: false,
    // });
    blockUICustom({
        title: 'Guardando documento...',
        html: '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><div class="mt-2">Por favor espere, no recargue la página...</div></div>',
        allowOutsideClick: false,
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
        $("#btnS_Archivo").removeAttr("disabled");
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
        formData.append("toServer", 3);

        formData.append("_idUsuario", idUsuario);
        formData.append("_txtDesc", txtDesc);
        formData.append("_idDocumento", idDocumento);
        formData.append("_fileExt", fileExt);
        formData.append("_txtUrl", txtUrl);
        formData.append("_confirmNewName", confirmNewName);
        formData.append("_txtNewName", txtNewName);
        formData.append("_eFiscal", eFiscal);
        await sendChunk(formData,
            function (response) {
                let objetoJS = JSON.parse(response);
                if (objetoJS.flag) {
                    showMsg(objetoJS.msg, 'success');
                    getArchivero(eFiscal, idDocumento);
                    seeHistorico(eFiscal);
                    clearForms(1);
                    $("#modalArchiveroForm").modal("hide");
                    $("#btnS_Archivo").removeAttr("disabled");
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
    }
}

function validarFormularioEvidencia() {
    const $container = $("#formArchiveroForm");
    const invalid = $container
        .find("[data-required], [data-required-if]")
        .filter(function () {
            const $el = $(this);
            const value = ($el.val() ?? "").toString().trim();
            const required = $el.data("required");
            const requiredIf = $el.data("required-if");
            if (required && (!value || value === "0")) {
                return true;
            }
            if (requiredIf) {
                const isChecked = $(requiredIf).is(":checked");
                if (isChecked && !value) {
                    return true;
                }
                if (!isChecked) {
                    $el.val("");
                    return false;
                }
            }
            return false;
        })
        .first();

    if (invalid.length) {
        showMsgForm(
            invalid.attr("id"),
            invalid.data("msg") || "Campo inválido",
            "error"
        );
        return false;
    }

    return true;
}

function clearForms(type) {
    if (type === 1) {
        $("#txtDesc").val('');
        $("#txtNombreCustom").val('');
        $("#customFile").val('');
        $("#cboArchivo").val(0);
        $('#forCheckName').prop('checked', false);
    } else if (type === 2) {
    } else if (type === 3) {
    } else if (type === 4) {
    } else if (type === 5) {
    } else if (type === 6) {
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    s03.hide();
    autoValidateContainer("#formArchiveroForm");
    loadEndpoints(11);
    obtenerSelectDatosEfiscal();
    obtenerSelectDatosOS(cveEfiscald);
    obtenerSelectDatosUP(cveEfiscald, cveOSd, '')
    obtenerSelectDatosArchivo();
    if (idRolUser === '101') {
        logger.log("Usuario Isra");
        getArchivero(cveEfiscald, 0);
        seeHistorico(cveEfiscald);
    } else if (idRolUser === '102') {
        logger.log("Usuario Leo");
    } else if (idRolUser === '103') {
        logger.log("Usuario Esther");
        $("#btnGroupVerticalDrop1").hide();
    }

    $(document).on("change", "#cboEfiscal, #cboArchivoFilter", async function () {
        var cboArchivo = $("#cboArchivoFilter").val();
        var eFiscal = $("#cboEfiscal").val();
        if (await verifyInitialDataE(eFiscal)) {
            if (idRolUser === '101') {
                getArchivero(eFiscal, cboArchivo);
                seeHistorico(eFiscal);
            } else if (idRolUser === '102') {

            } else if (idRolUser === '103') {

            }
        }
    });

    $(document).on("click", "#btnSearch", async function () {
        var cboArchivo = $("#cboArchivoFilter").val();
        var eFiscal = $("#cboEfiscal").val();
        if (idRolUser === '101') {
            if (await verifyInitialDataE(eFiscal)) {
                getArchivero(eFiscal, cboArchivo);
                seeHistorico(eFiscal);
            }
        } else if (idRolUser === '102') {

        } else if (idRolUser === '103') {

        }
    });

    $(document).on("click", "#btnN_Archivo", async function () {
        // const confirmado = await alertConfirmMessage("¿Deseas crear un nuevo archivo?");
        // logger.warn(confirmado)
        // if (!confirmado) { return }
        var eFiscal = $("#cboEfiscal").val();
        clearForms(1);
        if (await verifyInitialDataE(eFiscal)) {
            autoValidateContainer("#formArchiveroForm");
            $("#cboArchivo").val(0);
            $("#setLinked").hide();
            divNombreArchivo.hide();
            $("#modalArchiveroForm").modal("show");
        }
    });

    $(document).on("click", "#btnS_Archivo", async function () {
        const confirmado = await alertConfirmMessage("¿Esta seguro de guardar el archivo?");
        if (!confirmado) { return }
        const $btn = $("#btnS_Archivo");
        $btn.prop("disabled", true);
        try {
            const cveEfiscal = $("#cboEfiscal").val();
            //const okInitial = await verifyInitialDataE(cveEfiscal);
            if (!await verifyInitialDataE(cveEfiscal)) return;
            if (!validarFormularioEvidencia()) return;
            const file = $("#customFile")[0].files[0];
            if (!file) {
                showMsg("No ha insertado ningún archivo, favor de ingresarlo.", "error");
                return;
            }
            const data = {
                txtDesc: $("#txtDesc").val().trim(),
                cboArchivo: $("#cboArchivo").val(),
                txtUrlConfirm: $("#setLinked").text(),
                confirmNewName: $("#forCheckName").is(":checked") ? 1 : 0,
                txtNombreCustom: $("#forCheckName").is(":checked") ? $("#txtNombreCustom").val().trim() : "",
                cveEfiscal,
                ext: getFileExtension(file.name)
            };
            uploadFileInChunks(file, idUser, data.txtDesc, data.cboArchivo, data.ext, data.txtUrlConfirm, data.confirmNewName, data.txtNombreCustom, data.cveEfiscal);
        } catch (err) {
            showMsg(err, "error");
        } finally {
            $btn.prop("disabled", false);
        }
    });


    $(document).on("click", ".btnDownloadDoc", function () {
        var idReturn = $(this)[0].dataset.ctrlArchivero;
        gDeById(idReturn);
    });

    $(document).on("change", "#cboArchivo", function () {
        var selectedValue = $(this).val();
        var cveEfiscal = $("#cboEfiscal").val();
        if (selectedValue !== '0') {
            selectedUrl = $(this)[0][selectedValue].dataset.ctrlUrl + cveEfiscal + "/";
            $("#setLinked").html('Ruta de almacenamiento: <strong>' + selectedUrl + '</strong>').show();
        } else {
            selectedUrl = "";
            $("#setLinked").hide();
        }
    });

    $(document).on("change", "#customFile", function () {
        let file = $(this)[0].files[0];
        if (file !== undefined) {
            $("#setLinked").html('Ruta de almacenamiento: <strong>' + selectedUrl + file.name + '</strong>').show();
        } else {
            if (selectedUrl === "") {
                $("#setLinked").hide();
            } else {
                $("#setLinked").html('Ruta de almacenamiento: <strong>' + selectedUrl + '</strong>').show();
            }
        }
    });

    $(document).on("change", "#forCheckName", function () {
        if ($(this).is(':checked')) {
            divNombreArchivo.show();
        } else {
            divNombreArchivo.hide();
        }
    });
});

