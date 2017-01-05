'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')

/* global describe, it */
describe('version-middleware', () => {
  const middleware = require('.')

  it('is a function', () => {
    la(is.fn(middleware))
  })

  it('returns a function', () => {
    const version = middleware()
    la(is.fn(version))
  })

  it('returns npm version and git SHA', (done) => {
    const version = middleware()
    const response = {
      send: data => {
        la(is.object(data), 'expected data')
        la(is.unemptyString(data.version), 'missing version', data)
        la(is.shortCommitId(data.git), 'missing git', data)
        done()
      }
    }
    version(null, response)
  })
})
