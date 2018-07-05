// throttle

export default (f, ms = 50) => {
  let handle,
    savedArgs,
    last = +new Date();
  return (...args) => {
    savedArgs = args;
    if (!handle) {
      const now = +new Date(),
        left = last + ms - now;
      if (left <= 0) {
        const args = savedArgs;
        savedArgs = null;
        last = now;
        f(...args);
      } else {
        handle = setTimeout(() => {
          const args = savedArgs;
          handle = savedArgs = null;
          last = now;
          f(...args);
        }, left);
      }
    }
  };
};
