import { openPopup, closePopup } from "./reno-popup-actions";

(function() {
	class RenoPopup extends HTMLElement {

		connectedCallback () {
			// create label
			// const tempContainer = this.ownerDocument.createElement('div');
			// tempContainer.innerHTML = this.getAttribute('label');
			// while (tempContainer.firstChild) {
			// 	this.appendChild(tempContainer.firstChild);
			// }
			// this.appendChild(tempContainer.firstChild);
			// console.log(document.querySelector('reno-popup').childNodes);
			// console.log(this.childNodes);
			// adjust children styles
			// TODO: sticky - the popup can stay open, until ...?
			const sticky = this.getAttribute('sticky');
			// listen to events on the entire component
			switch(this.getAttribute('trigger')) {
				case 'click':
					this.addEventListener('click', this);
					// TODO
					break;
				case 'focus':
					this.addEventListener('focus', this);
					// TODO
					break;
				case 'mouseover':
				default:
					this.addEventListener('mouseover', this);
					this.addEventListener('mouseout', this);
			}
		}
		disconnectedCallback () {

		}
		attributeChangedCallback (attrName, oldVal, newVal) {

		}
		handleEvent (e) {
			const trigger = this.getAttribute('trigger') || 'mouseover';
			switch (e.type) {
				case trigger:
					// retrieve content...
					const content = this.querySelector('.content');
					// open popup with reno-popup passed in
					openPopup(this, content.cloneNode(true));
					break;
				case 'mouseout':
					closePopup();
					break;
			}
		}

	}
	customElements.define('reno-popup', RenoPopup);

})();
