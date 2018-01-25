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
		global.common = mod.exports;
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

	var init = exports.init = function (mover) {
		_newArrowCheck(undefined, undefined);

		// container box
		var rect = mover.container.getBoundingClientRect(),
		    style = window.getComputedStyle(mover.container);
		var box = {
			left: rect.left + window.pageXOffset + parseFloat(style.borderLeftWidth),
			right: rect.right + window.pageXOffset - parseFloat(style.borderRightWidth) - parseFloat(style.marginRight),
			top: rect.top + window.pageYOffset + parseFloat(style.borderTopWidth),
			bottom: rect.bottom + window.pageYOffset - parseFloat(style.borderBottomWidth) - parseFloat(style.marginBottom)
		};
		style = window.getComputedStyle(mover.avatar);
		box.left -= parseFloat(style.marginLeft);
		box.right -= parseFloat(style.marginLeft) + parseFloat(style.borderLeftWidth) + parseFloat(style.width) + parseFloat(style.borderRightWidth);
		box.top -= parseFloat(style.marginTop);
		box.bottom -= parseFloat(style.marginTop) + parseFloat(style.borderTopWidth) + parseFloat(style.height) + parseFloat(style.borderBottomWidth);
		mover.containerBox = box;
		// draggable items
		var items = mover.container.querySelectorAll(mover.options.target || '.reno-dnd-item'),
		    itemBoxes = [];
		for (var i = 0; i < items.length; ++i) {
			rect = items[i].getBoundingClientRect();
			itemBoxes.push({
				node: items[i],
				left: rect.left + window.pageXOffset,
				right: rect.right + window.pageXOffset,
				top: rect.top + window.pageYOffset,
				bottom: rect.bottom + window.pageYOffset
			});
		}
		mover.itemBoxes = itemBoxes;
	}.bind(undefined);

	var over = exports.over = function (mover) {
		_newArrowCheck(undefined, undefined);

		// binary search is better, but linear will do in a pinch
		var done = mover.itemBoxes.some(function (item) {
			_newArrowCheck(undefined, undefined);

			if (item.left <= mover.mouseX && mover.mouseX < item.right && item.top <= mover.mouseY && mover.mouseY < item.bottom) {
				if (item.node !== mover.previousOverItem) {
					mover.previousOverItem && mover.previousOverItem.classList.remove('reno-dnd-over');
					mover.previousOverItem = item.node;
					mover.previousOverItem.classList.add('reno-dnd-over');
				}
				return true;
			}
			return false;
		}.bind(undefined));
		if (!done) {
			mover.previousOverItem && mover.previousOverItem.classList.remove('reno-dnd-over');
			mover.previousOverItem = null;
		}
	}.bind(undefined);

	var movingX = exports.movingX = function (mover, e) {
		_newArrowCheck(undefined, undefined);

		mover.x += e.pageX - mover.mouseX;
		mover.x = Math.max(mover.containerBox.left, Math.min(mover.containerBox.right, mover.x));
	}.bind(undefined);

	var movingY = exports.movingY = function (mover, e) {
		_newArrowCheck(undefined, undefined);

		mover.y += e.pageY - mover.mouseY;
		mover.y = Math.max(mover.containerBox.top, Math.min(mover.containerBox.bottom, mover.y));
	}.bind(undefined);

	var moving = exports.moving = function (mover, e) {
		_newArrowCheck(undefined, undefined);

		mover.x += e.pageX - mover.mouseX;
		mover.x = Math.max(mover.containerBox.left, Math.min(mover.containerBox.right, mover.x));
		mover.y += e.pageY - mover.mouseY;
		mover.y = Math.max(mover.containerBox.top, Math.min(mover.containerBox.bottom, mover.y));
	}.bind(undefined);
});