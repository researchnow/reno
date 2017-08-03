(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './delay'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./delay'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.delay);
    global.pumpValue = mod.exports;
  }
})(this, function (exports, _delay) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _delay2 = _interopRequireDefault(_delay);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = function (source, target, attrName) {
    var ms = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
    var wrap = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _delay2.default;
    return wrap(function (e) {
      target.setAttribute(attrName, (source || e.target).value);
    }, ms);
  };
});