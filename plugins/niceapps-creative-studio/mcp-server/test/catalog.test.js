import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeApp, parseScreenshots, searchCatalog } from '../src/catalog.js'

const apps = [
  { slug: 'calm', name: 'Calm Plan', category: 'Productivity', description: 'A quiet daily planner', screenshots: '["one.png"]' },
  { slug: 'money', name: 'Money Map', category: 'Finance', description: 'Understand spending', screenshots: [] },
]

test('normalizes serialized screenshots', () => {
  assert.deepEqual(parseScreenshots('["one.png",""]'), ['one.png'])
  assert.deepEqual(normalizeApp(apps[0]).screenshots, ['one.png'])
})

test('searches product language and category', () => {
  assert.equal(searchCatalog(apps, { query: 'planner' })[0].slug, 'calm')
  assert.equal(searchCatalog(apps, { category: 'Finance' })[0].slug, 'money')
})

test('returns no forced match for unrelated terms', () => {
  assert.deepEqual(searchCatalog(apps, { query: 'weather' }), [])
})
