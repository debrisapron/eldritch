'use strict'

let path = require('path')
let chokidar = require('chokidar')

let requires = {}

let reloadFiles = () => {
  console.info('\x1b[32m%s\x1b[0m', '👁 Changes detected, re-requiring watched files')
  let names = Object.keys(requires).map((k) => requires[k])
  names.forEach((name) => delete require.cache[require.resolve(name)])
  names.forEach((name) => require(name))
}

let requirify = (filename) => {
  let relativePath = path.relative(__dirname, filename)
  return `./${ relativePath }`
}

let add = (filename) => {
  if (!requires[filename]) {
    let name = requirify(filename)
    requires[filename] = name
  }
  reloadFiles()
}

let remove = (filename) => {
  delete requires[filename]
  reloadFiles()
}

let init = (paths, opts) => {
  let watcher = chokidar.watch(paths, opts)
  watcher
    .on('add', add)
    .on('change', add)
    .on('unlink', remove)
  console.info('\x1b[32m%s\x1b[0m', '👁 ELDRITCH 👁 is watching')
}

module.exports = { init }
