(function() {
  'use strict';

  const propagateTo = (node, name, value) => {
    node && node[value === null ? 'removeAttribute' : 'setAttribute'](name, value);
  };

  const supportedEvents = {
    'reno-table-data-updated': 'onDataUpdated',
    'reno-table-sort-requested': 'onSortRequested',
    'reno-table-page-selected': 'onPageSelected',
    'reno-table-io-start': 'onIoStart',
    'reno-table-io-done': 'onIoDone'
  };

  class RenoTable extends HTMLElement {
    constructor() {
      super();
      this.view = this.pager = this.counter = null;
    }
    // life-cycle callbacks
    connectedCallback() {
      if (!this.html) this.html = hyperHTML.bind(this);
      this.render();
      Object.keys(supportedEvents).forEach(eventName => this.addEventListener(eventName, this));
    }
    disconnectedCallback() {
      this.view = this.pager = this.counter = null;
      this.html``; // hack to reset a template
      Object.keys(supportedEvents).forEach(eventName => this.removeEventListener(eventName, this));
    }
    static get observedAttributes() {
      return ['offset', 'limit', 'fields', 'sort', 'filter', 'url', 'labels', 'nocolgroup', 'around'];
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
      if (attrName === 'around') {
        return propagateTo(this.pager, attrName, newVal);
      }
      propagateTo(this.view, attrName, newVal);
      if (attrName !== 'labels' && attrName !== 'fields' && attrName !== 'offset') {
        this.view && this.view.setAttribute('offset', '0');
      }
    }
    // custom methods
    refresh() {
      this.view && this.view.io();
      return this;
    }
    redraw() {
      this.view && this.view.render();
      return this;
    }
    render() {
      this.html`
				<reno-content-switcher obscureClass="reno-obscuring" revealClass="reno-revealing">
					<div class="normal">
						<div class="border-wrap"><reno-table-view></reno-table-view></div>
					</div>
					<div class="page empty">
						<div class="strong">This table is empty.</div>
						<div>Try to populate it first.</div>
					</div>
					<div class="page overfiltered">
						<div class="strong">There are no items that match the search terms.</div>
					</div>
					<div class="page error">
						<div class="strong">I/O error. Please try again later.</div>
						<div>The support team is automatically notified.</div>
					</div>
					<div class="page spinner"><div class="reno-spinner">Loading&hellip;;</div></div>
				</reno-content-switcher>
				<div class="control-bar">
					<reno-table-pager></reno-table-pager>
					<div><reno-table-counter></reno-table-counter></div>
				</div>
			`;
      if (!this.view) {
        this.view = this.querySelector('reno-table-view');
        this.pager = this.querySelector('reno-table-pager');
        this.counter = this.querySelector('reno-table-counter');
        RenoTable.observedAttributes.forEach(name => propagateTo(this.view, name, this.getAttribute(name)));
      }
      return this;
    }
    // event handlers
    handleEvent(e) {
      this[supportedEvents[e.type]](e);
    }
    onDataUpdated(e) {
      if (this.pager) {
        this.pager.setAttribute('total', e.detail.total);
        this.pager.setAttribute('offset', e.detail.offset);
        this.pager.setAttribute('limit', e.detail.limit);
      }
      if (this.counter) {
        this.counter.setAttribute('total', e.detail.total);
        this.counter.setAttribute('offset', e.detail.offset);
        this.counter.setAttribute('limit', e.detail.shown);
      }
      const contentSwitcher = this.querySelector('reno-content-switcher'),
        controlBar = this.querySelector('.control-bar');
      contentSwitcher &&
        contentSwitcher.reveal(e.detail.total ? '.normal' : this.getAttribute('filter') ? '.overfiltered' : '.empty');
      if (e.detail.total) {
        controlBar.classList.remove('hidden');
        contentSwitcher && contentSwitcher.reveal('.normal');
      } else {
        controlBar.classList.add('hidden');
        contentSwitcher && contentSwitcher.reveal(this.getAttribute('filter') ? '.overfiltered' : '.empty');
      }
    }
    onSortRequested(e) {
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
    onPageSelected(e) {
      this.view && this.view.setAttribute('offset', e.detail.offset);
    }
    onIoStart() {
      const contentSwitcher = this.querySelector('reno-content-switcher');
      if (contentSwitcher) {
        contentSwitcher.obscure(0.9);
        this.pager && this.pager.setAttribute('disabled', true);
        this.counter && this.counter.setAttribute('disabled', true);
      }
    }
    onIoDone(e) {
      if (e.detail.error) {
        const contentSwitcher = this.querySelector('reno-content-switcher');
        contentSwitcher && contentSwitcher.reveal('.error');
      } else {
        this.pager && this.pager.removeAttribute('disabled');
        this.counter && this.counter.removeAttribute('disabled');
      }
    }
  }
  customElements.define('reno-table', RenoTable);
})();
