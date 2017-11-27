import { openPopup, closePopup } from "./reno-popup-actions";

(function() {
	class RenoPopup extends HTMLElement {
		connectedCallback () {
			// listen to events on the entire component
			switch(this.getAttribute('trigger')) {
				case 'click':
					document.addEventListener('click', this);
					// TODO
					break;
				case 'focus':
					this.addEventListener('focus', this);
					// TODO
					break;
				default:
				// case 'mouseover':
					this.addEventListener('mouseover', this);
					this.addEventListener('mouseout', this);
			}
		}
		handleEvent (e) {
			const isOpen = document.querySelector('#reno-popup-container').classList.contains('open');

			// handle events
			const trigger = this.getAttribute('trigger') || 'mouseover';
			if (trigger !== e.type && (trigger !== 'mouseover' || e.type !== 'mouseout')) return;

			switch (e.type) {
				case 'click':
					// clicking anywhere except the popup container will close
					isOpen && !e.target.closest('#reno-popup-container') && closePopup();
					// clicking only the popup component will open
					!isOpen && e.target.closest('reno-popup') && openPopup(this);
					break;
				case 'focus':
					// TODO
					break;
				case 'mouseover':
					openPopup(this);
					break;
				case 'mouseout':
					if (!e.relatedTarget || !e.relatedTarget.closest('#reno-popup-container')) {
						closePopup();
					}
					break;
			}
		}

	}
	customElements.define('reno-popup', RenoPopup);
})();
