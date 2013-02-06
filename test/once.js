'use strict';

module.exports = function (t, a, d) {
	var called = 0, fn = t(function () { ++called; });

	fn();
	fn();
	fn();
	setTimeout(function () {
		a(called, 1);
		d();
	}, 10);
};
