/*eslint-env mocha*/
'use strict';

// Benchmark example 'borrowed' from EventEmitter3 repo
const Benchmark = require('benchmark');
const Assert = require('assert');

const ppaskarisStableStringify = require('../index');
const nickyoutStableStringify = require('fast-stable-stringify');
const substackStringify = require('json-stable-stringify');

const data = [
  require('./final-boss.json'),
  require('./final-boss-undefined'),
];

function xorWith(buffer, string) {
  if (string.length > buffer.length) {
    buffer = Buffer.concat([buffer], buffer.length * 2);
  }
  for (let i = 0; i < string.length; ++i) {
    buffer[i] ^= string.charCodeAt(i);
  }
  return buffer;
}

describe('benchmark', () => {

  it('is the fastest', function (done) {
    this.timeout(45000);
    let result = Buffer.alloc(0);
    const suite = new Benchmark.Suite()
      .add('ppaskaris/faster-stable-stringify', () => {
        result = xorWith(result, ppaskarisStableStringify(data));
      })
      .add('nickyout/fast-stable-stringify', () => {
        result = xorWith(result, nickyoutStableStringify(data));
      })
      .add('substack/json-stable-stringify', () => {
        result = xorWith(result, substackStringify(data));
      })
      .on('complete', () => {
        const fastest = suite.filter('fastest').map('name')[0];
        Assert.equal(fastest, 'ppaskaris/faster-stable-stringify');
        done();
      })
      .run({ async: true });
  });

});
