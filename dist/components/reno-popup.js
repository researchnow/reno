'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renoPopupActions = require('./reno-popup-actions');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
	var RenoPopup = function (_HTMLElement) {
		_inherits(RenoPopup, _HTMLElement);

		function RenoPopup() {
			_classCallCheck(this, RenoPopup);

			return _possibleConstructorReturn(this, (RenoPopup.__proto__ || Object.getPrototypeOf(RenoPopup)).apply(this, arguments));
		}

		_createClass(RenoPopup, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				// listen to events on the entire component
				switch (this.getAttribute('trigger')) {
					case 'click':
						document.addEventListener('click', this);
						// TODO
						break;
					case 'focus':
						this.addEventListener('focus', this);
						// TODO
						break;
					default:
						// case 'mouseover':
						this.addEventListener('mouseover', this);
						this.addEventListener('mouseout', this);
				}
			}
		}, {
			key: 'handleEvent',
			value: function handleEvent(e) {
				var isOpen = document.querySelector('#reno-popup-container').classList.contains('open');

				// handle events
				var trigger = this.getAttribute('trigger') || 'mouseover';
				if (trigger !== e.type && (trigger !== 'mouseover' || e.type !== 'mouseout')) return;

				switch (e.type) {
					case 'click':
						// clicking anywhere except the popup container will close
						isOpen && !e.target.closest('#reno-popup-container') && (0, _renoPopupActions.closePopup)();
						// clicking only the popup component will open
						!isOpen && e.target.closest('reno-popup') && (0, _renoPopupActions.openPopup)(this);
						break;
					case 'focus':
						// TODO
						break;
					case 'mouseover':
						(0, _renoPopupActions.openPopup)(this);
						break;
					case 'mouseout':
						if (!e.relatedTarget || !e.relatedTarget.closest('#reno-popup-container')) {
							(0, _renoPopupActions.closePopup)();
						}
						break;
				}
			}
		}]);

		return RenoPopup;
	}(HTMLElement);

	customElements.define('reno-popup', RenoPopup);
})();