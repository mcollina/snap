import Snap from '../snap.js'
import { test } from 'node:test'
import { deepEqual, rejects } from 'node:assert/strict'
import { rm, mkdtemp } from 'node:fs/promises'
import { join } from 'desm'
import { glob } from 'glob'

delete process.env.CI

async function check (snap) {
  {
    const obj = { foo: 'bar' }
    const _obj = await snap(obj)

    deepEqual(obj, _obj)
  }

  {
    const obj = 'hello world'
    const _obj = await snap(obj)

    deepEqual(obj, _obj)
  }
}

test('update and read', async (t) => {
  const cwd = await mkdtemp('snap-test-')

  await t.test('update', async () => {
    const snap = Snap(import.meta.url, { update: true, cwd })
    await check(snap)
  })

  await t.test('read', async () => {
    const snap = Snap(import.meta.url, { cwd })
    await check(snap)
  })

  await rm(cwd, { recursive: true })
})

test('update and read in top folder', async (t) => {
  await t.test('update', async () => {
    const snap = Snap(import.meta.url, { update: true })
    await check(snap)
  })

  await t.test('read', async () => {
    const snap = Snap(import.meta.url)
    await check(snap)
  })

  const dir = join(import.meta.url, '..', '.snapshots')
  const files = await glob(dir + '/**/*', { nodir: true })

  deepEqual(files.length, 2)

  await rm(dir, { recursive: true })
})

test('no update', async (t) => {
  const cwd = await mkdtemp('snap-test-')

  await t.test('write', async () => {
    const snap = Snap(import.meta.url, { cwd })
    await check(snap)
  })

  await t.test('read', async () => {
    const snap = Snap(import.meta.url, { cwd })
    await check(snap)
  })

  await rm(cwd, { recursive: true })
})

test('no update fails in CI', async (t) => {
  const cwd = await mkdtemp('snap-test-')

  const snap = Snap(import.meta.url, { cwd })

  const ci = process.env.CI
  process.env.CI = 'true'
  t.after(() => {
    if (ci) {
      process.env.CI = ci
    } else {
      delete process.env.CI
    }
  })
  const obj = { foo: 'bar' }
  await rejects(snap(obj))

  await rm(cwd, { recursive: true })
})
