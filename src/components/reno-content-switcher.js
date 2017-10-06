(function () {
	'use strict';

	let matches;
	['matches', 'matchesSelector', 'webkit', 'moz', 'ms', 'o'].some(name => {
		if (name.length < 7) { // prefix
			name += 'MatchesSelector';
		}
		if (Element.prototype[name]) {
			matches = name;
			return true;
		}
		return false;
	});

	class RenoContentSwitcher extends HTMLElement {
		connectedCallback () {
			this.addEventListener('transitionend', this);
		}
		disconnectedCallback () {
			this.removeEventListener('transitionend', this);
		}
		// custom methods
		obscure (opacity=1, display='flex') {
			const curtain = this.lastElementChild,
				obscureClass = this.getAttribute('obscureClass'),
				revealClass  = this.getAttribute('revealClass');
			if (revealClass)  curtain.classList.remove(revealClass);
			if (obscureClass) curtain.classList.add(obscureClass);

			curtain.style.display = display;

			if (this.notFirstRun) {
				if (this.offsetParent) {
					const boxTo = curtain.getBoundingClientRect();
					this.style.height = boxTo.height + 'px';
				} else {
					this.style.height = 'auto';
				}
			}

			const oldOpacity = getComputedStyle(curtain).getPropertyValue('opacity'); // needed to sync
			curtain.style.opacity = opacity;
			this.state = 'obscuring';
		}
		reveal (selector) {
			const selected = this.selectPages(selector);
			if (!selected) return;

			selected.style.display = 'block';
			this.hideOthers(selected);

			if (this.notFirstRun) {
				if (this.offsetParent) {
					const boxTo = selected.getBoundingClientRect(), boxFrom = this.getBoundingClientRect();
					if (boxTo.height !== boxFrom.height) {
						this.style.height = boxTo.height + 'px';
					}
				} else {
					this.style.height = 'auto';
				}
			} else {
				this.notFirstRun = true;
			}

			const curtain = this.lastElementChild,
				obscureClass = this.getAttribute('obscureClass'),
				revealClass  = this.getAttribute('revealClass');
			if (obscureClass) curtain.classList.remove(obscureClass);
			if (revealClass)  curtain.classList.add(revealClass);

			if (!this.offsetParent) {
				return this.revealNow();
			}

			const oldOpacity = getComputedStyle(curtain).getPropertyValue('opacity'); // needed to sync
			if (oldOpacity === '0') {
				curtain.style.display = 'none';
				this.state = '';
			}

			curtain.style.opacity = 0;
			this.state = 'revealing';
		}
		revealNow () {
			const curtain = this.lastElementChild;
			curtain.style.display = 'none';
			curtain.style.opacity = 0;
			this.style.height = 'auto';
			this.state = '';
		}
		selectPages (selector) {
			let selected;
			for (let page = this.firstElementChild; page; page = page.nextElementSibling) {
				if (page[matches](selector)) {
					selected = page;
					break;
				}
			}
			return selected;
		}
		hideOthers (selected) {
			for (let page = this.firstElementChild; page; page = page.nextElementSibling) {
				if (page !== selected && page !== this.lastElementChild) {
					page.style.display = 'none';
				}
			}
			return this;
		}
		// event processing
		handleEvent (e) {
			if (e.type === 'transitionend') {
				if (e.target === this) {
					this.style.height = 'auto';
				} else if (e.target === this.lastElementChild) {
					if (this.state === 'revealing') {
						const curtain = this.lastElementChild;
						curtain.style.display = 'none';
						this.state = '';
					}
				}
			}
			//
			// if (e.type !== 'transitionend') return;
			// if (e.target === this) {
			// 	this.style.height = 'auto';
			// 	return;
			// }
			// if (e.target === this.lastElementChild && this.state === 'revealing') {
			// 	const curtain = this.lastElementChild;
			// 	curtain.style.display = 'none';
			// 	this.state = '';
			// }
			//
		}
	}
	customElements.define('reno-content-switcher', RenoContentSwitcher);
})();
