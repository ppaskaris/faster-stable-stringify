/* eslint-env mocha */
'use strict';

const Assert = require('chai').assert;
const stableStringify = require('./index');

function assertEqualsNative(value) {
  Assert.equal(stableStringify(value), JSON.stringify(value));
}

describe('native parity', () => {

  it('handles undefined', () => {
    assertEqualsNative(undefined);
  });

  it('handles null', () => {
    assertEqualsNative(null);
  });

  it('handles strings', () => {
    assertEqualsNative('', '');
    assertEqualsNative('greetings', 'greetings');
    assertEqualsNative('\0', '\\0');
    assertEqualsNative('\n', '\\n');
  });

  it('handles numbers', () => {
    assertEqualsNative(0);
    assertEqualsNative(42);
    assertEqualsNative(-0);
    assertEqualsNative(6e40);
    assertEqualsNative(Infinity);
    assertEqualsNative(-Infinity);
    assertEqualsNative(NaN);
    assertEqualsNative(new Number(56));
  });

  it('handles booleans', () => {
    assertEqualsNative(true);
    assertEqualsNative(false);
    assertEqualsNative(new Boolean(true));
  });

  it('handles dates', () => {
    assertEqualsNative(new Date());
  });

  it('handles arrays', () => {
    assertEqualsNative([]);
    assertEqualsNative([42]);
    assertEqualsNative(['greetings', undefined, 42]);
  });

  it('handles objects', () => {
    assertEqualsNative({});
    assertEqualsNative({ a: 42 });
    assertEqualsNative({ a: 'greetings', b: undefined, c: 42 });
  });

  function Greetings(message) {
    this.message = message;
    this.shout = message.toUpperCase() + '!';
  }

  it('handles constructors', () => {
    assertEqualsNative(new Greetings('hello'));
  });

  const complexObject = {
    array: [1, 2, 3],
    goofyNumbers: [0, -0, Infinity, -Infinity, NaN, 9e-56],
    number: 42,
    other: {
      arrayWithNullValue: [1, null, 3],
      arrayWithUndefinedValue: [1, undefined, 3],
      date: new Date(),
      nullValue: null,
      undefinedValue: undefined
    },
    string: 'greetings'
  };

  const complexArray = [
    [new Number(1), new String('hello'), new Boolean(56), new Date()],
    'greetings',
    42,
    [0, -0, Infinity, -Infinity, NaN, 9e-56],
    {
      arrayWithNullValue: [1, null, 3],
      arrayWithUndefinedValue: [1, undefined, 3],
      date: new Date(),
      nullValue: null,
      undefinedValue: undefined,
    }
  ];

  it('supports complex values', () => {
    assertEqualsNative(complexObject);
    assertEqualsNative(complexArray);
  });

  it('handles buffer objects', () => {
    const buffer = Buffer.alloc(8, 0xDEADBEEF);
    Assert.equal(
      stableStringify(buffer),
      '{"data":[239,239,239,239,239,239,239,239],"type":"Buffer"}'
    );
  });

  it('handles toJSON that changes', () => {
    class WeirdToJSON {
      constructor() {
        this._toJsonVersion = 0;
      }
      get toJSON() {
        var toJsonVersion = ++this._toJsonVersion;
        return function weirdToJSON(key) {
          return `${toJsonVersion}: ${key}`;
        };
      }
    }

    Assert.equal(
      stableStringify(new WeirdToJSON()),
      JSON.stringify(new WeirdToJSON())
    );
  });

  it('"handles" functions', () => {
    assertEqualsNative(function ಠ_ಠ() {});
  });

});

describe('determinism', () => {

  it('sorts object keys', () => {
    var obj = { z: 42, y: 36, x: 77, a: 11 };
    Assert.equal(
      stableStringify(obj),
      '{"a":11,"x":77,"y":36,"z":42}'
    );
  });

  it('sorts nested object keys', () => {
    var obj = {
      b: {
        b: 1,
        a: 2
      },
      a: {
        b: 3,
        a: 4
      }
    };
    Assert.equal(
      stableStringify(obj),
      '{"a":{"a":4,"b":3},"b":{"a":2,"b":1}}'
    );

    var array = [
      1, {
        b: {
          b: 1,
          a: 2
        },
        a: {
          b: 3,
          a: 4
        }
      },
      null
    ];
    Assert.equal(
      stableStringify(array),
      '[1,{"a":{"a":4,"b":3},"b":{"a":2,"b":1}},null]'
    );
  });

  it('sorts object keys lexicographically', () => {
    var obj = {
      100: 100,
      10: 10,
    };
    Assert.equal(stableStringify(obj), '{"10":10,"100":100}');
  });

});

describe('edge cases', () => {

  it('handles circular objects', () => {
    const obj = {};
    obj.value = obj;
    obj.array = [1, obj, 3];
    obj.object = { b: 1, c: obj, a: 3 };
    obj.coverage = [];
    obj.coverage.push(1, obj.coverage, 3);
    Assert.equal(
      stableStringify(obj),
      '{' +
      '"array":[1,"[Circular]",3],' +
      '"coverage":[1,"[Circular]",3],' +
      '"object":{"a":3,"b":1,"c":"[Circular]"},' +
      '"value":"[Circular]"' +
      '}'
    );
  });

});
