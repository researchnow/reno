'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var handleClick = null;

var RenoPopup = function (_HTMLElement) {
	_inherits(RenoPopup, _HTMLElement);

	function RenoPopup() {
		_classCallCheck(this, RenoPopup);

		return _possibleConstructorReturn(this, (RenoPopup.__proto__ || Object.getPrototypeOf(RenoPopup)).apply(this, arguments));
	}

	_createClass(RenoPopup, [{
		key: 'connectedCallback',
		value: function connectedCallback() {
			if (!handleClick) {
				handleClick = on(document, 'click', Reno.utils.popup.hidePopup);
			}
			// listen to events on the entire component
			switch (this.getAttribute('trigger')) {
				case 'click':
					this.handle = on(this, 'click', this);
					break;
				default:
					// case 'mouseover':
					this.handle = on(this, 'mouseover,mouseout', this);
					break;
			}
		}
	}, {
		key: 'disconnectedCallback',
		value: function disconnectedCallback() {
			this.handle.remove();
		}
	}, {
		key: 'handleEvent',
		value: function handleEvent(e) {
			// handle events
			var trigger = this.getAttribute('trigger') || 'mouseover';
			if (trigger !== e.type && (trigger !== 'mouseover' || e.type !== 'mouseout')) return;

			switch (e.type) {
				case 'click':
					Reno.utils.popup.isOpen() ? Reno.utils.popup.close() : Reno.utils.popup.open(this);
					break;
				case 'mouseover':
					Reno.utils.popup.open(this);
					break;
				case 'mouseout':
					var popup = document.getElementById('reno-popup-container');
					if (!e.relatedTarget || popup && !popup.contains(e.relatedTarget)) {
						Reno.utils.popup.close();
					}
					break;
			}
			e.stopPropagation();
		}
	}]);

	return RenoPopup;
}(HTMLElement);

customElements.define('reno-popup', RenoPopup);