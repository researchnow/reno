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
const hyperHTML = require('hyperhtml/cjs');
if (window && !window.hyperHTML) {
  window.hyperHTML = hyperHTML;
}
const on = require('@clubajax/on');
if (window && !window.on) {
  window.on = on;
}
