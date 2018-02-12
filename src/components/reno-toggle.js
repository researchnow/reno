class RenoToggle extends HTMLElement {
  connectedCallback() {
    // create checkbox input
    const input = this.ownerDocument.createElement('input');
    input.type = 'checkbox';
    input.name = this.getAttribute('name') || 'toggle';
    input.checked = this.getAttribute('status') == 'on';
    this.appendChild(input);
    this.handle = on(this, 'click', this);
  }

  disconnectedCallback () {
		this.handle.remove();
  }
  
  handleEvent () {
    const input = this.firstChild;
    switch (this.getAttribute('status')) {
      case 'on':
        this.setAttribute('status', 'off');
        input.checked = false;
        break;
      case 'off':
      default:
        this.setAttribute('status', 'on');
        input.checked = true;
        break;
    }
  }

  // // custom methods
  // get status () { return this.getAttribute('status') }

}

customElements.define('reno-toggle', RenoToggle);