(function () {
	class RenoSearch extends HTMLElement {
		constructor () {
			super();
			this.onClick  = this.onClick.bind(this);
			this.onChange = this.onChange.bind(this);
			this.onFocus  = this.onFocus.bind(this);
			this.onBlur   = this.onBlur.bind(this);
		}
		// life-cycle callbacks
		connectedCallback () {
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
			this.lastChild.addEventListener('click', this.onClick);
			this.firstChild.addEventListener('change', this.onChange);
			this.firstChild.addEventListener('keyup', this.onChange);
			this.firstChild.addEventListener('focus', this.onFocus);
			this.firstChild.addEventListener('blur', this.onBlur);
		}
		disconnectedCallback () {
			this.lastChild.removeEventListener('click', this.onClick);
			this.firstChild.removeEventListener('change', this.onChange);
			this.firstChild.removeEventListener('keyup', this.onChange);
			this.firstChild.removeEventListener('focus', this.onFocus);
			this.firstChild.removeEventListener('blur', this.onBlur);
			while (this.firstChild) this.removeChild(this.firstChild);
		}
		static get observedAttributes () { return ['name', 'value', 'disabled', 'placeholder']; }
		attributeChangedCallback (attrName, oldVal, newVal) {
			if (!this.firstChild) return;
			if (attrName === 'value') {
				if (newVal !== null) {
					this.firstChild.value = newVal;
					this.classList[newVal ? 'add' : 'remove']('has-value');
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
		get value () {
			return this.firstChild && this.firstChild.value || '';
		}
		set value (x) {
			this.setAttribute('value', x);
		}
		get disabled () {
			return this.firstChild && this.firstChild.disabled || false;
		}
		set disabled (x) {
			this[x ? 'setAttribute' : 'removeAttribute']('disabled', '');
		}
		// event handlers
		onClick (e) {
			if (this.firstChild && this.firstChild.value && this.getAttribute('disabled') === null) {
				this.firstChild.value = '';
				this.lastChild.classList.remove('has-value');
			}
		}
		onChange (e) {
			if (this.firstChild) {
				this.lastChild.classList[this.firstChild.value ? 'add' : 'remove']('has-value');
			}
		}
		onFocus (e) {
			this.classList.add('focused');
		}
		onBlur (e) {
			this.classList.remove('focused');
		}
	}
	customElements.define('reno-search', RenoSearch);
})();
