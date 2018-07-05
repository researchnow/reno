export const dropX = mover => {
  if (!mover.previousOverItem) return;
  // binary search is better, but linear will do in a pinch
  const done = mover.itemBoxes.some(item => {
    if (mover.mouseX < (item.left + item.right) / 2) {
      if (item.node !== mover.node) {
        mover.container.insertBefore(mover.node, item.node);
      }
      return true;
    }
    return false;
  });
  if (!done) {
    mover.container.appendChild(mover.node);
  }
};

export const dropY = mover => {
  if (!mover.previousOverItem) return;
  // binary search is better, but linear will do in a pinch
  const done = mover.itemBoxes.some(item => {
    if (mover.mouseY < (item.top + item.bottom) / 2) {
      if (item.node !== mover.node) {
        mover.container.insertBefore(mover.node, item.node);
      }
      return true;
    }
    return false;
  });
  if (!done) {
    mover.container.appendChild(mover.node);
  }
};
