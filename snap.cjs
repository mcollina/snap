'use strict'

let _Snap
async function getSnap () {
  if (_Snap) return _Snap

  _Snap = await import('./snap.js')
  return _Snap
}

module.exports = function (...args) {
  let _snap

  async function getInstance () {
    if (_snap) return _snap

    _snap = (await getSnap()).default(...args)
    return _snap
  }

  return async function snap (...args) {
    const instance = await getInstance()
    return instance(...args)
  }
}
