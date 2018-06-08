'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
	'use strict';

	var supportedEvents = { click: 'onClick', input: 'onInput', submit: 'onSubmit' };

	var validityFlags = ['customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderFlow', 'stepMismatch', 'tooLong', 'typeMismatch', 'valid', 'valueMissing'];

	var RenoForm = function (_HTMLElement) {
		_inherits(RenoForm, _HTMLElement);

		function RenoForm() {
			_classCallCheck(this, RenoForm);

			return _possibleConstructorReturn(this, (RenoForm.__proto__ || Object.getPrototypeOf(RenoForm)).apply(this, arguments));
		}

		_createClass(RenoForm, [{
			key: 'connectedCallback',

			// life-cycle callbacks
			value: function connectedCallback() {
				var _this2 = this;

				this.handle = on.makeMultiHandle(Object.keys(supportedEvents).map(function (eventName) {
					_newArrowCheck(this, _this2);

					return on(this, eventName, this);
				}.bind(this)));
				if (this.getAttribute('showmessages') !== null) {
					this.deferredFunction = this.showMessages;
					window.requestAnimationFrame(function () {
						_newArrowCheck(this, _this2);

						this.deferredFunction && this.deferredFunction.call(this);
						this.deferredFunction = null;
					}.bind(this));
				}
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				this.handle.remove();
				this.deferredFunction = null;
			}
		}, {
			key: 'attributeChangedCallback',
			value: function attributeChangedCallback(attrName, oldVal, newVal) {
				if (attrName === 'disabled') {
					var fieldSets = this.querySelectorAll('fieldset'),
					    disabled = newVal !== null;
					for (var i = 0; i < fieldSets.length; ++i) {
						fieldSets[i].disabled = disabled;
					}
				}
			}
			// custom methods

		}, {
			key: 'getElements',
			value: function getElements(clean) {
				var elements = [],
				    forms = this.querySelectorAll('form');
				for (var i = 0; i < forms.length; ++i) {
					var form = forms[i];
					for (var j = 0; j < form.length; ++j) {
						var element = form.elements[j];
						if (!clean || element.name && (element.tagName.toLowerCase() === 'input' && (element.type === 'checkbox' || element.type === 'radio') ? element.checked : true)) {
							elements.push(element);
						}
					}
				}
				return elements;
			}
		}, {
			key: 'getElementsByName',
			value: function getElementsByName(clean) {
				var _this3 = this;

				var dict = {};
				this.getElements(clean).forEach(function (element) {
					_newArrowCheck(this, _this3);

					return dict[element.name] = element;
				}.bind(this));
				return dict;
			}
		}, {
			key: 'getFormData',
			value: function getFormData() {
				var form = this.querySelector('form');
				return form && new FormData(form);
			}
		}, {
			key: 'checkValidity',
			value: function checkValidity() {
				var forms = this.querySelectorAll('form');
				var allValid = true;
				for (var i = 0; i < forms.length; ++i) {
					var valid = forms[i].checkValidity();
					allValid = allValid && valid;
				}
				return allValid;
			}
		}, {
			key: 'reportValidity',
			value: function reportValidity() {
				var forms = this.querySelectorAll('form');
				var allValid = true;
				for (var i = 0; i < forms.length; ++i) {
					var valid = forms[i].reportValidity();
					allValid = allValid && valid;
				}
				return allValid;
			}
		}, {
			key: 'showElementMessages',
			value: function showElementMessages(node, rootSelector, errorSelector) {
				var _this4 = this;

				var element = node;
				if (rootSelector) {
					while (element && element[on.matches] && !element[on.matches](rootSelector)) {
						element = element.parentNode;
					}element = element && element[on.matches] ? element : node;
				}
				validityFlags.forEach(function (flag) {
					_newArrowCheck(this, _this4);

					element.classList[node.validity[flag] ? 'add' : 'remove']('validity-' + flag);
				}.bind(this));
				if (rootSelector && errorSelector) {
					var errorNode = element.querySelector(errorSelector);
					if (errorNode) {
						while (errorNode.lastChild) {
							errorNode.removeChild(errorNode.lastChild);
						}errorNode.appendChild(node.ownerDocument.createTextNode(node.validationMessage));
					}
				}
			}
		}, {
			key: 'showFormMessages',
			value: function showFormMessages(form, rootSelector, errorSelector) {
				var elements = form.elements,
				    length = form.length;
				for (var j = 0; j < length; ++j) {
					this.showElementMessages(elements[j], rootSelector, errorSelector);
				}
			}
		}, {
			key: 'showMessages',
			value: function showMessages() {
				var forms = this.querySelectorAll('form'),
				    rootSelector = this.getAttribute('rootselector'),
				    errorSelector = this.getAttribute('errorselector');
				for (var i = 0; i < forms.length; ++i) {
					this.showFormMessages(forms[i], rootSelector, errorSelector);
				}
			}
			// event handlers

		}, {
			key: 'handleEvent',
			value: function handleEvent(e) {
				this[supportedEvents[e.type]](e);
			}
		}, {
			key: 'onClick',
			value: function onClick(e) {
				if (e.target[on.matches]('input[type="checkbox"], input[type="radio"]')) {
					this.dispatchEvent(new CustomEvent('reno-form-click', { bubbles: true, detail: { changed: e } }));
				}
			}
		}, {
			key: 'onInput',
			value: function onInput(e) {
				this.showElementMessages(e.target, this.getAttribute('rootselector'), this.getAttribute('errorselector'));
				this.dispatchEvent(new CustomEvent('reno-form-input', { bubbles: true, detail: { changed: e } }));
			}
		}, {
			key: 'onSubmit',
			value: function onSubmit(e) {
				if (e.target[on.matches]('form')) {
					e.preventDefault();
					this.showFormMessages(e.target, this.getAttribute('rootselector'), this.getAttribute('errorselector'));
					this.dispatchEvent(new CustomEvent('reno-form-submit', { bubbles: true, detail: { form: e, validity: e.target.reportValidity() } }));
				}
			}
		}], [{
			key: 'observedAttributes',
			get: function get() {
				return ['disabled'];
			}
		}]);

		return RenoForm;
	}(HTMLElement);

	customElements.define('reno-form', RenoForm);
})();