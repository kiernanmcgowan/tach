tach
===

[![Greenkeeper badge](https://badges.greenkeeper.io/kiernanmcgowan/tach.svg)](https://greenkeeper.io/)

Utility function to detect if a script is blocking longer that a certain period of time. Useful when working with socket.io to make sure that heartbeats can continue to flow. Intended for debugging use only.

```
npm install tach
```

How it works
---

`tach` uses setInterval to sample the current time as a thread runs. If there is a large time difference between intervals, then we assume a thread is being blocked.

Use
---

Basic:

```
var t = new tach(function(delay) {
  // this call back will be called in the case of a block
});
t.start();

// let your script run, tach will sample the thread
fs.readFileSync('some/really/big/file');

// you can check the status of everything whenever you want
t.getBlockCount();
t.getSampleCount();
t.getSamplesSinceBlock();

t.stop();

// and tach will no longer sample your thread.
```

With Options:
```
var opts = {
  // delay in milliseconds to consider a block
  warnTime: 10000,
  // frequency in milliseconds to sample thread
  sampleTime: 500
};
var t = new tach(opts, function(delay) {

});
```

License
---

Copyright (c) 2014 Kiernan Tim McGowan (dropdownmenu)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
