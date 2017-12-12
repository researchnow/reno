class RenoToggle extends HTMLElement {
  connectedCallback() {
    this.handle = on(this, 'click', this);
  }

  disconnectedCallback () {
		this.handle.remove();
  }
  
  handleEvent () {
    switch (this.getAttribute('status')) {
      case 'on':
        this.setAttribute('status', 'off');
        break;
      case 'off':
      default:
        this.setAttribute('status', 'on');
        break;
    }
  }

  // custom methods
  get status ()     { return this.getAttribute('status') }

}

customElements.define('reno-toggle', RenoToggle);