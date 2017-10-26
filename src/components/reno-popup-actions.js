export function openPopup (popupComponent, content) {
	// popup styles
	const popupContainer = document.querySelector('#popup-container');
	popupContainer.classList.remove('close');
	popupContainer.classList.add('open');
	// set content
	popupContainer.appendChild(content);
	// calculate position
	calculatePlacement(popupComponent, popupContainer);
}

export function closePopup () {
	// destroy popup content
	const popupContainer = document.querySelector('#popup-container');
	popupContainer.classList.remove('open');
	popupContainer.classList.add('close');
	while (popupContainer.firstChild) {
		popupContainer.removeChild(popupContainer.firstChild);
	}
}

function calculatePlacement (popupComponent, popupContainer) {
	const domRect = popupComponent.getBoundingClientRect();
	popupContainer.style.top = domRect.y + domRect.height + pageYOffset + 'px';
	popupContainer.style.left = domRect.x + domRect.width + pageXOffset + 'px';
}
