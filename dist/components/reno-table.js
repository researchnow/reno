'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n\t\t\t\t<reno-content-switcher obscureClass="reno-obscuring" revealClass="reno-revealing">\n\t\t\t\t\t<div class="normal">\n\t\t\t\t\t\t<div class="border-wrap"><reno-table-view></reno-table-view></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="page empty">\n\t\t\t\t\t\t<div class="strong">This table is empty.</div>\n\t\t\t\t\t\t<div>Try to populate it first.</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="page overfiltered">\n\t\t\t\t\t\t<div class="strong">There are no items that match the search terms.</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="page error">\n\t\t\t\t\t\t<div class="strong">I/O error. Please try again later.</div>\n\t\t\t\t\t\t<div>The support team is automatically notified.</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="page spinner"><div class="reno-spinner">Loading...</div></div>\n\t\t\t\t</reno-content-switcher>\n\t\t\t\t<div class="control-bar">\n\t\t\t\t\t<reno-table-pager></reno-table-pager>\n\t\t\t\t\t<div><reno-table-counter></reno-table-counter></div>\n\t\t\t\t</div>\n\t\t\t'], ['\n\t\t\t\t<reno-content-switcher obscureClass="reno-obscuring" revealClass="reno-revealing">\n\t\t\t\t\t<div class="normal">\n\t\t\t\t\t\t<div class="border-wrap"><reno-table-view></reno-table-view></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="page empty">\n\t\t\t\t\t\t<div class="strong">This table is empty.</div>\n\t\t\t\t\t\t<div>Try to populate it first.</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="page overfiltered">\n\t\t\t\t\t\t<div class="strong">There are no items that match the search terms.</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="page error">\n\t\t\t\t\t\t<div class="strong">I/O error. Please try again later.</div>\n\t\t\t\t\t\t<div>The support team is automatically notified.</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="page spinner"><div class="reno-spinner">Loading...</div></div>\n\t\t\t\t</reno-content-switcher>\n\t\t\t\t<div class="control-bar">\n\t\t\t\t\t<reno-table-pager></reno-table-pager>\n\t\t\t\t\t<div><reno-table-counter></reno-table-counter></div>\n\t\t\t\t</div>\n\t\t\t']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
	'use strict';

	var propagateTo = function propagateTo(node, name, value) {
		node && node[value === null ? 'removeAttribute' : 'setAttribute'](name, value);
	};

	var supportedEvents = { 'reno-table-data-updated': 'onDataUpdated', 'reno-table-sort-requested': 'onSortRequested', 'reno-table-page-selected': 'onPageSelected',
		'reno-table-io-start': 'onIoStart', 'reno-table-io-done': 'onIoDone' };

	var RenoTable = function (_HTMLElement) {
		_inherits(RenoTable, _HTMLElement);

		function RenoTable() {
			_classCallCheck(this, RenoTable);

			return _possibleConstructorReturn(this, (RenoTable.__proto__ || Object.getPrototypeOf(RenoTable)).apply(this, arguments));
		}

		_createClass(RenoTable, [{
			key: 'connectedCallback',

			// life-cycle callbacks
			value: function connectedCallback() {
				var _this2 = this;

				if (!this.html) this.html = hyperHTML.bind(this);
				this.render();
				Object.keys(supportedEvents).forEach(function (eventName) {
					return _this2.addEventListener(eventName, _this2);
				});
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				var _this3 = this;

				Object.keys(supportedEvents).forEach(function (eventName) {
					return _this3.removeEventListener(eventName, _this3);
				});
			}
		}, {
			key: 'attributeChangedCallback',
			value: function attributeChangedCallback(attrName, oldVal, newVal) {
				if (attrName === 'around') {
					return propagateTo(this.pager, attrName, newVal);
				}
				propagateTo(this.view, attrName, newVal);
				if (attrName !== 'labels' && attrName !== 'fields') {
					this.view && this.view.setAttribute('offset', '0');
				}
			}
			// custom methods

		}, {
			key: 'refresh',
			value: function refresh() {
				this.view && this.view.io();
			}
			// TODO: add re-render

		}, {
			key: 'render',
			value: function render() {
				var _this4 = this;

				var filter = this.getAttribute('filter');
				this.html(_templateObject);
				if (!this.view) {
					this.view = this.querySelector('reno-table-view');
					this.pager = this.querySelector('reno-table-pager');
					this.counter = this.querySelector('reno-table-counter');
					RenoTable.observedAttributes.forEach(function (name) {
						return propagateTo(_this4.view, name, _this4.getAttribute(name));
					});
					this.view.setAttribute('offset', '0');
				}
			}
			// event handlers

		}, {
			key: 'handleEvent',
			value: function handleEvent(e) {
				this[supportedEvents[e.type]](e);
			}
		}, {
			key: 'onDataUpdated',
			value: function onDataUpdated(e) {
				if (this.pager) {
					this.pager.setAttribute('total', e.detail.total);
					this.pager.setAttribute('offset', e.detail.offset);
					this.pager.setAttribute('limit', e.detail.limit);
				}
				if (this.counter) {
					this.counter.setAttribute('total', e.detail.total);
					this.counter.setAttribute('offset', e.detail.offset);
					this.counter.setAttribute('limit', e.detail.shown);
				}
				var contentSwitcher = this.querySelector('reno-content-switcher'),
				    controlBar = this.querySelector('.control-bar');
				contentSwitcher && contentSwitcher.reveal(e.detail.total ? '.normal' : this.getAttribute('filter') ? '.overfiltered' : '.empty');
				if (e.detail.total) {
					controlBar.classList.remove('hidden');
					contentSwitcher && contentSwitcher.reveal('.normal');
				} else {
					controlBar.classList.add('hidden');
					contentSwitcher && contentSwitcher.reveal(this.getAttribute('filter') ? '.overfiltered' : '.empty');
				}
			}
		}, {
			key: 'onSortRequested',
			value: function onSortRequested(e) {
				if (this.view) {
					this.view.setAttribute('offset', '0');
					switch (e.detail.currentState) {
						case -1:
							this.view.setAttribute('sort', '-' + e.detail.field);
							break;
						case 0:
							this.view.setAttribute('sort', e.detail.field);
							break;
						default:
							this.view.removeAttribute('sort');
							break;
					}
				}
			}
		}, {
			key: 'onPageSelected',
			value: function onPageSelected(e) {
				this.view && this.view.setAttribute('offset', e.detail.offset);
			}
		}, {
			key: 'onIoStart',
			value: function onIoStart() {
				var contentSwitcher = this.querySelector('reno-content-switcher');
				if (contentSwitcher) {
					contentSwitcher.obscure(0.9);
					this.pager && this.pager.setAttribute('disabled', true);
					this.counter && this.counter.setAttribute('disabled', true);
				}
			}
		}, {
			key: 'onIoDone',
			value: function onIoDone(e) {
				if (e.detail.error) {
					var contentSwitcher = this.querySelector('reno-content-switcher');
					contentSwitcher && contentSwitcher.reveal('.error');
				} else {
					this.pager && this.pager.removeAttribute('disabled');
					this.counter && this.counter.removeAttribute('disabled');
				}
			}
		}], [{
			key: 'observedAttributes',
			get: function get() {
				return ['offset', 'limit', 'fields', 'sort', 'filter', 'url', 'labels', 'nocolgroup', 'around'];
			}
		}]);

		return RenoTable;
	}(HTMLElement);

	customElements.define('reno-table', RenoTable);
})();