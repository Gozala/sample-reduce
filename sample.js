"use strict";

var reduce = require("reducible/reduce")
var reducible = require("reducible/reducible")
var reduced = require("reducible/reduced")
var end = require("reducible/end")
var isReduced = require("reducible/is-reduced")
var isError = require("reducible/is-error")

function sample(input, trigger) {
  /**
  Returns reducible signal of samples from the `input` every time an event
  occurs on the `trigger`. For example, `sample(position, clicks)` will return
  reducible collections of positions at a time of clicks. Result ends when
  either `input` or `trigger` ends.
  **/

  return reducible(function reduceSampled(next, initial) {
    var result              // storage for result of accumulation
    var last                // last value being yielded
    var started = false     // weather `input` already started.
    var triggered = false   // weather `trigger` already started.
    var state = initial     // currently accumulated state

    function reducer(isInput) {
      return function reduceSample(value) {
        // If result is already set by either of reducibles, it's either ended,
        // errored or consumed. In such case `reduced` state is stored in the
        // result, returning which signals source to stop.
        if (result) return result
        // If `end` or error value is yield store result and pass value down
        // the flow so that error / end can be handled.
        if (value === end || isError(value)) {
          next(value, state)
          result = reduced(state)
          return result
        }

        // If value from input update last one.
        if (isInput) last = value

        var isFirstInputAfterTrigger = !started && triggered
        var isTriggerAfterInput = !isInput && started

        // Mark appropriate source as started.
        if (isInput) started = true
        else triggered = true

        // If input value is yield after trigger has started or if
        // trigger yields after input started pass value down the flow
        // and accumulate new state.
        if (isFirstInputAfterTrigger || isTriggerAfterInput) {
          state = next(last, state)
          // If reduction is complete store result to stop another reduction
          // source.
          if (isReduced(state)) result = state
        }

        // Return state, so that in case if it is `reduced` will stop source.
        return state
      }
    }

    reduce(trigger, reducer(false))
    reduce(input, reducer(true))
  })
}

module.exports = sample
