let handle = null;

export function open(options) {
  options = options || {};

  if (!options.content) return;

  close();

  const doc = options.document || document;
  let modalContainer = doc.getElementById('reno-modal-container');
  if (!modalContainer) {
    modalContainer = hyperHTML.wire()`<div id="reno-modal-container">
      <div class="reno-modal-background"></div>
      <div class="reno-modal-content">
        <div class="reno-modal"></div>
      </div>
    </div>`;
    modalContainer.ownerDocument.body.appendChild(modalContainer);
  }

  // modal styles
  modalContainer.classList.remove('close');
  modalContainer.classList.add('open');

  const placeholder = options.loading || hyperHTML.wire()`<div class="loading">Loading&hellip;</div>`,
    eventHandler = options.eventHandler || defaultEventHandler,
    modal = modalContainer.querySelector('.reno-modal'),
    html = hyperHTML.bind(modal);

  if (!options.title && !options.buttons) {
    html`${{any: options.content, placeholder: placeholder}}`;
    handle = on.makeMultiHandle([
      on(modal, 'click', 'button', eventHandler),
      on(doc, 'keyup:Escape', eventHandler)
    ]);
    return;
  }

const title = options.title ? hyperHTML.wire()`<div class="title"><div>${{any: options.title}}</div><div><button class="close" index="">&times;</button></div></div>` : '',
    buttons = options.buttons.map((button, index) => {
      let className = 'reno-button',
        text = button;
      switch (button.charAt(0)) {
        case '!':
          className = 'reno-button-caution';
          text = button.substring(1);
          break;
        case '1':
          text = button.substring(1);
          break;
        case '2':
          className = 'reno-button-secondary';
          text = button.substring(1);
          break;
        case '3':
          className = 'reno-button-tertiary';
          text = button.substring(1);
          break;
        default:
          switch (button.toLowerCase()) {
            case 'ok':
              className = 'reno-button-ok';
              break;
            case 'cancel':
              className = 'reno-button-cancel';
              break;
          }
      }
      if (options.buttonStyle) {
        className += '-' + options.buttonStyle;
      }
      return hyperHTML.wire()`<button key=${text + '/' + className} index=&{index} class=${className}>${text}</button>`;
    });

  html`${title}<div class="content">${{any: options.content, placeholder: placeholder}}</div>${
    buttons.length ? hyperHTML.wire()`<div class="buttons">${buttons}</div>` : ''
  }`;
  handle = on.makeMultiHandle([
    on(modal, 'click', 'button', eventHandler),
    on(doc, 'keyup:Escape', eventHandler)
  ]);
}

export function close(doc) {
  const modalContainer = (doc || document).getElementById('reno-modal-container');
  if (!modalContainer) return;
  handle && handle.remove();
  modalContainer.classList.remove('open');
  modalContainer.classList.add('close');
  hyperHTML.bind(modalContainer.querySelector('.reno-modal'))``;
}

export function isOpen(doc) {
  const modalContainer = (doc || document).getElementById('reno-modal-container');
  return modalContainer && modalContainer.classList.contains('open');
}

function defaultEventHandler (e) {
  close(e.target.ownerDocument);
}
