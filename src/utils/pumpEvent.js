// pump values in response on change events throttling updates

import debounce from './debounce';
import getPath from './getPath';

export default (target, attrName, path='', ms=500) => debounce(e => { target.setAttribute(attrName, getPath(e, path)); }, ms);
