(function () {
	const debounce = f => {
		let flag;
		return () => {
			if (!flag) {
				flag = true;
				window.requestAnimationFrame(() => { flag = false; f(); });
			}
		}
	}
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
			this.onClick = this.onClick.bind(this);
			this.io = debounce(this.io.bind(this));
		}
		// life-cycle callbacks
		connectedCallback () {
			this.addEventListener('click', this.onClick);
			this.render = hyperHTML.bind(this);
			this.io();
		}
		disconnectedCallback () {
			this.removeEventListener('click', this.onClick);
		}
		static get observedAttributes () { return ['offset', 'limit', 'fields', 'sort', 'filter', 'url', 'labels', 'nocolgroup']; }
		attributeChangedCallback (attrName, oldVal, newVal) {
			if (attrName === 'labels' || attrName === 'nocolgroup') {
				return this.show();
			}
			if (attrName === 'fields') {
				this.fieldList = (newVal || 'name').split(',').map(field => field.trim());
				this.fieldMap = {};
				this.fieldList.forEach(field => {
					const start = field.charAt(0) === '-' ? 1 : 0;
					this.fieldMap[field] = field.charAt(start).toUpperCase() + field.substr(start + 1).replace(/_|\-/g, ' ');
				});
			}
			this.io();
		}
		// custom methods
		show () {
			if (!this.render) return;

			// prepare parameters
			const offset = Math.max(0, parseInt(this.getAttribute('offset') ||  '0',  10));
			const limit  = Math.max(1, parseInt(this.getAttribute('limit')  || '10',  10));
			const labels = this.getAttribute('labels') !== null;
			const noColGroup = this.getAttribute('nocolgroup') !== null;

			const sortList = {};
			(this.getAttribute('sort') || '').split(',').forEach(field => field.charAt(0) === '-' ? (sortList[field.substr(1)] = 'descending') : (sortList[field] = 'ascending'));

			// prepare the colgroup
			let cols;
			if (!noColGroup) {
				cols = this.fieldList.map(field => {
					const cssClasses = 'field-' + field + (typeof sortList[field] == 'string' ? ' ' + sortList[field] : '');
					return hyperHTML.wire()`<col class="${cssClasses}"></col>`;
				});
			}

			// prepare the header
			const headRowCells = this.fieldList.map(field => {
				const cssClasses = 'td field-' + field + (typeof sortList[field] == 'string' ? ' ' + sortList[field] : '');
				return hyperHTML.wire()`<div class="${cssClasses}" field="${field}"><span>${this.fieldMap[field]}</span></div>`;
			});
			const header = hyperHTML.wire()`<div class="thead"><div class="tr">${headRowCells}</div></div>`;

			// prepare the body
			const bodyRows = this.page.data.map(o => {
				const bodyRowCells = this.fieldList.map(labels
					? field => hyperHTML.wire()`<div class="${'td field-' + field}"><div class="label">${this.fieldMap[field]}</div><div class="value">${this.formatFieldValue(o, field)}</div></div>`
					: field => hyperHTML.wire()`<div class="${'td field-' + field}">${this.formatFieldValue(o, field)}</div>`);
				return hyperHTML.wire(o)`<div class="tr">${bodyRowCells}</div>`;
			});

			// prepare the footer
			const footer = ''; // no footer for now

			// assemble everything together
			if (cols) {
				this.render`<colgroup>${cols}</colgroup>${header}<div class="tbody">${bodyRows}</div>${footer}`;
			} else {
				this.render`${header}<div class="tbody">${bodyRows}</div>${footer}`;
			}
		}
		io () {
			// prepare parameters
			const url = this.getAttribute('url');
			if (!url || !this.fieldList) return;

			const offset = Math.max(0, parseInt(this.getAttribute('offset') ||  '0',  10));
			const limit  = Math.max(1, parseInt(this.getAttribute('limit')  || '10',  10));
			const fields = this.fieldList.filter(field => field.charAt(0) !== '-').join(',');
			const filter = this.getAttribute('filter');
			const sort   = this.getAttribute('sort');

			// submit an I/O request
			const request = {limit, offset, fields};
			if (filter) { request.filter = filter; }
			if (sort) { request.sort = sort; }
			heya.io.get(url, this.sanitizeRequest(request)).then(page => {
				page = this.sanitizeResponse(page);
				this.page  = page instanceof Array ? {data: page} : page;
				this.total = this.page.total;
				this.realOffset = this.page.offset;
				this.realLimit  = this.page.data.length;
				this.show();
				this.dispatchEvent(new CustomEvent('reno-table-data-updated', {bubbles: true, detail: {limit, total: this.total, offset: this.realOffset, shown: this.realLimit}}));
			});
		}
		// event handlers
		onClick (e) {
			let node = e.target;
			while (node && node.nodeType != 1) { node = node.parentNode; } // need ELEMENT node
			for (; node && node !== this; node = node.parentNode) {
				const field = node.getAttribute('field');
				if (field) { // process sorting events
					const currentState = node.classList.contains('ascending') ? -1 : node.classList.contains('descending') ? 1 : 0;
					this.dispatchEvent(new CustomEvent('reno-table-sort-requested', {bubbles: true, detail: {field, currentState}}));
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
		formatFieldValue (o, field) { return field.charAt(0) === '-' ? '<em>&mdash;</em>' : o[field]; }
		sanitizeRequest (request) { return request; }
		sanitizeResponse (response) { return response; }
	}
	customElements.define('reno-table-view', RenoTableView);
})();
