var pc = require('../../index')
// Mimic some methods from Object

module.exports = {
  keys: keys,
  values: values,
  entries: entries
}
function keys (collection) {
  return pc(collection, pc.map(function (value, key) {
    return key
  }), [])
}

function values (collection) {
  return pc(collection, null, [])
}

function entries (collection) {
  return pc(collection, pc.map(function (value, key) {
    return [ key, value ]
  }), [])
}
