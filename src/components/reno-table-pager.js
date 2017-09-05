(function () {
	class RenoTablePager extends HTMLElement {
		// constructor (self) {
		// 	self = super(self);
		// 	self.onClick = self.onClick.bind(self);
		// 	return self;
		// }
		constructor () {
			super();
			this.onClick = this.onClick.bind(this);
		}
		// life-cycle methods
		connectedCallback () {
			this.addEventListener('click', this.onClick);
			this.html = hyperHTML.bind(this);
			this.render();
		}
		disconnectedCallback () {
			this.removeEventListener('click', this.onClick);
		}
		static get observedAttributes () { return ['offset', 'limit', 'total', 'around']; }
		attributeChangedCallback () {
			this.render();
		}
		// custom methods
		render () {
			if (!this.html) return;

			// prepare parameters
			let offset = this.getAttribute('offset');
			let limit  = this.getAttribute('limit');
			let total  = this.getAttribute('total');
			if (offset === null || limit === null || total === null) return;

			offset = Math.max(0, parseInt(offset, 10));
			limit  = Math.max(1, parseInt(limit,  10));
			total  = Math.max(0, parseInt(total,  10));

			const around = Math.max(1, parseInt(this.getAttribute('around') || '2', 10));

			// first/last page offsets
			const firstPageOffset = 0;
			let lastPageOffset = Math.floor(total / limit) * limit;
			if (lastPageOffset >= total) {
				lastPageOffset = total - limit;
			}

			// around page offsets
			const pages = [];
			let currentPage, firstPage, lastPage,
				pageOffset = Math.max(0, Math.min(offset - around * limit, lastPageOffset - 2 * around * limit));
			for (let i = 2 * around + 1; i > 0; --i, pageOffset += limit) {
				if (pageOffset > offset && pageOffset < offset + limit) {
					pageOffset = offset;
				}
				if (pageOffset >= total) {
					break;
				}
				if (pageOffset === offset) {
					currentPage = pages.length;
				}
				if (pageOffset === firstPageOffset) {
					firstPage = pages.length;
				}
				if (pageOffset === lastPageOffset) {
					lastPage = pages.length;
				}
				pages.push(pageOffset);
			}

			const firstPageNumber = Math.floor(pages[0] / limit) + 1;

			const pageList = pages.map((offset, index) => {
				const cssClasses = ['go-page'];
				if (index === currentPage) { cssClasses.push('current'); }
				if (index === firstPage)   { cssClasses.push('first'); }
				if (index === lastPage)    { cssClasses.push('last'); }
				const number = firstPageNumber + index;
				return hyperHTML.wire()`<div class="${cssClasses.join(' ')}" offset="${offset}" reason="${number}">${number}</div>`;
			});

			const firstPageClasses = ['go-first'], lastPageClasses = ['go-last'], prevPageClasses = ['go-prev'], nextPageClasses = ['go-next'];
			if (currentPage === 0)               { prevPageClasses.push('ignore'); firstPageClasses.push('ignore'); }
			if (currentPage == pages.length - 1) { nextPageClasses.push('ignore'); lastPageClasses.push('ignore'); }

			const prevPageOffset = currentPage === 0 ? 0 : pages[currentPage - 1];
			const nextPageOffset = currentPage === pages.length - 1 ? Math.max(0, total - limit) : pages[currentPage + 1];

			this.html`
				<div  class="${firstPageClasses.join(' ')}" offset="${firstPageOffset}" reason="first"></div>
				<div  class="${prevPageClasses.join(' ')}"  offset="${prevPageOffset}"  reason="previous"></div>${
					pageList
				}<div class="${nextPageClasses.join(' ')}"  offset="${nextPageOffset}"  reason="next"></div>
				<div  class="${lastPageClasses.join(' ')}"  offset="${lastPageOffset}"  reason="last"></div>
			`;
		}
		// event handlers
		onClick (e) {
			let node = e.target;
			while (node && node.nodeType != 1) { node = node.parentNode; } // need ELEMENT node
			for (; node && node !== this; node = node.parentNode) {
				const reason = node.getAttribute('reason');
				if (reason) {
					const offset = node.getAttribute('offset');
					if (offset && !node.classList.contains('ignore') && (this.getAttribute('current') !== 'ignore' || offset !== this.getAttribute('offset'))) {
						this.dispatchEvent(new CustomEvent('reno-table-page-selected', {bubbles: true, detail: {reason, offset}}));
						return;
					}
				}
			}
		}
	}
	customElements.define('reno-table-pager', RenoTablePager);
})();
