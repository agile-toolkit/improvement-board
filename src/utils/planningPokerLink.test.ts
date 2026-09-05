import { describe, it, expect, beforeEach } from 'vitest'
import { buildPokerUrl, getLastEstimate } from './planningPokerLink'

const HISTORY_KEY = 'planning-poker:history'

describe('buildPokerUrl', () => {
  it('points at the Planning Poker endpoint with the title prefilled and a utm_source tag', () => {
    const url = new URL(buildPokerUrl('Reduce build times'))
    expect(url.origin + url.pathname).toBe('https://agile-toolkit.github.io/planning-poker/')
    expect(url.searchParams.get('prefill')).toBe('Reduce build times')
    expect(url.searchParams.get('utm_source')).toBe('improvement-board')
  })
})

describe('getLastEstimate', () => {
  beforeEach(() => localStorage.clear())

  it('returns null when there is no session history', () => {
    expect(getLastEstimate('Reduce build times')).toBeNull()
  })

  it('returns the most recent matching story\'s final estimate', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([
      { id: '2', date: '2026-09-02', stories: [{ title: 'Reduce build times', finalEstimate: '8' }] },
      { id: '1', date: '2026-09-01', stories: [{ title: 'Reduce build times', finalEstimate: '5' }] },
    ]))
    expect(getLastEstimate('Reduce build times')).toBe('8')
  })

  it('matches trimmed and case-insensitively', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([
      { id: '1', date: '2026-09-01', stories: [{ title: '  Reduce Build Times  ', finalEstimate: '13' }] },
    ]))
    expect(getLastEstimate('reduce build times')).toBe('13')
  })

  it('supports non-numeric card values', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([
      { id: '1', date: '2026-09-01', stories: [{ title: 'Unclear scope', finalEstimate: '?' }] },
    ]))
    expect(getLastEstimate('Unclear scope')).toBe('?')
  })

  it('returns null when no story matches', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([
      { id: '1', date: '2026-09-01', stories: [{ title: 'Something else', finalEstimate: '5' }] },
    ]))
    expect(getLastEstimate('Reduce build times')).toBeNull()
  })

  it('recovers gracefully from corrupted storage', () => {
    localStorage.setItem(HISTORY_KEY, 'not json')
    expect(getLastEstimate('Reduce build times')).toBeNull()
  })
})
