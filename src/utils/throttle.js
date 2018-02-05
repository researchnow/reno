// throttle

export default (f, ms=50) => {
	let handle, savedArgs, last = +new Date();
	return (...args) => {
		savedArgs = args;
		if (!handle) {
			const now = +new Date(), left = last + ms - now;
			if (left <= 0) {
				last = now;
				f(...savedArgs);
				savedArgs = null;
			} else {
				handle = setTimeout(() => {
					handle = null;
					last = now;
					f(...savedArgs);
					savedArgs = null;
				}, left);
			}
		}
	};
};
