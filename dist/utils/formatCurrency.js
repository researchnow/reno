(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', './formatNumber'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('./formatNumber'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.formatNumber);
		global.formatCurrency = mod.exports;
	}
})(this, function (exports, _formatNumber) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _formatNumber2 = _interopRequireDefault(_formatNumber);

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

	exports.default = function (number /*, country='US'*/) {
		_newArrowCheck(undefined, undefined);

		// country is a provision for future extensions
		// the default: US
		var result = '$' + (0, _formatNumber2.default)(Math.abs(number), 2);
		return number < 0 ? '(' + result + ')' : result;
	}.bind(undefined);
});