'use strict';

var callable = require('es5-ext/lib/Object/valid-callable')
  , nextTick = require('./next-tick');

module.exports = function (fn/*, timeout*/) {
	var scheduled, run, context, args, timeout, ntFn, index;
	callable(fn);
	timeout = arguments[1] >>> 0;
	if (!timeout) ntFn = nextTick;
	else ntFn = function (cb) { return setTimeout(cb, timeout); };
	run = function () {
		scheduled = false;
		index = null;
		fn.apply(context, args);
		context = null;
		args = null;
	};
	return function () {
		if (scheduled) {
			if (index == null) return;
			clearTimeout(index);
		}
		scheduled = true;
		context = this;
		args = arguments;
		index = ntFn(run);
	};
};
