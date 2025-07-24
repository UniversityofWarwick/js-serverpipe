/* eslint-env browser */
import { getCsrfHeaderName, getCsrfToken } from './csrfToken.js';


export function addQsToUrl(url, qs) {
    const params = new URLSearchParams(qs);
    // append to url
    const connector = url.includes('?') ? '&' : '?';
    return `${url}${connector}${params.toString()}`;
}

export function fetchWithCredentials(url, options = {}) {
    const headers = 'headers' in options ? options.headers : {};
    addCsrfHeaderIfSafe(url, headers);
    return fetch(
        url,
        {
            credentials: 'same-origin',
            headers,
            ...options,
        },
    );
}

export function getJsonWithCredentials(url, options = {}) {
    const defaultHeaders = {
        Accept: 'application/json',
    };
    const headers = 'headers' in options ? [...options.headers, defaultHeaders] : defaultHeaders;

    return fetchWithCredentials(url, {
        method: 'GET',
        headers,
        ...options,
    });
}


export function postJsonWithCredentials(url, body, options = {}) {
    const defaultHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const headers = 'headers' in options ? [...options.headers, defaultHeaders] : defaultHeaders;
    addCsrfHeaderIfSafe(url, headers);
    return fetchWithCredentials(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
        ...options,
    });
}

export function postMultipartFormWithCredentials(url, form, options = {}) {
    const defaultHeaders = {
        Accept: 'application/json',
    };
    const headers = 'headers' in options ? [...options.headers, defaultHeaders] : defaultHeaders;
    addCsrfHeaderIfSafe(url, headers);
    // CASE-518 disable empty file inputs for iOS 11
    const fileInputs = form.querySelectorAll('input[type="file"]:not([disabled])');
    fileInputs.forEach(function (fi) {
        if (fi.files.length > 0) {
            return;
        }
        fi.setAttribute('disabled', '');
    });

    const formData = new FormData(form);

    fileInputs.forEach(function (fi) {
        fi.removeAttribute('disabled');
    });

    return fetchWithCredentials(url, {
        method: 'POST',
        body: formData,
        headers,
        ...options,
    });
}

function addCsrfHeaderIfSafe(url, headers) {
    if (new URL(url, window.location.origin).origin === window.location.origin) {
        headers[getCsrfHeaderName()] = getCsrfToken();
    }
}