// clean a named property recursively (mutative algorithm) from all objects

// TODO: write unit tests

const clean = (object, name) => {
  if (!object || typeof object != 'object') return;
  delete object[name];
  if (object instanceof Date || object instanceof RegExp) return;
  Object.keys(object).forEach(key => clean(object[key], name));
  return object;
};

export default (object, name = '_id') => clean(object, name);
