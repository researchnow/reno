import '../styles/main.scss';
import '../app.scss';

import '../components/reno-search';
import '../components/reno-table-view';
import '../components/reno-table-pager';
import '../components/reno-table-counter';
import '../components/reno-table';

import debounce  from '../utils/debounce';
import delay     from '../utils/delay';
import getPath   from '../utils/getPath';
import pumpEvent from '../utils/pumpEvent';
import pumpValue from '../utils/pumpValue';

// patch up

if (window) {
	if (!window.Reno) window.Reno = {utils: {}};
	if (!Reno.utils) Reno.utils = {};
	Reno.utils.debounce  = debounce;
	Reno.utils.delay     = delay;
	Reno.utils.getPath   = getPath;
	Reno.utils.pumpEvent = pumpEvent;
	Reno.utils.pumpValue = pumpValue;
}
