/**
 * ====================================================================
 * SEGURIDAD - HELPER PARA PREVENCIÓN DE VULNERABILIDADES
 * ====================================================================
 * Este archivo contiene funciones para:
 * 1. Sanitización y validación de entradas de usuario
 * 2. Codificación de salida (Output Encoding)
 * 3. Protección contra inyección SQL
 * 4. Prevención de XSS (Cross-Site Scripting)
 * ====================================================================
 */

'use strict';

// ====================================================================
// 1. SANITIZACIÓN Y VALIDACIÓN DE ENTRADAS
// ====================================================================

/**
 * Sanitiza una cadena de texto eliminando caracteres peligrosos
 * @param {string} input - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
window.sanitizeInput = function (input) {
    if (typeof input !== 'string') {
        return '';
    }

    // Eliminar caracteres de control y espacios en blanco excesivos
    return input
        .trim()
        .replace(/[\x00-\x1F\x7F]/g, '') // Caracteres de control
        .substring(0, 5000); // Limitar longitud
};

/**
 * Valida que una entrada sea un número válido
 * @param {any} value - Valor a validar
 * @param {number} min - Valor mínimo (opcional)
 * @param {number} max - Valor máximo (opcional)
 * @returns {boolean} - true si es válido
 */
window.isValidNumber = function (value, min = null, max = null) {
    const num = parseInt(value, 10);

    if (isNaN(num)) {
        return false;
    }

    if (min !== null && num < min) {
        return false;
    }

    if (max !== null && num > max) {
        return false;
    }

    return true;
};

/**
 * Valida que una entrada sea un email válido
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
window.isValidEmail = function (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida que una entrada sean solo caracteres alfanuméricos y guiones
 * @param {string} input - Texto a validar
 * @returns {boolean} - true si es válido
 */
window.isAlphanumeric = function (input) {
    const alphanumericRegex = /^[a-zA-Z0-9\-_]+$/;
    return alphanumericRegex.test(input);
};

/**
 * Valida que una entrada sea una fecha válida (YYYY-MM-DD)
 * @param {string} date - Fecha a validar
 * @returns {boolean} - true si es válida
 */
window.isValidDate = function (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        return false;
    }

    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
};

// ====================================================================
// 2. CODIFICACIÓN DE SALIDA (Output Encoding)
// ====================================================================

/**
 * Codifica HTML para prevenir XSS
 * @param {string} text - Texto a codificar
 * @returns {string} - Texto codificado seguro
 */
window.encodeHTML = function (text) {
    if (typeof text !== 'string') {
        return '';
    }

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, char => map[char]);
};

/**
 * Codifica una URL para prevenir XSS
 * @param {string} url - URL a codificar
 * @returns {string} - URL codificada
 */
window.encodeURL = function (url) {
    try {
        return encodeURIComponent(url);
    } catch (e) {
        logger.warn('Error al codificar URL:', e);
        return '';
    }
};

/**
 * Codifica para atributos HTML
 * @param {string} text - Texto para atributo
 * @returns {string} - Texto codificado
 */
