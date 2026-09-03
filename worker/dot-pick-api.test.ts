import assert from 'node:assert/strict'
import test from 'node:test'
import worker from './index.ts'

type RecordedStatement = {
  sql: string
  args: unknown[]
  run: () => Promise<{ success: true }>
  all: () => Promise<{ results: unknown[] }>
}

function fakeDatabase(results: unknown[] = []) {
  const prepared: RecordedStatement[] = []
  const batches: RecordedStatement[][] = []
  const runs: RecordedStatement[] = []
  const DB = {
    prepare(sql: string) {
      const statement: RecordedStatement = {
        sql,
        args: [],
        async run() { runs.push(statement); return { success: true } },
        async all() { return { results } },
      }
      const bound = Object.assign(statement, {
        bind(...args: unknown[]) { statement.args = args; return statement },
      })
      prepared.push(bound)
      return bound
    },
    async batch(statements: RecordedStatement[]) { batches.push(statements); return statements.map(() => ({ success: true })) },
  }
  return { DB, prepared, batches, runs }
}

const appPayload = {
  slug: 'calm-space',
  name: 'Calm Space',
  category: 'Productivity',
  description: 'A focused place to plan.',
  screenshots: ['one.png'],
}

test('apps GET returns the Dot pick field unchanged', async () => {
  const database = fakeDatabase([{ ...appPayload, is_dot_pick: 1 }])
  const response = await worker.fetch(new Request('https://example.test/api/apps'), { DB: database.DB, ADMIN_API_KEY: 'secret' } as never)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), [{ ...appPayload, is_dot_pick: 1 }])
})

test('setting a Dot pick clears the previous pick in the same D1 batch', async () => {
  const database = fakeDatabase()
  const response = await worker.fetch(new Request('https://example.test/api/apps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Token': 'secret' },
    body: JSON.stringify({ ...appPayload, is_dot_pick: true }),
  }), { DB: database.DB, ADMIN_API_KEY: 'secret' } as never)

  assert.equal(response.status, 201)
  assert.equal(database.runs.length, 0)
  assert.equal(database.batches.length, 1)
  assert.equal(database.batches[0].length, 2)
  assert.match(database.batches[0][0].sql, /UPDATE apps SET is_dot_pick=0/)
  assert.deepEqual(database.batches[0][0].args, ['calm-space'])
  assert.match(database.batches[0][1].sql, /is_dot_pick/)
  assert.equal(database.batches[0][1].args.at(-1), 1)
})

test('a normal app write does not clear the current Dot pick', async () => {
  const database = fakeDatabase()
  const response = await worker.fetch(new Request('https://example.test/api/apps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Token': 'secret' },
    body: JSON.stringify({ ...appPayload, is_dot_pick: false }),
  }), { DB: database.DB, ADMIN_API_KEY: 'secret' } as never)

  assert.equal(response.status, 201)
  assert.equal(database.batches.length, 0)
  assert.equal(database.runs.length, 1)
  assert.equal(database.runs[0].args.at(-1), 0)
})
