let handle = null;

export function open(options) {
  options = options || {};
  const data = options.data;
  if (!options.popupClass && (!options.anchor || (!options.content && typeof data != 'function'))) return;

  const doc = options.anchor ? options.anchor.ownerDocument : document;
  // if there's content => close other popups
  close();

  // find/create a popup container
  let popupContainer = doc.getElementById('reno-popup-container');
  if (!popupContainer) {
    popupContainer = doc.createElement('div');
    popupContainer.id = 'reno-popup-container';
    doc.body.appendChild(popupContainer);
  }

  // popup styles
  doc.body.classList.remove('reno-popup-close');
  doc.body.classList.add('reno-popup-open');
  if (options.popupClass) popupContainer.className = options.popupClass;

  // form content
  const placeholder = options.loading || hyperHTML.wire()`<div class="loading">Loading&hellip;</div>`,
    eventHandler = options.eventHandler || defaultEventHandler;
  let content = options.content;
  if (data) {
    content = data();
    if (content && typeof content.then == 'function') {
      content = content.then(data => {
        window.requestAnimationFrame(() => calculatePlacement(options.anchor, popupContainer, options));
        return data;
      });
    }
  }
  let childContainer = hyperHTML.wire()`<div class="child-container"></div>`;
  hyperHTML.bind(childContainer)`${{any: content, placeholder: placeholder}}`;
  hyperHTML.bind(popupContainer)`${{any: childContainer}}`;

  handle = on(popupContainer, 'click', eventHandler);

  return new Promise(resolve => {
    window.requestAnimationFrame(() => {
      if (options.anchor) calculatePlacement(options.anchor, popupContainer, options);
      resolve(true);
    });
  });
}

export function close(doc) {
  doc = doc || document;
  const popupContainer = doc.getElementById('reno-popup-container');
  if (!popupContainer) return;
  handle && handle.remove();
  doc.body.classList.remove('reno-popup-open');
  popupContainer.className = '';
  doc.body.classList.add('reno-popup-close');
  hyperHTML.bind(popupContainer)``;
  return Promise.resolve(true);
}

export function isOpen(doc) {
  return (doc || document).body.classList.contains('reno-popup-open');
}

export function hidePopup(e) {
  const popup = e.target.ownerDocument.getElementById('reno-popup-container');
  if (popup && !popup.contains(e.target)) {
    Reno.utils.popup.close();
  }
}

function defaultEventHandler(e) {}

const defaultRender = data =>
  hyperHTML.wire()`<div class="content list">${
    data.length ? data.map((value, index) => hyperHTML.wire()`<div renoindex="${index}">${value.name}</div>`) : hyperHTML.wire()`<div>No results found.</div>`
  }</div>`;

export function enhanceListContent(data, clickCallback, render = defaultRender, selector = '[renoindex]') {
  return Promise.resolve(data)
    .then(data => [data, render(data)])
    .then(array => {
      const data = array[0],
        handle = on(document, 'click', e => {
          const popup = document.getElementById('reno-popup-container');
          const node = popup && popup.contains(e.target) && on.closest(e.target.nodeType === 1 ? e.target : e.target.parentNode, selector);
          handle.remove();
          Reno.utils.popup.close();
          const prop = node && /^\[(\w+)\]$/.exec(selector);
          node && clickCallback(node, prop ? data[node.getAttribute(prop[1])] : null);
        });
      return array[1];
    });
}

function alignAtTop(popupContainer, popupContent, popupContainerDomRect, popupContainerMargin) {
  // when content is too long - move to top of page
  popupContainer.style.top = window.pageYOffset + 'px';
  popupContent.classList.add('padd-top');

  popupContent.style.maxHeight = popupContainerDomRect.height + popupContainerMargin + 'px';

  if (window.pageYOffset + popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
    // needs max height
    popupContent.style.maxHeight = window.innerHeight + 'px';
    popupContent.classList.add('height-dbl-padd');
  }
}

