// the classic machine epsilon
let eps = 1;
for (let next = eps; next + 1 > 1; eps = next, next = 0.5 * next);

/**
 * Quick helper function to convert a number to x number of decimal places
 * @param number
 * @param decimalPlaces
 */
const toPrecision = (number, decimalPlaces) => {
  number = number || 0;
  if (typeof number == "string") number = parseFloat(number);
  return parseFloat((number + number * toPrecision.epsilon).toFixed(decimalPlaces));
}

toPrecision.epsilon = eps;

export default toPrecision;
