// the classic machine epsilon
let eps = 1;
for (let next = eps; next + 1 > 1; eps = next, next = 0.5 * next);

export const epsilon = eps;

/**
 * Quick helper function to convert a number to x number of decimal places
 * @param number
 * @param decimalPlaces
 */
export const toPrecision = (number, decimalPlaces) => {
  number = number || 0;
  if (typeof number == "string") number = parseFloat(number);
  return (number + number * epsilon).toFixed(decimalPlaces);
}
