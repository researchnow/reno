const PopupLabelGap = 12;

export function openPopup (popupComponent) {
	const popupContent = popupComponent.querySelector('.content') || popupComponent;
	if (!popupContent) return;

	const data = popupContent.data;
	const url  = popupContent.getAttribute('url');

	// if there's no url or content, do nothing
	if (!popupContent.childNodes.length && typeof data != 'function' && !url) return;

	const popupLoading = popupComponent.querySelector('.loading');

	// if there's url or content => close other popups
	closePopup();

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
				then(data => data.map(value => hyperHTML.wire()`<div>${value.name}</div>`));
		}
		content = content.
			then(data => {
				window.requestAnimationFrame(() => calculatePlacement(popupComponent, popupContainer));
				return data;
			});
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

export function closePopup () {
	const popupContainer = document.getElementById('reno-popup-container');
	if (!popupContainer) return;
	popupContainer.classList.remove('open');
	popupContainer.classList.add('close');
	hyperHTML.bind(popupContainer)``;
	return Promise.resolve(true);
}

function calculatePlacement (popupComponent, popupContainer) {
	const placement = popupComponent.getAttribute('placement');
	let alignment = popupComponent.getAttribute('alignment');

	if (!alignment) {
		switch (placement) {
			case 'left':
			case 'right':
				alignment = 'top';
				break;
			default:
			// case 'top':
			// case 'bottom':
				alignment = 'left';
				break;
		}
	}

	popupContainer.style.top = '0';
	popupContainer.style.left = '0';

	const popupComponentDomRect = popupComponent.getBoundingClientRect();
	const popupContainerDomRect = popupContainer.getBoundingClientRect();

	const anchor = popupComponentDomRect[alignment];
	switch (alignment) {
		case 'left':
		case 'right':
			popupContainer.style.left = (anchor + window.pageXOffset) + 'px';
			break;
		default:
		// case 'top':
		// case 'bottom':
			popupContainer.style.top = (anchor + window.pageYOffset) + 'px';
			break;
	}

	switch (placement) {
		case 'left':
			if (popupComponentDomRect.left - popupContainerDomRect.width < 0) {
				popupContainer.style.left = (popupComponentDomRect.right + window.pageXOffset + PopupLabelGap) + 'px';
			} else {
				popupContainer.style.left = (popupComponentDomRect.left - popupContainerDomRect.width + window.pageXOffset - PopupLabelGap) + 'px';
			}
			popupContainer.style.top = (popupComponentDomRect.top + window.pageYOffset - (popupContainerDomRect.height - popupComponentDomRect.height)/2) + 'px';
			break;
		case 'right':
			if (popupComponentDomRect.right + popupContainerDomRect.width > window.innerWidth) {
				popupContainer.style.left = (popupComponentDomRect.left - popupContainerDomRect.width + window.pageXOffset) + 'px';
			} else {
				popupContainer.style.left = (popupComponentDomRect.right + window.pageXOffset) + 'px';
			}
			break;
		case 'top':
			if (popupComponentDomRect.top - popupContainerDomRect.height < 0) {
				popupContainer.style.top = (popupComponentDomRect.bottom + window.pageYOffset) + 'px';
			} else {
				popupContainer.style.top = (popupComponentDomRect.top - popupContainerDomRect.height + window.pageYOffset) + 'px';
			}
			break;
		default:
		// case 'bottom':
			if (popupComponentDomRect.bottom + popupContainerDomRect.height > window.innerHeight) {
				popupContainer.style.top = (popupComponentDomRect.top - popupContainerDomRect.height + window.pageYOffset) + 'px';
			} else {
				popupContainer.style.top = (popupComponentDomRect.bottom + window.pageYOffset) + 'px';
			}
			break;
	}

	// TODO: we can cover cases when a popup is completely invisible forcing it to the visible part of a screen
}
