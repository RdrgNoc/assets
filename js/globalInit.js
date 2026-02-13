'use strict';

window.sendChunk = function (formData, onComplete) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "Handler/UploadChunk.ashx",
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                resolve(res);
                logger.log(res);
                onComplete(JSON.stringify(res));
            },
            error: function (err) {
                reject(err);
            }
        });
    });
}

window.uploadChunkWithProgress = function (formData, onProgress, onComplete) {

    const xhr = new XMLHttpRequest();
    const startTime = Date.now();

    xhr.open("POST", "Handler/UploadChunk.ashx", true);

    xhr.upload.onprogress = function (e) {
        if (!e.lengthComputable) return;

        const elapsed = (Date.now() - startTime) / 1000;
        const speed = e.loaded / elapsed;
        const remainingBytes = e.total - e.loaded;
        const remainingTime = remainingBytes / speed;

        const percent = Math.round((e.loaded / e.total) * 100);

        if (window.progressBar) {
            window.progressBar.value = percent;
            window.progressText.innerText = `Subiendo ${percent}%`;
            window.timeRemaining.innerText = `Tiempo restante: ${formatTime(remainingTime)}`;
        }

        if (onProgress) {
            onProgress({
                percent,
                loaded: e.loaded,
                total: e.total,
                speed,
                remainingTime
            });
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200 && onComplete) {
            onComplete(JSON.parse(xhr.responseText));
        }
    };

    xhr.onerror = function () {
        logger.error("Error de red durante la subida");
    };

    xhr.send(formData);
};