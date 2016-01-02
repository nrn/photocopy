var test = require('tape')
var empty = require('./index.js')

test('empty example', function (t) {
  var obj = { foo: 'bar' }
  t.equal(Object.keys(empty(obj)).length, 0, 'no keys in obj')
  var array = [ 1, 2, 3 ]
  t.equal(Array.isArray(empty(array)), true, 'is array')
  t.equal(empty(array).length, 0, 'array is empty')
  var set = new Set(array)
  t.equal(empty(set).size, 0, 'set is empty')
  var map = new Map([[1, 2], [3, 4]])
  t.equal(empty(map).size, 0, 'map is empty')
  t.end()
})
