"use strict";

/* -------------------------------------------------------------------------- */
/*                              Config                                        */
/* -------------------------------------------------------------------------- */

//document.addEventListener("contextmenu", (event) => event.preventDefault());

//document.addEventListener("keydown", (event) => {
//    if (event.ctrlKey && (event.key === "u" || event.key === "U")) {
//        event.preventDefault();
//    }
//    if (event.ctrlKey && event.shiftKey && (event.key === "I" || event.key === "i")) {
//        event.preventDefault();
//    }
//    if (event.key === "F12") {
//        event.preventDefault();
//    }
//});

var CONFIG = {
    isNavbarVerticalCollapsed: false,
    theme: 'light',
    isRTL: false,
    isFluid: false,
    navbarStyle: 'transparent',
    navbarPosition: 'vertical',
    timyng: 3500
};

Object.keys(CONFIG).forEach(function (key) {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, CONFIG[key]);
    }
});

if (JSON.parse(localStorage.getItem('isNavbarVerticalCollapsed'))) {
    document.documentElement.classList.add('navbar-vertical-collapsed');
}

if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
} else if (localStorage.getItem('theme') === 'auto') {
    document.documentElement.setAttribute('data-bs-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

$(document).ready(function () {

    logger.log("¡SISTEMA INFORMATICO DE CONTROL INTERNO!");

    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });
    $('.scrollup').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    var popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl, {
            delay: 30000
        })
    })
    toastList.forEach(toast => toast.show())

    //$('.dropdown-menu-card').click(function (e) {
    //    e.stopPropagation();
    //    logger.log(`${e.target.textContent} clicado!`);
    //});

    //$('.btnClosedModals').click(function (e) {
    //    e.stopPropagation();
    //});

    //if (!($('.modal.in').length)) {
    //    $('.myConfigModalDrag').css({
    //        top: 0,
    //        left: 0
    //    });
    //}
    //$('.myConfigModalDrag').modal({
    //    backdrop: false,
    //    show: true
    //});

    //$(".myConfigModalDrag").draggable({
    //    handle: ".modal-header"
    //});
});

