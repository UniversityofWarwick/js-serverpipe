/* eslint-env browser */
import log from 'loglevel';
import Url from 'url';
import {getCsrfHeaderName, getCsrfToken} from './csrfToken';

function isIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    const ie = (msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./));
    if (ie) {
        log.debug('Running on MS IE');
    }
    return ie;
}

export function addQsToUrl(url, qs) {
    const parsedUrl = Url.parse(url, true);
    parsedUrl.search = null;
    parsedUrl.query = {
        ...parsedUrl.query,
        ...qs,
    };
    return Url.format(parsedUrl);
}

export function fetchWithCredentials(url, options = {}) {
    const headers = 'headers' in options ? options.headers : {};
    addCsrfHeaderIfSafe(options, headers);
    return fetch(
        isIE() ? addQsToUrl(url, {ts: new Date().valueOf()}) : url,
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
    addCsrfHeaderIfSafe(options, headers);
    return fetchWithCredentials(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
        ...options,
    });
}

function addCsrfHeaderIfSafe(options, headers) {
    if (new URL(options.url, window.location.origin).origin === window.location.origin) {
        headers[getCsrfHeaderName()] = getCsrfToken();
    }
}

export function postMultipartFormWithCredentials(url, form, options = {}) {
    const defaultHeaders = {
        Accept: 'application/json',
    };
    const headers = 'headers' in options ? [...options.headers, defaultHeaders] : defaultHeaders;
    addCsrfHeaderIfSafe(options, headers);
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
