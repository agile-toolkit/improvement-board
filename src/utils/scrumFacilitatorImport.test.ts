import { describe, it, expect, beforeEach } from 'vitest'
import { readScrumFacilitatorActionItems } from './scrumFacilitatorImport'

const SESSION_KEY = 'scrum-facilitator-session'
const HISTORY_KEY = 'scrum-facilitator-history'

describe('readScrumFacilitatorActionItems', () => {
  beforeEach(() => localStorage.clear())

  it('returns an empty array when neither key has data', () => {
    expect(readScrumFacilitatorActionItems([])).toEqual([])
  })

  it('extracts action items from the current session', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      savedAt: Date.now(),
      retroNotes: {
        Improve: [
          { text: 'Automate the release checklist', isAction: true },
          { text: 'Just a regular note', isAction: false },
        ],
      },
    }))
    const result = readScrumFacilitatorActionItems([])
    expect(result).toEqual([{ title: 'Automate the release checklist', description: 'Improve' }])
  })

  it('ignores a session older than 24 hours', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      savedAt: Date.now() - 25 * 3600 * 1000,
      retroNotes: { Improve: [{ text: 'Stale action', isAction: true }] },
    }))
    expect(readScrumFacilitatorActionItems([])).toEqual([])
  })

  it('extracts action items from history entries', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([
      { savedAt: Date.now(), exportData: { retroNotes: { Keep: [{ text: 'Pair on tricky bugs', isAction: true }] } } },
    ]))
    const result = readScrumFacilitatorActionItems([])
    expect(result).toEqual([{ title: 'Pair on tricky bugs', description: 'Keep' }])
  })

  it('includes the note owner in the description when present', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      savedAt: Date.now(),
      retroNotes: { Improve: [{ text: 'Automate the release checklist', isAction: true, owner: 'Priya' }] },
    }))
    const result = readScrumFacilitatorActionItems([])
    expect(result).toEqual([{ title: 'Automate the release checklist', description: 'Improve · Priya' }])
  })

  it('skips action items that already exist as improvement items (trimmed, case-insensitive)', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      savedAt: Date.now(),
      retroNotes: { Improve: [{ text: 'Automate the release checklist', isAction: true }] },
    }))
    const result = readScrumFacilitatorActionItems(['  automate the release checklist  '])
    expect(result).toEqual([])
  })

  it('dedupes the same action item appearing in both session and history', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      savedAt: Date.now(),
      retroNotes: { Improve: [{ text: 'Automate the release checklist', isAction: true }] },
    }))
    localStorage.setItem(HISTORY_KEY, JSON.stringify([
      { savedAt: Date.now(), exportData: { retroNotes: { Improve: [{ text: 'automate the release checklist', isAction: true }] } } },
    ]))
    expect(readScrumFacilitatorActionItems([])).toHaveLength(1)
  })

  it('caps suggestions at 5', () => {
    const notes = Array.from({ length: 8 }, (_, i) => ({ text: `Action ${i}`, isAction: true }))
    localStorage.setItem(SESSION_KEY, JSON.stringify({ savedAt: Date.now(), retroNotes: { Improve: notes } }))
    expect(readScrumFacilitatorActionItems([])).toHaveLength(5)
  })

  it('recovers gracefully from corrupted storage', () => {
    localStorage.setItem(SESSION_KEY, 'not json')
    localStorage.setItem(HISTORY_KEY, 'not json')
    expect(readScrumFacilitatorActionItems([])).toEqual([])
  })
})
