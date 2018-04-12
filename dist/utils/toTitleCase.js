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
    global.toTitleCase = mod.exports;
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

  exports.default = function (str) {
    _newArrowCheck(undefined, undefined);

    return str.replace(/\b\w+\b/g, function (txt) {
      _newArrowCheck(undefined, undefined);

      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }.bind(undefined));
  }.bind(undefined);
});