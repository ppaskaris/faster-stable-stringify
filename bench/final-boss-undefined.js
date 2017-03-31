'use strict';

class TestClass {
  constructor(str) {
    this._str = 'Greetings, ' + str;
  }
}

class TestClassWithToJSON {
  constructor(str) {
    this._str = 'Greetings, ' + str;
  }
  toJSON() {
    return this._str + '!';
  }
}

module.exports = {
  'object': {
    'undefined': undefined,
    'undefineds': {
      'ONE': undefined,
      'TWO': undefined,
      'THREE': undefined
    }
  },
  'array': [
    undefined
  ],
  'mixed': [
    undefined,
    {
      'undefined': undefined,
      'Aa1 Bb2 Cc3 \u0000\u001F\u0020\uFFFF☃"\\/\f\n\r\t\b': 'MIXED',
      'MIXED': 'Aa1 Bb2 Cc3 \u0000\u001F\u0020\uFFFF☃"\\/\f\n\r\t\b',
      'MAX_VALUE': 1.7976931348623157e+308,
      'MIN_VALUE': 5e-324,
      'NEGATIVE_MAX_VALUE': -1.7976931348623157e+308,
      'NEGATIVE_MIN_VALUE': -5e-324,
      'TRUE': true,
      'FALSE': false,
      'NULL': null
    },
    -1.7976931348623157e+308,
    -5e-324,
    'Aa1 Bb2 Cc3 \u0000\u001F\u0020\uFFFF☃"\\/\f\n\r\t\b',
    true,
    false,
    null,
    undefined
  ],
  'primitiveObjectsInArray': [
    new Number(42),
    new String('greetings'),
    new Boolean(false)
  ],
  'primitiveObjectsInObject': {
    'numberObject': new Number(42),
    'stringObject': new String('greetings'),
    'booleanObject': new Boolean(false)
  },
  'constructor': new TestClass('Joe'),
  'having.toJSON': [
    new Date('2017-03-31T23:01:35.108Z'),
    new TestClassWithToJSON('Joe')
  ]
};
