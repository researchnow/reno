'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var eventHandler = /^on(?:[A-Z][a-z0-9]*)+$/;
var eventSplitter = /[A-Z]/g;

var CustomEventHandler = function (_React$Component) {
  _inherits(CustomEventHandler, _React$Component);

  function CustomEventHandler(props) {
    _classCallCheck(this, CustomEventHandler);

    var _this = _possibleConstructorReturn(this, (CustomEventHandler.__proto__ || Object.getPrototypeOf(CustomEventHandler)).call(this, props));

    _this.customEventListeners = {};
    return _this;
  }

  // life cycle methods

  _createClass(CustomEventHandler, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      Object.keys(this.props).filter(function (name) {
        return eventHandler.test(name);
      }).forEach(function (name) {
        _this2.setProp(name, _this2.props[name]);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      Object.keys(this.customEventListeners).filter(function (name) {
        return _this3.customEventListeners.hasOwnProperty(name);
      }).forEach(function (name) {
        _this3.parent.removeEventListener(name, _this3.customEventListeners[name]);
      });
      this.customEventListeners = {};
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this4 = this;

      // set changed attributes
      Object.keys(nextProps).filter(function (name) {
        return eventHandler.test(name);
      }).forEach(function (name) {
        var value = nextProps[name];
        if (!(name in _this4.props) || value !== _this4.props[name]) {
          _this4.setProp(name, value);
        }
      });
      // remove unused attributes
      Object.keys(this.props).filter(function (name) {
        return eventHandler.test(name) && !(name in nextProps);
      }).forEach(function (name) {
        _this4.setProp(name, null);
      });
    }

    // own methods

  }, {
    key: 'setProp',
    value: function setProp(name, value) {
      var eventName = name.replace(eventSplitter, function ($0) {
        return '-' + $0.toLowerCase();
      }).substr(3);
      if (this.customEventListeners.hasOwnProperty(eventName)) {
        this.parent.removeEventListener(eventName, this.customEventListeners[eventName]);
      }
      if (value) {
        this.customEventListeners[eventName] = value;
        this.parent.addEventListener(eventName, value);
      } else {
        delete this.customEventListeners[eventName];
      }
    }

    // render component

  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement(
        'div',
        { ref: function ref(elem) {
            _this5.parent = elem;
          } },
        this.props.children
      );
    }
  }]);

  return CustomEventHandler;
}(_react2.default.Component);

CustomEventHandler.propTypes = {
  tag: _propTypes2.default.string
};
exports.default = CustomEventHandler;