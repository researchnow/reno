// throttle

export default (f, ms=50) => {
	let handle;
	return (...args) => {
		if (!handle) {
			f(...args);
			handle = setTimeout(() => {
				handle = null;
			}, ms);
		}
	};
};
