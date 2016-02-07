var done = require('./done')

module.exports = sort

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

