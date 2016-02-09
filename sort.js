var done = require('./done')
var reduce = require('universal-reduce')
var splay = require('splay')

module.exports = sort

function sort (fn) {
  return function (next) {
    var root = null
    return function (acc, val, key) {
      if (done(acc, val, key)) {
        splay.seqRead(root, function (node) {
          if (!reduce.isReduced(acc)) {
            acc = next(acc, node.value, node.key)
          }
        })
        return next(acc)
      }
      root = splay.insert(root, new splay.Node(key, val), fn)
      return acc
    }
  }
}
