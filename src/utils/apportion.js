/**
 * Hamiltons method for reallocate numbers to match the total, and keep the original distribution as much as possible
 * See: http://www.ctl.ua.edu/math103/apportionment/appmeth.htm
 * @param total Number of seats
 * @param array Proportional population in each state
 * @param quantum a quant of distribution (1, 10, 100, 1000, and so on)
 * @returns {*}
 */

export default (total, array, quantum=1) => {
  let SD = 0; // standard divisor
  let values = array.map((value, index) => {
    SD += value;
    return {id: index, original: value};
  });
	if (SD <= 0) {
		return values.map(item => item.original);
	}
  let allocated = 0;
  values.forEach(item => {
    const quota = (item.original / SD) * total;
    item.value = Math.floor(quota / quantum) * quantum;
    item.frac  = quota % quantum;
    allocated += item.value;
  });
  if (allocated < total) {
    const n = Math.ceil((total - allocated) / quantum);
    values.sort((a, b) => {
      const d = b.frac - a.frac;
      return d ? d : a.id - b.id;
    });
    for (let i = 0; i < n; ++i) {
      values[i].value += quantum;
    }
    values.sort((a, b) => a.id - b.id);
  }
  return values.map(item => item.value);
};
