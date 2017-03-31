'use strict';

function stableStringifyImpl(value, cycles, keyOrIndex) {
  if (value != null) {
    var toJSON = value.toJSON;
    if (typeof toJSON === 'function') {
      value = toJSON.call(value, keyOrIndex);
    }
  }

  if (typeof value === 'object') {
    if (value instanceof Number) {
      value = Number(value);
    } else if (value instanceof String) {
      value = String(value);
    } else if (value instanceof Boolean) {
      value = value.valueOf();
    }
  }

  if (value === null) {
    return 'null';
  }

  if (value === true) {
    return 'true';
  }

  if (value === false) {
    return 'false';
  }

  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number') {
    if (isFinite(value)) {
      return String(value);
    } else {
      return 'null';
    }
  }

  var i, str, comma;
  if (Array.isArray(value)) {
    if (cycles.has(value)) {
      return '"[Circular]"';
    } else {
      cycles.add(value);
      str = '[';
      comma = false;
      for (i = 0; i < value.length; ++i) {
        var item = stableStringifyImpl(value[i], cycles, i);
        if (comma) {
          str += ',';
        } else {
          comma = true;
        }
        if (item === undefined) {
          str += 'null';
        } else {
          str += item;
        }
      }
      str += ']';
      cycles.delete(value);
      return str;
    }
  } else if (typeof value === 'object') {
    if (cycles.has(value)) {
      return '"[Circular]"';
    } else {
      cycles.add(value);
      str = '{';
      comma = false;
      var keys = Object.keys(value).sort();
      for (i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var val = stableStringifyImpl(value[key], cycles, key);
        if (val === undefined) {
          continue;
        }
        if (comma) {
          str += ',';
        } else {
          comma = true;
        }
        str += JSON.stringify(key) + ':' + val;
      }
      str += '}';
      cycles.delete(value);
      return str;
    }
  } else {
    return undefined;
  }
}

module.exports = function stableStringify(value) {
  return stableStringifyImpl(value, new WeakSet(), '');
};
