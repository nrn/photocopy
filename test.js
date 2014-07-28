var test = require('tape')
  , pc = require('./index')

test('iterate-all', function (t) {
  var a = pc([1,2,3], function (i) { return i })
  t.equal(a[1], 2, 'map identity over array')

  var b = pc([1,2,3])
  t.equal(b[0], 1, 'map identity over array by default')

  var obj = {a: 1, b:2}
  var c = pc(obj, function (v, k) { return k + v })
  t.equal(c.b, 'b2', 'modify object while copying')
  obj.b = false
  t.equal(c.b, 'b2', 'confirm copy')


  ;(function () {
    t.equal(pc(arguments)[2], 3, 'arguments object')
  }(1, 2, 3))

  var d = {foo: 'bar' }
  d.constructor = null
  t.equal(pc(d).foo, 'bar', 'no constructor')

  t.end()
})

