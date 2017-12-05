import { openPopup, closePopup } from "./reno-popup-actions";

let handleClick = null;

const hidePopup = e => {
	const popup = document.getElementById('reno-popup-container');
	if (popup && !popup.contains(e.target)) {
		closePopup();
	}
};

class RenoPopup extends HTMLElement {
	connectedCallback () {
		if (!handleClick) {
			handleClick = on(document, 'click', hidePopup);
		}
		// listen to events on the entire component
		switch(this.getAttribute('trigger')) {
			case 'click':
				this.handle = on(this, 'click', this);
				break;
			// case 'focus':
			// 	this.handle = on(this, 'focus', this);
			// 	break;
			default:
			// case 'mouseover':
				this.handle = on(this, 'mouseover,mouseout', this);
				break;
		}
	}
	disconnectedCallback () {
		this.handle.remove();
	}
	handleEvent (e) {
		// handle events
		const trigger = this.getAttribute('trigger') || 'mouseover';
		if (trigger !== e.type && (trigger !== 'mouseover' || e.type !== 'mouseout')) return;

		switch (e.type) {
			case 'click':
				openPopup(this);
				break;
			// case 'focus':
			// 	// TODO
			// 	break;
			case 'mouseover':
				openPopup(this);
				break;
			case 'mouseout':
				const popup = document.getElementById('reno-popup-container');
				if (!e.relatedTarget || popup && !popup.contains(e.relatedTarget)) {
					closePopup();
				}
				break;
		}
		e.stopPropagation();
	}
}

customElements.define('reno-popup', RenoPopup);
