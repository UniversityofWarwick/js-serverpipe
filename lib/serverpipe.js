/* eslint-env browser */
import fetch from 'isomorphic-fetch';
import log from 'loglevel';
import Url from 'url';
import { getCsrfHeaderName, getCsrfToken } from './csrfToken';

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
  headers[getCsrfHeaderName()] = getCsrfToken();
  return fetch(
    isIE() ? addQsToUrl(url, { ts: new Date().valueOf() }) : url,
    {
      credentials: 'same-origin',
      headers,
      ...options,
    },
  );
}

export function postJsonWithCredentials(url, body, options = {}) {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const headers = 'headers' in options ? [...options.headers, defaultHeaders] : defaultHeaders;

  headers[getCsrfHeaderName()] = getCsrfToken();
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

  headers[getCsrfHeaderName()] = getCsrfToken();
  return fetchWithCredentials(url, {
    method: 'POST',
    body: new FormData(form),
    headers,
    ...options,
  });
}
