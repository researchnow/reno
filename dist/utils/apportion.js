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
    global.apportion = mod.exports;
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

  exports.default = function (total, arr) {
    var quantum = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _newArrowCheck(undefined, undefined);

    var SD = 0; // standard divisor
    var values = arr.map(function (value, index) {
      _newArrowCheck(undefined, undefined);

      SD += value;
      return { id: index, original: value };
    }.bind(undefined));
    if (SD <= 0) {
      return values.map(function (item) {
        _newArrowCheck(undefined, undefined);

        return item.original;
      }.bind(undefined));
    }
    var allocated = 0;
    values.forEach(function (item) {
      _newArrowCheck(undefined, undefined);

      var quota = item.original / SD * total;
      item.value = Math.floor(quota / quantum) * quantum;
      item.frac = quota % quantum;
      allocated += item.value;
    }.bind(undefined));
    if (allocated < total) {
      var n = Math.ceil((total - allocated) / quantum);
      values.sort(function (a, b) {
        _newArrowCheck(undefined, undefined);

        var d = b.frac - a.frac;
        return d ? d : a.id - b.id;
      }.bind(undefined));
      for (var i = 0; i < n; ++i) {
        values[i].value += quantum;
      }
      values.sort(function (a, b) {
        _newArrowCheck(undefined, undefined);

        return a.id - b.id;
      }.bind(undefined));
    }
    return values.map(function (item) {
      _newArrowCheck(undefined, undefined);

      return item.value;
    }.bind(undefined));
  }.bind(undefined);
});