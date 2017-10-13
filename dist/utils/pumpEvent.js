(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './delay', './getPath'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./delay'), require('./getPath'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.delay, global.getPath);
    global.pumpEvent = mod.exports;
  }
})(this, function (exports, _delay, _getPath) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _delay2 = _interopRequireDefault(_delay);

  var _getPath2 = _interopRequireDefault(_getPath);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _newArrowCheck(innerThis, boundThis) {
    if (innerThis !== boundThis) {
      throw new TypeError("Cannot instantiate an arrow function");
    }
  }

  exports.default = function (target, attrName) {
    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var ms = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
    var wrap = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _delay2.default;

    _newArrowCheck(undefined, undefined);

    return wrap(function (e) {
      _newArrowCheck(undefined, undefined);

      target.setAttribute(attrName, (0, _getPath2.default)(e, path));
    }.bind(undefined), ms);
  }.bind(undefined);
});