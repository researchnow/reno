import React from 'react';


class MountedComponent extends React.Component {
  constructor (props) {
    super(props);

		this._checkedPendingStateChanges = [];

		this.setState = this.checkedSetState;
		this.componentDidMount = this.checkedComponentDidMount;
  }

	checkedSetState (data, callback) {
		this._checkedPendingStateChanges.push({data, callback});
	}

	checkedComponentDidMount () {
		delete this.setState;
		delete this.componentDidMount;
		this.componentWillUnmount = this.checkedComponentWillUnmount;
		this._checkedPendingStateChanges.forEach(({data, callback}) => { this.setState(data, callback); });
		this._checkedPendingStateChanges = [];
		this.componentDidMount && this.componentDidMount();
	}

	checkedComponentWillUnmount () {
		delete this.componentWillUnmount;
		this.setState = this.checkedSetState;
		this.componentDidMount = this.checkedComponentDidMount;
		this.componentWillUnmount && this.componentWillUnmount();
	}
}

export default MountedComponent;
