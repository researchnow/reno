'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {
	'use strict';

	var RenoTableCounter = function (_HTMLElement) {
		_inherits(RenoTableCounter, _HTMLElement);

		function RenoTableCounter() {
			_classCallCheck(this, RenoTableCounter);

			return _possibleConstructorReturn(this, (RenoTableCounter.__proto__ || Object.getPrototypeOf(RenoTableCounter)).apply(this, arguments));
		}

		_createClass(RenoTableCounter, [{
			key: 'connectedCallback',

			// life-cycle methods
			value: function connectedCallback() {
				this.render();
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
				// prepare parameters
				var offset = this.getAttribute('offset');
				var limit = this.getAttribute('limit');
				var total = this.getAttribute('total');
				if (offset === null || limit === null || total === null) return;

				offset = Math.max(0, parseInt(offset, 10));
				limit = Math.max(1, parseInt(limit, 10));
				total = Math.max(0, parseInt(total, 10));

				this.innerHTML = '<span class="items">' + (offset + 1) + '-' + (offset + limit) + '</span> of <span class="total">' + total + '</span>';
			}
		}], [{
			key: 'observedAttributes',
			get: function get() {
				return ['offset', 'limit', 'total'];
			}
		}]);

		return RenoTableCounter;
	}(HTMLElement);

	customElements.define('reno-table-counter', RenoTableCounter);
})();