// binary search with a less() function as a parameter

export default (sortedArray, x, less=((a, b) => a < b)) => {
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
