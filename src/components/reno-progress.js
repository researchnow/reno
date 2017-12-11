class RenoProgress extends HTMLElement {
  connectedCallback() {
    this.progressElement = this.ownerDocument.createElement('div');
    this.progressElement.classList.add('reno-progress');
    this.barElement = this.ownerDocument.createElement('div');
    this.barElement.classList.add('reno-progress-bar');
    this.progressElement.appendChild(this.barElement);
    this.appendChild(this.progressElement);

    this.updateProgress(this.getAttribute('progress'));
  }

  static get observedAttributes() {return ['progress']; }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'progress') this.updateProgress(newVal);
  }

  updateProgress(progress) {
    switch(true) {
      case progress === 'pending':
      case progress === 'reverse-pending':
        if (this.barElement) this.barElement.classList.add(progress);
        break;
      case !isNaN(parseFloat(progress)):
        if (this.barElement) this.barElement.style.width = parseFloat(progress) + 'px';
        break;
    }
  }

  disconnectedCallback() {
    // this.ownerDocument.removeChild(this.progressContainer)
  }
}

customElements.define('reno-progress', RenoProgress);