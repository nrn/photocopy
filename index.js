var reduce = require('universal-reduce')

module.exports = photocopy

function photocopy (original, fn, copy) {
  copy || (copy = new (original.constructor || Object))
  fn || (fn = identity)

  return reduce(original, photo(fn), copy)
}

function photo (fn) {
  return function (copy, value, key) {
    copy[key] = fn.call(copy, value, key)
    return copy
  }
}

function identity (a) {
  return a
}
