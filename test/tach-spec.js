var tach = require('../index');

var sleep = require('sleep');

var SAMPLE_DELAY = 280;
var SLEEP_SECONDS = 2;

describe('non blocking', function() {
  var callbackCounter;
  var b;

  beforeEach(function() {
    callbackCounter = 0;
  });

  it('should have zero callbacks with async functions', function(done) {
    b = new tach(function() {
      callbackCounter++;
    });
    b.start();

    // wait for enough samples
    setTimeout(function() {
      expect(b.getSampleCount()).toBe(1);
      expect(callbackCounter).toBe(0);
      expect(b.getBlockCount()).toBe(0);
      expect(b.getSamplesSinceBlock()).toBe(1);
      b.stop();
      done();
    }, SAMPLE_DELAY); // be slightly faster than the sample
  });

  it('should have a correct sample rate with async functions', function(done) {
    b = new tach({sampleInterval: 50}, function() {
      callbackCounter++;
    });
    b.start();

    // wait for enough samples
    setTimeout(function() {
      expect(b.getSampleCount()).toBe(5);
      expect(callbackCounter).toBe(0);
      expect(b.getBlockCount()).toBe(0);
      expect(b.getSamplesSinceBlock()).toBe(5);
      b.stop();
      done();
    }, SAMPLE_DELAY); // be slightly faster than 5x the sample
  });
});

describe('blocking', function() {
  var delay;
  var b;

  beforeEach(function() {
    delay = 0;
  });

  it('should have 1 sample with 1 block with blocking functions', function(done) {
    b = new tach({warnTime: 1000}, function(d) {
      delay = d;
    });
    b.start();

    setTimeout(function() {
      // wait for enough samples
      expect(b.getSampleCount()).toBe(1);
      setTimeout(function() {
        // expect another sample
        expect(b.getSampleCount()).toBe(2);
        expect(delay).toBeGreaterThan(SLEEP_SECONDS * 1000 - SAMPLE_DELAY);
        expect(b.getBlockCount()).toBe(1);
        expect(b.getSamplesSinceBlock()).toBe(0);
        b.stop();
        done();
      }, SAMPLE_DELAY);
      sleep.sleep(SLEEP_SECONDS);
    }, SAMPLE_DELAY);
  });

  it('should detect a blockage in the same scope', function(done) {
    b = new tach({warnTime: 1000}, function(d) {
      delay = d;
    });
    b.start();
    sleep.sleep(SLEEP_SECONDS);
    b.stop();

    // we still need the interval to run
    setTimeout(function() {
      expect(b.getSampleCount()).toBe(1);
      expect(delay).toBeGreaterThan(SLEEP_SECONDS * 1000 - SAMPLE_DELAY);
      expect(b.getBlockCount()).toBe(1);
      expect(b.getSamplesSinceBlock()).toBe(0);
      done();
    }, SAMPLE_DELAY);
  });
});