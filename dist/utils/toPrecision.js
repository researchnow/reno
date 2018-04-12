(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.toPrecision = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }

  // the classic machine epsilon
  var eps = 1;
  for (var next = eps; next + 1 > 1; eps = next, next = 0.5 * next) {}

  var epsilon = exports.epsilon = eps;

  /**
   * Quick helper function to convert a number to x number of decimal places
   * @param number
   * @param decimalPlaces
   */
  var toPrecision = exports.toPrecision = function (number, decimalPlaces) {
    _newArrowCheck(undefined, undefined);

    number = number || 0;
    if (typeof number == "string") number = parseFloat(number);
    return (number + number * epsilon).toFixed(decimalPlaces);
  }.bind(undefined);
});