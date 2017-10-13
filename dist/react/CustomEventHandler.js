var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

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
      this.updateEventHandlers(this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this2 = this;

      Object.getOwnPropertyNames(this.customEventListeners).forEach(function (name) {
        _this2.parent.removeEventListener(name, _this2);
      });
      this.customEventListeners = {};
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.updateEventHandlers(nextProps);
    }
  }, {
    key: 'updateEventHandlers',
    value: function updateEventHandlers(props) {
      var _this3 = this;

      // set changed attributes
      Object.getOwnPropertyNames(props).filter(function (name) {
        return eventHandler.test(name);
      }).forEach(function (name) {
        _this3.setProp(name, props[name]);
      });
      if (props !== this.props) {
        // remove unused attributes
        Object.getOwnPropertyNames(this.props).filter(function (name) {
          return eventHandler.test(name) && !(name in props);
        }).forEach(function (name) {
          _this3.setProp(name, null);
        });
      }
    }

    // own methods

  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      var handler = this.customEventListeners[e.type];
      handler && handler(e);
    }
  }, {
    key: 'setProp',
    value: function setProp(name, value) {
      var eventName = name.replace(eventSplitter, function ($0) {
        return '-' + $0.toLowerCase();
      }).substr(3);
      if (value) {
        if (!this.customEventListeners.hasOwnProperty(eventName)) {
          this.parent.addEventListener(eventName, this);
        }
        this.customEventListeners[eventName] = value;
      } else {
        if (this.customEventListeners.hasOwnProperty(eventName)) {
          this.parent.removeEventListener(eventName, this);
          delete this.customEventListeners[eventName];
        }
      }
    }

    // render component

  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'div',
        { ref: function ref(elem) {
            _this4.parent = elem;
          }, className: this.props.className || '' },
        this.props.children
      );
    }
  }]);

  return CustomEventHandler;
}(React.Component);

CustomEventHandler.propTypes = {
  className: PropTypes.string
};


export default CustomEventHandler;