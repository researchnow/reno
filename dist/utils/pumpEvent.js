(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './debounce', './getPath'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./debounce'), require('./getPath'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debounce, global.getPath);
    global.pumpEvent = mod.exports;
  }
})(this, function (exports, _debounce, _getPath) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _debounce2 = _interopRequireDefault(_debounce);

  var _getPath2 = _interopRequireDefault(_getPath);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = function (target, attrName) {
    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var ms = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
    return (0, _debounce2.default)(function (e) {
      target.setAttribute(attrName, (0, _getPath2.default)(e, path));
    }, ms);
  };
});