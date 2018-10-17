class RenoModal extends HTMLElement {
  open() {
    const content = clone(this.querySelector('.content')),
      title = this.getAttribute('title') || clone(this.querySelector('.title'));
    let buttons = this.getAttribute('buttons');
    if (buttons && typeof buttons == 'string') {
      buttons = buttons.split(/\s*,\s*/g);
    } else {
      buttons = clone(this.querySelector('.buttons'));
    }
    const options = {
      document: this.ownerDocument,
      size: this.getAttribute('size'),
      customClass: this.getAttribute('customclass'),
      content: content,
      title: title,
      buttons: buttons,
      buttonStyle: this.getAttribute('buttonstyle'),
      eventHandler: this.eventHandler
        ? e => this.eventHandler(e, this)
        : e => {
            this.dispatchEvent(
              new CustomEvent('reno-modal-click', {
                bubbles: true,
                detail: {source: e.target, original: e, component: this}
              })
            );
            this.close();
          }
    };
    Reno.utils.modal.open(options);
    return options;
  }
  close() {
    Reno.utils.modal.close(this.ownerDocument);
  }
}

function clone(node) {
  return node && node.cloneNode(true);
}

customElements.define('reno-modal', RenoModal);
