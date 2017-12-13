let handleClick = null;

const hidePopup = e => {
	const popup = document.getElementById('reno-popup-container');
	if (popup && !popup.contains(e.target)) {
		Reno.utils.popup.close();
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
				Reno.utils.popup.isOpen() ? Reno.utils.popup.close() : Reno.utils.popup.open(this);
				break;
			case 'mouseover':
				Reno.utils.popup.open(this);
				break;
			// case 'focus':
			// 	// TODO
			// 	break;
			case 'mouseout':
				const popup = document.getElementById('reno-popup-container');
				if (!e.relatedTarget || popup && !popup.contains(e.relatedTarget)) {
					Reno.utils.popup.close();
				}
				break;
		}
		e.stopPropagation();
	}
}

customElements.define('reno-popup', RenoPopup);
