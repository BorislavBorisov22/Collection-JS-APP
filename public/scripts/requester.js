'use strict';

function request(url, method, contentType = '', body = {}, headers = {}) {
    const promise = new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: method,
            cotentType: contentType,
            body: body,
            headers: headers,
            success: (data) => resolve(data),
            error: (err) => reject(err)
        });
    });
}

function get(url) {
    return request(url, 'GET');
}

function putJSON(url, body, headers = {}) {
    return request(url, 'PUT', 'application/json', body, headers);
}

function postJSON(url, body, headers = {}) {
    return request(url, 'POST', 'appplication/json', body, headers);
}

function getJSON(url, headers = {}) {
    return request(url, 'GET', 'application/json', {}, headers);
}

function patchJSON(url, body = {}, headers = {}) {
    return request(url, 'PATCH', 'application/json', body, headers);
}

export {get, putJSON, postJSON, getJSON, patchJSON };