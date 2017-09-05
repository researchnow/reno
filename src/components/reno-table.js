(function () {
	const propagateTo = (node, name, value) => {
		node && node[value === null ? 'removeAttribute' : 'setAttribute'](name, value);
	};

	const supportedEvents = {'reno-table-data-updated': 'onDataUpdated', 'reno-table-sort-requested': 'onSortRequested', 'reno-table-page-selected': 'onPageSelected',
		'reno-table-io-start': 'onIoStart', 'reno-table-io-done': 'onIoDone'};

	class RenoTable extends HTMLElement {
		// life-cycle callbacks
		connectedCallback () {
			if (!this.html) this.html = hyperHTML.bind(this);
			this.render();
			Object.keys(supportedEvents).forEach(eventName => this.addEventListener(eventName, this));
		}
		disconnectedCallback () {
			Object.keys(supportedEvents).forEach(eventName => this.removeEventListener(eventName, this));
		}
		static get observedAttributes () { return ['limit', 'fields', 'sort', 'filter', 'url', 'labels', 'nocolgroup', 'around']; }
		attributeChangedCallback (attrName, oldVal, newVal) {
			if (attrName === 'around') {
				return propagateTo(this.pager, attrName, newVal);
			}
			propagateTo(this.view, attrName, newVal);
			if (attrName !== 'labels' && attrName !== 'fields') {
				this.view && this.view.setAttribute('offset', '0');
			}
		}
		// custom methods
		refresh () {
			this.view && this.view.io();
		}
		render () {
			const filter = this.getAttribute('filter');
			this.html`
				<div class="normal">
					<reno-table-view></reno-table-view>
					<div>
						<reno-table-pager></reno-table-pager>
						<div><reno-table-counter></reno-table-counter></div>
					</div>
				</div>
				<div class="empty">
					<div class="line1">${filter ? 'There are no items that match the search term(s).' : 'This table is empty.'}</div>
					<div class="line2">${filter ? 'Try refining your serch term(s) or broaden your search.' : 'Try to populate it first.'}</div>
				</div>
				<div class="error">
					<div class="line1">I/O error. Please try again later.</div>
					<div class="line2">The support team is automatically notified.</div>
				</div>
				<div class="loading">Loading...</div>
			`;
			if (!this.view) {
				this.view    = this.querySelector('reno-table-view');
				this.pager   = this.querySelector('reno-table-pager');
				this.counter = this.querySelector('reno-table-counter');
				RenoTable.observedAttributes.forEach(name => propagateTo(this.view, name, this.getAttribute(name)));
				this.view.setAttribute('offset', '0');
			}
		}
		// event handlers
		handleEvent (e) {
			this[supportedEvents[e.type]](e);
		}
		onDataUpdated (e) {
			this.classList.remove('loading');
			this.classList.add(e.detail.total ? 'normal' : 'empty');
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
		onIoStart () {
			this.classList.remove('normal');
			this.classList.remove('empty');
			this.classList.remove('error');
			this.classList.add('loading');
			this.render();
		}
		onIoDone (e) {
			this.classList.remove('loading');
			e.detail.error && this.classList.add('error');
			this.render();
		}
	}
	customElements.define('reno-table', RenoTable);
})();
