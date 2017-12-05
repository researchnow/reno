import { openPopup, closePopup } from "./reno-popup-actions";

(function() {
	class RenoPopup extends HTMLElement {
		connectedCallback () {
			// listen to events on the entire component
			switch(this.getAttribute('trigger')) {
				case 'click':
					this.handle = on(document, 'click', this);
					break;
				// case 'focus':
				// 	this.handle = on(this, 'focus', this);
				// 	break;
				default:
				// case 'mouseover':
					this.handle = on.makeMultiHandle([
						on(this, 'mouseover', this),
						on(this, 'mouseout', this)
					]);
			}
		}
		disconnectedCallback () {
			this.handle.remove();
		}
		handleEvent (e) {
			const isOpen = document.querySelector('#reno-popup-container').classList.contains('open');

			// handle events
			const trigger = this.getAttribute('trigger') || 'mouseover';
			if (trigger !== e.type && (trigger !== 'mouseover' || e.type !== 'mouseout')) return;

			switch (e.type) {
				case 'click':
					// clicking anywhere except the popup container will close
					isOpen && !on.closest(e.target, '#reno-popup-container') && closePopup();
					// clicking only the popup component will open
					!isOpen && this.contains(e.target) && openPopup(this);
					break;
				case 'focus':
					// TODO
					break;
				case 'mouseover':
					openPopup(this);
					break;
				case 'mouseout':
					if (!e.relatedTarget || !on.closest(e.relatedTarget, '#reno-popup-container')) {
						closePopup();
					}
					break;
			}
			e.stopPropagation();
			e.stopImmediatePropagation();
			// e.preventDefault();
		}
	}
	customElements.define('reno-popup', RenoPopup);
})();
