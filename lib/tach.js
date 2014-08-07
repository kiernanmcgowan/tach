// tach.js
// runs a check interval function and detects time delay
var _ = require('underscore');

var __DEFAULTS = {
  // 15 seconds
  warnTime: 15 * 1000,
  // 250 milliseconds
  sampleInterval: 250
};

function tach(opts, callback) {
  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function');
  }

  // extend the defaults
  var objOpts = _.defaults(opts, __DEFAULTS);

  var _blockCount = 0;
  var _sampleCount = 0;
  var _samplesSinceBlock = 0;
  var _intervalId;
  var _stopAtNextInterval = false;

  var lastSampleTime = null;

  var nextFn = function(cb) {
    // use nextTick if on server, otherwise setTimeout will work
    if (typeof process === 'object') {
      process.nextTick(cb);
    } else {
      setTimeout(cb, 0);
    }
  };

  var checkFn = function() {
    _sampleCount++;
    var delay = Date.now() - lastSampleTime - objOpts.sampleInterval;
    if (delay > objOpts.warnTime) {
      _samplesSinceBlock = 0;
      _blockCount++;
      callback(delay);
    } else {
      _samplesSinceBlock++;
    }
    lastSampleTime = Date.now();
    if (_stopAtNextInterval) {
      clearInterval(_intervalId);
    }
  };

  this.getBlockCount = function() {
    return _blockCount;
  };

  this.getSampleCount = function() {
    return _sampleCount;
  };

  this.getSamplesSinceBlock = function() {
    return _samplesSinceBlock;
  };

  this.start = function() {
    if (!_intervalId) {
      lastSampleTime = Date.now();
      //checkFn();
      _intervalId = setInterval(checkFn, objOpts.sampleInterval);
    } else {
      throw new Error('tach test already started');
    }
  };

  this.stop = function() {
    if (_intervalId && !_stopAtNextInterval) {
      _stopAtNextInterval = true;
    } else if (!_intervalId) {
      throw new Error('tach test not started');
    }
  };
}
module.exports = tach;
