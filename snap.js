import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { findUp } from 'find-up'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import slash from 'slash'

export default function build (testPath, opts = {}) {
  let counter = 0

  const update = opts.update || !!process.env.SNAP_UPDATE

  let dir
  async function init () {
    if (testPath.startsWith('file:')) {
      testPath = fileURLToPath(testPath)
    }
    const root = dirname(await findUp('package.json', { cwd: dirname(testPath) }))
    const seed = slash(testPath.replace(root, '.'))
    const hash = createHash('md5').update(seed).digest('hex')
    const cwd = opts.cwd || join(root, '.snapshots')
    dir = join(cwd, hash)

    await mkdir(dir, { recursive: true })
  }

  async function snapUpdate (obj) {
    if (!dir) await init()
    const file = join(dir, `${counter++}.json`)
    await writeFile(file, JSON.stringify(obj, null, 2))
    return obj
  }

  async function snapRead (obj) {
    if (!dir) await init()
    const file = join(dir, `${counter++}.json`)
    try {
      const data = await readFile(file, 'utf8')
      return JSON.parse(data)
    } catch (err) {
      if (err.code === 'ENOENT') {
        await writeFile(file, JSON.stringify(obj, null, 2))
        return obj
      }

      throw err
    }
  }

  return update ? snapUpdate : snapRead
}
