var has = Object.prototype.hasOwnProperty

module.exports = photocopy

function photocopy (original, fn, copy) {
  copy || (copy = new (original.constructor || Object))
  fn || (fn = identity)

  for (var i in original) {
    if (has.call(original, i)) {
      copy[i] = fn.call(copy, original[i], i)
    }
  }

  return copy
}

function identity (a) {
  return a
}

