'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')

/* global describe, it */
describe('version-middleware', () => {
  const setup = require('.')

  it('is a function', () => {
    la(is.fn(setup))
  })

  it('returns a function', () => {
    const middleware = setup()
    la(is.fn(middleware))
  })
})
