'use strict'

let fs = require('fs')
let childProcess = require('child_process')
let _ = require('lodash')
let test = require('tape')
let { series } = require('async')
let rimraf = require('rimraf')

let TMP_FOLDER_PREFIX = '__TEST-TMP-DELETE-ME-'
let DEBOUNCE_INTERVAL = 100
let STARTUP_MSG = '\u001b[32m👁 ELDRITCH 👁 is watching\u001b[0m'
let CHANGE_MSG = '\u001b[32m👁 Changes detected, re-requiring watched files\u001b[0m'

let mkdir = () => fs.mkdtempSync(TMP_FOLDER_PREFIX)

let killChild = (child) => process.kill(-child.pid)

let rmdir = () => rimraf.sync(TMP_FOLDER_PREFIX + '*')

let eldritchSpawn = (args) => {
  return childProcess.spawn('bin/eldritch', args, { detached: true })
}

let getStdout = _.curry((child, cb) => {
  let logs = []
  let listener = (data) => {
    logs.push(data.toString().trim())
    returnLogs()
  }
  let returnLogs = _.debounce(() => {
    child.stdout.removeListener('data', listener)
    cb(null, logs)
  }, DEBOUNCE_INTERVAL)
  child.stdout.on('data', listener)
})

test('add a single file', (t) => {
  let dir = mkdir()
  let fileA = `${ dir }/a.js`
  let child = eldritchSpawn([fileA])
  series([
    getStdout(child),
    (cb) => fs.writeFile(fileA, 'console.log("FOO")', cb),
    getStdout(child)
  ], (err, logs) => {
    if (err) { throw err }
    logs = _.compact(_.flatten(logs))
    t.deepEqual(logs, [STARTUP_MSG, CHANGE_MSG, 'FOO'])
    killChild(child)
    rmdir()
    t.end()
  })
})

test('change a single file', (t) => {
  let dir = mkdir()
  let fileA = `${ dir }/a.js`
  fs.writeFileSync(fileA, 'console.log("FOO")')
  let child = eldritchSpawn([fileA])
  series([
    getStdout(child),
    (cb) => fs.writeFile(fileA, 'console.log("BAR")', cb),
    getStdout(child)
  ], (err, logs) => {
    if (err) { throw err }
    logs = _.compact(_.flatten(logs))
    t.deepEqual(logs, [STARTUP_MSG, CHANGE_MSG, 'FOO', CHANGE_MSG, 'BAR'])
    killChild(child)
    rmdir()
    t.end()
  })
})
