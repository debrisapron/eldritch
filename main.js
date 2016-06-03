'use strict'

let electron = require('electron')
let { app, BrowserWindow } = electron

app.on('ready', () => {
  let win = new BrowserWindow({ show: false })
  win.loadURL(`file://${__dirname}/app/index.html`)
})
