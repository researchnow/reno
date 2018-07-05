// delay

export default (f, ms = 50) => {
  let handle, savedArgs;
  return (...args) => {
    savedArgs = args;
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(() => {
      const args = savedArgs;
      handle = savedArgs = null;
      f(...args);
    }, ms);
  };
};
