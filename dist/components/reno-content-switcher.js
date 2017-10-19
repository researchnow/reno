'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

(function () {
	'use strict';

	var _this = this;

	var matches = void 0;
	['matches', 'matchesSelector', 'webkit', 'moz', 'ms', 'o'].some(function (name) {
		_newArrowCheck(this, _this);

		if (name.length < 7) {
			// prefix
			name += 'MatchesSelector';
		}
		if (Element.prototype[name]) {
			matches = name;
			return true;
		}
		return false;
	}.bind(this));

	var RenoContentSwitcher = function (_HTMLElement) {
		_inherits(RenoContentSwitcher, _HTMLElement);

		function RenoContentSwitcher() {
			_classCallCheck(this, RenoContentSwitcher);

			return _possibleConstructorReturn(this, (RenoContentSwitcher.__proto__ || Object.getPrototypeOf(RenoContentSwitcher)).apply(this, arguments));
		}

		_createClass(RenoContentSwitcher, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				this.addEventListener('transitionend', this);
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				this.removeEventListener('transitionend', this);
			}
			// custom methods

		}, {
			key: 'obscure',
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

				var oldOpacity = getComputedStyle(curtain).getPropertyValue('opacity'); // needed to sync
				curtain.style.opacity = opacity;
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
						var boxTo = selected.getBoundingClientRect(),
						    boxFrom = this.getBoundingClientRect();
						if (boxTo.height !== boxFrom.height) {
							this.style.height = boxTo.height + 'px';
						}
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

				var oldOpacity = getComputedStyle(curtain).getPropertyValue('opacity'); // needed to sync
				if (oldOpacity === '0') {
					curtain.style.display = 'none';
					this.state = '';
				}

				curtain.style.opacity = 0;
				this.state = 'revealing';
			}
		}, {
			key: 'revealNow',
			value: function revealNow() {
				var curtain = this.lastElementChild;
				curtain.style.display = 'none';
				curtain.style.opacity = 0;
				this.style.height = 'auto';
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
				if (e.type !== 'transitionend') return;
				if (e.target === this) {
					this.style.height = 'auto';
					return;
				}
				if (e.target === this.lastElementChild && this.state === 'revealing') {
					var curtain = this.lastElementChild;
					curtain.style.display = 'none';
					this.state = '';
				}
			}
		}]);

		return RenoContentSwitcher;
	}(HTMLElement);

	customElements.define('reno-content-switcher', RenoContentSwitcher);
})();