var done = require('./done')
var reduce = require('universal-reduce')
var splay = require('splay')

module.exports = sort

function sort (fn) {
  return function (next) {
    var root = splay(compareor(fn))
    return function (acc, val, key) {
      if (done(acc, val, key)) {
        root.forEach(function (item) {
          if (!reduce.isReduced(acc)) {
            acc = next(acc, item.value, item.key)
          }
        })
        return next(acc)
      }
      root = root.insert({ key: key, value: val })
      return acc
    }
  }
}

function compareor (fn) {
  return function (a, b) {
    return fn(a.value, b.value, a.key, b.key)
  }
}

