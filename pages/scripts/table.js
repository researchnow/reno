(function () {
	// the mock I/O block
	heya.io.mock.attach();

	mock(['/planets', '/planets/', '/planets?*', '/planets/?*'], (options, prep) => {
		const params = getParams(prep.url);
		return heya.io.get('data/data.json').then(data => {
			data = data.slice(0);
			if (params.filter) {
				const criteria = new RegExp(params.filter, 'i');
				data = data.filter(o => criteria.test(o.name));
			}
			if (params.fields) {
				const fields = params.fields.split(',');
				data = data.map(o => {
					const t = {};
					fields.forEach(name => { t[name] = o[name]; });
					return t;
				});
			}
			if (params.sort) {
				const reverse = params.sort.charAt(0) === '-', name = reverse ? params.sort.substr(1) : params.sort;
				data.sort((a, b) => {
					if (a[name] < b[name]) return -1;
					return b[name] < a[name] ? 1 : 0;
				});
				reverse && data.reverse();
			}
			if (params.hasOwnProperty('limit') || params.hasOwnProperty('offset')) {
				const limit = parseInt(params.limit, 10) || 10, offset = parseInt(params.offset, 10) || 0;
				return {offset, total: data.length, data: data.slice(offset, offset + limit)};
			}
			return data;
		});
	});

	// utilities

	function getParams (url) {
		const data = {}, questionMark = url.indexOf('?');
		if (questionMark >= 0) {
			url.slice(questionMark + 1).split('&').forEach(part => {
				const pair = part.split(/=(.*)$/);
				data[decodeURIComponent(pair[0])] = pair[1] && decodeURIComponent(pair[1]) || '';
			});
		}
		return data;
	}

	function mock (url, fn) {
		if (url instanceof Array) {
			url.forEach(url => heya.io.mock(url, fn));
		} else {
			heya.io.mock(url, fn);
		}
	}

	// simple event processors

	document.documentElement.addEventListener('reno-table-item-selected', e => {
		alert('Selected: ' + e.detail.item.name);
	});

	let changePump;
	document.documentElement.addEventListener('reno-change', e => {
		if (!changePump) {
			changePump = Reno.utils.pumpValue(document.querySelector('reno-search'), document.querySelector('reno-table'), 'filter');
		}
		changePump(e);
	});
})();
