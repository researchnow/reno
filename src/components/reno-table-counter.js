(function() {
  'use strict';

  class RenoTableCounter extends HTMLElement {
    // life-cycle methods
    connectedCallback() {
      this.render();
    }
    static get observedAttributes() {
      return ['offset', 'limit', 'total'];
    }
    attributeChangedCallback() {
      this.render();
    }
    // custom methods
    render() {
      // prepare parameters
      let offset = this.getAttribute('offset');
      let limit = this.getAttribute('limit');
      let total = this.getAttribute('total');
      if (offset === null || limit === null || total === null) return;

      offset = Math.max(0, +offset);
      limit = Math.max(1, +limit);
      total = Math.max(0, +total);

      this.innerHTML = `<span class="items">${offset + 1}-${Math.min(
        offset + limit,
        total
      )}</span> of <span class="total">${total}</span>`;
    }
  }
  customElements.define('reno-table-counter', RenoTableCounter);
})();
