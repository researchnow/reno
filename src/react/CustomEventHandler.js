import React from 'react';
import PropTypes from 'prop-types';

const eventHandler  = /^on(?:[A-Z][a-z0-9]*)+$/;
const eventSplitter = /[A-Z]/g;

class CustomEventHandler extends React.Component {
  static propTypes = {
		className: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.customEventListeners = {};
  }

  // life cycle methods

  componentDidMount () {
    Object.keys(this.props).
      filter(name => eventHandler.test(name)).
      forEach(name => { this.setProp(name, this.props[name]); });
  }

  componentWillUnmount () {
    Object.keys(this.customEventListeners).
      filter(name => this.customEventListeners.hasOwnProperty(name)).
      forEach(name => { this.parent.removeEventListener(name, this.customEventListeners[name]); });
    this.customEventListeners = {};
  }

  componentWillReceiveProps (nextProps) {
    // set changed attributes
    Object.keys(nextProps).
      filter(name => eventHandler.test(name)).
      forEach(name => {
        const value = nextProps[name];
        if (!(name in this.props) || value !== this.props[name]) { this.setProp(name, value); }
      });
    // remove unused attributes
    Object.keys(this.props).
      filter(name => eventHandler.test(name) && !(name in nextProps)).
      forEach(name => { this.setProp(name, null); });
  }

  // own methods

  setProp (name, value) {
    const eventName = name.replace(eventSplitter, $0 => '-' + $0.toLowerCase()).substr(3);
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

  render () { return <div ref={elem => { this.parent = elem; }} className="{this.props.className || ''}">{this.props.children}</div>; }
}

export default CustomEventHandler;
