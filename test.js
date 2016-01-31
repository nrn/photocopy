var test = require('tape')
var reduce = require('universal-reduce')
var pc = require('./index')
var done = require('./done')

function incKey (next) {
  var inc = 0
  return function (acc, value, key) {
    if (done(acc, value, key)) {
      return next(acc)
    }
    inc += 1
    return next(acc, value, 'a' + inc)
  }
}

function pair (next) {
  var isFirst = true
  var first
  return function (acc, value, key) {
    if (!isFirst) {
      isFirst = true
      return next(acc, [first, value], key)
    } else {
      isFirst = false
      first = value
      return acc
    }
  }
}

test('iterate-all', function (t) {
  var a = pc([1, 2, 3], pc.map(function (i) { return i }))
  t.equal(a[1], 2, 'map identity over array')

  var b = pc([1, 2, 3])
  t.equal(b[0], 1, 'map identity over array by default')

  t.deepEqual(pc([1, 2, 3, 4], pair), [[1, 2], [3, 4]], 'even pair')
  // also tests single item compose
  t.deepEqual(pc([1, 2, 3], pc.comp(pair)), [[1, 2], [3, undefined]], 'uneven pair')

  function all (next) {
    return function (acc, val, key) {
      if (done(acc, val, key)) {
        return next(acc)
      }
      if (!val) return reduce.reduced(false)
      return next(acc, val, key)
    }
  }

  t.equal(pc([true, false, true], all, true), false, 'early reduce')
  var symbols = {}
  var aaa = Symbol('aaa')
  symbols[aaa] = 'a'
  symbols[Symbol('bbb')] = 'b'
  symbols[Symbol('ccc')] = 'c'
  symbols.foo = 'bar'
  symbols[1] = 'baz'

  t.deepEqual(pc(symbols)[aaa], 'a', 'Copies symbol')
  t.deepEqual(pc(symbols, pc.filter(function (v, k) { return typeof k === 'symbol' }), []),
        ['a', 'b', 'c'], 'filters by key type')
  t.deepEqual(pc(symbols, pc.identity, []), ['baz', 'bar', 'a', 'b', 'c'], 'in order')

  var obj = {a: 1, b: 2}
  // also tests single item compose
  var c = pc(obj, pc.comp(pc.map(function (v, k) { return k + v })))
  t.equal(c.b, 'b2', 'modify object while copying')
  obj.b = false
  t.equal(c.b, 'b2', 'confirm copy')

  var deep = new Set()
  deep.add([1, 2, 3])
  var tmp = new Map()
  tmp.set(1, 'a')
  tmp.set(2, 'b')
  tmp.set(3, 'c')
  deep.add(tmp)
  function notA4 (value, key) {
    return key !== 'a4'
  }
  var flat = pc(deep, pc.comp(pc.cat, incKey, pc.filter(notA4)), {})
  t.deepEqual(flat, {a1: 1, a2: 2, a3: 3, a5: 'b', a6: 'c'}, 'weeeee')
  t.deepEqual(pc(flat, pc.keyMap(() => 'a'), {}, pc.byKey),
    {a: [1, 2, 3, 'b', 'c']},
    'Partition by key'
  )
  tmp.set(4, [ 'd' ])
  deep.add('e')

  t.deepEqual(pc(deep, pc.steamroll, []), [ 1, 2, 3, 'a', 'b', 'c', 'd', 'e' ], 'fully steamrolled')

  ;(function () {
    t.equal(pc(arguments)[2], 3, 'arguments object')
    t.ok(Array.isArray(pc(arguments, pc.identity, [])), 'arguments to array')
  }(1, 2, 3))

  var d = { foo: 'bar' }
  d.constructor = null
  t.equal(pc(d).foo, 'bar', 'no constructor')

  var add = function (a, b) { return a + b }
  add.foo = 'bar'

  function wrap (fn) { return function () { return fn.apply(this, arguments) } }

  var wrappedAdd = pc(add, null, wrap(add))
  t.notEqual(add, wrappedAdd, 'wrapped function not the same ref')
  t.equal(add.foo, wrappedAdd.foo, 'props transfered')
  t.equal(add(1, 2), wrappedAdd(1, 2), 'work the same')

  var take1 = pc.take(1)
  t.deepEqual(pc([1, 2, 3], take1), [ 1 ], 'take')
  t.deepEqual(pc(tmp, take1, {}), { 1: 'a' }, 'take obj')
  var skip2 = pc.skip(2)
  t.deepEqual(pc([1, 2, 3], skip2), [ 3 ], 'skip')
  t.deepEqual(pc(tmp, skip2, {}), { 3: 'c', 4: [ 'd' ] }, 'skip obj')

  var numSort = pc.sort(function (av, bv, ak, bk) {
    return av - bv
  })

  t.deepEqual(pc(new Set([3, 2, 1, 4]), numSort, []), [1, 2, 3, 4], 'numeric sort')

  t.deepEqual(pc([1, 2, 3, 2, 1, 2, 2, 2, 4, 1, 2, 2], pc.comp(
    numSort,
    numSort,
    numSort,
    numSort,
    pc.filter(function (val) { return val === 2 }),
    pc.map(function (val, key) { return +key })
  )), [ 1, 3, 5, 6, 7, 10, 11 ], 'really stable')

  t.deepEqual(
    pc(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      pc.cond(
        (val, key) => !(val % 3 === 0 || key === '9'),
        pc.identity,
        next => acc => acc // black hole
      )
    ),
    [1, 2, 4, 5, 7, 8],
    'conditional transform'
  )

  t.end()
})
