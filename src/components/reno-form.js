(function () {
	'use strict';

	const supportedEvents = {click: 'onClick', input: 'onInput', submit: 'onSubmit'};

	const validityFlags = ['customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderFlow', 'stepMismatch', 'tooLong', 'typeMismatch', 'valid', 'valueMissing'];

	class RenoForm extends HTMLElement {
		// life-cycle callbacks
		connectedCallback () {
			this.handle = on.makeMultiHandle(Object.keys(supportedEvents).map(eventName => on(this, eventName, this)));
			if (this.getAttribute('showmessages') !== null) {
				this.deferredFunction = this.showMessages;
				window.requestAnimationFrame(() => {
					this.deferredFunction && this.deferredFunction.call(this);
					this.deferredFunction = null;
				});
			}
		}
		disconnectedCallback () {
			this.handle.remove();
			this.deferredFunction = null;
		}
		static get observedAttributes () { return ['disabled']; }
		attributeChangedCallback (attrName, oldVal, newVal) {
			if (attrName === 'disabled') {
				const fieldSets = this.querySelectorAll('fieldset'), disabled = newVal !== null;
				for (let i = 0; i < fieldSets.length; ++i) {
					fieldSets[i].disabled = disabled;
				}
			}
		}
		// custom methods
		getElements (clean) {
			const elements = [], forms = this.querySelectorAll('form');
			for (let i = 0; i < forms.length; ++i) {
				const form = forms[i];
				for (let j = 0; j < form.length; ++j) {
					const element = form.elements[j];
					if (!clean || element.name && (element.tagName.toLowerCase() === 'input' && (element.type === 'checkbox' || element.type === 'radio') ? element.checked : true)) {
						elements.push(element);
					}
				}
			}
			return elements;
		}
		getElementsByName (clean) {
			const dict = {};
			this.getElements(clean).forEach(element => dict[element.name] = element);
			return dict;
		}
		getFormData () {
			const form = this.querySelector('form');
			return form && new FormData(form);
		}
		checkValidity () {
			const forms = this.querySelectorAll('form');
			let allValid = true;
			for (let i = 0; i < forms.length; ++i) {
				const valid = forms[i].checkValidity();
				allValid = allValid && valid;
			}
			return allValid;
		}
		reportValidity () {
			const forms = this.querySelectorAll('form');
			let allValid = true;
			for (let i = 0; i < forms.length; ++i) {
				const valid = forms[i].reportValidity();
				allValid = allValid && valid;
			}
			return allValid;
		}
		showElementMessages (node, rootSelector, errorSelector) {
			let element = node;
			if (rootSelector) {
				while (element && element[on.matches] && !element[on.matches](rootSelector)) element = element.parentNode;
				element = element && element[on.matches] ? element : node;
			}
			validityFlags.forEach(flag => {
				element.classList[node.validity[flag] ? 'add' : 'remove']('validity-' + flag);
			});
			if (rootSelector && errorSelector) {
				const errorNode = element.querySelector(errorSelector);
				if (errorNode) {
					while (errorNode.lastChild) errorNode.removeChild(errorNode.lastChild);
					errorNode.appendChild(node.ownerDocument.createTextNode(node.validationMessage));
				}
			}
			return this;
		}
		showFormMessages (form, rootSelector, errorSelector) {
			const elements = form.elements, length = form.length;
			for (let j = 0; j < length; ++j) {
				this.showElementMessages(elements[j], rootSelector, errorSelector);
			}
			return this;
		}
		showMessages () {
			const forms = this.querySelectorAll('form'),
				rootSelector = this.getAttribute('rootselector'),
				errorSelector = this.getAttribute('errorselector');
			for (let i = 0; i < forms.length; ++i) {
				this.showFormMessages(forms[i], rootSelector, errorSelector);
			}
			return this;
		}
		// event handlers
		handleEvent (e) {
			this[supportedEvents[e.type]](e);
		}
		onClick (e) {
			if (e.target[on.matches]('input[type="checkbox"], input[type="radio"]')) {
				this.dispatchEvent(new CustomEvent('reno-form-click', {bubbles: true, detail: {changed: e}}));
			}
		}
		onInput (e) {
			this.showElementMessages(e.target, this.getAttribute('rootselector'), this.getAttribute('errorselector'));
			this.dispatchEvent(new CustomEvent('reno-form-input', {bubbles: true, detail: {changed: e}}));
		}
		onSubmit (e) {
			if (e.target[on.matches]('form')) {
				e.preventDefault();
				this.showFormMessages(e.target, this.getAttribute('rootselector'), this.getAttribute('errorselector'));
				this.dispatchEvent(new CustomEvent('reno-form-submit', {bubbles: true, detail: {form: e, validity: e.target.reportValidity()}}));
			}
		}
	}
	customElements.define('reno-form', RenoForm);
})();
