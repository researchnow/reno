(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports);
		global.popup = mod.exports;
	}
})(this, function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.open = open;
	exports.close = close;
	exports.isOpen = isOpen;

	function _newArrowCheck(innerThis, boundThis) {
		if (innerThis !== boundThis) {
			throw new TypeError("Cannot instantiate an arrow function");
		}
	}

	var _templateObject = _taggedTemplateLiteral(['<div class="loading">Loading&hellip;</div>'], ['<div class="loading">Loading&hellip;</div>']),
	    _templateObject2 = _taggedTemplateLiteral(['<div>', '</div>'], ['<div>', '</div>']),
	    _templateObject3 = _taggedTemplateLiteral(['', ''], ['', '']),
	    _templateObject4 = _taggedTemplateLiteral([''], ['']);

	function _taggedTemplateLiteral(strings, raw) {
		return Object.freeze(Object.defineProperties(strings, {
			raw: {
				value: Object.freeze(raw)
			}
		}));
	}

	function open(popupComponent, options) {
		var _this = this;

		options = options || {};
		var popupContent = options.content || popupComponent.querySelector('.content') || popupComponent;
		if (!popupContent) return;

		var data = options.data || popupContent.data;
		var url = options.url || popupContent.getAttribute('url');

		// if there's no url or content, do nothing
		if (!popupContent.childNodes.length && typeof data != 'function' && !url) return;

		var popupLoading = options.loading || popupComponent.querySelector('.loading');

		// if there's url or content => close other popups
		close();

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
			if (typeof content.then == 'function') {
				content = content.then(function (data) {
					_newArrowCheck(this, _this);

					window.requestAnimationFrame(function () {
						_newArrowCheck(this, _this);

						return calculatePlacement(popupComponent, popupContainer);
					}.bind(this));
					return data;
				}.bind(this));
			}
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

	function close() {
		var popupContainer = document.getElementById('reno-popup-container');
		if (!popupContainer) return;
		popupContainer.classList.remove('open');
		popupContainer.classList.add('close');
		hyperHTML.bind(popupContainer)(_templateObject4);
		return Promise.resolve(true);
	}

	function isOpen() {
		var popupContainer = document.getElementById('reno-popup-container');
		return popupContainer && popupContainer.classList.contains('open');
	}

	function calculatePlacement(popupComponent, popupContainer) {
		var placement = popupComponent.getAttribute('placement');
		var alignment = popupComponent.getAttribute('alignment');

		popupContainer.style.top = '0';
		popupContainer.style.left = '0';

		var popupComponentDomRect = popupComponent.getBoundingClientRect();
		var popupContainerDomRect = popupContainer.getBoundingClientRect();
		var computedMargin = getComputedStyle(popupContainer).margin;
		var popupContainerMargin = /px\b/.test(computedMargin) ? parseFloat(computedMargin) : 0;

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
});