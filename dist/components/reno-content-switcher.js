'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
	'use strict';

	var matches = void 0;
	['matches', 'matchesSelector', 'webkit', 'moz', 'ms', 'o'].some(function (name) {
		if (name.length < 7) {
			// prefix
			name += 'MatchesSelector';
		}
		if (Element.prototype[name]) {
			matches = name;
			return true;
		}
		return false;
	});

	var RenoContentSwitcher = function (_HTMLElement) {
		_inherits(RenoContentSwitcher, _HTMLElement);

		function RenoContentSwitcher() {
			_classCallCheck(this, RenoContentSwitcher);

			return _possibleConstructorReturn(this, (RenoContentSwitcher.__proto__ || Object.getPrototypeOf(RenoContentSwitcher)).apply(this, arguments));
		}

		_createClass(RenoContentSwitcher, [{
			key: 'obscure',

			// custom methods
			value: function obscure() {
				var opacity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
				var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';

				var curtain = this.lastElementChild,
				    obscureClass = this.getAttribute('obscureClass'),
				    revealClass = this.getAttribute('revealClass');
				if (revealClass) curtain.classList.remove(revealClass);
				if (obscureClass) curtain.classList.add(obscureClass);

				curtain.style.display = display;

				if (this.notFirstRun) {
					if (this.offsetParent) {
						var boxTo = curtain.getBoundingClientRect();
						this.style.height = boxTo.height + 'px';
					} else {
						this.style.height = 'auto';
					}
				}

				var oldOpacity = getComputedStyle(curtain).getPropertyValue('opacity'); // need to sync?
				curtain.style.opacity = opacity;

				if (this.state === 'revealing') {
					curtain.removeEventListener('transitionend', this);
				}
				this.state = 'obscuring';
			}
		}, {
			key: 'reveal',
			value: function reveal(selector) {
				var selected = this.selectPages(selector);
				if (!selected) return;

				selected.style.display = 'block';
				this.hideOthers(selected);

				if (this.notFirstRun) {
					if (this.offsetParent) {
						var boxTo = selected.getBoundingClientRect();
						this.style.height = boxTo.height + 'px';
					} else {
						this.style.height = 'auto';
					}
				} else {
					this.notFirstRun = true;
				}

				var curtain = this.lastElementChild,
				    obscureClass = this.getAttribute('obscureClass'),
				    revealClass = this.getAttribute('revealClass');
				if (obscureClass) curtain.classList.remove(obscureClass);
				if (revealClass) curtain.classList.add(revealClass);

				if (!this.offsetParent) {
					return this.revealNow();
				}

				var oldOpacity = getComputedStyle(curtain).getPropertyValue('opacity');
				if (oldOpacity === "0") {
					return this.revealNow();
				}

				curtain.style.opacity = 0;
				if (this.state === 'obscuring') {
					curtain.addEventListener('transitionend', this);
				}
				this.state = 'revealing';
			}
		}, {
			key: 'revealNow',
			value: function revealNow() {
				var curtain = this.lastElementChild;
				curtain.style.opacity = 0;
				curtain.style.display = 'none';
				this.state = '';
			}
		}, {
			key: 'selectPages',
			value: function selectPages(selector) {
				var selected = void 0;
				for (var page = this.firstElementChild; page; page = page.nextElementSibling) {
					if (page[matches](selector)) {
						selected = page;
						break;
					}
				}
				return selected;
			}
		}, {
			key: 'hideOthers',
			value: function hideOthers(selected) {
				for (var page = this.firstElementChild; page; page = page.nextElementSibling) {
					if (page !== selected && page !== this.lastElementChild) {
						page.style.display = 'none';
					}
				}
				return this;
			}
			// event processing

		}, {
			key: 'handleEvent',
			value: function handleEvent(e) {
				if (e.type === 'transitionend' && this.state === 'revealing') {
					var curtain = this.lastElementChild;
					curtain.style.display = 'none';
					this.state = '';
				}
				this.removeEventListener('transitionend', this);
			}
		}]);

		return RenoContentSwitcher;
	}(HTMLElement);

	customElements.define('reno-content-switcher', RenoContentSwitcher);
})();