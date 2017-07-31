'use strict';

// Extracts symbols as SVG files


if (process.argv.length < 4) {
	console.log('Use: node scripts/svg-extract.js svg-file dest-folder');
	return;
}


const fs = require('fs');
const path = require('path');

const svgson = require('svgson');


const attrs = a => {
	const keys = Object.keys(a);
	if (!keys.length) return '';
	return keys.map(name => ' ' + name + '="' + a[name] + '"');
}

const json2svg = o => {
	if (o.childs && o.childs.length) {
		return '<' + o.name + attrs(o.attrs) + '>' + o.childs.map(json2svg) + '</' + o.name + '>';
	} else {
		return '<' + o.name + attrs(o.attrs) + ' />'
	}
};


fs.readFile(process.argv[2], 'utf-8', (err, data) => {
	if (err) return err;
	svgson(data, {}, svg => {
    fs.mkdir(process.argv[3], err => {
			if (err && err.code !== 'EEXIST') return err;
			svg.childs.filter(symbol => symbol.name === 'symbol').forEach(symbol => {
				if (/^reno\-icon\-/.test(symbol.attrs.id)) {
					const name = path.join(process.argv[3], symbol.attrs.id.substr(10) + '.svg');
					const content = {
						name:   svg.name,
						attrs:  svg.attrs,
						childs: symbol.childs
					};
					console.log('writing', name);
					fs.writeFileSync(name, json2svg(content));
				} else {
					console.log('symbol name:', symbol.attrs.name, '- it should start with reno-icon-, skipping...');
				}
			});
			console.log('done');
		});
  });
});
