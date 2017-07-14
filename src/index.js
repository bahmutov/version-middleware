'use strict'

const join = require('path').join
const exists = require('fs').existsSync
const la = require('lazy-ass')
const is = require('check-more-types')

function findBuiltInfo () {
  // assuming package.json is in the same folder
  const lastCommit = require('last-commit')
  const packageFilename = join(process.cwd(), 'package.json')
  const pkg = require(packageFilename)
  const combineShaAndVersion = git =>
    ({version: pkg.version, git})

  return lastCommit()
    .then(combineShaAndVersion)
}

const buildFilename = join(process.cwd(), 'build.json')

function loadBuildFile () {
  const data = require(buildFilename)
  la(is.unemptyString(data.version),
    buildFilename, 'is missing "version" property', data)
  la(is.commitId(data.id),
    buildFilename, 'is missing "id" property with Git sha', data)
  const renamed = {
    version: data.version,
    git: data.id.trim().substr(0, 7)
  }
  return Promise.resolve(renamed)
}

const getBuiltInfo = exists(buildFilename) ? loadBuildFile : findBuiltInfo

function versionResponse (req, res) {
  const sendResult = res.send.bind(res)
  getBuiltInfo().then(sendResult)
}

module.exports = () => versionResponse

if (!module.parent) {
  getBuiltInfo()
    .then(console.log)
    .catch(console.error)
}
