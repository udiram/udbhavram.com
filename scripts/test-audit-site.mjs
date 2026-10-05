import assert from 'node:assert/strict'
import { classifyFetchError, classifyHttpResult } from './audit-url-result.mjs'

assert.deepEqual(classifyHttpResult('https://example.com/ok', 200), {
  url: 'https://example.com/ok',
  status: 200,
  outcome: 'verified',
})
assert.equal(classifyHttpResult('https://example.com/blocked', 403).outcome, 'unverified')
assert.equal(classifyHttpResult('https://example.com/server-error', 503).outcome, 'unverified')
assert.equal(classifyHttpResult('https://example.com/missing', 404).outcome, 'failed')

const transport = classifyFetchError('https://example.com/timeout', new Error('timed out'))
assert.equal(transport.outcome, 'unverified')
assert.equal(transport.error, 'timed out')

console.log('Audit result classification checks passed.')
