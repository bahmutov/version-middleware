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

  it('returns an object', (done) => {
    const version = middleware()
    const response = {
      send: data => {
        la(is.object(data), 'expected data')
        done()
      }
    }
    version(null, response)
  })

  it('returns npm version and git SHA', (done) => {
    const version = middleware()
    const response = {
      send: data => {
        la(is.unemptyString(data.version), 'missing version', data)
        la(is.shortCommitId(data.git), 'invalid git property', data)
        done()
      }
    }
    version(null, response)
  })

  it('returns date service started', (done) => {
    const version = middleware()
    const response = {
      send: data => {
        la(is.unemptyString(data.started), 'missing when started', data)
        done()
      }
    }
    version(null, response)
  })
})
