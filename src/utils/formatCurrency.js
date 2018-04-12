import formatNumber from './formatNumber';


export default (number /*, country='US'*/) => {
	// country is a provision for future extensions
	// the default: US
	const result = '$' + formatNumber(Math.abs(number), 2);
	return number < 0 ? '(' + result + ')' : result;
}
