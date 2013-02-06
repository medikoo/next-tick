'use strict';

var callable = require('es5-ext/lib/Object/valid-callable')
  , nextTick = require('./next-tick');

module.exports = function (fn) {
	var scheduled, run, context, args;
	callable(fn);
	run = function () {
		scheduled = false;
		fn.apply(context, args);
		context = null;
		args = null;
	};
	return function () {
		if (scheduled) return;
		scheduled = true;
		context = this;
		args = arguments;
		nextTick(run);
	};
};
