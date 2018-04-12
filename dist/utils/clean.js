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
		global.clean = mod.exports;
	}
})(this, function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	function _newArrowCheck(innerThis, boundThis) {
		if (innerThis !== boundThis) {
			throw new TypeError("Cannot instantiate an arrow function");
		}
	}

	// clean a named property recursively (mutative algorithm) from all objects

	// TODO: write unit tests

	var clean = function (object, name) {
		_newArrowCheck(undefined, undefined);

		if (!object || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) != 'object') return;
		delete object[name];
		if (object instanceof Date || object instanceof RegExp) return;
		Object.keys(object).forEach(function (key) {
			_newArrowCheck(undefined, undefined);

			return clean(object[key], name);
		}.bind(undefined));
		return object;
	}.bind(undefined);

	exports.default = function (object) {
		var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_id';

		_newArrowCheck(undefined, undefined);

		return clean(object, name);
	}.bind(undefined);
});