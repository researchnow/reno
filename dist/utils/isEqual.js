(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.isEqual = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isEqual;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function byAlphabet(a, b) {
    return a < b ? -1 : b < a ? 1 : 0;
  }

  function isEqual(a, b) {
    if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) != (typeof b === 'undefined' ? 'undefined' : _typeof(b))) return false;
    if (!a || !b || (typeof a === 'undefined' ? 'undefined' : _typeof(a)) != 'object' && typeof a != 'function') {
      if (typeof a == 'number' && isNaN(a) && isNaN(b)) return true;
      return a === b;
    }
    if (a instanceof Array && b instanceof Array) {
      if (a.length != b.length) return false;
      for (var i = 0; i < a.length; ++i) {
        if (a.hasOwnProperty(i)) {
          if (!b.hasOwnProperty(i) || !isEqual(a[i], b[i])) return false;
        } else {
          if (b.hasOwnProperty(i)) return false;
        }
      }
      return true;
    }
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() == b.getTime();
    }
    if (a instanceof RegExp && b instanceof RegExp) {
      return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
    }
    // general object
    if (a.constructor !== b.constructor) return false;
    var ak = Object.keys(a).sort(byAlphabet),
        bk = Object.keys(b).sort(byAlphabet);
    if (ak.length != bk.length) return false;
    for (var _i = 0; _i < ak.length; ++_i) {
      var key = ak[_i];
      if (key !== bk[_i] || !isEqual(a[key], b[key])) return false;
    }
    return true;
  }
});