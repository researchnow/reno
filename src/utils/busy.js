let handle = null;

export function open(options) {
  if (typeof options == 'string') {
    options = {message: options};
  } else if (!options) {
    options = {};
  }

  close();

  const doc = options.document || document;
  let busyContainer = doc.getElementById('reno-busy-container');
  if (!busyContainer) {
    busyContainer = hyperHTML.wire()`<div id="reno-busy-container">
      <div class="reno-busy-background"></div>
      <div class="reno-busy-content">
        <div class="reno-busy-message"></div>
        <div class="reno-busy-spinner"><div class="reno-spinner">Busy&hellip;</div></div>
      </div>
    </div>`;
    busyContainer.ownerDocument.body.appendChild(busyContainer);
    handle = null;
  }
  if (!handle) {
    busyContainer.addEventListener('transitionend', e => {
      if (e.target === busyContainer && busyContainer.ownerDocument.body.classList.contains('reno-busy-close')) {
        busyContainer.style.display = 'none';
        hyperHTML.bind(busyContainer.querySelector('.reno-busy-message'))``;
      }
    });
  }

  doc.body.classList.remove('reno-busy-close');
  doc.body.classList.add('reno-busy-open');

  const msg = busyContainer.querySelector('.reno-busy-message');
  msg && hyperHTML.bind(msg)`${{any: options.message}}`;

  busyContainer.style.display = 'block';

  const oldOpacity = getComputedStyle(busyContainer).getPropertyValue('opacity'); // needed to sync
  busyContainer.style.opacity = 'opacity' in options ? options.opacity : 1;
}

export function close(doc) {
  doc = doc || document;
  const busyContainer = doc.getElementById('reno-busy-container');
  if (!busyContainer) return;

  doc.body.classList.remove('reno-busy-open');
  doc.body.classList.add('reno-busy-close');

  const oldOpacity = getComputedStyle(busyContainer).getPropertyValue('opacity'); // needed to sync
  if (oldOpacity === '0') {
    busyContainer.style.display = 'none';
    hyperHTML.bind(busyContainer.querySelector('.reno-busy-message'))``;
  }
  busyContainer.style.opacity = 0;
}

export function isOpen(doc) {
  return (doc || document).body.classList.contains('reno-busy-open');
}

export function updateMessage(options) {
  if (typeof options == 'string') {
    options = {message: options};
  } else if (!options) {
    options = {};
  }

  const doc = options.document || document;
  if (!Reno.utils.busy.isOpen(doc)) return false;

  const busyContainer = doc.getElementById('reno-busy-container');
  if (!busyContainer) return false;

  const msg = busyContainer.querySelector('.reno-busy-message');
  if (!msg) return false;

  hyperHTML.bind(msg)`${{any: options.message || ''}}`;
  return true;
}

export function wrap(fn, options) {
  const doc = (options && options.document) || document;
  Reno.utils.busy.open(options);
  let result;
  try {
    result = fn();
  } catch(error) {
    Reno.utils.busy.close(doc);
    throw error;
  }
  if (result && typeof result.then == 'function') {
    return result.then(
      value => {
        Reno.utils.busy.close(doc);
        return value;
      },
      error => {
        Reno.utils.busy.close(doc);
        return Promise.reject(error);
      }
    );
  }
  Reno.utils.busy.close(doc);
  return result;
}