window.encodeAttribute = function (text) {
    if (typeof text !== 'string') {
        return '';
    }

    return text
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&#x27;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

// ====================================================================
// 3. VALIDACIÓN Y PREPARACIÓN DE DATOS PARA SERVIDOR
// ====================================================================

/**
 * Valida y prepara datos antes de enviar al servidor
 * @param {object} data - Objeto con datos a validar
 * @param {object} rules - Reglas de validación
 * @returns {object} - {valid: boolean, errors: array, data: object}
 */
window.validateAndPrepareData = function (data, rules) {
    const errors = [];
    const cleanData = {};

    for (const [key, value] of Object.entries(data)) {
        const rule = rules[key];

        if (!rule) {
            continue; // Ignorar campos sin reglas
        }

        // Aplicar sanitización
        let cleanValue = value;
        if (rule.type === 'string') {
            cleanValue = sanitizeInput(value);
        }

        // Validar según reglas
        if (rule.required && (!cleanValue || cleanValue.toString().trim() === '')) {
            errors.push(`${key} es requerido`);
            continue;
        }

        if (rule.type === 'number' && !isValidNumber(cleanValue)) {
            errors.push(`${key} debe ser un número válido`);
            continue;
        }

        if (rule.type === 'email' && !isValidEmail(cleanValue)) {
            errors.push(`${key} debe ser un email válido`);
            continue;
        }

        if (rule.type === 'date' && !isValidDate(cleanValue)) {
            errors.push(`${key} debe ser una fecha válida (YYYY-MM-DD)`);
            continue;
        }

        if (rule.minLength && cleanValue.toString().length < rule.minLength) {
            errors.push(`${key} debe tener al menos ${rule.minLength} caracteres`);
            continue;
        }

        if (rule.maxLength && cleanValue.toString().length > rule.maxLength) {
            errors.push(`${key} no debe exceder ${rule.maxLength} caracteres`);
            continue;
        }

        if (rule.pattern && !rule.pattern.test(cleanValue.toString())) {
            errors.push(`${key} tiene un formato inválido`);
            continue;
        }

        cleanData[key] = cleanValue;
    }

    return {
        valid: errors.length === 0,
        errors: errors,
        data: cleanData
    };
};

// ====================================================================
// 4. ENRIQUECIMIENTO SEGURO DE DATOS PARA ENVÍO AL SERVIDOR
// ====================================================================

/**
 * Prepara datos seguros para enviar al servidor con validación
 * @param {object} data - Datos a enviar
 * @param {string} version - Versión del archivo
 * @returns {object} - Datos preparados con validación incluida
 */
window.prepareSecureData = function (data, version) {
    return {
        ...data,
        _csrfToken: window.csrfToken || '', // Token CSRF si está disponible
        _jsVersion: version,
        _timestamp: new Date().toISOString(),
        _clientChecksum: generateDataChecksum(data)
    };
};

/**
 * Genera un checksum simple para verificar integridad de datos
 * @param {object} data - Datos a verificar
 * @returns {string} - Checksum
 */
window.generateDataChecksum = function (data) {
    try {
        const jsonString = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < jsonString.length; i++) {
            const char = jsonString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    } catch (e) {
        return '';
    }
};

// ====================================================================
// 5. CONFIGURACIÓN DE CONTENT SECURITY POLICY (CSP)
// ====================================================================

/**
 * Obtiene el meta tag CSP existente o crea uno nuevo
 * NOTA: Esto es principalmente informativo. El CSP correcto debe configurarse
 * en el servidor vía headers HTTP.
 * @returns {string} - Directiva CSP recomendada
 */
window.getRecommendedCSP = function () {
    return `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' cdnjs.cloudflare.com code.jquery.com;
    style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self' https:;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    `.trim();
};

/**
 * Verifica si el navegador soporta CSP
 * @returns {boolean}
 */
window.supportsCSP = function () {
    return typeof SecurityPolicyViolationEvent !== 'undefined';
};

/**
 * Escucha violaciones de CSP y las registra
 */
window.monitorCSPViolations = function () {
    if (!supportsCSP()) {
        logger.warn('Este navegador no soporta monitoreo de CSP');
        return;
    }

    document.addEventListener('securitypolicyviolation', function (e) {
        logger.error('Violación de CSP detectada:', {
            violatedDirective: e.violatedDirective,
            blockedURI: e.blockedURI,
            sourceFile: e.sourceFile,
            lineNumber: e.lineNumber,
            columnNumber: e.columnNumber
        });
    });
};

// ====================================================================
// 6. EJEMPLO DE USO COMPLETO
// ====================================================================

/**
 * Ejemplo: Validar y enviar datos de forma segura
 * 
 * const rules = {
 *     _eFiscal: { type: 'string', required: true, maxLength: 10, pattern: /^\d{4}$\/ },
 *     nombre: { type: 'string', required: true, minLength: 3, maxLength: 100 },
 *     email: { type: 'email', required: true },
 *     edad: { type: 'number', required: true, min: 18, max: 120 }
 * };
 * 
 * const validation = validateAndPrepareData(
 *     { _eFiscal: user_efiscal, nombre: userInput, email: userEmail, edad: userAge },
 *     rules
 * );
 * 
 * if (!validation.valid) {
 *     showMsg(validation.errors.join(', '), 'error');
 *     return;
 * }
 * 
 * const secureData = prepareSecureData(validation.data, AUTOMATA_SLAYER_VERSION);
 * fetchDataArr(endpointKey, secureData, z, callback);
 */

logger.log('%cSecurity Helper cargado exitosamente', 'color: green; font-weight: bold;');
