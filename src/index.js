'use strict'

const join = require('path').join
const fs = require('fs')
const la = require('lazy-ass')
const is = require('check-more-types')
const started = new Date().toISOString()

function findBuiltInfo () {
  // assuming package.json is in the same folder
  const lastCommit = require('last-commit')
  const packageFilename = join(process.cwd(), 'package.json')
  const pkg = require(packageFilename)
  const combineShaAndVersion = git => ({ version: pkg.version, git })

  return lastCommit().then(combineShaAndVersion)
}

const buildFilename = join(process.cwd(), 'build.json')

function loadBuildFile () {
  const data = JSON.parse(fs.readFileSync(buildFilename, 'utf8'))
  la(
    is.unemptyString(data.version),
    buildFilename,
    'is missing "version" property',
    data
  )
  la(
    is.commitId(data.id),
    buildFilename,
    'is missing "id" property with Git sha',
    data
  )
  const renamed = {
    version: data.version,
    git: data.id.trim().substr(0, 7)
  }
  const full = Object.assign({}, renamed, data)
  return Promise.resolve(full)
}

function loadBuildInfoFn (filename) {
  if (fs.existsSync(filename)) {
    return loadBuildFile
  } else {
    return findBuiltInfo
  }
}

function addStarted (info) {
  info.started = started
  return info
}

function sendVersionResponse (sendResult) {
  la(is.fn(sendResult), 'send result is not a function', sendResult)
  const getBuiltInfo = loadBuildInfoFn(buildFilename)
  return getBuiltInfo()
    .then(addStarted)
    .then(sendResult)
}

const isSendArgument = args => args.length === 1 && is.fn(args[0])

function versionResponse (req, res) {
  if (isSendArgument(arguments)) {
    return sendVersionResponse(req)
  }
  if (is.fn(res.setHeader)) {
    const noCaching = [
      'max-age=0',
      'no-cache',
      'no-store',
      'no-transform',
      'must-revalidate'
    ].join(', ')
    res.setHeader('Cache-Control', noCaching)
  }
  const sendResult = res.send.bind(res)
  return sendVersionResponse(sendResult)
}

module.exports = () => versionResponse

if (!module.parent) {
  const getBuiltInfo = loadBuildInfoFn(buildFilename)
  getBuiltInfo()
    .then(console.log)
    .catch(console.error)
}
