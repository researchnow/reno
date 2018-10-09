export function open(options) {
  options = options || {};
  const data = options.data;
  if (!options.anchor || (!options.content && typeof data != 'function')) return;

  const doc = options.document || document;

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

  // form content
  const placeholder = options.loading || hyperHTML.wire()`<div class="loading">Loading&hellip;</div>`;
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
  hyperHTML.bind(popupContainer)`${{any: content, placeholder: placeholder}}`;

  return new Promise(resolve => {
    window.requestAnimationFrame(() => {
      calculatePlacement(options.anchor, popupContainer, options);
      resolve(true);
    });
  });
}

export function close(doc) {
  doc = doc || document;
  const popupContainer = doc.getElementById('reno-popup-container');
  if (!popupContainer) return;
  doc.body.classList.remove('reno-popup-open');
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

const defaultRender = data =>
  hyperHTML.wire()`<div class="content list">${
    data.length
      ? data.map((value, index) => hyperHTML.wire()`<div renoindex="${index}">${value.name}</div>`)
      : hyperHTML.wire()`<div>No results found.</div>`
  }</div>`;

export function enhanceListContent(data, clickCallback, render = defaultRender, selector = '[renoindex]') {
  return Promise.resolve(data)
    .then(data => [data, render(data)])
    .then(array => {
      const data = array[0],
        handle = on(document, 'click', e => {
          const popup = document.getElementById('reno-popup-container');
          const node =
            popup &&
            popup.contains(e.target) &&
            on.closest(e.target.nodeType === 1 ? e.target : e.target.parentNode, selector);
          handle.remove();
          Reno.utils.popup.close();
          const prop = node && /^\[(\w+)\]$/.exec(selector);
          node && clickCallback(node, prop ? data[node.getAttribute(prop[1])] : null);
        });
      return array[1];
    });
}

function calculatePlacement(popupComponent, popupContainer, options) {
  const placement = options.placement || popupComponent.getAttribute('placement');
  let alignment = options.alignment || popupComponent.getAttribute('alignment');

  popupContainer.style.top = '0';
  popupContainer.style.left = '0';

  const popupComponentDomRect = popupComponent.getBoundingClientRect();
  const popupContainerDomRect = popupContainer.getBoundingClientRect();
  const computedMargin = getComputedStyle(popupContainer).margin;
  const popupContainerMargin = /px\b/.test(computedMargin) ? parseFloat(computedMargin) : 0;

  switch (placement) {
    case 'left':
      if (popupComponentDomRect.left - popupContainerDomRect.width - popupContainerMargin < 0) {
        popupContainer.style.left = popupComponentDomRect.right + window.pageXOffset + 'px';
      } else {
        popupContainer.style.left =
          popupComponentDomRect.left -
          popupContainerDomRect.width +
          window.pageXOffset -
          2 * popupContainerMargin +
          'px';
      }
      break;
    case 'right':
      if (popupComponentDomRect.right + popupContainerDomRect.width + popupContainerMargin > window.innerWidth) {
        popupContainer.style.left =
          popupComponentDomRect.left -
          popupContainerDomRect.width +
          window.pageXOffset -
          2 * popupContainerMargin +
          'px';
      } else {
        popupContainer.style.left = popupComponentDomRect.right + window.pageXOffset + 'px';
      }
      break;
    case 'top':
      if (popupComponentDomRect.top - popupContainerDomRect.height - popupContainerMargin < 0) {
        popupContainer.style.top = popupComponentDomRect.bottom + window.pageYOffset + 'px';
      } else {
        popupContainer.style.top =
          popupComponentDomRect.top -
          popupContainerDomRect.height +
          window.pageYOffset -
          2 * popupContainerMargin +
          'px';
      }
      break;
    default:
      // case 'bottom':
      if (popupComponentDomRect.bottom + popupContainerDomRect.height + popupContainerMargin > window.innerHeight) {
        popupContainer.style.top =
          popupComponentDomRect.top -
          popupContainerDomRect.height +
          window.pageYOffset -
          2 * popupContainerMargin +
          'px';
      } else {
        popupContainer.style.top = popupComponentDomRect.bottom + window.pageYOffset + 'px';
      }
      break;
  }

  const anchor = popupComponentDomRect[alignment] - popupContainerMargin;
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
          popupContainer.style.top =
            popupComponentDomRect.top +
            window.pageYOffset -
            popupContainerMargin -
            (popupContainerDomRect.height - popupComponentDomRect.height) / 2 +
            'px';
          break;
        case 'top':
        default:
          // case 'bottom':
          popupContainer.style.left =
            popupComponentDomRect.left +
            window.pageXOffset -
            popupContainerMargin -
            (popupContainerDomRect.width - popupComponentDomRect.width) / 2 +
            'px';
          break;
      }
      break;
  }

  // TODO: we can cover cases when a popup is completely invisible forcing it to the visible part of a screen
}
