// Planning Poker stores its session history under 'planning-poker:history'
// (SessionHistoryEntry[], newest last) — confirmed by reading
// planning-poker/src/App.tsx and src/types.ts directly. Card values are
// free-form strings (decks aren't all numeric — e.g. "☕", "?"), so an
// estimate is read back as a string, not assumed numeric.
const HISTORY_KEY = 'planning-poker:history'
const PLANNING_POKER_BASE = 'https://agile-toolkit.github.io/planning-poker/'

interface SessionHistoryStory {
  title: string
  finalEstimate: string | null
}

interface SessionHistoryEntry {
  id: string
  date: string
  stories: SessionHistoryStory[]
}

// planning-poker prepends new sessions (`[entry, ...prev]`), so index 0 is
// the most recent session.

export function buildPokerUrl(title: string): string {
  const params = new URLSearchParams({
    prefill: title,
    utm_source: 'improvement-board',
  })
  return `${PLANNING_POKER_BASE}?${params.toString()}`
}

function normalize(title: string): string {
  return title.trim().toLowerCase()
}

/**
 * Most recent final estimate for a story whose title matches (trimmed,
 * case-insensitive) the given title, searching newest session first.
 */
export function getLastEstimate(title: string): string | null {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return null
    const history: SessionHistoryEntry[] = JSON.parse(raw)
    if (!Array.isArray(history)) return null
    const target = normalize(title)
    for (const entry of history) {
      const match = entry.stories?.find(s => normalize(s.title) === target && s.finalEstimate)
      if (match) return match.finalEstimate
    }
    return null
  } catch {
    return null
  }
}
