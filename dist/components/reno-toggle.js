'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RenoToggle = function (_HTMLElement) {
  _inherits(RenoToggle, _HTMLElement);

  function RenoToggle() {
    _classCallCheck(this, RenoToggle);

    return _possibleConstructorReturn(this, (RenoToggle.__proto__ || Object.getPrototypeOf(RenoToggle)).apply(this, arguments));
  }

  _createClass(RenoToggle, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      this.handle = on(this, 'click', this);
    }
  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback() {
      this.handle.remove();
    }
  }, {
    key: 'handleEvent',
    value: function handleEvent() {
      switch (this.getAttribute('status')) {
        case 'on':
          this.setAttribute('status', 'off');
          break;
        case 'off':
        default:
          this.setAttribute('status', 'on');
          break;
      }
    }

    // custom methods

  }, {
    key: 'status',
    get: function get() {
      return this.getAttribute('status');
    }
  }]);

  return RenoToggle;
}(HTMLElement);

customElements.define('reno-toggle', RenoToggle);