'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['<div class="', '" offset="', '" reason="', '">', '</div>'], ['<div class="', '" offset="', '" reason="', '">', '</div>']),
    _templateObject2 = _taggedTemplateLiteral(['\n\t\t\t\t<div  class="', '" offset="', '" reason="first"></div>\n\t\t\t\t<div  class="', '"  offset="', '"  reason="previous"></div>', '<div class="', '"  offset="', '"  reason="next"></div>\n\t\t\t\t<div  class="', '"  offset="', '"  reason="last"></div>\n\t\t\t'], ['\n\t\t\t\t<div  class="', '" offset="', '" reason="first"></div>\n\t\t\t\t<div  class="', '"  offset="', '"  reason="previous"></div>', '<div class="', '"  offset="', '"  reason="next"></div>\n\t\t\t\t<div  class="', '"  offset="', '"  reason="last"></div>\n\t\t\t']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
	'use strict';

	var RenoTablePager = function (_HTMLElement) {
		_inherits(RenoTablePager, _HTMLElement);

		// constructor (self) {
		// 	self = super(self);
		// 	self.onClick = self.onClick.bind(self);
		// 	return self;
		// }
		function RenoTablePager() {
			_classCallCheck(this, RenoTablePager);

			var _this = _possibleConstructorReturn(this, (RenoTablePager.__proto__ || Object.getPrototypeOf(RenoTablePager)).call(this));

			_this.onClick = _this.onClick.bind(_this);
			return _this;
		}
		// life-cycle methods


		_createClass(RenoTablePager, [{
			key: 'connectedCallback',
			value: function connectedCallback() {
				if (!this.html) this.html = hyperHTML.bind(this);
				this.addEventListener('click', this.onClick);
				this.render();
			}
		}, {
			key: 'disconnectedCallback',
			value: function disconnectedCallback() {
				this.removeEventListener('click', this.onClick);
			}
		}, {
			key: 'attributeChangedCallback',
			value: function attributeChangedCallback() {
				this.render();
			}
			// custom methods

		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				if (!this.html) return;

				// prepare parameters
				var offset = this.getAttribute('offset');
				var limit = this.getAttribute('limit');
				var total = this.getAttribute('total');
				if (offset === null || limit === null || total === null) return;

				offset = Math.max(0, +offset);
				limit = Math.max(1, +limit);
				total = Math.max(0, +total);

				var around = Math.max(1, +(this.getAttribute('around') || '2'));

				// first/last page offsets
				var firstPageOffset = 0;
				var lastPageOffset = Math.floor(total / limit) * limit;
				if (lastPageOffset >= total) {
					lastPageOffset = total - limit;
				}

				// around page offsets
				var pages = [];
				var currentPage = void 0,
				    firstPage = void 0,
				    lastPage = void 0,
				    pageOffset = Math.max(0, Math.min(offset - around * limit, lastPageOffset - 2 * around * limit));
				for (var i = 2 * around + 1; i > 0; --i, pageOffset += limit) {
					if (pageOffset > offset && pageOffset < offset + limit) {
						pageOffset = offset;
					}
					if (pageOffset >= total) {
						break;
					}
					if (pageOffset === offset) {
						currentPage = pages.length;
					}
					if (pageOffset === firstPageOffset) {
						firstPage = pages.length;
					}
					if (pageOffset === lastPageOffset) {
						lastPage = pages.length;
					}
					pages.push(pageOffset);
				}

				var firstPageNumber = Math.floor(pages[0] / limit) + 1;

				var pageList = pages.map(function (offset, index) {
					_newArrowCheck(this, _this2);

					var cssClasses = ['go-page'];
					if (index === currentPage) {
						cssClasses.push('current');
					}
					if (index === firstPage) {
						cssClasses.push('first');
					}
					if (index === lastPage) {
						cssClasses.push('last');
					}
					var number = firstPageNumber + index;
					return hyperHTML.wire()(_templateObject, cssClasses.join(' '), offset, number, number);
				}.bind(this));

				var firstPageClasses = ['go-first'],
				    lastPageClasses = ['go-last'],
				    prevPageClasses = ['go-prev'],
				    nextPageClasses = ['go-next'];
				if (currentPage === 0) {
					prevPageClasses.push('ignore');firstPageClasses.push('ignore');
				}
				if (currentPage == pages.length - 1) {
					nextPageClasses.push('ignore');lastPageClasses.push('ignore');
				}

				var prevPageOffset = currentPage === 0 ? 0 : pages[currentPage - 1];
				var nextPageOffset = currentPage === pages.length - 1 ? Math.max(0, total - limit) : pages[currentPage + 1];

				this.html(_templateObject2, firstPageClasses.join(' '), firstPageOffset, prevPageClasses.join(' '), prevPageOffset, pageList, nextPageClasses.join(' '), nextPageOffset, lastPageClasses.join(' '), lastPageOffset);
			}
			// event handlers

		}, {
			key: 'onClick',
			value: function onClick(e) {
				if (this.getAttribute('disabled') !== null) return;
				var node = e.target;
				while (node && node.nodeType != 1) {
					node = node.parentNode;
				} // need ELEMENT node
				for (; node && node !== this; node = node.parentNode) {
					var reason = node.getAttribute('reason');
					if (reason) {
						var offset = node.getAttribute('offset');
						if (offset && !node.classList.contains('ignore') && (this.getAttribute('current') !== 'ignore' || offset !== this.getAttribute('offset'))) {
							this.dispatchEvent(new CustomEvent('reno-table-page-selected', { bubbles: true, detail: { reason: reason, offset: offset } }));
							return;
						}
					}
				}
			}
		}], [{
			key: 'observedAttributes',
			get: function get() {
				return ['offset', 'limit', 'total', 'around'];
			}
		}]);

		return RenoTablePager;
	}(HTMLElement);

	customElements.define('reno-table-pager', RenoTablePager);
})();