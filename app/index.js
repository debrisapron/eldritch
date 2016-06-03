'use strict'

let electron = require('electron')
let yargs = require('yargs')
let watcher = require('./watcher')

let remote = electron.remote

let fixLogging = () => {
  // Redirect console to node console
  console = remote.getGlobal('console')

  // Redirect errors to stderr
  window.addEventListener('error', function (e) {
    e.preventDefault()
    console.error(e.error.stack || 'Uncaught ' + e.error)
  })
}

// Get command-line arguments. Returns object containing specified file paths.
// TODO get named options for chokidar
let getArgs = () => {
  let remoteArgv = remote.getGlobal('process').argv
  let argv = yargs(remoteArgv).argv
  let paths = argv._.slice(2)
  return paths
}

fixLogging()
watcher.init(getArgs())
