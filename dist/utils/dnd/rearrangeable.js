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
		global.rearrangeable = mod.exports;
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

	var dropX = exports.dropX = function (mover) {
		_newArrowCheck(undefined, undefined);

		if (!mover.previousOverItem) return;
		// binary search is better, but linear will do in a pinch
		var done = mover.itemBoxes.some(function (item) {
			_newArrowCheck(undefined, undefined);

			if (mover.mouseX < (item.left + item.right) / 2) {
				if (item.node !== mover.node) {
					mover.container.insertBefore(mover.node, item.node);
				}
				return true;
			}
			return false;
		}.bind(undefined));
		if (!done) {
			mover.container.appendChild(mover.node);
		}
	}.bind(undefined);

	var dropY = exports.dropY = function (mover) {
		_newArrowCheck(undefined, undefined);

		if (!mover.previousOverItem) return;
		// binary search is better, but linear will do in a pinch
		var done = mover.itemBoxes.some(function (item) {
			_newArrowCheck(undefined, undefined);

			if (mover.mouseY < (item.top + item.bottom) / 2) {
				if (item.node !== mover.node) {
					mover.container.insertBefore(mover.node, item.node);
				}
				return true;
			}
			return false;
		}.bind(undefined));
		if (!done) {
			mover.container.appendChild(mover.node);
		}
	}.bind(undefined);
});