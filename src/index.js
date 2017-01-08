'use strict'

const join = require('path').join
const exists = require('fs').existsSync

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
  return Promise.resolve(data)
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

