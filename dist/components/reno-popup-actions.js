'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _templateObject = _taggedTemplateLiteral(['<div class="loading">Loading&hellip;</div>'], ['<div class="loading">Loading&hellip;</div>']),
    _templateObject2 = _taggedTemplateLiteral(['<div>', '</div>'], ['<div>', '</div>']),
    _templateObject3 = _taggedTemplateLiteral(['', ''], ['', '']),
    _templateObject4 = _taggedTemplateLiteral([''], ['']);

exports.openPopup = openPopup;
exports.closePopup = closePopup;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function openPopup(popupComponent) {
	var _this = this;

	var popupContent = popupComponent.querySelector('.content') || popupComponent;
	if (!popupContent) return;

	var data = popupContent.data;
	var url = popupContent.getAttribute('url');

	// if there's no url or content, do nothing
	if (!popupContent.childNodes.length && typeof data != 'function' && !url) return;

	var popupLoading = popupComponent.querySelector('.loading');

	// if there's url or content => close other popups
	closePopup();

	// find/create a popup container
	var popupContainer = popupComponent.ownerDocument.getElementById('reno-popup-container');
	if (!popupContainer) {
		popupContainer = popupComponent.ownerDocument.createElement('div');
		popupContainer.id = 'reno-popup-container';
		popupComponent.ownerDocument.body.appendChild(popupContainer);
	}

	// popup styles
	popupContainer.classList.remove('close');
	popupContainer.classList.add('open');

	// form content
	var placeholder = popupLoading ? popupLoading.cloneNode(true) : hyperHTML.wire()(_templateObject);
	var content = void 0;
	if (data || url) {
		if (data) {
			content = data();
		} else {
			content = heya.io.get(url).then(function (data) {
				_newArrowCheck(this, _this);

				return data.map(function (value) {
					_newArrowCheck(this, _this);

					return hyperHTML.wire()(_templateObject2, value.name);
				}.bind(this));
			}.bind(this));
		}
		content = content.then(function (data) {
			_newArrowCheck(this, _this);

			window.requestAnimationFrame(function () {
				_newArrowCheck(this, _this);

				return calculatePlacement(popupComponent, popupContainer);
			}.bind(this));
			return data;
		}.bind(this));
	} else {
		content = popupContent.cloneNode(true);
	}
	hyperHTML.bind(popupContainer)(_templateObject3, { any: content, placeholder: placeholder });
	return new Promise(function (resolve) {
		_newArrowCheck(this, _this);

		window.requestAnimationFrame(function () {
			_newArrowCheck(this, _this);

			calculatePlacement(popupComponent, popupContainer);
			resolve(true);
		}.bind(this));
	}.bind(this));
}

function closePopup() {
	var popupContainer = document.getElementById('reno-popup-container');
	if (!popupContainer) return;
	popupContainer.classList.remove('open');
	popupContainer.classList.add('close');
	hyperHTML.bind(popupContainer)(_templateObject4);
	return Promise.resolve(true);
}

function calculatePlacement(popupComponent, popupContainer) {
	var placement = popupComponent.getAttribute('placement');
	var alignment = popupComponent.getAttribute('alignment');

	popupContainer.style.top = '0';
	popupContainer.style.left = '0';

	var popupComponentDomRect = popupComponent.getBoundingClientRect();
	var popupContainerDomRect = popupContainer.getBoundingClientRect();
	var computedMargin = getComputedStyle(popupContainer).margin;
	var popupContainerMargin = /px\b/.test(computedMargin) ? parseInt(computedMargin) : 0;

	switch (placement) {
		case 'left':
			if (popupComponentDomRect.left - popupContainerDomRect.width - popupContainerMargin < 0) {
				popupContainer.style.left = popupComponentDomRect.right + window.pageXOffset + 'px';
			} else {
				popupContainer.style.left = popupComponentDomRect.left - popupContainerDomRect.width + window.pageXOffset - 2 * popupContainerMargin + 'px';
			}
			break;
		case 'right':
			if (popupComponentDomRect.right + popupContainerDomRect.width + popupContainerMargin > window.innerWidth) {
				popupContainer.style.left = popupComponentDomRect.left - popupContainerDomRect.width + window.pageXOffset - 2 * popupContainerMargin + 'px';
			} else {
				popupContainer.style.left = popupComponentDomRect.right + window.pageXOffset + 'px';
			}
			break;
		case 'top':
			if (popupComponentDomRect.top - popupContainerDomRect.height - popupContainerMargin < 0) {
				popupContainer.style.top = popupComponentDomRect.bottom + window.pageYOffset + 'px';
			} else {
				popupContainer.style.top = popupComponentDomRect.top - popupContainerDomRect.height + window.pageYOffset - 2 * popupContainerMargin + 'px';
			}
			break;
		default:
			// case 'bottom':
			if (popupComponentDomRect.bottom + popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
				popupContainer.style.top = popupComponentDomRect.top - popupContainerDomRect.height + window.pageYOffset - 2 * popupContainerMargin + 'px';
			} else {
				popupContainer.style.top = popupComponentDomRect.bottom + window.pageYOffset + 'px';
			}
			break;
	}

	var anchor = popupComponentDomRect[alignment] - popupContainerMargin;
	switch (alignment) {
		case 'left':
			popupContainer.style.left = anchor + window.pageXOffset + 'px';
			break;
		case 'right':
			popupContainer.style.left = anchor + window.pageXOffset - popupContainerDomRect.width + 'px';
			break;
		case 'top':
			popupContainer.style.top = anchor + window.pageYOffset + 'px';
			break;
		case 'bottom':
			popupContainer.style.top = anchor + window.pageYOffset - popupContainerDomRect.height + 'px';
			break;
		default:
			// case 'center':
			switch (placement) {
				case 'left':
				case 'right':
					popupContainer.style.top = popupComponentDomRect.top + window.pageYOffset - popupContainerMargin - (popupContainerDomRect.height - popupComponentDomRect.height) / 2 + 'px';
					break;
				case 'top':
				default:
					// case 'bottom':
					popupContainer.style.left = popupComponentDomRect.left + window.pageXOffset - popupContainerMargin - (popupContainerDomRect.width - popupComponentDomRect.width) / 2 + 'px';
					break;
			}
			break;
	}

	// TODO: we can cover cases when a popup is completely invisible forcing it to the visible part of a screen
}