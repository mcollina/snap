import Snap from './snap.js'
import { test } from 'node:test'
import { deepEqual } from 'node:assert/strict'

const snap = Snap(import.meta.url)

test('a snapshot', async (t) => {
  const actual = await (await fetch('http://example.com')).text()
  const snapshot = await snap(actual)
  deepEqual(actual, snapshot)
})
