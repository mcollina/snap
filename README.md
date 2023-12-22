# @matteocollina/snap

snapshot testing companion for node:test.

## Install

```
npm i @matteocollina/snap
```

## Usage

```js
import Snap from '@matteocollina/snap'
import { test } from 'node:test'
import { deepEqual } from 'node:assert/strict'

const snap = Snap(import.meta.url)

test('a snapshot', async (t) => {
  const actual = await (await fetch('http://example.com')).text()
  const snapshot = await snap(actual)
  deepEqual(actual, snapshot)
})
```

On the first execution, the snapshot will be taked and stored in
the `.snapshots` folder in the same directory of `package.json`.

To update the snapshot, run with the `SNAP_UPDATE=1` env variable set.

### Usage with CommonJS

```js
const Snap = require('@matteocollina/snap')
const { test } = require('node:test')
const { deepEqual } = require('node:assert/strict')

const snap = Snap(import.meta.url)

test('a snapshot', async (t) => {
  const actual = await (await fetch('http://example.com')).text()
  const snapshot = await snap(actual)
  deepEqual(actual, snapshot)
})
```

## License

MIT
