function byAlphabet(a, b) {
  return a < b ? -1 : b < a ? 1 : 0;
}

export default function isEqual(a, b) {
  if (typeof a != typeof b) return false;
  if (!a || !b || (typeof a != 'object' && typeof a != 'function')) {
    if (typeof a == 'number' && isNaN(a) && isNaN(b)) return true;
    return a === b;
  }
  if (a instanceof Array && b instanceof Array) {
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; ++i) {
      if (a.hasOwnProperty(i)) {
        if (!b.hasOwnProperty(i) || !isEqual(a[i], b[i])) return false;
      } else {
        if (b.hasOwnProperty(i)) return false;
      }
    }
    return true;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() == b.getTime();
  }
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
  }
  // general object
  if (a.constructor !== b.constructor) return false;
  const ak = Object.keys(a).sort(byAlphabet),
    bk = Object.keys(b).sort(byAlphabet);
  if (ak.length != bk.length) return false;
  for (let i = 0; i < ak.length; ++i) {
    const key = ak[i];
    if (key !== bk[i] || !isEqual(a[key], b[key])) return false;
  }
  return true;
}
