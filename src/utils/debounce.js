// debounce

export default (f, ms=50) => {
	let handle, savedArgs;
	return (...args) => {
		savedArgs = args;
		if (!handle) {
			handle = setTimeout(() => {
				handle = null;
				f(...savedArgs);
			}, ms);
		}
	};
};
