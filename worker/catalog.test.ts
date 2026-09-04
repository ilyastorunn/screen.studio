import assert from 'node:assert/strict'
import test from 'node:test'
import { filterCatalog, nextDiscovery, selectDotPick } from '../src/catalog.ts'

const catalog = [
  { slug: 'first', name: 'First App', category: 'Tools' },
  { slug: 'picked', name: 'Picked App', category: 'Design', is_dot_pick: true },
  { slug: 'last', name: 'Last App', category: 'Design' },
]

test('selects the explicit Dot pick and falls back to the newest item', () => {
  assert.equal(selectDotPick(catalog)?.slug, 'picked')
  assert.equal(selectDotPick(catalog.map(item => ({ ...item, is_dot_pick: false })))?.slug, 'first')
})

test('filters by category and a trimmed case-insensitive query', () => {
  assert.deepEqual(filterCatalog(catalog, ' PICK ', 'Design').map(item => item.slug), ['picked'])
  assert.deepEqual(filterCatalog(catalog, '', 'Design').map(item => item.slug), ['picked', 'last'])
})

test('next discovery wraps and returns nothing for a one-item catalog', () => {
  assert.equal(nextDiscovery(catalog, 'last')?.slug, 'first')
  assert.equal(nextDiscovery([catalog[0]], 'first'), undefined)
})

// The search field promises category discovery as well as app-name lookup.
test('searches category names and still respects an active category filter', () => {
  assert.deepEqual(filterCatalog(catalog, ' DESIGN ', 'All').map(item => item.slug), ['picked', 'last'])
  assert.deepEqual(filterCatalog(catalog, 'design', 'Tools'), [])
  assert.deepEqual(filterCatalog(catalog, 'unknown', 'All'), [])
  assert.deepEqual(filterCatalog([], 'design', 'All'), [])
})
