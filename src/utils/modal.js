let handle = null;

const sizes = ['small', 'medium', 'large', 'x-large'];

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
  doc.body.classList.remove('reno-modal-close');
  doc.body.classList.add('reno-modal-open');

  const placeholder = options.loading || hyperHTML.wire()`<div class="loading">Loading&hellip;</div>`,
    eventHandler = options.eventHandler || defaultEventHandler,
    modal = modalContainer.querySelector('.reno-modal'),
    html = hyperHTML.bind(modal);

  modal.className = 'reno-modal'; // clear all other CSS class names
  options.size && modal.classList.add(options.size);
  options.customClass && modal.classList.add(options.customClass);

  if (!options.title && !options.buttons) {
    html`${{any: options.content, placeholder: placeholder}}`;
    handle = on.makeMultiHandle([on(modal, 'click', 'button', eventHandler), on(doc, 'keyup:Escape', eventHandler)]);
    return;
  }

  const title = options.title
    ? hyperHTML.wire()`<div class="title"><div>${{
        any: options.title
      }}</div><div><button class="close" index="">&times;</button></div></div>`
    : '';
  let buttons = options.buttons;
  if (buttons instanceof Array && buttons.every(button => typeof button == 'string')) {
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
    buttons = buttons.length ? hyperHTML.wire()`<div class="buttons">${buttons}</div>` : '';
  }

  html`${title}<div class="content">${{any: options.content, placeholder: placeholder}}</div>${buttons}`;
  handle = on.makeMultiHandle([on(modal, 'click', 'button', eventHandler), on(doc, 'keyup:Escape', eventHandler)]);
}

export function close(doc) {
  doc = doc || document;
  const modalContainer = doc.getElementById('reno-modal-container');
  if (!modalContainer) return;
  handle && handle.remove();
  doc.body.classList.remove('reno-modal-open');
  doc.body.classList.add('reno-modal-close');
  hyperHTML.bind(modalContainer.querySelector('.reno-modal'))``;
}

export function isOpen(doc) {
  return (doc || document).body.classList.contains('reno-modal-open');
}

function defaultEventHandler(e) {
  close(e.target.ownerDocument);
}
