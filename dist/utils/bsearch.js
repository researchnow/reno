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

	exports.default = function (sortedArray, x) {
		var less = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (a, b) {
			_newArrowCheck(undefined, undefined);

			return a < b;
		}.bind(undefined);

		_newArrowCheck(undefined, undefined);

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