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
		global.throttle = mod.exports;
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

	function _newArrowCheck(innerThis, boundThis) {
		if (innerThis !== boundThis) {
			throw new TypeError("Cannot instantiate an arrow function");
		}
	}

	exports.default = function (f) {
		var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

		_newArrowCheck(undefined, undefined);

		var handle = void 0,
		    savedArgs = void 0,
		    last = +new Date();
		return function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			_newArrowCheck(undefined, undefined);

			savedArgs = args;
			if (!handle) {
				var now = +new Date(),
				    left = last + ms - now;
				if (left <= 0) {
					last = now;
					f.apply(undefined, _toConsumableArray(savedArgs));
					savedArgs = null;
				} else {
					handle = setTimeout(function () {
						_newArrowCheck(undefined, undefined);

						handle = null;
						last = now;
						f.apply(undefined, _toConsumableArray(savedArgs));
						savedArgs = null;
					}.bind(undefined), left);
				}
			}
		}.bind(undefined);
	}.bind(undefined);
});