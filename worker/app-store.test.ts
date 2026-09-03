import assert from 'node:assert/strict'
import test from 'node:test'
import * as worker from './index.ts'

test('App Store imports always use the US storefront', () => {
  assert.equal((worker as Record<string, unknown>).APP_STORE_STOREFRONT, 'us')
})

test('Apple rate limits preserve the 429 status and retry hint', async () => {
  const response = worker.appleFailureResponse(new Response('rate limited', {
    status: 429,
    headers: { 'Retry-After': '60' },
  }))

  assert.equal(response.status, 429)
  assert.equal(response.headers.get('Retry-After'), '60')
  assert.deepEqual(await response.json(), {
    error: 'Apple API rate limit exceeded. Please wait and try again.',
    retry_after: '60',
  })
})
