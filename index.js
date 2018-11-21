'use strict';

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
	      if ((typeof process === 'object') && process && (typeof process.nextTick === 'function')) {
		      module.exports = process.nextTick;
	      } else {
          module.exports = factory();
	      }
    } else {
        // Browser globals (root is window)
        // include process polyfil
        root.process = root.process || {}
        root.process.nextTick = root.process.nextTick || factory();
  }
}((typeof global === 'object' && global.global === global && global) ||
    (typeof window === 'object' && window.window === window && window) ||
    (typeof self === 'object' && self.self === self && self) ||
    this, function () {

  var ensureCallable = function (fn) {
	  if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	  return fn;
  };

  var byObserver = function (Observer) {
	  var node = document.createTextNode(''), queue, currentQueue, i = 0;
	  new Observer(function () {
		  var callback;
		  if (!queue) {
			  if (!currentQueue) return;
			  queue = currentQueue;
		  } else if (currentQueue) {
			  queue = currentQueue.concat(queue);
		  }
		  currentQueue = queue;
		  queue = null;
		  if (typeof currentQueue === 'function') {
			  callback = currentQueue;
			  currentQueue = null;
			  callback();
			  return;
		  }
		  node.data = (i = ++i % 2); // Invoke other batch, to handle leftover callbacks in case of crash
		  while (currentQueue) {
			  callback = currentQueue.shift();
			  if (!currentQueue.length) currentQueue = null;
			  callback();
		  }
	  }).observe(node, { characterData: true });
	  return function (fn) {
		  ensureCallable(fn);
		  if (queue) {
			  if (typeof queue === 'function') queue = [queue, fn];
			  else queue.push(fn);
			  return;
		  }
		  queue = fn;
		  node.data = (i = ++i % 2);
	  };
  };
  // MutationObserver
  if ((typeof document === 'object') && document) {
	  if (typeof MutationObserver === 'function') return byObserver(MutationObserver);
	  if (typeof WebKitMutationObserver === 'function') return byObserver(WebKitMutationObserver);
  }

  // W3C Draft
  // http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
  if (typeof setImmediate === 'function') {
	  return function (cb) { setImmediate(ensureCallable(cb)); };
  }

  // Wide available standard
  if ((typeof setTimeout === 'function') || (typeof setTimeout === 'object')) {
	  return function (cb) { setTimeout(ensureCallable(cb), 0); };
  }

  return null;
}));
