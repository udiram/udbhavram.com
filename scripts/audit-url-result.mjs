export function classifyHttpResult(url, status) {
  if (status >= 200 && status < 400) {
    return { url, status, outcome: 'verified' }
  }

  if ([403, 429, 999].includes(status)) {
    return { url, status, outcome: 'unverified', reason: 'request was blocked or rate limited' }
  }

  if (status >= 500) {
    return { url, status, outcome: 'unverified', reason: 'server error after retry' }
  }

  return { url, status, outcome: 'failed', reason: 'unexpected HTTP response' }
}

export function classifyFetchError(url, error) {
  return {
    url,
    outcome: 'unverified',
    reason: 'transport check failed',
    error: error instanceof Error ? error.message : String(error),
  }
}