const FILE_CONFIGS = {
    pdf: {
        exts: ['pdf'],
        mime: ['application/pdf'],
        name: 'PDF'
    },
    word: {
        exts: ['doc', 'docx'],
        mime: [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        name: 'Word'
    },
    excel: {
        exts: ['xls', 'xlsx'],
        mime: [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        name: 'Excel'
    },
    package: {
        exts: ['zip', 'rar', '7z', 'tar', 'gz'],
        mime: ['application/zip', 'application/x-rar-compressed'],
        name: 'comprimido'
    },
    image: {
        exts: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
        mime: ['image/'],
        name: 'imagen'
    },
    presentation: {
        exts: ['ppt', 'pptx'],
        mime: [
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ],
        name: 'PowerPoint'
    },
    text: {
        exts: ['txt', 'csv'],
        mime: ['text/'],
        name: 'texto'
    },
    video: {
        exts: ['mp4', 'avi', 'mov', 'wmv', 'mkv'],
        mime: ['video/'],
        name: 'video'
    },
    audio: {
        exts: ['mp3', 'wav', 'ogg', 'm4a', 'flac'],
        mime: ['audio/'],
        name: 'audio'
    }
};

function generarLetra() {
    var letras = ["a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var numero = (Math.random() * 15).toFixed(0);
    return letras[numero];
};

function colorHEX() {
    var coolor = "";
    for (var i = 0; i < 6; i++) {
        coolor = coolor + generarLetra();
    }
    return "#" + coolor;
};

function getArrColors(count) {
    var arr = []
    for (let index = 0; index < count; index++) {
        const element = colorHEX();
        arr.push(element)
    }
    return arr;
};

function colorRGBA() {
    var o = Math.round, r = Math.random, s = 255;
    return '' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + '';
}

function transparentize(opacity) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return 'rgba(' + colorRGBA() + ',' + alpha + ')'
}

var getColor = function getColor(name) {
    var dom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.documentElement;
    return getComputedStyle(dom).getPropertyValue("--falcon-".concat(name)).trim();
};

var getGrays = function getGrays(dom) {
    return {
        100: getColor('gray-100', dom),
        200: getColor('gray-200', dom),
        300: getColor('gray-300', dom),
        400: getColor('gray-400', dom),
        500: getColor('gray-500', dom),
        600: getColor('gray-600', dom),
        700: getColor('gray-700', dom),
        800: getColor('gray-800', dom),
        900: getColor('gray-900', dom),
        1000: getColor('gray-1000', dom),
        1100: getColor('gray-1100', dom)
    };
};

var getColors = function getColors(dom) {
    return {
        primary: getColor('primary', dom),
        secondary: getColor('secondary', dom),
        success: getColor('success', dom),
        info: getColor('info', dom),
        warning: getColor('warning', dom),
        danger: getColor('danger', dom),
        light: getColor('light', dom),
        dark: getColor('dark', dom),
        white: getColor('white', dom),
        black: getColor('black', dom),
        emphasis: getColor('emphasis-color', dom)
    };
};

var getSubtleColors = function getSubtleColors(dom) {
    return {
        primary: getColor('primary-bg-subtle', dom),
        secondary: getColor('secondary-bg-subtle', dom),
        success: getColor('success-bg-subtle', dom),
        info: getColor('info-bg-subtle', dom),
        warning: getColor('warning-bg-subtle', dom),
        danger: getColor('danger-bg-subtle', dom),
        light: getColor('light-bg-subtle', dom),
        dark: getColor('dark-bg-subtle', dom)
    };
};

function base64ToArrayBuffer(_base64) {
    var binaryString = window.atob(_base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(_fileName, _byte, _type) {
    var blob = new Blob([_byte], { type: _type });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = _fileName;
    link.download = fileName;
    mostrarFichero(link.href)
    //link.click();
}

function mostrarFichero(destino) {
    window.open(destino, null, "directories=no,height=600,width=800,left=0,top=0,location=no,menubar=yes,status=no,toolbar=yes,resizable=yes");
    //document.forms(0).submit();
}

function elTostado(icon, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 10000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({ icon: icon, title: message })
}

function setMessage(text, type, layout, time) {
    var options = {
        text: text,
        type: type,
        theme: 'mint',
        layout: layout,
        timeout: time,
    }
    return options
}
function blockUICustom(options = {}) {
    const config = {
        title: options.title || 'Espere por favor',
        html: options.html || '<div class="spinner-grow text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
        backdrop: 'rgba(0,0,0,0.8)',
        showClass: {
            popup: 'animate__animated animate__fadeIn'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut'
        },
        ...options
    };

    return Swal.fire(config);
}

// document.addEventListener('hidden.bs.modal', function () {
//     document.body.classList.remove('modal-open');
//     document.body.style.paddingRight = '';
//     document.body.style.overflow = '';
// });

function showMsgForm(idElemento, mensaje, type) {
    //const elemento = $("#" + idElemento);
    //new Noty(setMessage(mensaje, type, 'topCenter', CONFIG.timyng)).show();
    const $el = $("#" + idElemento);
    $el.removeClass("is-valid is-invalid");
    if (type === "error" || type === "danger") {
        $el.addClass("is-invalid").focus();
    } else if (type === "success") {
        $el.addClass("is-valid");
    }
    new Noty(setMessage(mensaje, type, "topCenter", CONFIG.timyng)).show();
}

function showMsg(mensaje, type) {
    new Noty(setMessage(mensaje, type, 'topCenter', CONFIG.timyng)).show();
}

function recargarTabla(idTabla, htmlFilas) {
    const tabla = $("#" + idTabla);

    if ($.fn.DataTable.isDataTable(tabla)) {
        tabla.DataTable().clear().destroy();
    }

    tabla.find("tbody").html(htmlFilas);

    initDataTable(idTabla);
}

function recargarTablaSinOpciones(idTabla, htmlFilas) {
    const tabla = $("#" + idTabla);

    if ($.fn.DataTable.isDataTable(tabla)) {
        tabla.DataTable().clear().destroy();
    }

    tabla.find("tbody").html(htmlFilas);

    initDataTableNo(idTabla);
}

function initDataTable(idElemento) {
    const selector = "#" + idElemento;
    const $elemento = $(selector);

    $elemento.DataTable({
        responsive: true,
        paging: true,
        searching: true,
        ordering: true,
        lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, 'Todos']
        ],
        fixedColumns: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        },
        drawCallback: function () {
            $('.pagination').addClass('pagination-sm');
        }
    });
}

function initDataTableNo(idElemento) {
    const selector = "#" + idElemento;
    const $elemento = $(selector);

    $elemento.DataTable({
        responsive: true,
        paging: false,
        searching: false,
        ordering: true,
        fixedColumns: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        },
        drawCallback: function () {
            $('.pagination').addClass('pagination-sm');
        }
    });
}

function alertConfirmMessage(message) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-outline-success m-1',
            denyButton: 'btn btn-outline-danger m-1',
        },
        buttonsStyling: false
    });

    return swalWithBootstrapButtons.fire({
        title: message,
        showDenyButton: true,
        confirmButtonText: `
            <lottie-player
                src="../../../Content/assets/img/animated-icons/custom_animations/92577-complete-check.json"
                mode="bounce"
                background="transparent"
                speed="0.5"
                style="width: 35px; margin: 0 auto"
                loop autoplay
                class="d-flex my-2 mx-2">
            </lottie-player> SI
        `,
        denyButtonText: `
            <lottie-player
                src="/Content/assets/img/animated-icons/custom_animations/92701-x-mark.json"
                mode="bounce"
                background="transparent"
                speed="0.5"
                style="width: 35px; margin: 0 auto"
                loop autoplay
                class="d-flex my-2 mx-2">
            </lottie-player> NO
        `
    }).then(result => result.isConfirmed);
}

