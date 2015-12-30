var test = require('tape')
var extend = require('./index')

test('extend', function (t) {
  var target = {}
  extend(target, { a: 1, b: 2 }, { c: 3 }, { a: 4, 0: 100 }, [ 1 ])
  t.deepEqual(target, { 0: 1, a: 4, b: 2, c: 3 }, 'Smashes into object')
  t.end()
})

test('extend', { skip: typeof Map !== 'function' }, function (t) {
  var target = new Map()
  var result = new Map([['0', 1], ['a', 4], ['b', 2], ['c', 3]])
  extend(target, { a: 1, b: 2 }, { c: 3 }, { a: 4, 0: 100 }, new Map([['0', 1]]))
  target.forEach(function (val, key) {
    t.equal(val, result.get(key), 'Smashed ' + key + ' into map')
  })
  t.end()
})
