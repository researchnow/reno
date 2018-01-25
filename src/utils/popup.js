export function open (popupComponent, options) {
	options = options || {};
	const popupContent = options.content || popupComponent.querySelector('.content') || popupComponent;
	if (!popupContent) return;

	const data	= options.data || popupContent.data;
	const url		= options.url  || popupContent.getAttribute('url');

	// if there's no url or content, do nothing
	if (!popupContent.childNodes.length && typeof data != 'function' && !url) return;

	const popupLoading = options.loading || popupComponent.querySelector('.loading');

	// if there's url or content => close other popups
	close();

	// find/create a popup container
	let popupContainer = popupComponent.ownerDocument.getElementById('reno-popup-container');
	if (!popupContainer) {
		popupContainer = popupComponent.ownerDocument.createElement('div');
		popupContainer.id = 'reno-popup-container';
		popupComponent.ownerDocument.body.appendChild(popupContainer);
	}

	// popup styles
	popupContainer.classList.remove('close');
	popupContainer.classList.add('open');

	// form content
	const placeholder = popupLoading ? popupLoading.cloneNode(true) : hyperHTML.wire()`<div class="loading">Loading&hellip;</div>`;
	let content;
	if (data || url) {
		if (data) {
			content = data();
		} else {
			content = heya.io.get(url).
				then(data => data.map(value => hyperHTML.wire()`<div>${value.name}</div>`)).
				then(data => hyperHTML.wire()`<div class="content">${data}</div>`);
		}
		if (typeof content.then == 'function') {
			content = content.then(data => {
				window.requestAnimationFrame(() => calculatePlacement(popupComponent, popupContainer));
				return data;
			});
		}
	} else {
		content = popupContent.cloneNode(true);
	}
	hyperHTML.bind(popupContainer)`${{any: content, placeholder: placeholder}}`;

	return new Promise(resolve => {
		window.requestAnimationFrame(() => {
			calculatePlacement(popupComponent, popupContainer);
			resolve(true);
		});
	});
}

export function close () {
	const popupContainer = document.getElementById('reno-popup-container');
	if (!popupContainer) return;
	popupContainer.classList.remove('open');
	popupContainer.classList.add('close');
	hyperHTML.bind(popupContainer)``;
	return Promise.resolve(true);
}

export function isOpen () {
	const popupContainer = document.getElementById('reno-popup-container');
	return popupContainer && popupContainer.classList.contains('open');
}

export function enhanceListContent (dataPromise, clickCallback) {
	return dataPromise
		.then(data => 
			hyperHTML.wire()`<div class="content list">${data.length ? data.map(value => hyperHTML.wire()`<div dataid="${value.id}">${value.name}</div>`) : hyperHTML.wire()`<div>${"No results found."}</div>`}</div>`
		)
		.then(promise => {
			// TODO: attribute name setting
			const handle = on(document, 'click', e => {
				let node;
				const popup = document.getElementById('reno-popup-container');
				if (popup && popup.contains(e.target)) {
					node = e.target.nodeType === 1 ? e.target : e.target.parentNode;
					while (node && node[on.matches] && !node[on.matches](`[dataid]`)) node = node.parentNode;
				}
				handle.remove();
				Reno.utils.popup.close();
				if (!node || !node[on.matches]) return;
				clickCallback(node);
			});
			return promise;
		})
}

function calculatePlacement (popupComponent, popupContainer) {
	const placement = popupComponent.getAttribute('placement');
	let alignment = popupComponent.getAttribute('alignment');

	popupContainer.style.top = '0';
	popupContainer.style.left = '0';

	const popupComponentDomRect = popupComponent.getBoundingClientRect();
	const popupContainerDomRect = popupContainer.getBoundingClientRect();
	const computedMargin = getComputedStyle(popupContainer).margin;
	const popupContainerMargin = /px\b/.test(computedMargin) ? parseFloat(computedMargin) : 0;

	switch (placement) {
		case 'left':
			if (popupComponentDomRect.left - popupContainerDomRect.width - popupContainerMargin < 0) {
				popupContainer.style.left = (popupComponentDomRect.right + window.pageXOffset) + 'px';
			} else {
				popupContainer.style.left = (popupComponentDomRect.left - popupContainerDomRect.width + window.pageXOffset - 2 * popupContainerMargin) + 'px';
			}
			break;
		case 'right':
			if (popupComponentDomRect.right + popupContainerDomRect.width + popupContainerMargin > window.innerWidth) {
				popupContainer.style.left = (popupComponentDomRect.left - popupContainerDomRect.width + window.pageXOffset - 2 * popupContainerMargin) + 'px';
			} else {
				popupContainer.style.left = (popupComponentDomRect.right + window.pageXOffset) + 'px';
			}
			break;
		case 'top':
			if (popupComponentDomRect.top - popupContainerDomRect.height - popupContainerMargin < 0) {
				popupContainer.style.top = (popupComponentDomRect.bottom + window.pageYOffset) + 'px';
			} else {
				popupContainer.style.top = (popupComponentDomRect.top - popupContainerDomRect.height + window.pageYOffset - 2 * popupContainerMargin) + 'px';
			}
			break;
		default:
		// case 'bottom':
			if (popupComponentDomRect.bottom + popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
				popupContainer.style.top = (popupComponentDomRect.top - popupContainerDomRect.height + window.pageYOffset - 2 * popupContainerMargin) + 'px';
			} else {
				popupContainer.style.top = (popupComponentDomRect.bottom + window.pageYOffset) + 'px';
			}
			break;
	}

	const anchor = popupComponentDomRect[alignment]  - popupContainerMargin;
	switch (alignment) {
		case 'left':
			popupContainer.style.left = (anchor + window.pageXOffset) + 'px';
			break;
		case 'right':
			popupContainer.style.left = (anchor + window.pageXOffset - popupContainerDomRect.width) + 'px';
			break;
		case 'top':
			popupContainer.style.top = (anchor + window.pageYOffset) + 'px';
			break;
		case 'bottom':
			popupContainer.style.top = (anchor + window.pageYOffset - popupContainerDomRect.height) + 'px';
			break;
		default:
			// case 'center':
			switch (placement) {
				case 'left':
				case 'right':
					popupContainer.style.top = (popupComponentDomRect.top + window.pageYOffset - popupContainerMargin - (popupContainerDomRect.height - popupComponentDomRect.height) / 2) + 'px';
					break;
				case 'top':
				default:
					// case 'bottom':
					popupContainer.style.left = (popupComponentDomRect.left + window.pageXOffset - popupContainerMargin - (popupContainerDomRect.width - popupComponentDomRect.width) / 2) + 'px';
					break;
			}
			break;
	}

	// TODO: we can cover cases when a popup is completely invisible forcing it to the visible part of a screen
}