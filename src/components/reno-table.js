(function () {
	const propagateTo = (node, name, value) => {
		node && node[value === null ? 'removeAttribute' : 'setAttribute'](name, value);
	};

	class RenoTable extends HTMLElement {
		constructor () {
			super();
			this.onDataUpdated   = this.onDataUpdated.bind(this);
			this.onSortRequested = this.onSortRequested.bind(this);
			this.onPageSelected  = this.onPageSelected.bind(this);
		}
		// life-cycle callbacks
		connectedCallback () {
			// construct a tree
			this.view = this.ownerDocument.createElement('reno-table-view');
			RenoTable.observedAttributes.forEach(name => propagateTo(this.view, name, this.getAttribute(name)));
			this.view.setAttribute('offset', '0');
			this.appendChild(this.view);
			this.pager   = this.ownerDocument.createElement('reno-table-pager');
			this.counter = this.ownerDocument.createElement('reno-table-counter');
			const div1 = this.ownerDocument.createElement('div'), div2 = this.ownerDocument.createElement('div');
			this.appendChild(div1);
			div1.appendChild(this.pager);
			div1.appendChild(div2);
			div2.appendChild(this.counter);
			// attach events
			this.addEventListener('reno-table-data-updated',   this.onDataUpdated);
			this.addEventListener('reno-table-sort-requested', this.onSortRequested);
			this.addEventListener('reno-table-page-selected',  this.onPageSelected);
		}
		disconnectedCallback () {
			this.removeEventListener('reno-table-data-updated',   this.onDataUpdated);
			this.removeEventListener('reno-table-sort-requested', this.onSortRequested);
			this.removeEventListener('reno-table-page-selected',  this.onPageSelected);
		}
		static get observedAttributes () { return ['limit', 'fields', 'sort', 'filter', 'url', 'labels', 'around']; }
		attributeChangedCallback (attrName, oldVal, newVal) {
			if (attrName === 'around') {
				return propagateTo(this.pager, attrName, newVal);
			}
			propagateTo(this.view, attrName, newVal);
			if (attrName !== 'labels' && attrName !== 'fields') {
				this.view && this.view.setAttribute('offset', '0');
			}
		}
		// event handlers
		onDataUpdated (e) {
			if (this.pager) {
				this.pager.setAttribute('total',  e.detail.total);
				this.pager.setAttribute('offset', e.detail.offset);
				this.pager.setAttribute('limit',  e.detail.limit);
			}
			if (this.counter) {
				this.counter.setAttribute('total',  e.detail.total);
				this.counter.setAttribute('offset', e.detail.offset);
				this.counter.setAttribute('limit',  e.detail.shown);
			}
		}
		onSortRequested (e) {
			if (this.view) {
				this.view.setAttribute('offset', '0');
				switch (e.detail.currentState) {
					case -1:
						this.view.setAttribute('sort', '-' + e.detail.field);
						break;
					case 0:
						this.view.setAttribute('sort', e.detail.field);
						break;
					default:
						this.view.removeAttribute('sort');
						break;
				}
			}
		}
		onPageSelected (e) {
			this.view && this.view.setAttribute('offset', e.detail.offset);
		}
	}
	customElements.define('reno-table', RenoTable);
})();
