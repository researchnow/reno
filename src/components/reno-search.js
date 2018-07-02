(function () {
	'use strict';

	const supportedEvents = {click: 0, change: 0, focus: 0, blur: 0, keyup: 'onChange'},
		firstChildEvents = ['change', 'keyup', 'focus', 'blur'];

	class RenoSearch extends HTMLElement {
		// life-cycle callbacks
		connectedCallback () {
			// render representation
			const name = this.getAttribute('name'), value = this.getAttribute('value'),
				disabled = this.getAttribute('disabled'), placeholder = this.getAttribute('placeholder');
			const input = this.ownerDocument.createElement('input');
			input.type = 'text';
			if (name !== null) input.setAttribute('name', name);
			if (value !== null) input.value = value;
			input.disabled = disabled !== null;
			if (placeholder !== null) input.setAttribute('placeholder', placeholder);
			const span = this.ownerDocument.createElement('span');
			span.innerHTML = '&nbsp;';
			value && span.classList.add('has-value');
			this.appendChild(input);
			this.appendChild(span);
			// initialize the internal state
			this._previousValue = value || '';
			// attach events
			this.lastChild.addEventListener('click', this);
			firstChildEvents.forEach(eventName => this.firstChild.addEventListener(eventName, this));
		}
		disconnectedCallback () {
			// detach events
			this.lastChild.removeEventListener('click', this);
			firstChildEvents.forEach(eventName => this.firstChild.removeEventListener(eventName, this));
			// destroy representation
			while (this.firstChild) this.removeChild(this.firstChild);
		}
		static get observedAttributes () { return ['name', 'value', 'disabled', 'placeholder']; }
		attributeChangedCallback (attrName, oldVal, newVal) {
			if (!this.firstChild) return;
			if (attrName === 'value') {
				if (newVal) {
					this.firstChild.value = this._previousValue = newVal;
					this.lastChild.classList[newVal ? 'add' : 'remove']('has-value');
				} else {
					this.firstChild.value = this._previousValue = '';
					this.lastChild.classList.remove('has-value');
				}
			} else if (attrName === 'disabled') {
				this.firstChild.disabled = newVal !== null;
			} else if (attrName === 'placeholder') {
				this.firstChild[newVal === null ? 'removeAttribute' : 'setAttribute']('placeholder', newVal);
			} else if (attrName === 'name') {
				this.firstChild[newVal === null ? 'removeAttribute' : 'setAttribute']('name', newVal);
			}
		}
		// custom methods
		get value ()     { return this.firstChild && this.firstChild.value || ''; }
		set value (x)    { this.setAttribute('value', x || ''); }
		get disabled ()  { return this.firstChild && this.firstChild.disabled || false; }
		set disabled (x) { this[x ? 'setAttribute' : 'removeAttribute']('disabled', ''); }
		notifyAboutChange () {
      this.dispatchEvent(new CustomEvent('reno-change', {bubbles: true, detail: {value: this.firstChild.value}}));
      return this;
		}
		// event handlers
		handleEvent (e) {
			let name = supportedEvents[e.type];
			if (name === 0) {
				name = 'on' + e.type.charAt(0).toUpperCase() + e.type.substr(1).toLowerCase();
			}
			if (typeof name == 'string' && typeof this[name] == 'function') {
				this[name](e);
			}
		}
		onClick (e) {
			if (e.target == this.lastChild && this.firstChild && this.firstChild.value && this.getAttribute('disabled') === null) {
				this.firstChild.value = this._previousValue = '';
				this.lastChild.classList.remove('has-value');
				this.notifyAboutChange();
			}
		}
		onChange (e) {
			if (this.firstChild) {
				if (this._previousValue === this.firstChild.value) return;
				this._previousValue = this.firstChild.value;
				this.lastChild.classList[this.firstChild.value ? 'add' : 'remove']('has-value');
				this.notifyAboutChange();
			}
		}
		onFocus (e) { this.classList.add('focused'); }
		onBlur (e)  { this.classList.remove('focused'); }
	}
	customElements.define('reno-search', RenoSearch);
})();
