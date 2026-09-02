import { describe, it, expect } from 'vitest'
import { getDueDateState, dueBadgeClasses, getAgeState, ageDaysOld } from './dueDate'

const DAY = 86_400_000

describe('getDueDateState', () => {
  it('returns "none" when no due date is set', () => {
    expect(getDueDateState(undefined, false)).toBe('none')
  })
  it('returns "done" for a completed item regardless of date', () => {
    expect(getDueDateState(Date.now() - DAY, true)).toBe('done')
  })
  it('returns "overdue" for a past due date', () => {
    expect(getDueDateState(Date.now() - DAY, false)).toBe('overdue')
  })
  it('returns "today" for a due date within the next 24h', () => {
    expect(getDueDateState(Date.now() + DAY / 2, false)).toBe('today')
  })
  it('returns "soon" for a due date 1-2 days out', () => {
    expect(getDueDateState(Date.now() + 1.5 * DAY, false)).toBe('soon')
  })
  it('returns "future" for a due date more than 2 days out', () => {
    expect(getDueDateState(Date.now() + 10 * DAY, false)).toBe('future')
  })
})

describe('dueBadgeClasses', () => {
  it('returns distinct, non-empty classes for every non-none state', () => {
    const states = ['overdue', 'today', 'soon', 'future', 'done'] as const
    for (const s of states) {
      expect(dueBadgeClasses(s).length).toBeGreaterThan(0)
    }
  })
  it('returns an empty string for "none"', () => {
    expect(dueBadgeClasses('none')).toBe('')
  })
})

describe('getAgeState', () => {
  it('treats a done item as fresh regardless of age', () => {
    expect(getAgeState(Date.now() - 100 * DAY, true)).toBe('fresh')
  })
  it('returns "fresh" for a recently updated item', () => {
    expect(getAgeState(Date.now() - DAY, false)).toBe('fresh')
  })
  it('returns "aging" between 7 and 21 days untouched', () => {
    expect(getAgeState(Date.now() - 10 * DAY, false)).toBe('aging')
  })
  it('returns "stale" past 21 days untouched', () => {
    expect(getAgeState(Date.now() - 30 * DAY, false)).toBe('stale')
  })
})

describe('ageDaysOld', () => {
  it('floors the elapsed whole days', () => {
    expect(ageDaysOld(Date.now() - 5.9 * DAY)).toBe(5)
  })
})
