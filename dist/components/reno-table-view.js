'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

(function () {
	var debounce = function debounce(f) {
		var flag = void 0;
		return function () {
			if (!flag) {
				flag = true;
				window.requestAnimationFrame(function () {
					flag = false;f();
				});
			}
		};
	};

	var activeElements = { button: 1, input: 1, textarea: 1, a: 1, label: 1 };

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

			var _this = _possibleConstructorReturn(this, (RenoTableView.__proto__ || Object.getPrototypeOf(RenoTableView)).call(this));

			_this.page = { data: [] };
			_this.onClick = _this.onClick.bind(_this);
			_this.io = debounce(_this.io.bind(_this));
			return _this;
		}
		// life-cycle callbacks


		_createClass(RenoTableView, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				this.addEventListener('click', this.onClick);
				this.html = hyperHTML.bind(this);
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
				var _this2 = this;

				if (attrName === 'labels' || attrName === 'nocolgroup') {
					return this.render();
				}
				if (attrName === 'fields') {
					this.fieldList = (newVal || 'name').split(',').map(function (field) {
						return field.trim();
					});
					this.fieldMap = this.fieldMap || {};
					this.fieldList.forEach(function (field) {
						if (!Object.prototype.hasOwnProperty.call(_this2.fieldMap, field)) {
							var start = field.charAt(0) === '-' ? 1 : 0;
							_this2.fieldMap[field] = field.charAt(start).toUpperCase() + field.substr(start + 1).replace(/_|\-/g, ' ');
						}
					});
				}
				this.io();
			}
			// custom methods

		}, {
			key: 'render',
			value: function render() {
				var _this3 = this;

				if (!this.html) return;

				// prepare parameters
				var offset = Math.max(0, parseInt(this.getAttribute('offset') || '0', 10));
				var limit = Math.max(1, parseInt(this.getAttribute('limit') || '10', 10));
				var labels = this.getAttribute('labels') !== null;
				var noColGroup = this.getAttribute('nocolgroup') !== null;

				var sortList = {};
				(this.getAttribute('sort') || '').split(',').forEach(function (field) {
					return field.charAt(0) === '-' ? sortList[field.substr(1)] = 'descending' : sortList[field] = 'ascending';
				});

				// prepare the colgroup
				var cols = [];
				if (!noColGroup) {
					cols = this.fieldList.map(function (field) {
						var cssClasses = 'field-' + field + (typeof sortList[field] == 'string' ? ' ' + sortList[field] : '');
						return hyperHTML.wire()(_templateObject, cssClasses);
					});
					cols = hyperHTML.wire()(_templateObject2, cols);
				}

				// prepare the header
				var headRowCells = this.fieldList.filter(function (field) {
					return _this3.fieldMap[field] !== null;
				}).map(function (field) {
					var cssClasses = 'td field-' + field + (typeof sortList[field] == 'string' ? ' ' + sortList[field] : '');
					var fieldName = _this3.fieldMap[field];
					if (fieldName === undefined) fieldName = '<em>' + field + '</em>';
					return hyperHTML.wire()(_templateObject3, cssClasses, field, (typeof fieldName === 'undefined' ? 'undefined' : _typeof(fieldName)) == 'object' ? fieldName : { html: fieldName });
				});
				var header = hyperHTML.wire()(_templateObject4, headRowCells);

				// prepare the body
				var bodyRows = this.page.data.map(function (o) {
					var bodyRowCells = _this3.fieldList.filter(function (field) {
						return _this3.fieldMap[field] !== null;
					}).map(function (field) {
						var value = _this3.formatFieldValue(o, field);
						if (labels) {
							var fieldName = _this3.fieldMap[field];
							if (fieldName === undefined) fieldName = '<em>' + field + '</em>';
							return hyperHTML.wire()(_templateObject5, 'td field-' + field, (typeof fieldName === 'undefined' ? 'undefined' : _typeof(fieldName)) == 'object' ? fieldName : { html: fieldName }, (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' ? value : { html: value });
						}
						return hyperHTML.wire()(_templateObject6, 'td field-' + field, (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' ? value : { html: value });
					});
					return hyperHTML.wire(o)(_templateObject7, bodyRowCells);
				});

				// prepare the footer
				var footer = ''; // no footer for now

				// assemble everything together
				this.html(_templateObject8, cols, header, bodyRows, footer);
			}
		}, {
			key: 'io',
			value: function io() {
				var _this4 = this;

				// prepare parameters
				var url = this.getAttribute('url');
				if (!url || !this.fieldList) return;

				var offset = Math.max(0, parseInt(this.getAttribute('offset') || '0', 10));
				var limit = Math.max(1, parseInt(this.getAttribute('limit') || '10', 10));
				var fields = this.fieldList.filter(function (field) {
					return field.charAt(0) !== '-';
				}).join(',');
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
				heya.io(this.sanitizeRequest({ url: url, method: 'GET', query: request })).then(function (page) {
					page = _this4.sanitizeResponse(page);
					_this4.page = page instanceof Array ? { data: page } : page;
					_this4.total = _this4.page.total;
					_this4.realOffset = _this4.page.offset;
					_this4.realLimit = _this4.page.data.length;
					_this4.render();
					_this4.dispatchEvent(new CustomEvent('reno-table-data-updated', { bubbles: true, detail: { limit: limit, total: _this4.total, offset: _this4.realOffset, shown: _this4.realLimit } }));
				});
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
						var currentState = node.classList.contains('ascending') ? -1 : node.classList.contains('descending') ? 1 : 0;
						this.dispatchEvent(new CustomEvent('reno-table-sort-requested', { bubbles: true, detail: { field: field, currentState: currentState } }));
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