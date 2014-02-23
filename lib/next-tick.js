'use strict';

var root = typeof window !== 'undefined' ? window :
		typeof global !== 'undefined' ? global : {};

if ((typeof process !== 'undefined') && process &&
		(typeof process.nextTick === 'function')) {

	// Node.js
	module.exports = process.nextTick;

} else if (typeof MutationObserver !== 'undefined' ||
		typeof WebkitMutationObserver !== 'undefined') {

	var Observer = root.MutationObserver || root.WebkitMutationObserver;
	module.exports = function (cb) {
		var elem = document.createElement('div')
		new Observer(cb).observe(elem, { attributes: true })
		elem.setAttribute('x', 'y')
	};

} else if (typeof setImmediate === 'function') {

	// W3C Draft
	// http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
	module.exports = function (cb) { setImmediate(cb); };

} else {

	// Wide available standard
	module.exports = function (cb) { setTimeout(cb, 0); };
}
