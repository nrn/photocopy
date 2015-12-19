var reduce = require('universal-reduce')
var reduced = reduce.reduced

var getStep = require('./get-step')

module.exports = photocopy

function photocopy (original, tx, seed, step) {
  if (typeof tx !== 'function') tx = identity
  if (typeof seed === 'undefined') seed = new (original.constructor || Object)
  if (typeof step !== 'function') step = getStep(seed)

  return reduce(original, tx(step), seed)
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

photocopy({
  identity: identity,
  cat: cat,
  simple: simple,
  filter: filter,
  map: map,
  keyMap: keyMap,
  reduced: reduced,
  byKey: byKey,
  comp: comp
}, null, photocopy)

function byKey (acc, value, key) {
  var arr = acc[key] || (acc[key] = [])
  arr.push(value)
  return acc
}

function simple (setup) {
  return function (fn) {
    return function (next) {
      // setup state here
      return function (acc, val, key) {
        if (typeof acc === 'undefined' || acc instanceof reduced) return next(acc, val, key)
        if (typeof val === 'undefined') return next(acc, val, key)
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
