var reduce = require('universal-reduce')
var reduced = reduce.reduced

var getStep = require('./get-step')
var done = require('./done')

module.exports = photocopy

function photocopy (original, tx, seed, step) {
  if (typeof tx !== 'function') tx = identity
  if (typeof seed === 'undefined') {
    seed = new (original.constructor || Object)
  }
  if (typeof step !== 'function') step = getStep(seed)
  // Initialize transducer
  var transducer = tx(step)
  // apply to the collection
  var acc = reduce(original, transducer, seed)
  // flush remaining state.
  var finalVal = transducer(acc)
  if (finalVal instanceof reduced) return finalVal.val
  return finalVal
}

function identity (next) {
  return next
}

function cat (next) {
  return function (acc, value, key) {
    return reduce(value, next, acc)
  }
}

var filter = simple(function (fn, next, acc, val, key) {
  return fn(val, key) ? next(acc, val, key) : acc
})

var map = simple(function (fn, next, acc, val, key) {
  return next(acc, fn(val, key), key)
})

var keyMap = simple(function (fn, next, acc, val, key) {
  return next(acc, val, fn(val, key))
})

function take (n) {
  var i = 0
  return filter(function () {
    if (i >= n) return false
    i += 1
    return true
  })
}

function skip (n) {
  var i = 0
  return filter(function () {
    if (i >= n) return true
    i += 1
    return false
  })
}

photocopy({
  identity: identity,
  cat: cat,
  simple: simple,
  filter: filter,
  map: map,
  keyMap: keyMap,
  reduced: reduced,
  byKey: byKey,
  comp: comp,
  done: done,
  take: take,
  skip: skip
}, null, photocopy)

function byKey (acc, value, key) {
  if (done(acc, value, key)) {
    return acc
  }
  var arr = acc[key] || (acc[key] = [])
  arr.push(value)
  return acc
}

function simple (setup) {
  return function (fn) {
    return function (next) {
      // setup state here
      return function (acc, val, key) {
        if (done(acc, val, key)) {
          return next.apply(null, arguments)
        }
        return setup(fn, next, acc, val, key)
      }
    }
  }
}

function comp () {
  var args = Array.prototype.slice.call(arguments)
  return function (next) {
    return args.reduceRight(function (acc, fn) {
      return fn(acc)
    }, next)
  }
}
