'use strict'

const lastCommit = require('last-commit')
const join = require('path').join
// assuming package.json is in the same folder
const packageFilename = join(process.cwd(), 'package.json')
const pkg = require(packageFilename)

const combineShaAndVersion = git =>
  ({version: pkg.version, git})

function versionResponse (req, res) {
  const sendResult = res.send.bind(res)
  lastCommit()
    .then(combineShaAndVersion)
    .then(sendResult)
}

module.exports = () => versionResponse

