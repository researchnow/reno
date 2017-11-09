const margin = 5;

export function openPopup (popupComponent) {
	const content = popupComponent.querySelector('.content').cloneNode(true);
	const url = content.getAttribute('url');

	// if there's no url or content, do nothing
	if (!url && !content.childNodes.length) return;

	// else if there's url or content
	// close other popups
	closePopup();
	// popup styles
	const popupContainer = document.querySelector('#popup-container');
	popupContainer.classList.remove('close');
	popupContainer.classList.add('open');
	// if there's url
	if (url) {
		// display loading
		const loadingNode = popupComponent.querySelector('.loading');
		// TODO: remove the flashing / too fast loading
		if (loadingNode) content.innerHTML = loadingNode.cloneNode(true).innerHTML;
		else content.innerHTML = '<div class="loading">Loading...</div>';
		heya.io.get(url).then(data => {
			// format url response
			content.innerHTML = data.map((item) => (('<div>' + item.name + '</div>'))).join('');
			// set content
			popupContainer.appendChild(content);
			// calculate position
			calculatePlacement(popupComponent, popupContainer);
		});
	}
	// if there's content
	// set content
	popupContainer.appendChild(content);
	// calculate position
	calculatePlacement(popupComponent, popupContainer);
}

export function closePopup () {
	const popupContainer = document.querySelector('#popup-container');
	while (popupContainer.firstChild) {
		popupContainer.removeChild(popupContainer.firstChild);
	}
	popupContainer.classList.remove('open');
	popupContainer.classList.add('close');
}

function calculatePlacement (popupComponent, popupContainer) {
	const placement = popupComponent.getAttribute('placement');
	const popupComponentDomRect = popupComponent.getBoundingClientRect();
	const popupContainerDomRect = popupContainer.getBoundingClientRect();

	// TODO: if out of the screen...
	switch (placement) {
		case 'bottom':
		default:
			popupContainer.style.top = popupComponentDomRect.y + popupComponentDomRect.height + pageYOffset + 'px';
			popupContainer.style.left = popupComponentDomRect.x + (popupComponentDomRect.width - popupContainerDomRect.width) / 2+ pageXOffset + 'px';
			// only care about bleeding on left
			if (parseInt(popupContainer.style.left) < margin) {
				popupContainer.style.left = margin + "px";
			}
			break;
	}

	// all cases care about bleeding on top/bottom
	if (popupContainerDomRect.y + popupContainerDomRect.height > innerHeight ) {
		popupContainer.style.top = pageYOffset + popupComponentDomRect.y - popupContainerDomRect.height + "px";
	}
}
