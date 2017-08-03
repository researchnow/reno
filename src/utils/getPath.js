// getPath

const dereferable = {object: 1, function: 1};

export default (obj, path, delimiter='.') => {
	if (typeof path == 'string') {
		path = path ? path.split(delimiter) : [];
	}
	for (let i = 0; i < path.length; ++i) {
		if (!obj || !dereferable[typeof obj]) return; // undefined
		obj = obj[path[i]];
	}
	return obj;
};
