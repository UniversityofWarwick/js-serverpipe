import { addQsToUrl } from '../lib/serverpipe';
import { assert } from 'chai';

describe('serverpipe', () => {

  it('append querystring to url', () => {

    const originalUrl = '/api/test?cat=white';
    const qs = {
      cake: 'salted',
      ts: 123,
    };

    const expected = `/api/test?cat=white&cake=salted&ts=123`;
    assert.equal(addQsToUrl(originalUrl, qs), expected);
  });

});