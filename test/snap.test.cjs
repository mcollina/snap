'use strict'

const Snap = require('../snap.cjs')
const { test } = require('node:test')
const { deepEqual } = require('node:assert/strict')
const { rm, mkdtemp } = require('node:fs/promises')
const { glob } = require('glob')
const { dirname, join } = require('node:path')

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
    const snap = Snap(__filename, { update: true, cwd })
    await check(snap)
  })

  await t.test('read', async () => {
    const snap = Snap(__filename, { cwd })
    await check(snap)
  })

  await rm(cwd, { recursive: true })
})

test('update and read in top folder', async (t) => {
  await t.test('update', async () => {
    const snap = Snap(__filename, { update: true })
    await check(snap)
  })

  await t.test('read', async () => {
    const snap = Snap(__filename)
    await check(snap)
  })

  const dir = join(dirname(__filename), '..', '.snapshots')
  const files = await glob(dir + '/**/*', { nodir: true })

  deepEqual(files.length, 2)

  await rm(dir, { recursive: true })
})
