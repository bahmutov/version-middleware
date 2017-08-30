'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const sinon = require('sinon')
const { join } = require('path')
const fs = require('fs')
const R = require('ramda')
const snapshot = require('snap-shot-it')

/* eslint-env mocha */
describe('version-middleware', () => {
  const middleware = require('.')

  it('is a function', () => {
    la(is.fn(middleware))
  })

  it('returns a function', () => {
    const version = middleware()
    la(is.fn(version))
  })

  it('returns an object', done => {
    const version = middleware()
    const response = {
      send: data => {
        la(is.object(data), 'expected data')
        done()
      }
    }
    version(null, response)
  })

  it('returns npm version and git SHA', done => {
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

  it('returns date service started', done => {
    const version = middleware()
    const response = {
      send: data => {
        la(is.unemptyString(data.started), 'missing when started', data)
        done()
      }
    }
    version(null, response)
  })

  it('can call supplied send version instead of using response', done => {
    let result
    const send = info => {
      result = info
    }
    const version = middleware()
    version(send).then(() => {
      la(result, 'result is undefined')
      la(result.version, 'missing version', result)
      la(result.git, 'missing short git', result)
      done()
    })
  })

  describe('using build.json', () => {
    const sandbox = sinon.sandbox.create()
    const buildFilename = join(process.cwd(), 'build.json')
    const build = {
      version: '1.2.3',
      id: '330556f921702ddf207f6e2fa932e3fe5d08fb38',
      foo: 'is extra data'
    }

    beforeEach(() => {
      sandbox
        .stub(fs, 'existsSync')
        .withArgs(buildFilename)
        .returns(true)
      sandbox
        .stub(fs, 'readFileSync')
        .withArgs(buildFilename, 'utf8')
        .returns(JSON.stringify(build))
    })

    it('loads extra stuff from build.json', done => {
      let result
      // normalize transient properties
      const normalize = R.evolve({
        started: s => s.replace(/./g, 'x')
      })
      const send = info => {
        result = normalize(info)
      }
      const version = middleware()
      version(send).then(() => {
        sandbox.restore()
        snapshot(result)
        done()
      })
    })

    afterEach(() => {
      sandbox.restore()
    })
  })
})
