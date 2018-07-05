// pump events in response throttling updates

import delay from './delay';

export default (source, target, attrName, ms = 500, wrap = delay) =>
  wrap(e => {
    target.setAttribute(attrName, (source || e.target).value);
  }, ms);
