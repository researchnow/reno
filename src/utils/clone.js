// clone objects

function clone (s) {
	if (!s || typeof s != 'object' || typeof s == 'function') {
		return s;
	}
	if (s instanceof Date) {
		return new Date(s.getTime());
	}
	if (s instanceof RegExp) {
		return new RegExp(s.source, (s.global ? 'g' : '') + (s.multiline ? 'm' : '') + (s.ignoreCase ? 'i' : ''));
	}
	if (s instanceof Array) {
		return s.map(value => clone(value));
	}
	const t = {};
	return Object.keys(s).reduce((acc, key) => (acc[key] = clone(s[key]), acc), {});
}

export default clone;
