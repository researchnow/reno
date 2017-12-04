import '../styles/main.scss';

// dependencies
import '@clubajax/custom-elements-polyfill';
import 'heya-io/dist/io';
import 'heya-io/dist/FauxXHR';
import 'heya-io/dist/scaffold';
import 'heya-io/dist/mock';
const hyperHTML = require('hyperhtml/cjs');
if (window && !window.hyperHTML) {
	window.hyperHTML = hyperHTML;
}
const on = require('@clubajax/on');
if (window && !window.on) {
	window.on = on;
}

// utilities
import clone     from '../utils/clone';
import debounce  from '../utils/debounce';
import delay     from '../utils/delay';
import getPath   from '../utils/getPath';
import pumpEvent from '../utils/pumpEvent';
import pumpValue from '../utils/pumpValue';

// utilities: dnd
import start from '../utils/dnd/start';
import { init, over, moving, movingX, movingY } from '../utils/dnd/common';
import { dropX, dropY } from '../utils/dnd/rearrangeable';

// patch up
if (window) {
	if (!window.Reno) window.Reno = {utils: {}};
	if (!Reno.utils) Reno.utils = {};

	Reno.utils.clone     = clone;
	Reno.utils.debounce  = debounce;
	Reno.utils.delay     = delay;
	Reno.utils.getPath   = getPath;
	Reno.utils.pumpEvent = pumpEvent;
	Reno.utils.pumpValue = pumpValue;

	Reno.utils.dnd = {start, init, over, moving, movingX, movingY, rearrangeable: {dropX, dropY}};
}

// components
import '../components/reno-search';
import '../components/reno-table-view';
import '../components/reno-table-pager';
import '../components/reno-table-counter';
import '../components/reno-table';
import '../components/reno-content-switcher';
import '../components/reno-form';
import '../components/reno-popup';
