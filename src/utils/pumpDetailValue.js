// pump values in response on change events throttling updates

import debounce from './debounce';

export default (target, attrName, ms=500) => debounce(e => { target.setAttribute(attrName, e.detail.value); }, ms);
