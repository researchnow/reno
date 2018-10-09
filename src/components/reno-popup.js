let handleClick = null;

class RenoPopup extends HTMLElement {
	connectedCallback () {
		if (!handleClick) {
			handleClick = on(document, 'click', Reno.utils.popup.hidePopup);
		}
		// listen to events on the entire component
		switch(this.getAttribute('trigger')) {
			case 'click':
				this.handle = on(this, 'click', this);
				break;
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
				Reno.utils.popup.isOpen() ? this.close() : this.open();
				break;
			case 'mouseover':
				this.open();
				break;
			case 'mouseout':
				const popup = this.ownerDocument.getElementById('reno-popup-container');
				if (!e.relatedTarget || popup && !popup.contains(e.relatedTarget)) {
					this.close();
				}
				break;
		}
		e.stopPropagation();
  }
  open() {
    const options = {
      document: this.ownerDocument,
      anchor: this,
      content: clone(this.querySelector('.content')),
      loading: clone(this.querySelector('.loading')),
      placement: this.getAttribute('placement'),
      alignment: this.getAttribute('alignment')
    };
    Reno.utils.popup.open(options);
    return options;
  }
  close() {
    Reno.utils.popup.close();
  }
}

function clone(node) {
  return node && node.cloneNode(true);
}

customElements.define('reno-popup', RenoPopup);
