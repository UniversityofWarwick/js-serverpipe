import { assert } from 'chai';
import { fetchWithCredentials, addQsToUrl } from '../lib/serverpipe.js';

describe('serverpipe', () => {

  it('should have a fetchWithCredentials function', () => {
    assert.isFunction(fetchWithCredentials, 'fetchWithCredentials should be a function');
  });

  it('should append querystring to url with existing parameters', () => {
    const originalUrl = '/api/test?cat=white';
    const qs = {
      cake: 'salted',
      ts: 123,
    };
    const expected = `/api/test?cat=white&cake=salted&ts=123`;
    assert.equal(addQsToUrl(originalUrl, qs), expected);
  });

  it('should append querystring to url without existing parameters', () => {
    const originalUrl = '/api/test';
    const qs = {
      cake: 'salted',
      ts: 123,
    };
    const expected = `/api/test?cake=salted&ts=123`;
    assert.equal(addQsToUrl(originalUrl, qs), expected);
  });

});