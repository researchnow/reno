(function () {
	'use strict';

	const debounce = f => {
		let flag;
		return () => {
			if (!flag) {
				flag = true;
				window.requestAnimationFrame(() => { flag = false; f(); });
			}
		}
	}

	const activeElements = {button: 1, input: 1, textarea: 1, a: 1, label: 1};

	const primitives = {string: 1, number: 1, boolean: 1};

	const renderValue = value => primitives[typeof value] ? {html: value} : typeof value == 'function' ? value() : value;

	class RenoTableView extends HTMLElement {
		// constructor (self) {
		// 	self = super(self);
		// 	self.page = {data: []};
		// 	self.onClick = self.onClick.bind(self);
		// 	return self;
		// }
		constructor () {
			super();
			this.page = {data: []};
			this.blacklistedAttributes = {};
			this.onClick = this.onClick.bind(this);
			this.io = debounce(this.io.bind(this));
		}
		// life-cycle callbacks
		connectedCallback () {
			if (!this.html) this.html = hyperHTML.bind(this);
			this.addEventListener('click', this.onClick);
			this.io();
		}
		disconnectedCallback () {
			this.removeEventListener('click', this.onClick);
		}
		static get observedAttributes () { return ['offset', 'limit', 'fields', 'sort', 'filter', 'url', 'labels', 'nocolgroup']; }
		attributeChangedCallback (attrName, oldVal, newVal) {
			if (this.blacklistedAttributes[attrName] == 1) {
				// skip an attribute
				this.blacklistedAttributes[attrName] = 0;
				return;
			}
			if (attrName === 'labels' || attrName === 'nocolgroup') {
				return this.render();
			}
			if (attrName === 'fields') {
				this.fieldList = (newVal || 'name').split(',').map(field => field.trim());
				this.fieldMap = this.fieldMap || {};
				this.fieldList.forEach(field => {
					if (!Object.prototype.hasOwnProperty.call(this.fieldMap, field)) {
						const start = field.charAt(0) === '-' ? 1 : 0;
						this.fieldMap[field] = field.charAt(start).toUpperCase() + field.substr(start + 1).replace(/_|\-/g, ' ');
					}
				});
			}
			this.io();
		}
		// custom methods
		setAttributeSilently (attrName, value) {
			this.blacklistedAttributes[attrName] = 1;
			this.setAttribute(attrName, value);
		}
		render () {
			if (!this.html) return;

			// prepare parameters
			const labels = this.getAttribute('labels') !== null;
			const noColGroup = this.getAttribute('nocolgroup') !== null;

			const sortList = {};
			(this.getAttribute('sort') || '').split(',').forEach(field => field.charAt(0) === '-' ? (sortList[field.substr(1)] = 'descending') : (sortList[field] = 'ascending'));

			// prepare the colgroup
			let cols = [];
			if (!noColGroup) {
				cols = this.fieldList.map(field => {
					const cssClasses = 'field-' + field + (typeof sortList[field] == 'string' ? ' ' + sortList[field] : '');
					return hyperHTML.wire()`<col class="${cssClasses}"></col>`;
				});
				cols = hyperHTML.wire()`<colgroup>${cols}</colgroup>`;
			}

			// prepare the header
			const headRowCells = this.fieldList.filter(field => this.fieldMap[field] !== null).map(field => {
				const cssClasses = 'td field-' + field + (typeof sortList[field] == 'string' ? ' ' + sortList[field] : '');
				let fieldName = this.fieldMap[field];
				if (fieldName === undefined) fieldName ='<em>' + field + '</em>';
				return hyperHTML.wire()`<div class="${cssClasses}" field="${field}"><span>${renderValue(fieldName)}</span></div>`;
			});
			const header = hyperHTML.wire()`<div class="thead"><div class="tr">${headRowCells}</div></div>`;

			// prepare the body
			const bodyRows = this.page.data.map(o => {
				const bodyRowCells = this.fieldList.filter(field => this.fieldMap[field] !== null).map(field => {
					const value = this.formatFieldValue(o, field);
					if (labels) {
						let fieldName = this.fieldMap[field];
						if (fieldName === undefined) fieldName ='<em>' + field + '</em>';
						return hyperHTML.wire()`<div class="${'td field-' + field}">
							<div class="label">${renderValue(fieldName)}</div>
							<div class="value">${renderValue(value)}</div></div>`;
					}
					return hyperHTML.wire()`<div class="${'td field-' + field}">${typeof value == 'object' ? value : {html: value}}</div>`;
				});
				return hyperHTML.wire(o)`<div class="tr">${bodyRowCells}</div>`;
			});

			// prepare the footer
			const footer = ''; // no footer for now

			// assemble everything together
			this.html`${cols}${header}<div class="tbody">${bodyRows}</div>${footer}`;
		}
		io () {
			// prepare parameters
			const url = this.getAttribute('url');
			if (!url || !this.fieldList) return;

			const offset = Math.max(0, +(this.getAttribute('offset') ||  '0'));
			const limit  = Math.max(1, +(this.getAttribute('limit')  || '10'));
			const fields = this.fieldList.filter(field => field.charAt(0) !== '-').join(',');
			const filter = this.getAttribute('filter');
			const sort   = this.getAttribute('sort');

			// submit an I/O request
			const request = {limit, offset, fields};
			if (filter) { request.filter = filter; }
			if (sort) { request.sort = sort; }
			this.dispatchEvent(new CustomEvent('reno-table-io-start', {bubbles: true, detail: {}}));
			heya.io(this.sanitizeRequest({url: url, method: 'GET', query: request})).then(page => {
				page = this.sanitizeResponse(page);
				this.page  = page instanceof Array ? {data: page} : page;
				this.total = this.page.total;
				this.realOffset = this.page.offset;
				this.realLimit  = this.page.data.length;
				if (typeof this.realOffset == 'number' && offset != this.realOffset) {
					this.setAttributeSilently('offset', this.realOffset);
				}
				this.render();
				this.dispatchEvent(new CustomEvent('reno-table-data-updated', {bubbles: true, detail: {limit, total: this.total, offset: this.realOffset, shown: this.realLimit}}));
				this.dispatchEvent(new CustomEvent('reno-table-io-done', {bubbles: true, detail: {error: null}}));
			}).catch(e => {
				this.dispatchEvent(new CustomEvent('reno-table-io-done', {bubbles: true, detail: {error: e}}));
			});
		}
		// event handlers
		onClick (e) {
			let node = e.target;
			while (node && node.nodeType != 1) { node = node.parentNode; } // need ELEMENT node
			for (; node && node !== this; node = node.parentNode) {
				if (node.classList.contains('ignore-click') || activeElements[node.tagName.toLowerCase()] === 1 && !node.classList.contains('include-click')) break;
				const field = node.getAttribute('field');
				if (field) { // process sorting events
					if (field.charAt(0) !== '-') { // ignore technical fields
						const currentState = node.classList.contains('ascending') ? -1 : node.classList.contains('descending') ? 1 : 0;
						this.dispatchEvent(new CustomEvent('reno-table-sort-requested', {bubbles: true, detail: {field, currentState}}));
					}
					return;
				}
				if (node.classList.contains('tr')) {
					const parent = node.parentNode;
					if (parent.classList.contains('tbody')) { // process selection events
						for (let i = 0; i < parent.childNodes.length; ++i) {
							if (parent.childNodes[i] === node) {
								this.dispatchEvent(new CustomEvent('reno-table-item-selected', {bubbles: true, detail: {item: this.page.data[i]}}));
								return;
							}
						}
					}
				}
			}
		}
		// user-supplied callbacks
		// fieldMap is a map of names to form the header
		formatFieldValue (o, field) { return field.charAt(0) === '-' ? '<em>&mdash;</em>' : o[field]; }
		sanitizeRequest (request) { return request; }
		sanitizeResponse (response) { return response; }
	}
	customElements.define('reno-table-view', RenoTableView);
})();
