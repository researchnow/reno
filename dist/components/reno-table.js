'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
	var propagateTo = function propagateTo(node, name, value) {
		node && node[value === null ? 'removeAttribute' : 'setAttribute'](name, value);
	};

	var RenoTable = function (_HTMLElement) {
		_inherits(RenoTable, _HTMLElement);

		function RenoTable() {
			_classCallCheck(this, RenoTable);

			var _this = _possibleConstructorReturn(this, (RenoTable.__proto__ || Object.getPrototypeOf(RenoTable)).call(this));

			_this.onDataUpdated = _this.onDataUpdated.bind(_this);
			_this.onSortRequested = _this.onSortRequested.bind(_this);
			_this.onPageSelected = _this.onPageSelected.bind(_this);
			return _this;
		}
		// life-cycle callbacks


		_createClass(RenoTable, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				var _this2 = this;

				// construct a tree
				this.view = this.ownerDocument.createElement('reno-table-view');
				RenoTable.observedAttributes.forEach(function (name) {
					return propagateTo(_this2.view, name, _this2.getAttribute(name));
				});
				this.view.setAttribute('offset', '0');
				this.appendChild(this.view);
				this.pager = this.ownerDocument.createElement('reno-table-pager');
				this.counter = this.ownerDocument.createElement('reno-table-counter');
				var div1 = this.ownerDocument.createElement('div'),
				    div2 = this.ownerDocument.createElement('div');
				this.appendChild(div1);
				div1.appendChild(this.pager);
				div1.appendChild(div2);
				div2.appendChild(this.counter);
				// attach events
				this.addEventListener('reno-table-data-updated', this.onDataUpdated);
				this.addEventListener('reno-table-sort-requested', this.onSortRequested);
				this.addEventListener('reno-table-page-selected', this.onPageSelected);
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				this.removeEventListener('reno-table-data-updated', this.onDataUpdated);
				this.removeEventListener('reno-table-sort-requested', this.onSortRequested);
				this.removeEventListener('reno-table-page-selected', this.onPageSelected);
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
			// event handlers

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
		}], [{
			key: 'observedAttributes',
			get: function get() {
				return ['limit', 'fields', 'sort', 'filter', 'url', 'labels', 'around'];
			}
		}]);

		return RenoTable;
	}(HTMLElement);

	customElements.define('reno-table', RenoTable);
})();