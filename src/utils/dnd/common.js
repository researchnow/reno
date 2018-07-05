export const init = mover => {
  // container box
  let rect = mover.container.getBoundingClientRect(),
    style = window.getComputedStyle(mover.container);
  const box = {
    left: rect.left + window.pageXOffset + parseFloat(style.borderLeftWidth),
    right: rect.right + window.pageXOffset - parseFloat(style.borderRightWidth) - parseFloat(style.marginRight),
    top: rect.top + window.pageYOffset + parseFloat(style.borderTopWidth),
    bottom: rect.bottom + window.pageYOffset - parseFloat(style.borderBottomWidth) - parseFloat(style.marginBottom)
  };
  style = window.getComputedStyle(mover.avatar);
  box.left -= parseFloat(style.marginLeft);
  box.right -=
    parseFloat(style.marginLeft) +
    parseFloat(style.borderLeftWidth) +
    parseFloat(style.width) +
    parseFloat(style.borderRightWidth);
  box.top -= parseFloat(style.marginTop);
  box.bottom -=
    parseFloat(style.marginTop) +
    parseFloat(style.borderTopWidth) +
    parseFloat(style.height) +
    parseFloat(style.borderBottomWidth);
  mover.containerBox = box;
  // draggable items
  var items = mover.container.querySelectorAll(mover.options.target || '.reno-dnd-item'),
    itemBoxes = [];
  for (let i = 0; i < items.length; ++i) {
    rect = items[i].getBoundingClientRect();
    itemBoxes.push({
      node: items[i],
      left: rect.left + window.pageXOffset,
      right: rect.right + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      bottom: rect.bottom + window.pageYOffset
    });
  }
  mover.itemBoxes = itemBoxes;
};

export const over = mover => {
  // binary search is better, but linear will do in a pinch
  const done = mover.itemBoxes.some(item => {
    if (
      item.left <= mover.mouseX &&
      mover.mouseX < item.right &&
      item.top <= mover.mouseY &&
      mover.mouseY < item.bottom
    ) {
      if (item.node !== mover.previousOverItem) {
        mover.previousOverItem && mover.previousOverItem.classList.remove('reno-dnd-over');
        mover.previousOverItem = item.node;
        mover.previousOverItem.classList.add('reno-dnd-over');
      }
      return true;
    }
    return false;
  });
  if (!done) {
    mover.previousOverItem && mover.previousOverItem.classList.remove('reno-dnd-over');
    mover.previousOverItem = null;
  }
};

export const movingX = (mover, e) => {
  mover.x += e.pageX - mover.mouseX;
  mover.x = Math.max(mover.containerBox.left, Math.min(mover.containerBox.right, mover.x));
};

export const movingY = (mover, e) => {
  mover.y += e.pageY - mover.mouseY;
  mover.y = Math.max(mover.containerBox.top, Math.min(mover.containerBox.bottom, mover.y));
};

export const moving = (mover, e) => {
  mover.x += e.pageX - mover.mouseX;
  mover.x = Math.max(mover.containerBox.left, Math.min(mover.containerBox.right, mover.x));
  mover.y += e.pageY - mover.mouseY;
  mover.y = Math.max(mover.containerBox.top, Math.min(mover.containerBox.bottom, mover.y));
};
