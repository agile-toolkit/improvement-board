import { describe, it, expect, beforeEach } from 'vitest'
import { readMovingMotivatorsSession, bottomMotivators, MOTIVATOR_EMOJI } from './movingMotivatorsImport'
import type { MovingMotivatorsSession } from './movingMotivatorsImport'

beforeEach(() => localStorage.clear())

describe('readMovingMotivatorsSession', () => {
  it('returns null when no session exists', () => {
    expect(readMovingMotivatorsSession()).toBeNull()
  })

  it('returns null when ranked is missing or empty', () => {
    localStorage.setItem('moving-motivators:lastSession', JSON.stringify({ ranked: [] }))
    expect(readMovingMotivatorsSession()).toBeNull()
  })

  it('returns the parsed session when valid', () => {
    const session = { date: '2026-01-01', savedAt: 1, ranked: ['mastery', 'freedom'] }
    localStorage.setItem('moving-motivators:lastSession', JSON.stringify(session))
    expect(readMovingMotivatorsSession()).toEqual(session)
  })

  it('recovers gracefully from corrupted storage', () => {
    localStorage.setItem('moving-motivators:lastSession', '{not json')
    expect(readMovingMotivatorsSession()).toBeNull()
  })
})

describe('bottomMotivators', () => {
  const session: MovingMotivatorsSession = {
    date: '2026-01-01', savedAt: 1,
    ranked: ['curiosity', 'honor', 'acceptance', 'mastery', 'power', 'freedom', 'relatedness', 'order', 'goal', 'status'],
  }

  it('returns the lowest-ranked motivators first, capped at count', () => {
    const bottom = bottomMotivators(session, 3)
    expect(bottom.map(b => b.id)).toEqual(['status', 'goal', 'order'])
  })

  it('assigns each returned motivator its original 1-based rank', () => {
    const bottom = bottomMotivators(session, 3)
    expect(bottom.map(b => b.rank)).toEqual([10, 9, 8])
  })

  it('defaults to a count of 3', () => {
    expect(bottomMotivators(session)).toHaveLength(3)
  })
})

describe('MOTIVATOR_EMOJI', () => {
  it('has an emoji for all 10 CHAMPFROGS motivators', () => {
    expect(Object.keys(MOTIVATOR_EMOJI)).toHaveLength(10)
  })
})
