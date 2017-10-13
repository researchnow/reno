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
		global.getPath = mod.exports;
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

	// getPath

	var dereferable = { object: 1, function: 1 };

	exports.default = function (obj, path) {
		var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';

		_newArrowCheck(undefined, undefined);

		if (typeof path == 'string') {
			path = path ? path.split(delimiter) : [];
		}
		for (var i = 0; i < path.length; ++i) {
			if (!obj || !dereferable[typeof obj === 'undefined' ? 'undefined' : _typeof(obj)]) return; // undefined
			obj = obj[path[i]];
		}
		return obj;
	}.bind(undefined);
});