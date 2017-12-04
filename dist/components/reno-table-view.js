'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject = _taggedTemplateLiteral(['<col class="', '"></col>'], ['<col class="', '"></col>']),
    _templateObject2 = _taggedTemplateLiteral(['<colgroup>', '</colgroup>'], ['<colgroup>', '</colgroup>']),
    _templateObject3 = _taggedTemplateLiteral(['<div class="', '" field="', '"><span>', '</span></div>'], ['<div class="', '" field="', '"><span>', '</span></div>']),
    _templateObject4 = _taggedTemplateLiteral(['<div class="thead"><div class="tr">', '</div></div>'], ['<div class="thead"><div class="tr">', '</div></div>']),
    _templateObject5 = _taggedTemplateLiteral(['<div class="', '">\n\t\t\t\t\t\t\t<div class="label">', '</div>\n\t\t\t\t\t\t\t<div class="value">', '</div></div>'], ['<div class="', '">\n\t\t\t\t\t\t\t<div class="label">', '</div>\n\t\t\t\t\t\t\t<div class="value">', '</div></div>']),
    _templateObject6 = _taggedTemplateLiteral(['<div class="', '">', '</div>'], ['<div class="', '">', '</div>']),
    _templateObject7 = _taggedTemplateLiteral(['<div class="tr">', '</div>'], ['<div class="tr">', '</div>']),
    _templateObject8 = _taggedTemplateLiteral(['', '', '<div class="tbody">', '</div>', ''], ['', '', '<div class="tbody">', '</div>', '']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

(function () {
	'use strict';

	var _this = this;

	var debounce = function (f) {
		_newArrowCheck(this, _this);

		var flag = void 0;
		return function () {
			_newArrowCheck(this, _this);

			if (!flag) {
				flag = true;
				window.requestAnimationFrame(function () {
					_newArrowCheck(this, _this);

					flag = false;f();
				}.bind(this));
			}
		}.bind(this);
	}.bind(this);

	var activeElements = { button: 1, input: 1, textarea: 1, a: 1, label: 1 };

	var primitives = { string: 1, number: 1, boolean: 1 };

	var renderValue = function (value) {
		_newArrowCheck(this, _this);

		return primitives[typeof value === 'undefined' ? 'undefined' : _typeof(value)] ? { html: value } : typeof value == 'function' ? value() : value;
	}.bind(this);

	var RenoTableView = function (_HTMLElement) {
		_inherits(RenoTableView, _HTMLElement);

		// constructor (self) {
		// 	self = super(self);
		// 	self.page = {data: []};
		// 	self.onClick = self.onClick.bind(self);
		// 	return self;
		// }
		function RenoTableView() {
			_classCallCheck(this, RenoTableView);

			var _this2 = _possibleConstructorReturn(this, (RenoTableView.__proto__ || Object.getPrototypeOf(RenoTableView)).call(this));

			_this2.page = { data: [] };
			_this2.blacklistedAttributes = {};
			_this2.onClick = _this2.onClick.bind(_this2);
			_this2.io = debounce(_this2.io.bind(_this2));
			return _this2;
		}
		// life-cycle callbacks


		_createClass(RenoTableView, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				if (!this.html) this.html = hyperHTML.bind(this);
				this.addEventListener('click', this.onClick);
				this.io();
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				this.removeEventListener('click', this.onClick);
			}
		}, {
			key: 'attributeChangedCallback',
			value: function attributeChangedCallback(attrName, oldVal, newVal) {
				var _this3 = this;

				if (this.blacklistedAttributes[attrName] == 1) {
					// skip an attribute
					this.blacklistedAttributes[attrName] = 0;
					return;
				}
				if (attrName === 'labels' || attrName === 'nocolgroup') {
					return this.render();
				}
				if (attrName === 'fields') {
					this.fieldList = (newVal || 'name').split(',').map(function (field) {
						_newArrowCheck(this, _this3);

						return field.trim();
					}.bind(this));
					this.fieldMap = this.fieldMap || {};
					this.fieldList.forEach(function (field) {
						_newArrowCheck(this, _this3);

						if (!Object.prototype.hasOwnProperty.call(this.fieldMap, field)) {
							var start = field.charAt(0) === '-' ? 1 : 0;
							this.fieldMap[field] = field.charAt(start).toUpperCase() + field.substr(start + 1).replace(/_|\-/g, ' ');
						}
					}.bind(this));
				}
				this.io();
			}
			// custom methods

		}, {
			key: 'setAttributeSilently',
			value: function setAttributeSilently(attrName, value) {
				this.blacklistedAttributes[attrName] = 1;
				this.setAttribute(attrName, value);
			}
		}, {
			key: 'render',
			value: function render() {
				var _this4 = this;

				if (!this.html) return;

				// prepare parameters
				var offset = Math.max(0, parseInt(this.getAttribute('offset') || '0', 10));
				var limit = Math.max(1, parseInt(this.getAttribute('limit') || '10', 10));
				var labels = this.getAttribute('labels') !== null;
				var noColGroup = this.getAttribute('nocolgroup') !== null;

				var sortList = {};
				(this.getAttribute('sort') || '').split(',').forEach(function (field) {
					_newArrowCheck(this, _this4);

					return field.charAt(0) === '-' ? sortList[field.substr(1)] = 'descending' : sortList[field] = 'ascending';
				}.bind(this));

				// prepare the colgroup
				var cols = [];
				if (!noColGroup) {
					cols = this.fieldList.map(function (field) {
						_newArrowCheck(this, _this4);

						var cssClasses = 'field-' + field + (typeof sortList[field] == 'string' ? ' ' + sortList[field] : '');
						return hyperHTML.wire()(_templateObject, cssClasses);
					}.bind(this));
					cols = hyperHTML.wire()(_templateObject2, cols);
				}

				// prepare the header
				var headRowCells = this.fieldList.filter(function (field) {
					_newArrowCheck(this, _this4);

					return this.fieldMap[field] !== null;
				}.bind(this)).map(function (field) {
					_newArrowCheck(this, _this4);

					var cssClasses = 'td field-' + field + (typeof sortList[field] == 'string' ? ' ' + sortList[field] : '');
					var fieldName = this.fieldMap[field];
					if (fieldName === undefined) fieldName = '<em>' + field + '</em>';
					return hyperHTML.wire()(_templateObject3, cssClasses, field, renderValue(fieldName));
				}.bind(this));
				var header = hyperHTML.wire()(_templateObject4, headRowCells);

				// prepare the body
				var bodyRows = this.page.data.map(function (o) {
					_newArrowCheck(this, _this4);

					var bodyRowCells = this.fieldList.filter(function (field) {
						_newArrowCheck(this, _this4);

						return this.fieldMap[field] !== null;
					}.bind(this)).map(function (field) {
						_newArrowCheck(this, _this4);

						var value = this.formatFieldValue(o, field);
						if (labels) {
							var fieldName = this.fieldMap[field];
							if (fieldName === undefined) fieldName = '<em>' + field + '</em>';
							return hyperHTML.wire()(_templateObject5, 'td field-' + field, renderValue(fieldName), renderValue(value));
						}
						return hyperHTML.wire()(_templateObject6, 'td field-' + field, (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' ? value : { html: value });
					}.bind(this));
					return hyperHTML.wire(o)(_templateObject7, bodyRowCells);
				}.bind(this));

				// prepare the footer
				var footer = ''; // no footer for now

				// assemble everything together
				this.html(_templateObject8, cols, header, bodyRows, footer);
			}
		}, {
			key: 'io',
			value: function io() {
				var _this5 = this;

				// prepare parameters
				var url = this.getAttribute('url');
				if (!url || !this.fieldList) return;

				var offset = Math.max(0, parseInt(this.getAttribute('offset') || '0', 10));
				var limit = Math.max(1, parseInt(this.getAttribute('limit') || '10', 10));
				var fields = this.fieldList.filter(function (field) {
					_newArrowCheck(this, _this5);

					return field.charAt(0) !== '-';
				}.bind(this)).join(',');
				var filter = this.getAttribute('filter');
				var sort = this.getAttribute('sort');

				// submit an I/O request
				var request = { limit: limit, offset: offset, fields: fields };
				if (filter) {
					request.filter = filter;
				}
				if (sort) {
					request.sort = sort;
				}
				this.dispatchEvent(new CustomEvent('reno-table-io-start', { bubbles: true, detail: {} }));
				heya.io(this.sanitizeRequest({ url: url, method: 'GET', query: request })).then(function (page) {
					_newArrowCheck(this, _this5);

					var self = this;
					page = this.sanitizeResponse(page);
					this.page = page instanceof Array ? { data: page } : page;
					this.total = this.page.total;
					this.realOffset = this.page.offset;
					this.realLimit = this.page.data.length;
					if (typeof this.realOffset == 'number' && offset != this.realOffset) {
						this.setAttributeSilently('offset', this.realOffset);
					}
					this.render();
					this.dispatchEvent(new CustomEvent('reno-table-data-updated', { bubbles: true, detail: { limit: limit, total: this.total, offset: this.realOffset, shown: this.realLimit } }));
					this.dispatchEvent(new CustomEvent('reno-table-io-done', { bubbles: true, detail: { error: null } }));
				}.bind(this)).catch(function (e) {
					_newArrowCheck(this, _this5);

					this.dispatchEvent(new CustomEvent('reno-table-io-done', { bubbles: true, detail: { error: e } }));
				}.bind(this));
			}
			// event handlers

		}, {
			key: 'onClick',
			value: function onClick(e) {
				var node = e.target;
				while (node && node.nodeType != 1) {
					node = node.parentNode;
				} // need ELEMENT node
				for (; node && node !== this; node = node.parentNode) {
					if (node.classList.contains('ignore-click') || activeElements[node.tagName.toLowerCase()] === 1 && !node.classList.contains('include-click')) break;
					var field = node.getAttribute('field');
					if (field) {
						// process sorting events
						if (field.charAt(0) !== '-') {
							// ignore technical fields
							var currentState = node.classList.contains('ascending') ? -1 : node.classList.contains('descending') ? 1 : 0;
							this.dispatchEvent(new CustomEvent('reno-table-sort-requested', { bubbles: true, detail: { field: field, currentState: currentState } }));
						}
						return;
					}
					if (node.classList.contains('tr')) {
						var parent = node.parentNode;
						if (parent.classList.contains('tbody')) {
							// process selection events
							for (var i = 0; i < parent.childNodes.length; ++i) {
								if (parent.childNodes[i] === node) {
									this.dispatchEvent(new CustomEvent('reno-table-item-selected', { bubbles: true, detail: { item: this.page.data[i] } }));
									return;
								}
							}
						}
					}
				}
			}
			// user-supplied callbacks
			// fieldMap is a map of names to form the header

		}, {
			key: 'formatFieldValue',
			value: function formatFieldValue(o, field) {
				return field.charAt(0) === '-' ? '<em>&mdash;</em>' : o[field];
			}
		}, {
			key: 'sanitizeRequest',
			value: function sanitizeRequest(request) {
				return request;
			}
		}, {
			key: 'sanitizeResponse',
			value: function sanitizeResponse(response) {
				return response;
			}
		}], [{
			key: 'observedAttributes',
			get: function get() {
				return ['offset', 'limit', 'fields', 'sort', 'filter', 'url', 'labels', 'nocolgroup'];
			}
		}]);

		return RenoTableView;
	}(HTMLElement);

	customElements.define('reno-table-view', RenoTableView);
})();