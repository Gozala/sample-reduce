# sample

[![Build Status](https://secure.travis-ci.org/Gozala/sample-reduce.png)](http://travis-ci.org/Gozala/sample-reduce)

Library for sampling reducible signals (not very useful non eventual data
structures as it's time based operation).

## Docs

```js
function sample(input, trigger, assemble) {
  /**
  Returns reducible signal of samples from the `input` every time an event
  occurs on the `trigger`. For example, `sample(position, clicks)` will return
  reducible collections of positions at a time of clicks. Result ends when
  either `input` or `trigger` ends. Optionally `assemble` function may be
  passed as a third argument, in which case it will be invoked at every sample
  with value from `input` and `trigger` and expected to return assembled
  sample.
  **/
}
```

## Install

    npm install sample
