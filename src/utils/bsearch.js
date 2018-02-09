// binary search with a less() function as a parameter

const bsearchDefault = (sortedArray, x) => {
	let l = 0, r = sortedArray.length;
	while (l < r) {
		const m = ((r - l) >> 1) + l, p = sortedArray[m];
		if (p < x) {
			l = m + 1;
		} else {
			r = m;
		}
	}
	return l;
}

export default (sortedArray, x, less) => {
	if (less === undefined) return bsearchDefault(sortedArray, x);
	let l = 0, r = sortedArray.length;
	while (l < r) {
		const m = ((r - l) >> 1) + l, p = sortedArray[m];
		if (less(p, x)) {
			l = m + 1;
		} else {
			r = m;
		}
	}
	return l;
}
