import Snap from './snap.js'
import { test } from 'node:test'
import { deepEqual, notDeepEqual } from 'node:assert/strict'
import { rm, mkdtemp } from 'node:fs/promises'
import { expectType } from 'tsd'

test('update and read', async (t) => {
  const cwd = await mkdtemp('snap-test-')

  await t.test('update', async () => {
    const snap = Snap(import.meta.url, { update: true, cwd })
    const obj = { foo: 'bar' }
    const _obj = await snap(obj)
    expectType<any>(_obj)
    deepEqual(obj, _obj)
  })

  await t.test('read', async () => {
    const snap = Snap(import.meta.url, { cwd })
    const obj = { foo: 'bar' }
    const _obj = await snap(obj)
    expectType<any>(_obj)
    deepEqual(obj, _obj)
  })

  await t.test('fail', async () => {
    const snap = Snap(import.meta.url)
    const obj = { foo: 'bar' }
    const _obj = await snap(obj)
    expectType<any>(_obj)
    notDeepEqual(obj, _obj)
  })

  await rm(cwd, { recursive: true })
})
