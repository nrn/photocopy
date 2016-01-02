var pc = require('../../index')

module.exports = empty

function empty (collection) {
  return pc(collection, null, undefined, pc.reduced)
}

