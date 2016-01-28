var reduce = require('universal-reduce')

var getStep = require('./get-step')
var done = require('./done')

var basic = {
  'string': true,
  'number': true,
  'boolean': true,
  'symbol': true,
  'function': true
}

module.exports = photocopy

function photocopy (original, tx, seed, step) {
  if (typeof tx !== 'function') tx = identity
  if (typeof seed === 'undefined') {
    seed = new (original.constructor || Object)
  }
  if (typeof step !== 'function') step = getStep(seed)
  // Initialize transducer
  var transducer = tx(step)

  return reduce.unwrap(
    transducer(
      reduce(original, transducer, seed)
    )
  )
}

function identity (next) {
  return next
}

function cat (next) {
  return function (acc, value, key) {
    if (done(acc, value, key)) {
      return next.apply(null, arguments)
    }
    return photocopy(value, identity, acc, next)
  }
}

function steamroll (next) {
  return function inner (acc, value, key) {
    if (done(acc, value, key)) {
      return next.apply(null, arguments)
    }
    if (value == null || typeof value in basic) return next(acc, value, key)
    return photocopy(value, identity, acc, inner)
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
  return function (next) {
    var i = 0
    return function (acc, val, key) {
      if (done(acc, val, key)) {
        return next.apply(null, arguments)
      }
      if (i >= n) return acc
      i += 1
      return next(acc, val, key)
    }
  }
}

function skip (n) {
  return function (next) {
    var i = 0
    return function (acc, val, key) {
      if (done(acc, val, key)) {
        return next.apply(null, arguments)
      }
      if (i >= n) return next(acc, val, key)
      i += 1
      return acc
    }
  }
}

photocopy({
  identity: identity,
  cat: cat,
  steamroll: steamroll,
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
}, identity, photocopy)

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
  return photocopy(arguments, identity, null, fnStep)
}

function fnStep (acc, value, key) {
  if (acc == null) return value
  if (done(acc, value, key)) {
    return acc
  }
  return function (next) {
    return acc(value(next))
  }
}

function reduced (val) {
  return reduce.reduced(reduce.reduced(val))
}
