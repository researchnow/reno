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
    global.seq = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _arguments = arguments;

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }

  exports.default = seq = function (array, Deferred) {
    _newArrowCheck(undefined, undefined);

    var when = function (value) {
      var Deferred = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Promise;

      _newArrowCheck(undefined, undefined);

      return value && typeof value.then == "function" ? value : Deferred.resolve(value);
    }.bind(undefined);

    if (!(array instanceof Array)) {
      array = Array.prototype.slice.call(_arguments, 0);
      Deferred = null;
    }

    return function (initial) {
      _newArrowCheck(undefined, undefined);

      return array.reduce(function (acc, fn) {
        _newArrowCheck(undefined, undefined);

        return acc.then(fn);
      }.bind(undefined), when(initial, Deferred));
    }.bind(undefined);
  }.bind(undefined);
});