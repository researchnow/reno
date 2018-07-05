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
    global.formatNumber = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }

  exports.default = function (number) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var millennia = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
    var decimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';

    _newArrowCheck(undefined, undefined);

    var s = Math.abs(number).toFixed(precision);
    var fractionPos = precision > 0 ? s.length - precision - 1 : s.length;
    var leadingGroup = fractionPos % 3;
    var result = leadingGroup ? [s.slice(0, leadingGroup)] : [];
    for (var i = leadingGroup; i < fractionPos; i += 3) {
      result.push(s.slice(i, i + 3));
    }
    return (number < 0 ? '-' : '') + result.join(millennia) + (fractionPos < s.length ? decimal + s.slice(fractionPos + 1) : '');
  }.bind(undefined);
});