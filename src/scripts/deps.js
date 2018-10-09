require('heya-io/dist/io');
require('heya-io/dist/FauxXHR');
require('heya-io/dist/scaffold');
require('heya-io/dist/mock');

// set up the shim
try {
  eval('(class {})');
  window['no-native-shim'] = true;
} catch (e) {
  // supress
}
require('@clubajax/custom-elements-polyfill');

import hyperHTML from 'hyperhtml/esm';

if (!window.hyperHTML) {
  window.hyperHTML = hyperHTML;
}
// const hyperHTML = require('hyperhtml/cjs');
// if (!window.hyperHTML) {
//   window.hyperHTML = hyperHTML;
// }

window.customLoader = f => {
  window.on = f();
  window.customLoader = null;
};
require('@clubajax/on');
// const on = require('@clubajax/on');
// if (!window.on) {
//   window.on = on;
// }