function calculatePlacement(popupComponent, popupContainer, options) {
  const placement = options.placement || popupComponent.getAttribute('placement');
  let alignment = options.alignment || popupComponent.getAttribute('alignment');

  let popupContent = document.querySelector('#reno-popup-container .child-container');

  popupContainer.style.top = '0';
  popupContainer.style.left = '0';

  const widthMargin = 18;
  const heightMargin = 20;
  let isFlipped = false;

  const popupComponentDomRect = popupComponent.getBoundingClientRect();
  const popupContainerDomRect = popupContainer.getBoundingClientRect();
  const computedMargin = getComputedStyle(popupContainer).margin;
  const popupContainerMargin = /px\b/.test(computedMargin) ? parseFloat(computedMargin) : 0;

  switch (placement) {
    case 'left':
      if (popupComponentDomRect.left - popupContainerDomRect.width - popupContainerMargin < 0) {
        // not enough room on the left
        if (window.innerWidth - popupComponentDomRect.right > popupComponentDomRect.left) {
          // there is more room on the right, so put popup there
          popupContainer.style.left = popupComponentDomRect.right + window.pageXOffset + 'px';
          popupContainer.style.maxWidth = window.innerWidth - popupComponentDomRect.right + 'px';
          popupContent.classList.add('width-padd');
        } else {
          // there is more room on the left, so put popup there
          popupContainer.style.left = window.pageXOffset + 'px';
          popupContent.classList.add('padd-left');
          popupContainer.style.maxWidth = popupComponentDomRect.left + 'px';
        }
      } else {
        // plenty of room, proceed as planned
        popupContainer.style.left = popupComponentDomRect.left - popupContainerDomRect.width + window.pageXOffset - 2 * popupContainerMargin + 'px';
      }
      break;
    case 'right':
      if (popupComponentDomRect.right + popupContainerDomRect.width + popupContainerMargin > window.innerWidth) {
        // not enough room on the right
        if (window.innerWidth - popupComponentDomRect.right > popupComponentDomRect.left) {
          // more room on the right, so put popup there
          popupContainer.style.left = popupComponentDomRect.right + window.pageXOffset + 'px';
          popupContainer.style.maxWidth = window.innerWidth - popupComponentDomRect.right + 'px';
          popupContent.classList.add('width-padd');
        } else {
          // more room on the left, so put popup there
          if (popupComponentDomRect.left < popupContainerDomRect.width + popupContainerMargin) {
            popupContainer.style.left = window.pageXOffset + 'px';
            popupContent.classList.add('padd-left');
            popupContainer.style.maxWidth = popupComponentDomRect.left + 'px';
          } else {
            popupContainer.style.left = popupComponentDomRect.left - popupContainerDomRect.width - popupContainerMargin + 'px';
          }
        }
      } else {
        // plenty of room, proceed as planned
        popupContainer.style.left = popupComponentDomRect.right + window.pageXOffset + 'px';
      }

      break;
    case 'top':
      if (popupContainerDomRect.height + popupContainerMargin > popupComponentDomRect.top) {
        // not enough room on top
        if (popupComponentDomRect.top < window.innerHeight - popupComponentDomRect.bottom) {
          isFlipped = true;
          // more room on the bottom, so put popup there
          const neededSpace = popupContainerDomRect.height + popupContainerMargin;
          const availableSpace = window.innerHeight - popupComponentDomRect.bottom;
          if (popupComponentDomRect.bottom + popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
            // not enough space on bottom
            if (neededSpace > window.innerHeight) {
              // container is bigger than the window
              alignAtTop(popupContainer, popupContent, popupContainerDomRect, popupContainerMargin);
            } else {
              // container is too big, but not bigger than window, so set max height
              popupContent.style.maxHeight = window.innerHeight - popupComponentDomRect.bottom + 'px';
              popupContent.classList.add('height-padd');
              popupContainer.style.top = popupComponentDomRect.bottom + window.pageYOffset + 'px';
            }
          } else {
            // enough space on bottom
            popupContainer.style.top = popupComponentDomRect.bottom + window.pageYOffset + 'px';
          }
        } else {
          // more room on the top, so put popup there
          if (popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
            // container is bigger than the window
            alignAtTop(popupContainer, popupContent, popupContainerDomRect, popupContainerMargin);
          } else {
            // container is too big, but not bigger than window, so set max height
            popupContainer.style.top = window.pageYOffset + heightMargin + 'px';
            popupContent.style.maxHeight = popupComponentDomRect.top + 'px';
            popupContent.classList.add('height-padd');
          }
        }
      } else {
        // plenty of room, proceed as planned
        popupContainer.style.top = popupComponentDomRect.top - popupContainerDomRect.height + window.pageYOffset - 2 * popupContainerMargin + 'px';
      }

      break;
    default:
      const spaceOnBottom = window.innerHeight - popupComponentDomRect.bottom;
      if (popupContainerDomRect.height + popupContainerMargin > spaceOnBottom) {
        // not enough room on bottom
        if (popupComponentDomRect.top > spaceOnBottom) {
          isFlipped = true;
          // more room on the top, so put popup there
          const potentialTop = popupComponentDomRect.top - popupContainerDomRect.height + window.pageYOffset - 2 * popupContainerMargin;
          if (potentialTop < 0 || potentialTop < window.pageYOffset) {
            // not enough space on the top
            if (popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
              // container is bigger than the window
              alignAtTop(popupContainer, popupContent, popupContainerDomRect, popupContainerMargin);
            } else {
              // container is too big, but not bigger than window, so set max height
              popupContainer.style.top = window.pageYOffset + 'px';
              popupContent.classList.add('padd-top');
              popupContent.style.maxHeight = popupComponentDomRect.top + 'px';
              popupContent.classList.add('height-padd');
            }
          } else {
            // enough space on the top
            popupContainer.style.top = popupComponentDomRect.top - popupContainerDomRect.height + window.pageYOffset - 2 * popupContainerMargin + 'px';
          }
        } else {
          // more room on the bottom, so put popup there
          if (popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
            // container is bigger than the window
            alignAtTop(popupContainer, popupContent, popupContainerDomRect, popupContainerMargin);
          } else {
            // container is too big, but not bigger than window, so set max height
            popupContent.style.maxHeight = window.innerHeight - popupComponentDomRect.bottom + 'px';
            popupContent.classList.add('height-padd');
            popupContainer.style.top = popupComponentDomRect.bottom + window.pageYOffset + 'px';
          }
        }
      } else {
        // plenty of room, proceed as planned
        popupContainer.style.top = popupComponentDomRect.bottom + window.pageYOffset + 'px';
      }
      break;
  }

  const anchor = popupComponentDomRect[alignment] - popupContainerMargin;
  switch (alignment) {
    case 'left':
      popupContainer.style.left = anchor + window.pageXOffset + 'px';
      if (popupContainerDomRect.width + popupContainerMargin > window.innerWidth - popupComponentDomRect.left) {
        // too wide for window, use max width
        popupContainer.style.maxWidth = window.innerWidth + 'px';
        popupContent.classList.add('width-padd');
      }

      break;
    case 'right':
      if (popupContainerDomRect.width + popupContainerMargin > popupComponentDomRect.right) {
        // too wide for window, use max width and stop from going off left of page
        popupContainer.style.left = window.pageXOffset + 'px';
        popupContent.classList.add('padd-left');
        popupContainer.style.maxWidth = anchor + 'px';
      } else {
        popupContainer.style.left = anchor + window.pageXOffset - popupContainerDomRect.width + 'px';
      }

      break;
    case 'top':
      if (popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
        // container is longer than the page, so stop at top and add max height
        alignAtTop(popupContainer, popupContent, popupContainerDomRect, popupContainerMargin);
      } else {
        if (popupContainerDomRect.height + popupContainerMargin > window.innerHeight - popupComponentDomRect.top) {
          // bigger than the space we have
          popupContainer.style.top = anchor + window.pageYOffset + 'px';
          popupContent.style.maxHeight = window.innerHeight - popupComponentDomRect.top + 'px';
          popupContent.classList.add('height-padd');
        } else {
          popupContainer.style.top = anchor + window.pageYOffset + 'px';
        }
      }

      break;
    case 'bottom':
      if (popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
        // container is longer than the page, so stop at top and add max height
        alignAtTop(popupContainer, popupContent, popupContainerDomRect, popupContainerMargin);
      } else {
        if (popupContainerDomRect.height + popupContainerMargin > popupComponentDomRect.bottom) {
          // needs more space
          popupContainer.style.top = window.pageYOffset + 'px';
          popupContent.classList.add('padd-top');
          popupContent.style.maxHeight = popupComponentDomRect.bottom + 'px';
        } else {
          popupContainer.style.top = anchor + window.pageYOffset - popupContainerDomRect.height + 'px';
        }
      }
      break;
    default:
      // case 'center':
      switch (placement) {
        case 'left':
        case 'right':
          const potentialTop =
            popupComponentDomRect.top + window.pageYOffset - popupContainerMargin - (popupContainerDomRect.height - popupComponentDomRect.height) / 2;
          if (
            potentialTop < 0 ||
            potentialTop < window.pageYOffset ||
            potentialTop + popupContainerMargin + popupContainerDomRect.height > window.innerHeight + window.pageYOffset
          ) {
            if (popupContainerDomRect.height + popupContainerMargin < popupComponentDomRect.bottom) {
              // can fit if aligned to bottom
              popupContainer.style.top = popupComponentDomRect['bottom'] - popupContainerMargin + window.pageYOffset - popupContainerDomRect.height + 'px';
            } else if (popupContainerDomRect.height + popupContainerMargin < window.innerHeight - popupComponentDomRect.top) {
              // can fit if aligned to top
              popupContainer.style.top = popupComponentDomRect['top'] - popupContainerMargin + window.pageYOffset + 'px';
            } else {
              // won't fit aligned top or bottom, so stop at top and add max height
              alignAtTop(popupContainer, popupContent, popupContainerDomRect, popupContainerMargin);
            }
          } else {
            // fits with center alignment
            popupContainer.style.top =
              popupComponentDomRect.top + window.pageYOffset - popupContainerMargin - (popupContainerDomRect.height - popupComponentDomRect.height) / 2 + 'px';
          }

          break;
        case 'top':
        default:
          // case 'bottom':
          const potentialLeft =
            popupComponentDomRect.left + window.pageXOffset - popupContainerMargin - (popupContainerDomRect.width - popupComponentDomRect.width) / 2;
          if (potentialLeft < 0 || potentialLeft + popupContainerDomRect.width + popupContainerMargin > window.innerWidth) {
            // if container won't fit on page when centered, stop at left and add max width
            popupContainer.style.left = window.pageXOffset + 'px';
            popupContent.classList.add('padd-left', 'width-padd');
            popupContainer.style.maxWidth = window.innerWidth + 'px';
            const topOfPopup = Number(popupContainer.style.top.substring(0, popupContainer.style.top.length - 2));
            const isOffPage = topOfPopup - window.pageYOffset + popupContainer.getBoundingClientRect().height + popupContainerMargin > window.innerHeight;
            const isCoveringBtn =
              topOfPopup - window.pageYOffset + popupContainer.getBoundingClientRect().height + popupContainerMargin > popupComponentDomRect.top;
            if ((isOffPage && placement == 'top' && isFlipped) || (isOffPage && placement == 'bottom' && !isFlipped)) {
              // popup is going off bottom of page
              popupContent.style.maxHeight = window.innerHeight - popupComponentDomRect.bottom + 'px';
              popupContent.classList.add('height-padd');
            } else if ((isCoveringBtn && placement == 'top' && !isFlipped) || (isCoveringBtn && placement == 'bottom' && isFlipped)) {
              // popup is on top and covering the popup button
              popupContent.style.maxHeight = popupComponentDomRect.top - topOfPopup + 'px';
            }
          } else {
            popupContainer.style.left =
              popupComponentDomRect.left + window.pageXOffset - popupContainerMargin - (popupContainerDomRect.width - popupComponentDomRect.width) / 2 + 'px';
          }

          break;
      }
      break;
  }

  // TODO: we can cover cases when a popup is completely invisible forcing it to the visible part of a screen
}
