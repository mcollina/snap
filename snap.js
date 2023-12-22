import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { findUp } from 'find-up'
import { mkdir, writeFile, readFile } from 'node:fs/promises'

export default function build (seed, opts = {}) {
  const hash = createHash('md5').update(seed).digest('hex')
  let counter = 0

  const update = opts.update || !!process.env.SNAP_UPDATE

  let dir
  async function init () {
    const cwd = opts.cwd || dirname(await findUp('package.json', { cwd: dirname(seed) }))

    dir = join(cwd, '.snapshots', hash)

    try {
      await mkdir(dir, { recursive: true })
    } catch {
      // ignore
    }
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
    const data = await readFile(file, 'utf8')
    return JSON.parse(data)
  }

  return update ? snapUpdate : snapRead
}
