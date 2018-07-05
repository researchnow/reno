// https://github.com/heya/async/blob/master/seq.js
// to chain array of then

const when = (value, Deferred = Promise) =>
  value && typeof value.then == 'function' ? value : Deferred.resolve(value);

export default (array, Deferred) => {
  if (!(array instanceof Array)) {
    array = Array.prototype.slice.call(arguments, 0);
    Deferred = null;
  }
  return initial => array.reduce((acc, fn) => acc.then(fn), when(initial, Deferred));
};
