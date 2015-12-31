var pc = require('../../index')

module.exports = unique

function unique (collection, seed) {
  var seen = new FakeSet()
  function once (item) {
    if (!seen.has(item)) {
      seen.add(item)
      return true
    }
    return false
  }
  return pc(collection, pc.filter(once), seed)
}

function FakeSet () {
  if (typeof Set === 'function') {
    return new Set()
  }
  this._stuff = []
}

FakeSet.prototype.add = function (item) {
  this._stuff.push(item)
}

FakeSet.prototype.has = function (item) {
  return this._stuff.indexOf(item) !== -1
}
