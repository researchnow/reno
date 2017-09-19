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
		this.updateEventHandlers(this.props);
  }

  componentWillUnmount () {
    Object.getOwnPropertyNames(this.customEventListeners).
      forEach(name => { this.parent.removeEventListener(name, this); });
    this.customEventListeners = {};
  }

	componentWillReceiveProps (nextProps) {
		this.updateEventHandlers(nextProps);
	}

  updateEventHandlers (props) {
    // set changed attributes
    Object.getOwnPropertyNames(props).
      filter(name => eventHandler.test(name)).
      forEach(name => { this.setProp(name, props[name]); });
		if (props !== this.props) {
			// remove unused attributes
	    Object.getOwnPropertyNames(this.props).
	      filter(name => eventHandler.test(name) && !(name in props)).
	      forEach(name => { this.setProp(name, null); });
		}
  }

  // own methods

	handleEvent (e) {
		const handler = this.customEventListeners[e.type];
		handler && handler(e);
	}

  setProp (name, value) {
    const eventName = name.replace(eventSplitter, $0 => '-' + $0.toLowerCase()).substr(3);
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

  render () { return <div ref={elem => { this.parent = elem; }} className={this.props.className || ''}>{this.props.children}</div>; }
}

export default CustomEventHandler;
