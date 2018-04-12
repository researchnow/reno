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
import apportion   from '../utils/apportion';
import bsearch     from '../utils/bsearch';
import clean       from '../utils/clean';
import cleanRegExp from '../utils/cleanRegExp';
import clone       from '../utils/clone';
import debounce    from '../utils/debounce';
import delay       from '../utils/delay';
import getPath     from '../utils/getPath';
import isEqual     from '../utils/isEqual';
import pumpEvent   from '../utils/pumpEvent';
import pumpValue   from '../utils/pumpValue';
import * as popup  from '../utils/popup';
import seq         from '../utils/seq';
import throttle    from '../utils/throttle';

import formatCurrency from '../utils/formatCurrency';
import formatNumber   from '../utils/formatNumber';
import toPrecision    from '../utils/toPrecision';
import toTitleCase    from '../utils/toTitleCase';

// utilities: dnd
import start from '../utils/dnd/start';
import { init, over, moving, movingX, movingY } from '../utils/dnd/common';
import { dropX, dropY } from '../utils/dnd/rearrangeable';

// patch up
if (window) {
	if (!window.Reno) window.Reno = {utils: {}};
	if (!Reno.utils) Reno.utils = {};

	Reno.utils.apportion   = apportion;
	Reno.utils.bsearch     = bsearch;
	Reno.utils.clean       = clean;
	Reno.utils.cleanRegExp = cleanRegExp;
	Reno.utils.clone       = clone;
	Reno.utils.debounce    = debounce;
	Reno.utils.delay       = delay;
	Reno.utils.getPath     = getPath;
	Reno.utils.isEqual     = isEqual;
	Reno.utils.pumpEvent   = pumpEvent;
	Reno.utils.pumpValue   = pumpValue;
	Reno.utils.popup       = popup;
	Reno.utils.seq         = seq;
	Reno.utils.throttle    = throttle;

	Reno.utils.formatCurrency = formatCurrency;
	Reno.utils.formatNumber   = formatNumber;
	Reno.utils.toPrecision    = toPrecision;
	Reno.utils.toTitleCase    = toTitleCase;

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
import '../components/reno-progress';
