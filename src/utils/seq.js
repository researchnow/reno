// https://github.com/heya/async/blob/master/seq.js
// to chain array of then
export default seq = (array, Deferred) => {
  const when = (value, Deferred=Promise) => value && typeof value.then == "function" ? value : Deferred.resolve(value);

  if (!(array instanceof Array)) {
    array = Array.prototype.slice.call(arguments, 0);
    Deferred = null;
  }

  return initial => array.reduce((acc, fn) => acc.then(fn), when(initial, Deferred));
}
