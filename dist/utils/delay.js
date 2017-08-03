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
		global.delay = mod.exports;
	}
})(this, function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
				arr2[i] = arr[i];
			}

			return arr2;
		} else {
			return Array.from(arr);
		}
	}

	exports.default = function (f) {
		var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

		var handle = void 0,
		    savedArgs = void 0;
		return function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			savedArgs = args;
			if (handle) {
				clearTimeout(handle);
			}
			handle = setTimeout(function () {
				handle = null;
				f.apply(undefined, _toConsumableArray(savedArgs));
			}, ms);
		};
	};
});