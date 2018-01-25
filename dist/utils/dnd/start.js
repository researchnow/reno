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
		global.start = mod.exports;
	}
})(this, function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _newArrowCheck(innerThis, boundThis) {
		if (innerThis !== boundThis) {
			throw new TypeError("Cannot instantiate an arrow function");
		}
	}

	var noop = function () {
		_newArrowCheck(undefined, undefined);
	}.bind(undefined);

	var stopEvent = function (e) {
		_newArrowCheck(undefined, undefined);

		e.preventDefault();
		e.stopPropagation();
	}.bind(undefined);

	var moving = function (mover, e) {
		_newArrowCheck(undefined, undefined);

		mover.x += e.pageX - mover.mouseX;
		mover.y += e.pageY - mover.mouseY;
	}.bind(undefined);

	var clone = function (mover) {
		_newArrowCheck(undefined, undefined);

		var node = mover.node,
		    box = node.getBoundingClientRect(),
		    style = window.getComputedStyle(node),
		    avatar = node.cloneNode(true);

		mover.x = box.left - parseFloat(style.marginLeft) + window.pageXOffset;
		mover.y = box.top - parseFloat(style.marginTop) + window.pageYOffset;

		avatar.style.position = 'absolute';
		avatar.style.height = style.height;
		avatar.style.width = style.width;
		avatar.style.left = mover.x + 'px';
		avatar.style.top = mover.y + 'px';

		avatar.classList.remove('reno-dnd-dragged');
		avatar.classList.add(mover.options.avatarClass || 'reno-dnd-avatar');

		node.ownerDocument.body.appendChild(avatar);

		return avatar;
	}.bind(undefined);

	var Move = function () {
		function Move(container, options, node, e) {
			_classCallCheck(this, Move);

			this.container = container;
			this.options = options;
			this.node = node;

			// handle the state
			this.container.classList.add('reno-dnd-dragged-container');
			this.node.ownerDocument.documentElement.classList.add('reno-dnd-in-flight');
			this.node.classList.add('reno-dnd-dragged');

			this.mouseX = e.pageX;
			this.mouseY = e.pageY;

			this.avatar = (options.makeAvatar || clone)(this);
			this.moving = options.moving || moving;
			this.over = options.over || noop;

			this.handles = [on(node.ownerDocument, 'mouseup', this.done.bind(this)), on(node.ownerDocument, 'mousemove', this.move.bind(this)), on(node.ownerDocument, 'dragstart', stopEvent), on(node.ownerDocument.body, 'selectstart', stopEvent)];

			(this.options.init || noop)(this);
		}

		_createClass(Move, [{
			key: 'destroy',
			value: function destroy() {
				var _this = this;

				this.handles.forEach(function (h) {
					_newArrowCheck(this, _this);

					return h.remove();
				}.bind(this));
				this.handles = [];

				// handle the state
				this.container.classList.remove('reno-dnd-dragged-container');
				this.node.ownerDocument.documentElement.classList.remove('reno-dnd-in-flight');
				this.node.classList.remove('reno-dnd-dragged');
				if (this.previousOverItem) {
					this.previousOverItem.classList.remove('reno-dnd-over');
				}

				(this.options.destroy || noop)(this);
			}
		}, {
			key: 'done',
			value: function done(e) {
				stopEvent(e);
				(this.options.drop || noop)(this);
				this.avatar.parentNode.removeChild(this.avatar);
				this.destroy();
			}
		}, {
			key: 'move',
			value: function move(e) {
				stopEvent(e);
				this.moving(this, e);
				this.mouseX = e.pageX;
				this.mouseY = e.pageY;
				this.avatar.style.left = this.x + 'px';
				this.avatar.style.top = this.y + 'px';
				this.over(this);
			}
		}]);

		return Move;
	}();

	;

	var formNode = { a: 1, input: 1, select: 1, button: 1, textarea: 1, option: 1 };

	var process = function (container, options) {
		_newArrowCheck(undefined, undefined);

		return function (e, node) {
			_newArrowCheck(undefined, undefined);

			node = node || e.target;
			if (!e.button && formNode[node.tagName.toLowerCase()] !== 1 && !node.classList.contains('reno-dnd-ignore')) {
				new Move(container, options, node, e);
				stopEvent(e);
			}
		}.bind(undefined);
	}.bind(undefined);

	var start = function (container, options) {
		_newArrowCheck(undefined, undefined);

		options = options || {};
		var callback = process(container, options),
		    filter = options.filter || '.reno-dnd-item';
		return on(container, 'mousedown', filter, callback);
	}.bind(undefined);

	exports.default = start;
});