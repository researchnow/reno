// clean a named property recursively (mutative algorithm) from all objects by a regular expression pattern

// TODO: write unit tests

const cleanRegExp = (object, pattern) => {
  if (!object || typeof object != 'object') return;
  Object.keys(object).forEach(key => {
    if (pattern.test(key)) {
      delete object[key];
    } else {
      cleanRegExp(object[key], pattern);
    }
  });
  return object;
};

export default (object, pattern = /^_/) => cleanRegExp(object, pattern);
