// pump values in response to changed events throttling updates

import delay   from './delay';
import getPath from './getPath';

export default (target, attrName, path='', ms=500, wrap=delay) => wrap(e => { target.setAttribute(attrName, getPath(e, path)); }, ms);
