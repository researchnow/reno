'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RenoProgress = function (_HTMLElement) {
	_inherits(RenoProgress, _HTMLElement);

	function RenoProgress() {
		_classCallCheck(this, RenoProgress);

		return _possibleConstructorReturn(this, (RenoProgress.__proto__ || Object.getPrototypeOf(RenoProgress)).apply(this, arguments));
	}

	_createClass(RenoProgress, [{
		key: 'connectedCallback',
		value: function connectedCallback() {
			this.barElement = this.ownerDocument.createElement('div');
			this.appendChild(this.barElement);
			this.updateProgress(this.getAttribute('progress'));
		}
	}, {
		key: 'attributeChangedCallback',
		value: function attributeChangedCallback(attrName, oldVal, newVal) {
			if (attrName === 'progress') this.updateProgress(newVal);
		}
	}, {
		key: 'updateProgress',
		value: function updateProgress(progress) {
			if (!this.barElement) return;
			if (progress === 'pending' || progress === 'reverse-pending') {
				this.barElement.classList.add(progress);
			} else {
				var value = parseFloat(progress);
				if (isNaN(value)) {
					this.barElement.classList.add('pending');
				} else {
					// clean up pending states
					this.barElement.classList.remove('pending');
					this.barElement.classList.remove('reverse-pending');
					// set bar width
					this.barElement.style.width = value + '%';
				}
			}
		}
	}], [{
		key: 'observedAttributes',
		get: function get() {
			return ['progress'];
		}
	}]);

	return RenoProgress;
}(HTMLElement);

customElements.define('reno-progress', RenoProgress);