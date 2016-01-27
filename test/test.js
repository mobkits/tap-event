/*global describe, it, beforeEach, afterEach*/
var assert = require('assert')
var Touch = require('touch-simulate')
var tap = require('..')

var el
beforeEach(function () {
  el = document.createElement('div')
  el.style.height = '10px'
  el.style.width = '10px'
  document.body.appendChild(el)
})

afterEach(function () {
  document.body.removeChild(el)
})

describe('tap', function() {
  it('should tap', function () {
    var fired
    function ontap() {
      fired = true
    }
    el.addEventListener('touchstart', tap(ontap))
    var touch = Touch(el)
    return touch.tap().then(function () {
      assert.equal(fired, true)
    })
  })

  it('should not tap when holding too long', function () {
    var fired
    function ontap() {
      fired = true
    }
    el.addEventListener('touchstart', tap(ontap, {timeout: 100}))
    var touch = Touch(el)
    return touch.tap(null, 110).then(function () {
      assert.notEqual(fired, true)
    })
  })

  it('should not tap when moved', function () {
    var fired
    function ontap() {
      fired = true
    }
    el.addEventListener('touchstart', tap(ontap))
    var touch = Touch(el, {speed: 200})
    touch.start()
    touch.moveUp(5).wait(200).then(function () {
      assert.notEqual(fired, true)
    })
  })

  it('should not tap when clinetX or clientY changed', function (done) {
    var fired
    function ontap() {
      fired = true
    }
    el.addEventListener('touchstart', tap(ontap))
    var touch = Touch(el)
    touch.fireEvent('touchstart', 1, 1)
    setTimeout(function () {
      touch.fireEvent('touchend', 1, 2)
      assert.notEqual(fired, true)
      done()
    },100)
  })

  it('should preserve context and arguments', function () {
    var context = {}
    var fired
    context.ontap = tap(function(e, order) {
      fired = true
      assert.equal(order, 'desc')
      assert.equal(this, context)
    })

    el.addEventListener('touchstart', function (e) {
      context.ontap(e, 'desc')
    })
    var touch = Touch(el)
    return touch.tap().then(function () {
      assert.equal(fired, true)
    })
  })
})
