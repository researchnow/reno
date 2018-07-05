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
    global.bsearch = mod.exports;
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

  // binary search with a less() function as a parameter

  var bsearchDefault = function (sortedArray, x) {
    _newArrowCheck(undefined, undefined);

    var l = 0,
        r = sortedArray.length;
    while (l < r) {
      var m = (r - l >> 1) + l,
          p = sortedArray[m];
      if (p < x) {
        l = m + 1;
      } else {
        r = m;
      }
    }
    return l;
  }.bind(undefined);

  exports.default = function (sortedArray, x, less) {
    _newArrowCheck(undefined, undefined);

    if (less === undefined) return bsearchDefault(sortedArray, x);
    var l = 0,
        r = sortedArray.length;
    while (l < r) {
      var m = (r - l >> 1) + l,
          p = sortedArray[m];
      if (less(p, x)) {
        l = m + 1;
      } else {
        r = m;
      }
    }
    return l;
  }.bind(undefined);
});