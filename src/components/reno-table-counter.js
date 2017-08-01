(function () {
	class RenoTableCounter extends HTMLElement {
		// life-cycle methods
		connectedCallback () {
			this.render = hyperHTML.bind(this);
			this.show();
		}
		static get observedAttributes () { return ['offset', 'limit', 'total']; }
		attributeChangedCallback () {
			this.show();
		}
		// custom methods
		show () {
			if (!this.render) return;

			// prepare parameters
			let offset = this.getAttribute('offset');
			let limit  = this.getAttribute('limit');
			let total  = this.getAttribute('total');
			if (offset === null || limit === null || total === null) return;

			offset = Math.max(0, parseInt(offset, 10));
			limit  = Math.max(1, parseInt(limit,  10));
			total  = Math.max(0, parseInt(total,  10));

			this.render`${offset + 1}-${offset + limit} of ${total}`;
		}
	}
	customElements.define('reno-table-counter', RenoTableCounter);
})();
