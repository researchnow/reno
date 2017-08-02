(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', './debounce'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('./debounce'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.debounce);
		global.pumpValue = mod.exports;
	}
})(this, function (exports, _debounce) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _debounce2 = _interopRequireDefault(_debounce);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	exports.default = function (source, target, attrName) {
		var ms = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;

		var notify = (0, _debounce2.default)(function (e) {
			target.setAttribute(attrName, (source || e.target).value);
		}, ms);
		return function (e) {
			notify(e);
		};
	};
});