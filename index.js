var has = Object.prototype.hasOwnProperty

module.exports = photocopy

function photocopy (toCopy, fn) {
  var results = new (toCopy.constructor || Object)

  fn || (fn = identity)

  for (var i in toCopy) {
    if (has.call(toCopy, i)) {
      results[i] = fn.call(toCopy, toCopy[i], i)
    }
  }

  return results
}

function identity (a) {
  return a
}

