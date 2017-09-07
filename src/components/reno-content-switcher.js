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
		// custom methods
		obscure (opacity=1, display='flex') {
			const curtain = this.lastElementChild,
				obscureClass = this.getAttribute('obscureClass'),
				revealClass  = this.getAttribute('revealClass');

			curtain.style.display = display;

			if (this.notFirstRun) {
				const boxTo = curtain.getBoundingClientRect();
				this.style.height = boxTo.height + 'px';
			}

			if (revealClass)  curtain.classList.remove(revealClass);
			if (obscureClass) curtain.classList.add(obscureClass);
			curtain.style.opacity = opacity;

			if (this.state === 'revealing') {
				curtain.removeEventListener('transitionend', this);
			}
			this.state = 'obscuring';
		}
		reveal (selector) {
			const selected = this.selectPages(selector);
			if (!selected) return;

			selected.style.display = 'block';
			this.hideOthers(selected);

			if (this.notFirstRun) {
				const boxTo = selected.getBoundingClientRect();
				this.style.height = boxTo.height + 'px';
			} else {
				this.notFirstRun = true;
			}

			const curtain = this.lastElementChild,
				obscureClass = this.getAttribute('obscureClass'),
				revealClass  = this.getAttribute('revealClass');
			if (obscureClass) curtain.classList.remove(obscureClass);
			if (revealClass)  curtain.classList.add(revealClass);

			const oldOpacity = getComputedStyle(curtain).getPropertyValue('opacity');
			if (oldOpacity !== "0") {
				curtain.style.opacity = 0;
				if (this.state === 'obscuring') {
					curtain.addEventListener('transitionend', this);
				}
				this.state = 'revealing';
			} else {
				curtain.style.opacity = 0;
				curtain.style.display = 'none';
				this.state = '';
			}
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
			if (e.type === 'transitionend' && this.state === 'revealing') {
				const curtain = this.lastElementChild;
				curtain.style.display = 'none';
				this.state = '';
			}
			this.removeEventListener('transitionend', this);
		}
	}
	customElements.define('reno-content-switcher', RenoContentSwitcher);
})();
