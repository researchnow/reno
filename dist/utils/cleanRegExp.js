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
    global.cleanRegExp = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }

  // clean a named property recursively (mutative algorithm) from all objects by a regular expression pattern

  // TODO: write unit tests

  var cleanRegExp = function (object, pattern) {
    _newArrowCheck(undefined, undefined);

    if (!object || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) != 'object') return;
    Object.keys(object).forEach(function (key) {
      _newArrowCheck(undefined, undefined);

      if (pattern.test(key)) {
        delete object[key];
      } else {
        cleanRegExp(object[key], pattern);
      }
    }.bind(undefined));
    return object;
  }.bind(undefined);

  exports.default = function (object) {
    var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /^_/;

    _newArrowCheck(undefined, undefined);

    return cleanRegExp(object, pattern);
  }.bind(undefined);
});