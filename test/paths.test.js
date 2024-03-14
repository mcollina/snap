import Snap from '../snap.js'
import { test } from 'node:test'
import { rm, mkdtemp, writeFile, mkdir, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { notDeepEqual, rejects, deepEqual } from 'node:assert/strict'
import { createHash } from 'node:crypto'

delete process.env.CI

test('actual path written', async (t) => {
  const cwd = await mkdtemp('snap-test-')
  t.after(async () => {
    await rm(cwd, { recursive: true })
  })

  const hash = createHash('md5').update('./test/paths.test.js').digest('hex')

  // Store snapshot manually
  await mkdir(join(cwd, hash), { recursive: true })

  const toWrite = join(cwd, hash, '0.json')
  await writeFile(toWrite, JSON.stringify('hello world2'))

  const snap = Snap(import.meta.url, { cwd })

  const actual = 'actual'
  const snapshot = await snap(actual)
  // the returned valued is cached on disk,
  // so this will fail
  notDeepEqual(actual, snapshot)
})

test('rethrow reading', async (t) => {
  const cwd = await mkdtemp('snap-test-')
  t.after(async () => {
    await rm(cwd, { recursive: true })
  })

  const hash = createHash('md5').update('./test/paths.test.js').digest('hex')

  // Store snapshot manually
  await mkdir(join(cwd, hash), { recursive: true })

  const toWrite = join(cwd, hash, '0.json')
  await writeFile(toWrite, 'hello world2')

  const snap = Snap(import.meta.url, { cwd })

  const actual = 'actual'
  await rejects(snap(actual))
})

test('actually writes the right file', async (t) => {
  const cwd = await mkdtemp('snap-test-')
  t.after(async () => {
    await rm(cwd, { recursive: true })
  })

  const hash = createHash('md5').update('./test/paths.test.js').digest('hex')

  await mkdir(join(cwd, hash), { recursive: true })

  const snap = Snap(import.meta.url, { cwd })
  await snap('actual')

  const files = await readdir(join(cwd, hash))
  deepEqual(files, ['0.json'])
})
