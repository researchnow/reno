class RenoProgress extends HTMLElement {
  connectedCallback() {
    // create progress and bar elements
    this.progressElement = this.ownerDocument.createElement('div');
    this.progressElement.classList.add('reno-progress');
    this.barElement = this.ownerDocument.createElement('div');
    this.barElement.classList.add('reno-progress-bar');
    this.progressElement.appendChild(this.barElement);
    this.appendChild(this.progressElement);

    this.updateProgress(this.getAttribute('progress'));
  }

  static get observedAttributes() { return ['progress']; }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'progress') this.updateProgress(newVal);
  }

  updateProgress(progress) {
    if (!(this.barElement && this.progressElement)) return;
    switch(true) {
      case progress === 'pending':
      case progress === 'reverse-pending':
        this.barElement.classList.add(progress);
        break;
      case !isNaN(parseFloat(progress)):
        // clean up pending states
        this.barElement.classList.remove('pending');
        this.barElement.classList.remove('reverse-pending');
        // set bar width
        const progressWidth = parseFloat(getComputedStyle(this.progressElement).width);
        const barWidth = progressWidth * parseFloat(progress) / 100;
        this.barElement.style.width = barWidth + 'px';
        // make the right end of the bar round
        if (progressWidth - barWidth < 8) this.barElement.classList.add('round');
        else this.barElement.classList.remove('round');
        break;
      default:
        this.barElement.classList.add('pending');
        break;
    }
  }
}

customElements.define('reno-progress', RenoProgress);