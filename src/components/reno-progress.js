class RenoProgress extends HTMLElement {
	connectedCallback() {
		this.barElement = this.ownerDocument.createElement('div');
		this.appendChild(this.barElement);
		this.updateProgress(this.getAttribute('progress'));
	}

	static get observedAttributes() {
		return ['progress'];
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		if (attrName === 'progress') this.updateProgress(newVal);
	}

	updateProgress(progress) {
		if (!this.barElement) return;
		if (progress === 'pending' || progress === 'reverse-pending') {
			this.barElement.classList.add(progress);
		} else {
			const value = parseFloat(progress);
			if (isNaN(value)) {
				this.barElement.classList.add('pending');
			} else {
				// clean up pending states
				this.barElement.classList.remove('pending');
				this.barElement.classList.remove('reverse-pending');
				// set bar width
				const progressWidth = parseFloat(getComputedStyle(this).width);
				const barWidth = (progressWidth * value) / 100;
				this.barElement.style.width = barWidth + 'px';
				// make the right end of the bar round
				this.barElement.classList[progressWidth - barWidth < 8 ? 'add' : 'remove']('round');
			}
		}
	}
}

customElements.define('reno-progress', RenoProgress);
