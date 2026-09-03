import assert from 'node:assert/strict'
import test from 'node:test'
import { appleAppId, appleLookupEndpoint, parseAppleLookup } from '../src/app-store.ts'

test('extracts an Apple ID from an App Store URL', () => {
  assert.equal(appleAppId('https://apps.apple.com/us/app/pool-the-screenshot-app/id6752956163'), '6752956163')
  assert.equal(appleLookupEndpoint('6752956163'), 'https://itunes.apple.com/lookup?id=6752956163&country=us')
})

test('maps an Apple lookup response to the admin form', () => {
  const result = parseAppleLookup({ results: [{
    trackId: 6752956163,
    trackName: 'Pool, the screenshot app',
    primaryGenreName: 'Lifestyle',
    description: 'First paragraph.\n\nSecond paragraph.',
    artistName: 'Random Access Memories',
    trackViewUrl: 'https://apps.apple.com/us/app/id6752956163',
    artworkUrl512: 'https://example.com/icon.jpg',
    screenshotUrls: ['http://example.com/image/320x480bb.jpg'],
  }] })

  assert.equal(result?.name, 'Pool, the screenshot app')
  assert.equal(result?.description, 'First paragraph.')
  assert.deepEqual(result?.screenshots, ['https://example.com/image/640x960bb.jpg'])
})
