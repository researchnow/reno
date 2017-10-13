var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
	'use strict';

	var supportedEvents = { click: 0, change: 0, focus: 0, blur: 0, keyup: 'onChange' },
	    firstChildEvents = ['change', 'keyup', 'focus', 'blur'];

	var RenoSearch = function (_HTMLElement) {
		_inherits(RenoSearch, _HTMLElement);

		function RenoSearch() {
			_classCallCheck(this, RenoSearch);

			return _possibleConstructorReturn(this, (RenoSearch.__proto__ || Object.getPrototypeOf(RenoSearch)).apply(this, arguments));
		}

		_createClass(RenoSearch, [{
			key: 'connectedCallback',

			// life-cycle callbacks
			value: function connectedCallback() {
				var _this2 = this;

				// render representation
				var name = this.getAttribute('name'),
				    value = this.getAttribute('value'),
				    disabled = this.getAttribute('disabled'),
				    placeholder = this.getAttribute('placeholder');
				var input = this.ownerDocument.createElement('input');
				input.type = 'text';
				if (name !== null) input.setAttribute('name', name);
				if (value !== null) input.value = value;
				input.disabled = disabled !== null;
				if (placeholder !== null) input.setAttribute('placeholder', placeholder);
				var span = this.ownerDocument.createElement('span');
				span.innerHTML = '&nbsp;';
				value && span.classList.add('has-value');
				this.appendChild(input);
				this.appendChild(span);
				// attach events
				this.lastChild.addEventListener('click', this);
				firstChildEvents.forEach(function (eventName) {
					return _this2.firstChild.addEventListener(eventName, _this2);
				});
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				var _this3 = this;

				// detach events
				this.lastChild.removeEventListener('click', this);
				firstChildEvents.forEach(function (eventName) {
					return _this3.firstChild.removeEventListener(eventName, _this3);
				});
				// destroy representation
				while (this.firstChild) {
					this.removeChild(this.firstChild);
				}
			}
		}, {
			key: 'attributeChangedCallback',
			value: function attributeChangedCallback(attrName, oldVal, newVal) {
				if (!this.firstChild) return;
				if (attrName === 'value') {
					if (newVal !== null) {
						this.firstChild.value = newVal;
						this.classList[newVal ? 'add' : 'remove']('has-value');
					}
				} else if (attrName === 'disabled') {
					this.firstChild.disabled = newVal !== null;
				} else if (attrName === 'placeholder') {
					this.firstChild[newVal === null ? 'removeAttribute' : 'setAttribute']('placeholder', newVal);
				} else if (attrName === 'name') {
					this.firstChild[newVal === null ? 'removeAttribute' : 'setAttribute']('name', newVal);
				}
			}
			// custom methods

		}, {
			key: 'notifyAboutChange',
			value: function notifyAboutChange() {
				this.dispatchEvent(new CustomEvent('reno-change', { bubbles: true, detail: { value: this.firstChild.value } }));
			}
			// event handlers

		}, {
			key: 'handleEvent',
			value: function handleEvent(e) {
				var name = supportedEvents[e.type];
				if (name === 0) {
					name = 'on' + e.type.charAt(0).toUpperCase() + e.type.substr(1).toLowerCase();
				}
				if (typeof name == 'string' && typeof this[name] == 'function') {
					this[name](e);
				}
			}
		}, {
			key: 'onClick',
			value: function onClick(e) {
				if (e.target == this.lastChild && this.firstChild && this.firstChild.value && this.getAttribute('disabled') === null) {
					this.firstChild.value = '';
					this.lastChild.classList.remove('has-value');
					this.notifyAboutChange();
				}
			}
		}, {
			key: 'onChange',
			value: function onChange(e) {
				if (this.firstChild) {
					this.lastChild.classList[this.firstChild.value ? 'add' : 'remove']('has-value');
					this.notifyAboutChange();
				}
			}
		}, {
			key: 'onFocus',
			value: function onFocus(e) {
				this.classList.add('focused');
			}
		}, {
			key: 'onBlur',
			value: function onBlur(e) {
				this.classList.remove('focused');
			}
		}, {
			key: 'value',
			get: function get() {
				return this.firstChild && this.firstChild.value || '';
			},
			set: function set(x) {
				this.setAttribute('value', x);
			}
		}, {
			key: 'disabled',
			get: function get() {
				return this.firstChild && this.firstChild.disabled || false;
			},
			set: function set(x) {
				this[x ? 'setAttribute' : 'removeAttribute']('disabled', '');
			}
		}], [{
			key: 'observedAttributes',
			get: function get() {
				return ['name', 'value', 'disabled', 'placeholder'];
			}
		}]);

		return RenoSearch;
	}(HTMLElement);

	customElements.define('reno-search', RenoSearch);
})();