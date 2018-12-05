import '../styles/main.scss';

// utilities
import apportion from '../utils/apportion';
import bsearch from '../utils/bsearch';
import clean from '../utils/clean';
import cleanRegExp from '../utils/cleanRegExp';
import clone from '../utils/clone';
import debounce from '../utils/debounce';
import delay from '../utils/delay';
import * as modal from '../utils/modal';
import getPath from '../utils/getPath';
import isEqual from '../utils/isEqual';
import pumpEvent from '../utils/pumpEvent';
import pumpValue from '../utils/pumpValue';
import * as popup from '../utils/popup';
import seq from '../utils/seq';
import throttle from '../utils/throttle';
import * as busy from '../utils/busy';

import formatCurrency from '../utils/formatCurrency';
import formatNumber from '../utils/formatNumber';
import toPrecision from '../utils/toPrecision';
import toTitleCase from '../utils/toTitleCase';

// utilities: dnd
import start from '../utils/dnd/start';
import {init, over, moving, movingX, movingY} from '../utils/dnd/common';
import {dropX, dropY} from '../utils/dnd/rearrangeable';

// patch up
if (window) {
  if (!window.Reno) window.Reno = {utils: {}};
  if (!Reno.utils) Reno.utils = {};

  Reno.utils.apportion = apportion;
  Reno.utils.bsearch = bsearch;
  Reno.utils.clean = clean;
  Reno.utils.cleanRegExp = cleanRegExp;
  Reno.utils.clone = clone;
  Reno.utils.debounce = debounce;
  Reno.utils.delay = delay;
  Reno.utils.modal = modal;
  Reno.utils.getPath = getPath;
  Reno.utils.isEqual = isEqual;
  Reno.utils.pumpEvent = pumpEvent;
  Reno.utils.pumpValue = pumpValue;
  Reno.utils.popup = popup;
  Reno.utils.seq = seq;
  Reno.utils.throttle = throttle;
  Reno.utils.busy = busy;

  Reno.utils.formatCurrency = formatCurrency;
  Reno.utils.formatNumber = formatNumber;
  Reno.utils.toPrecision = toPrecision;
  Reno.utils.toTitleCase = toTitleCase;

  Reno.utils.dnd = {start, init, over, moving, movingX, movingY, rearrangeable: {dropX, dropY}};
}
