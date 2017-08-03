// pump values in response on change events throttling updates

import debounce from './debounce';

export default (source, target, attrName, ms=500) => debounce(e => { target.setAttribute(attrName, (source || e.target).value); }, ms);
