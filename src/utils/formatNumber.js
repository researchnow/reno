export default (number, precision=0, millenia=',', decimal='.') => {
	const s = Math.abs(number).toFixed(precision);
	const fractionPos = precision > 0 ? s.length - precision - 1 : s.length;
	const leadingGroup = fractionPos % 3;
	const result = leadingGroup ? [s.slice(0, leadingGroup)] : [];
	for (let i = leadingGroup; i < fractionPos; i += 3) {
		result.push(s.slice(i, i + 3));
	}
	return (number < 0 ? '-' : '') + result.join(millenia) + (fractionPos < s.length ? decimal + s.slice(fractionPos + 1) : '');
}
