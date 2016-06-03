# 👁 ELDRITCH 👁

Watch js files and run them in a hidden Electron browser window when they change. Useful for prototyping, debugging, live-coding, that sort of thing.

## Installation

```
npm install -g electron-prebuilt
npm install -g eldritch
```

## Example

In one console:
```
$ eldritch foo.js
```
In another:
```
$ echo "console.log('CTHULHU FHTAGN!')" > foo.js
$ echo "let c = new AudioContext; let o = c.createOscillator(); o.connect(c.destination); o.start()" > foo.js
```
The result should be an unearthly greeting accompanied by the thin monotonous whine of accursed flutes. Pretty cool.

## Usage

```
eldritch <pattern> [<pattern>...] [options]
```

Patterns and options are passed to `chokidar.watch` https://github.com/paulmillr/chokidar#api

Your watched files are running in a hidden Electron window so you can use all the usual browser APIs. Every time you make a change the watched files are re-required in the same context. In other words, global & window state are persisted between changes.

Also, every time a watched file is changed, *all* watched files are re-required. However, unwatched dependencies of those files will not be re-required.

Inside the browser, `console` is patched to output to the node console instead of writing to the browser's own console.

## Disclaimer

Please do not use ELDRITCH to open doors man was not meant to open or meddle with forces you cannot possibly control.
