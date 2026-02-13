'use strict';

window.APP_CONFIG = {
    debug: true // producción: false // local: true
};

//if (!window.APP_CONFIG?.debug) {
//    console.log = function () { };
//    console.warn = function () { };
//    console.error = function () { };
//    console.info = function () { };
//}

window.logger = {
    log: function (...args) {
        if (window.APP_CONFIG.debug) {
            console.log(...args);
        }
    },
    warn: function (...args) {
        if (window.APP_CONFIG.debug) {
            console.warn(...args);
        }
    },
    error: function (...args) {
        if (window.APP_CONFIG.debug) {
            console.error(...args);
        }
    },
    info: function (...args) {
        if (window.APP_CONFIG.debug) {
            console.info(...args);
        }
    },
    debug: function (...args) {
        if (window.APP_CONFIG.debug) {
            console.debug(...args);
        }
    }
    ,
    table: function (...args) {
        if (window.APP_CONFIG.debug) {
            console.table(...args);
        }
    }
};