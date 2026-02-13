let API_ROUTES = null;
let isFetchingEndpoints = false;
let pendingRequests = [];

var _lo_l = [
    'WebFrmPTAR001.aspx/GetAuthorizedEndpoints', //[0] doom
    'WebFrmPTAR002.aspx/GetAuthorizedEndpoints', //[1] ptar_2 --> metroid
    'WebFrmPTAR008.aspx/GetAuthorizedEndpoints', //[2] binding
    'WebFrmPTAR009.aspx/GetAuthorizedEndpoints', //[3] scorn
    'WebFrmPTAR003.aspx/GetAuthorizedEndpoints', //[4] evil
    'WebFrmPTAR010.aspx/GetAuthorizedEndpoints', //[5] wukong
    'WebFrmPTAR011.aspx/GetAuthorizedEndpoints', //[6] rocket
    'WebFrmPTAR013.aspx/GetAuthorizedEndpoints', //[7] nier
    'WebFrmPTAR014.aspx/GetAuthorizedEndpoints', //[8] forest
    'WebFrmPTAR015.aspx/GetAuthorizedEndpoints', //[9] automata
    'WebFrmPTAR017.aspx/GetAuthorizedEndpoints', //[10] dumbs
    'WebFrmPTAR018.aspx/GetAuthorizedEndpoints', //[11] dope
];

window.loadEndpoints = function (index) {
    return new Promise((resolve, reject) => {
        if (API_ROUTES !== null) {
            resolve(API_ROUTES);
            return;
        }

        if (isFetchingEndpoints) {
            pendingRequests.push({ resolve, reject });
            return;
        }

        isFetchingEndpoints = true;
        $.ajax({
            url: _lo_l[index],
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                API_ROUTES = JSON.parse(response.d);
                isFetchingEndpoints = false;
                resolve(API_ROUTES);
                pendingRequests.forEach(req => req.resolve(API_ROUTES));
                pendingRequests = [];
                logger.log("%cRUTAS DISPONIBLES EN ESTA PANTALLA", "background: rgba(255, 255, 255, 0.6); color: black;");
                logger.table(API_ROUTES);
            },
            error: function (error) {
                isFetchingEndpoints = false;
                logger.error("ERROR AL OBTENER LAS RUTAS (endpoints):", error);
                reject(error);
                pendingRequests.forEach(req => req.reject(error));
                pendingRequests = [];
            }
        });
    });
}

window.fetchDataArr = function (endpointKey, data, z, onSuccess, method = 'POST') {
    loadEndpoints(z).then(() => {
        if (!API_ROUTES[endpointKey]) {
            logger.error(`%cRUTAS DISPONIBLES EN ESTA PANTALLA${endpointKey}`, "color: rgba(255, 50, 50, 0.2)");
            return;
        }
        logger.log(`%c🎯 ${endpointKey} 💡 ${API_ROUTES[endpointKey].Item1}`, "color: hsla(71, 100%, 50%, 0.47)");
        logger.log(`🚀`, data);
        $.ajax({
            url: API_ROUTES[endpointKey].Item1,
            type: method,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data),
            async: true,
            success: function (result) {
                if (Array.isArray(result.d)) {
                    onSuccess(result.d);
                } else if (result.d === "error") {
                    onSuccess("error", []);
                } else if (typeof result.d === "string") {
                    onSuccess(result.d);
                } else if (result.d && typeof result.d === "object") {
                    onSuccess(result.d);
                } else {
                    logger.error(`ERROR CRITICO DEL SERVIDOR: %c${result.d}`, "color: hsla(0, 100%, 50%, 0.28)");
                    onSuccess(`ERROR CRITICO DEL SERVIDOR: ${result.d}`);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                logger.error("Error en la petición:", textStatus, errorThrown);
            }
        });
    }).catch(error => {
        logger.error("Error en fetchData:", error);
    });
}