function verifyInitialDataE(eFiscal) {
    if ((eFiscal === 0) ||
        (eFiscal === '0') ||
        (eFiscal === "null") ||
        (eFiscal === undefined) ||
        (eFiscal === "") ||
        (eFiscal === null)) {
        showMsg('Espere a obtener más datos...', 'alert');
        return false;
    }
    return true;
}

function verifyInitialDataOU(cveOS, cveUP) {
    if (cveOS === 0 && cveUP === 0 ||
        cveOS === '0' && cveUP === '0' ||
        cveOS === "null" && cveUP === "null" ||
        cveOS === undefined && cveUP === undefined ||
        cveOS === "" && cveUP === "" ||
        cveOS === null && cveUP === null) {
        showMsg('Espere a obtener más datos...', 'alert');
        return false;
    }
    return true;
}

function verifyInitialDataOUE(cveOS, cveUP, eFiscal) {
    if ((cveOS === 0 && cveUP === 0 && eFiscal === 0) ||
        (cveOS === '0' && cveUP === '0' && eFiscal === '0') ||
        (cveOS === "null" && cveUP === "null" && eFiscal === "null") ||
        (cveOS === undefined && cveUP === undefined && eFiscal === undefined) ||
        (cveOS === "" && cveUP === "" && eFiscal === "") ||
        (cveOS === null && cveUP === null && eFiscal === null)) {
        showMsg('Espere a obtener más datos...', 'alert');
        return false;
    }
    return true;
}

function autoValidateContainer(containerSelector) {
    const $container = $(containerSelector);
    if (!$container.length) return;
    $container
        .find("input, select, textarea")
        .off("input.autoValidate change.autoValidate blur.autoValidate")
        .on("input.autoValidate change.autoValidate blur.autoValidate", function () {
            const $el = $(this);
            const value = ($el.val() ?? "").toString().trim();
            const required = $el.data("required");
            const requiredIf = $el.data("required-if");
            let valid = true;
            if (value === "0" || value === "") valid = false;
            if (required && !value) valid = false;
            if (requiredIf && $(requiredIf).is(":checked") && !value) {
                valid = false;
            }
            $el.toggleClass("is-valid", valid && value);
            $el.toggleClass("is-invalid", !valid);
        });
}

function validateFile(input, type) {
    const fileConfigs = {
        pdf: { exts: ['.pdf'], name: 'PDF' },
        word: { exts: ['.doc', '.docx'], name: 'Word' },
        excel: { exts: ['.xls', '.xlsx'], name: 'Excel' },
        package: { exts: ['.zip', '.rar', '.7z', '.tar.gz'], name: 'comprimido' },
        image: { exts: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'], name: 'imagen' },
        presentation: { exts: ['.ppt', '.pptx'], name: 'PowerPoint' },
        text: { exts: ['.txt', '.csv'], name: 'texto' },
        video: { exts: ['.mp4', '.avi', '.mov', '.wmv', '.mkv'], name: 'video' },
        audio: { exts: ['.mp3', '.wav', '.ogg', '.m4a', '.flac'], name: 'audio' },
        allDocuments: {
            exts: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'],
            name: 'documento'
        }
    };

    const fileName = input.value.toLowerCase();

    if (!fileName) {
        showMsg('Por favor, seleccione un archivo.', 'error');
        return false;
    }

    const config = fileConfigs[type];
    if (!config) {
        showMsg('Tipo de archivo no configurado.', 'error');
        return false;
    }

    const isValid = config.exts.some(ext => fileName.endsWith(ext));

    if (!isValid) {
        const extensionsList = config.exts.join(', ');
        showMsg(`Formato no válido. Se permiten: ${extensionsList}`, 'error');
        input.value = '';
        return false;
    }

    showMsg(`Archivo ${config.name} válido.`, 'success');
    return true;
}

function validateUrl(input) {
    const url = input.value.trim();
    const protocolRegex = /^https?:\/\//i;

    if (!protocolRegex.test(url)) {
        showMsg('La URL debe comenzar con http:// o https://', 'error');
        input.value = '';
        return false;
    }

    showMsg('URL válida.', 'success');
    return true;
}

function verificarTexto(input) {
    const val = input.value;
    const espacios = val.match(/\s+/g);
    const signosPuntuacion = val.match(/[.,¿?¡!;:#$"'=()%&\/{}^~`´¨[\]\\|<>@*_+-]/g);

    if (espacios !== null) {
        if (espacios.length > 0) {
            showMsg("Favor de evitar espacios en el nombre de la evidencia.", 'error');
            input.value = "";
            return;
        }
    }

    if (signosPuntuacion !== null) {
        if (signosPuntuacion.length > 0) {
            showMsg("Favor de evitar signos de puntuación en el nombre de la evidencia.", 'error');
            input.value = "";
            return;
        }
    }
}

function getFileExtension(fileName) {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : null;
}

window.alertConfirmMessage = alertConfirmMessage;
window.verifyInitialDataE = verifyInitialDataE;
window.verifyInitialDataOU = verifyInitialDataOU;
window.verifyInitialDataOUE = verifyInitialDataOUE;
window.validateUrl = validateUrl;
window.validateFile = validateFile;
window.getFileExtension = getFileExtension;