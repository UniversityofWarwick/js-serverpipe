import { assert } from 'chai';
import { fetchWithCredentials } from '../lib/serverpipe.js';

describe('serverpipe', () => {

  it('should have a fetchWithCredentials function', () => {
    assert.isFunction(fetchWithCredentials, 'fetchWithCredentials should be a function');
  });

});