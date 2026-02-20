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

/**
 * Genera una letra o número aleatorio del conjunto [a-f, 0-9]
 * @returns {string} Una letra o número aleatorio
 */
function generarLetra() {
    var letras = ["a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var numero = (Math.random() * 15).toFixed(0);
    return letras[numero];
};

/**
 * Genera un color hexadecimal aleatorio
 * @returns {string} Color en formato hexadecimal (ej: #a1b2c3)
 */
function colorHEX() {
    var coolor = "";
    for (var i = 0; i < 6; i++) {
        coolor = coolor + generarLetra();
    }
    return "#" + coolor;
};

/**
 * Genera un arreglo de colores hexadecimales aleatorios
 * @param {number} count - Cantidad de colores a generar
 * @returns {string[]} Arreglo de colores en formato hexadecimal
 */
function getArrColors(count) {
    var arr = []
    for (let index = 0; index < count; index++) {
        const element = colorHEX();
        arr.push(element)
    }
    return arr;
};

/**
 * Genera valores RGB aleatorios sin canal alfa
 * @returns {string} Valores RGB separados por comas (ej: 255,128,64)
 */
function colorRGBA() {
    var o = Math.round, r = Math.random, s = 255;
    return '' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + '';
}

/**
 * Genera un color RGBA aleatorio con transparencia
 * @param {number} [opacity=0.5] - Opacidad del color (0-1). Por defecto 0.5
 * @returns {string} Color en formato RGBA (ej: rgba(255,128,64,0.5))
 */
function transparentize(opacity) {
    var alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return 'rgba(' + colorRGBA() + ',' + alpha + ')'
}

/**
 * Obtiene el valor de una variable CSS personalizada (custom property)
 * @param {string} name - Nombre de la variable CSS sin el prefijo "--falcon-"
 * @param {HTMLElement} [dom=document.documentElement] - Elemento del cual obtener la propiedad
 * @returns {string} Valor de la variable CSS
 */
var getColor = function getColor(name) {
    var dom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.documentElement;
    return getComputedStyle(dom).getPropertyValue("--falcon-".concat(name)).trim();
};

/**
 * Obtiene los valores de escala de grises del tema
 * @param {HTMLElement} dom - Elemento del cual extraer los valores de grises
 * @returns {Object} Objeto con propiedades 100-1100 conteniendo valores de color gris
 */
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

/**
 * Obtiene la paleta de colores del tema (primary, secondary, success, etc.)
 * @param {HTMLElement} dom - Elemento del cual extraer los colores del tema
 * @returns {Object} Objeto con propiedades de colores: primary, secondary, success, info, warning, danger, light, dark, white, black, emphasis
 */
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

/**
 * Obtiene versiones sutiles (más claras) de los colores del tema para fondos
 * @param {HTMLElement} dom - Elemento del cual extraer los colores sutiles
 * @returns {Object} Objeto con propiedades de colores sutiles para fondos
 */
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

/**
 * Convierte una cadena Base64 a un arreglo de bytes (Uint8Array)
 * @param {string} _base64 - Cadena codificada en Base64
 * @returns {Uint8Array} Arreglo de bytes descodificado
 */
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

/**
 * Crea y descarga un archivo a partir de un arreglo de bytes
 * @param {string} _fileName - Nombre del archivo a descargar
 * @param {Uint8Array|Array} _byte - Arreglo de bytes del contenido del archivo
 * @param {string} _type - Tipo MIME del archivo (ej: 'application/pdf')
 */
function saveByteArray(_fileName, _byte, _type) {
    var blob = new Blob([_byte], { type: _type });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = _fileName;
    link.download = fileName;
    mostrarFichero(link.href)
    //link.click();
}

/**
 * Abre un archivo en una ventana emergente con especificaciones de tamaño y controles
 * @param {string} destino - URL del archivo o recurso a mostrar
 */
function mostrarFichero(destino) {
    window.open(destino, null, "directories=no,height=600,width=800,left=0,top=0,location=no,menubar=yes,status=no,toolbar=yes,resizable=yes");
    //document.forms(0).submit();
}

/**
 * Muestra una notificación tipo "toast" en la esquina superior derecha con ícono y mensaje
 * @param {string} icon - Tipo de ícono (success, error, warning, info, question)
 * @param {string} message - Mensaje a mostrar en el toast
 */
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

/**
 * Crea un objeto de configuración para notificaciones Noty
 * @param {string} text - Texto del mensaje
 * @param {string} type - Tipo de notificación (error, success, alert, warning, info)
 * @param {string} layout - Disposición de la notificación (topCenter, topRight, bottomRight, etc.)
 * @param {number} time - Tiempo en milisegundos antes de auto-descartar
 * @returns {Object} Objeto de configuración para Noty
 */
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
/**
 * Muestra un diálogo bloqueante (modal) con spinner de carga personalizable
 * @param {Object} [options={}] - Configuración personalizada
 * @param {string} [options.title='Espere por favor'] - Título del diálogo
 * @param {string} [options.html] - HTML personalizado (por defecto muestra spinner)
 * @returns {Promise} Promise que se resuelve cuando el diálogo se cierra
 */
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

/**
 * Muestra un mensaje de validación en un elemento del formulario con notificación visual
 * @param {string} idElemento - ID del elemento del formulario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje (error, danger, success)
 */
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

/**
 * Muestra una notificación simple en el centro superior
 * @param {string} mensaje - Texto del mensaje
 * @param {string} type - Tipo de notificación (error, success, alert, warning, info)
 */
function showMsg(mensaje, type) {
    new Noty(setMessage(mensaje, type, 'topCenter', CONFIG.timyng)).show();
}

/**
 * Recarga una tabla DataTable con nuevo contenido HTML y reinicializa con paginación
 * @param {string} idTabla - ID de la tabla
 * @param {string} htmlFilas - HTML de las nuevas filas de la tabla
 */
function recargarTabla(idTabla, htmlFilas) {
    const tabla = $("#" + idTabla);

    if ($.fn.DataTable.isDataTable(tabla)) {
        tabla.DataTable().clear().destroy();
    }

    tabla.find("tbody").html(htmlFilas);

    initDataTable(idTabla);
}

/**
 * Recarga una tabla DataTable con nuevo contenido HTML sin paginación ni búsqueda
 * @param {string} idTabla - ID de la tabla
 * @param {string} htmlFilas - HTML de las nuevas filas de la tabla
 */
function recargarTablaSinOpciones(idTabla, htmlFilas) {
    const tabla = $("#" + idTabla);

    if ($.fn.DataTable.isDataTable(tabla)) {
        tabla.DataTable().clear().destroy();
    }

    tabla.find("tbody").html(htmlFilas);

    initDataTableNo(idTabla);
}

/**
 * Inicializa una tabla DataTable con paginación, búsqueda y ordenamiento
 * @param {string} idElemento - ID del elemento table
 */
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

/**
 * Inicializa una tabla DataTable solo con ordenamiento (sin paginación ni búsqueda)
 * @param {string} idElemento - ID del elemento table
 */
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

/**
 * Muestra un diálogo de confirmación con iconos animados SÍ/NO usando SweetAlert
 * @param {string} message - Mensaje a mostrar en el diálogo
 * @returns {Promise<boolean>} Promise que se resuelve a true si se confirma, false si se niega
 */
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

/**
 * Verifica que se haya seleccionado un año fiscal válido
 * @param {string|number} eFiscal - Año fiscal seleccionado
 * @returns {boolean} true si el año fiscal es válido, false en caso contrario
 */
function verifyInitialDataE(eFiscal) {
    if ((eFiscal === 0) ||
        (eFiscal === '0') ||
        (eFiscal === "null") ||
        (eFiscal === undefined) ||
        (eFiscal === "") ||
        (eFiscal === null)) {
        showMsg('Elija un año fiscal valido...', 'alert');
        return false;
    }
    return true;
}

/**
 * Verifica que se hayan seleccionado una organización y unidad presupuestal válidas
 * @param {string|number} cveOS - Clave de la organización
 * @param {string|number} cveUP - Clave de la unidad presupuestal
 * @returns {boolean} true si ambas están seleccionadas, false en caso contrario
 */
function verifyInitialDataOU(cveOS, cveUP) {
    if (cveOS === 0 && cveUP === 0 ||
        cveOS === '0' && cveUP === '0' ||
        cveOS === "null" && cveUP === "null" ||
        cveOS === undefined && cveUP === undefined ||
        cveOS === "" && cveUP === "" ||
        cveOS === null && cveUP === null) {
        showMsg('Elija una organización y unidad presupuestal...', 'alert');
        return false;
    }
    return true;
}

/**
 * Verifica que se hayan seleccionado organización, unidad presupuestal y año fiscal
 * @param {string|number} cveOS - Clave de la organización
 * @param {string|number} cveUP - Clave de la unidad presupuestal
 * @param {string|number} eFiscal - Año fiscal
 * @returns {boolean} true si todos los parámetros son válidos, false en caso contrario
 */
function verifyInitialDataOUE(cveOS, cveUP, eFiscal) {
    if ((cveOS === 0 && cveUP === 0 && eFiscal === 0) ||
        (cveOS === '0' && cveUP === '0' && eFiscal === '0') ||
        (cveOS === "null" && cveUP === "null" && eFiscal === "null") ||
        (cveOS === undefined && cveUP === undefined && eFiscal === undefined) ||
        (cveOS === "" && cveUP === "" && eFiscal === "") ||
        (cveOS === null && cveUP === null && eFiscal === null)) {
        showMsg('Elija una organización, unidad presupuestal y año fiscal...', 'alert');
        return false;
    }
    return true;
}

// Sistema global de debounce para autoValidateContainer
// Evita recrear el objeto en cada llamada y maneja múltiples containers
const autoValidateDebounceTimers = {};
const autoValidateInitializedContainers = new WeakSet();

/**
 * Valida en tiempo real todos los inputs de un contenedor con debounce de 300ms
 * Aplica clases Bootstrap (is-valid/is-invalid) y maneja dependencias condicionales
 * @param {string} containerSelector - Selector CSS del contenedor del formulario
 */
function autoValidateContainer(containerSelector) {
    try {
        const $container = $(containerSelector);
        if (!$container.length) {
            logger.warn('autoValidateContainer: No se encontró el container con selector:', containerSelector);
            return;
        }

        // Función auxiliar para validar un campo
        function validateField($el) {
            try {
                const type = ($el.attr('type') || '').toLowerCase();
                let value;
                if (type === 'checkbox' || type === 'radio') {
                    value = $el.is(':checked') ? '1' : '';
                } else if (type === 'file') {
                    value = ($el[0] && $el[0].files && $el[0].files.length) ? '1' : '';
                } else {
                    value = ($el.val() ?? '').toString().trim();
                }

                const required = $el.data("required");
                const requiredIf = $el.data("required-if");
                let valid = true;

                if (value === "0" || value === "") valid = false;
                if (required && !value) valid = false;
                if (requiredIf) {
                    const $dep = $(requiredIf);
                    if ($dep.length && $dep.is(':checked') && !value) {
                        valid = false;
                    }
                }

                // Aplicar clases y aria-invalid
                $el.toggleClass("is-valid", valid && value);
                $el.toggleClass("is-invalid", !valid && (required || requiredIf || value));
                $el.attr('aria-invalid', !valid && (required || requiredIf || value));
            } catch (e) {
                logger.warn('Error validando campo:', e);
            }
        }

        // Función para obtener ID único del elemento (con fallback si no tiene id)
        function getElementKey($el) {
            let key = $el.attr('id');
            if (!key) {
                // Si no tiene ID, usar data-name, name, o índice basado en position
                key = $el.data('name') || $el.attr('name') || 'element_' + $container.find('input, select, textarea').index($el);
            }
            return containerSelector + '_' + key; // Hacer la clave única por container
        }

        // Limpiar timers pendientes del container anterior (evita memory leaks)
        Object.keys(autoValidateDebounceTimers).forEach(key => {
            if (key.startsWith(containerSelector + '_')) {
                clearTimeout(autoValidateDebounceTimers[key]);
                delete autoValidateDebounceTimers[key];
            }
        });

        // Vincular eventos de validación en tiempo real
        // input: con debounce (300ms) para evitar parpadeo por cada carácter
        // change/blur: inmediato para respuesta rápida
        const $inputs = $container.find("input, select, textarea");
        if ($inputs.length === 0) {
            logger.warn('autoValidateContainer: No se encontraron inputs en el container:', containerSelector);
            return;
        }

        $inputs
            .off("input.autoValidate change.autoValidate blur.autoValidate")
            .on("input.autoValidate", function () {
                try {
                    const $el = $(this);
                    const key = getElementKey($el);
                    clearTimeout(autoValidateDebounceTimers[key]);
                    autoValidateDebounceTimers[key] = setTimeout(() => validateField($el), 300);
                } catch (e) {
                    logger.warn('Error en evento input:', e);
                }
            })
            .on("change.autoValidate blur.autoValidate", function () {
                try {
                    const $el = $(this);
                    const key = getElementKey($el);
                    clearTimeout(autoValidateDebounceTimers[key]);
                    validateField($el);
                } catch (e) {
                    logger.warn('Error en evento change/blur:', e);
                }
            });

        // Validar dependencias de requiredIf cuando se cambia el checkbox/radio disparador
        $container.find('[data-required-if]').each(function () {
            try {
                const $el = $(this);
                const depSelector = $el.data('required-if');
                if (!depSelector) return;

                const $dep = $(depSelector);
                if (!$dep.length) {
                    logger.warn('dependencia no encontrada para:', depSelector);
                    return;
                }

                $dep.off('change.autoValidateDep').on('change.autoValidateDep', function () {
                    validateField($el);
                });
            } catch (e) {
                logger.warn('Error configurando dependencias:', e);
            }
        });

    } catch (err) {
        logger.error('Error crítico en autoValidateContainer:', err);
    }
}

/**
 * Valida la extensión de archivo seleccionado contra un tipo permitido predefinido
 * @param {HTMLInputElement} input - Elemento input type="file"
 * @param {string} type - Tipo de archivo (pdf, word, excel, image, video, audio, etc.)
 * @returns {boolean} true si el archivo es válido, false en caso contrario
 */
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

/**
 * Valida que una URL comience con http:// o https://
 * @param {HTMLInputElement} input - Elemento input con la URL
 * @returns {boolean} true si la URL es válida, false en caso contrario
 */
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

/**
 * Valida que un campo no contenga espacios ni signos de puntuación (para nombres de evidencia)
 * Muestra mensaje de error y limpia el campo si no es válido
 * @param {HTMLInputElement} input - Elemento input a validar
 */
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

/**
 * Extrae la extensión de un archivo (sin el punto)
 * @param {string} fileName - Nombre del archivo
 * @returns {string|null} Extensión en minúsculas, o null si no hay extensión
 */
function getFileExtension(fileName) {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : null;
}

/**
 * Inyecta divs de valid-feedback e invalid-feedback en todos los inputs del formulario
 * @param {string} containerSelector - Selector CSS del contenedor del formulario
 */
function injectFeedbackMessages(containerSelector) {
    try {
        const $container = $(containerSelector);
        if (!$container.length) {
            logger.warn('injectFeedbackMessages: No se encontró el container con selector:', containerSelector);
            return;
        }

        const $fieldElements = $container.find('[data-required], [data-required-if]');
        if ($fieldElements.length === 0) {
            logger.warn('injectFeedbackMessages: No se encontraron campos con [data-required] o [data-required-if] en:', containerSelector);
            return;
        }

        let injectedCount = 0;
        let skippedCount = 0;

        $fieldElements.each(function () {
            try {
                const $el = $(this);

                // Validar que sea un elemento válido
                if (!$el.is(':visible') && !$el.attr('type')) {
                    logger.warn('El elemento no es un input válido:', $el);
                    skippedCount++;
                    return;
                }

                const msg = $el.data('msg') || 'Campo requerido';

                // Verificar si ya tiene feedback divs (para no duplicar)
                const $existingFeedback = $el.nextAll('.valid-feedback, .invalid-feedback').first();
                if ($existingFeedback.length > 0) {
                    skippedCount++;
                    return; // Ya existen, saltar
                }

                // Crear divs de feedback con encoding seguro
                const encodedMsg = (typeof encodeHTMLString === 'function') ? encodeHTMLString(msg) : msg;
                const $validFeedback = $('<div class="valid-feedback">Válido</div>');
                const $invalidFeedback = $('<div class="invalid-feedback">' + encodedMsg + '</div>');

                // Estrategia de inserción robusta: 4 niveles de fallback
                const $formFloating = $el.closest('.form-floating');
                const $formGroup = $el.closest('.form-group');
                const $colContainer = $el.closest('[class*="col-"], .row');

                if ($formFloating.length) {
                    $el.after($validFeedback.clone(), $invalidFeedback.clone());
                } else if ($formGroup.length && !$colContainer.length) {
                    $formGroup.append($validFeedback, $invalidFeedback);
                } else if ($colContainer.length) {
                    $colContainer.append($validFeedback, $invalidFeedback);
                } else {
                    $el.after($validFeedback, $invalidFeedback);
                }
                injectedCount++;

            } catch (e) {
                logger.warn('Error inyectando feedback para elemento:', e);
                skippedCount++;
            }
        });

        logger.log('injectFeedbackMessages completado: ' + injectedCount + ' divs inyectados, ' + skippedCount + ' saltados');

    } catch (err) {
        logger.error('Error crítico en injectFeedbackMessages:', err);
    }
}

// Exponer funciones principales al scope global para acceso desde HTML/WebForms
window.alertConfirmMessage = alertConfirmMessage;
window.verifyInitialDataE = verifyInitialDataE;
window.verifyInitialDataOU = verifyInitialDataOU;
window.verifyInitialDataOUE = verifyInitialDataOUE;
window.validateUrl = validateUrl;
window.validateFile = validateFile;
window.verificarTexto = verificarTexto;
window.getFileExtension = getFileExtension;
window.injectFeedbackMessages = injectFeedbackMessages;
window.autoValidateContainer = autoValidateContainer;