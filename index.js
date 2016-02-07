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
  return reduce.unwrap(_photocopy(original, tx, seed, step))
}

function _photocopy (original, tx, seed, step) {
  if (typeof tx !== 'function') tx = identity
  if (typeof seed === 'undefined') {
    seed = new (original.constructor || Object)
  }
  if (typeof step !== 'function') step = getStep(seed)
  // Initialize transducer
  var transducer = tx(step)

  return transducer(reduce._reduce(original, transducer, seed))
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

function cond (condition, ifTrue, ifFalse) {
  ifFalse = ifFalse != null ? ifFalse : identity

  return function (next) {
    next = condNextWrapper(next)
    ifTrue = ifTrue(next)
    ifFalse = ifFalse(next)

    return function (acc, val, key) {
      if (done(acc, val, key)) {
        return ifFalse(ifTrue(acc, val, key))
      }
      var fn = condition(val, key) ? ifTrue : ifFalse
      return fn(acc, val, key)
    }
  }
}

function condNextWrapper (next) {
  var isFirstBranch = true

  return function (acc, val, key) {
    if (done(acc, val, key) && isFirstBranch) {
      isFirstBranch = false
      return acc
    }

    return next(acc, val, key)
  }
}

function sort (fn) {
  return function (next) {
    var root = null
    return function (acc, val, key) {
      var path = []
      if (done(acc, val, key)) {
        return next(seqRead(root, next, acc))
      }
      root = place(key, val, fn, root, path)
      root = splay(path, path.pop())
      return acc
    }
  }
}
function seqRead (root, next, acc) {
  var node = root
  var path = []

  while (node.left) {
    path.push(node)
    node = node.left
  }
  node = splay(path, node)
  acc = next(acc, node.value, node.key)

  while (node.right) {
    path = [node]
    node = node.right
    while (node.left) {
      path.push(node)
      node = node.left
    }
    node = splay(path, node)
    acc = next(acc, node.value, node.key)
  }
  return acc
}

function splay (path, root) {
  var par
  var gp
  var ggp
  var tmp
  while (true) {
    par = path.pop()
    gp = path.pop()
    ggp = path[path.length - 1]
    if (!par) break
    if (root === par.right) {
      tmp = root.left
      root.left = par
      par.right = tmp
      if (gp && par === gp.right) {
        tmp = par.left
        par.left = gp
        gp.right = tmp
      } else if (gp) {
        tmp = root.right
        root.right = gp
        gp.left = tmp
      }
    } else {
      tmp = root.right
      root.right = par
      par.left = tmp
      if (gp && par === gp.left) {
        tmp = par.right
        par.right = gp
        gp.left = tmp
      } else if (gp) {
        tmp = root.left
        root.left = gp
        gp.right = tmp
      }
    }
    if (!ggp) break
    if (ggp.left === gp) {
      ggp.left = root
    } else {
      ggp.right = root
    }
  }

  return root
}

function place (key, val, compare, node, path) {
  if (!node) {
    node = new SplayNode(key, val)
    path.push(node)
    return node
  }
  path.push(node)
  if (compare(val, node.value, key, node.key) < 0) {
    node.left = place(key, val, compare, node.left, path)
  } else {
    node.right = place(key, val, compare, node.right, path)
  }
  return node
}

function SplayNode (key, value) {
  this.value = value
  this.key = key
  this.left = null
  this.right = null
}

photocopy({
  identity: identity,
  cat: cat,
  steamroll: steamroll,
  simple: simple,
  filter: filter,
  map: map,
  keyMap: keyMap,
  reduced: reduce.reduced,
  byKey: byKey,
  cond: cond,
  comp: comp,
  done: done,
  take: take,
  skip: skip,
  sort: sort,
  _photocopy: _photocopy
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

