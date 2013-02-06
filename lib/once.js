'use strict';

var nextTick = require('./next-tick');

module.exports = function (fn) {
	var scheduled, run;
	run = function () {
		scheduled = false;
		fn();
	};
	return function () {
		if (scheduled) return;
		scheduled = true;
		nextTick(run);
	};
};
