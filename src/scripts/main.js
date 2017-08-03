import '../styles/main.scss';
import '../app.scss';

import '../components/reno-search';
import '../components/reno-table-view';
import '../components/reno-table-pager';
import '../components/reno-table-counter';
import '../components/reno-table';

import debounce  from '../utils/debounce';
import getPath   from '../utils/getPath';
import pumpValue from '../utils/pumpValue';
import pumpEvent from '../utils/pumpEvent';

// patch up

if (window) {
	if (!window.Reno) window.Reno = {utils: {}};
	if (!Reno.utils) Reno.utils = {};
	Reno.utils.debounce = debounce;
	Reno.utils.getPath  = getPath;
	Reno.utils.pumpValue = pumpValue;
	Reno.utils.pumpEvent = pumpEvent;
}
