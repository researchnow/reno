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
		global.clone = mod.exports;
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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	// clone objects

	function clone(s) {
		var _this = this;

		if (!s || (typeof s === 'undefined' ? 'undefined' : _typeof(s)) != 'object' || typeof s == 'function') {
			return s;
		}
		if (s instanceof Date) {
			return new Date(s.getTime());
		}
		if (s instanceof RegExp) {
			return new RegExp(s.source, (s.global ? 'g' : '') + (s.multiline ? 'm' : '') + (s.ignoreCase ? 'i' : ''));
		}
		return Object.keys(s).reduce(function (acc, key) {
			_newArrowCheck(this, _this);

			return acc[key] = clone(s[key]), acc;
		}.bind(this), s instanceof Array ? [] : {});
	}

	exports.default = clone;
});