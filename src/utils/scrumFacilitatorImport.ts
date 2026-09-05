// Scrum Facilitator's retro board stores sticky notes per column
// (RetroNotes = Record<columnName, StickyNote[]>), each note optionally
// flagged isAction: true for a retro action item — confirmed by reading
// scrum-facilitator/src/types.ts directly. The current/most recently
// finished ceremony lives in 'scrum-facilitator-session' (cleared when a
// new ceremony starts); past ceremonies live in 'scrum-facilitator-history'.
// Both are read so a completed retro's action items stay importable after
// the next ceremony begins.
const SESSION_KEY = 'scrum-facilitator-session'
const HISTORY_KEY = 'scrum-facilitator-history'
const SESSION_STALE_MS = 24 * 3600 * 1000

interface StickyNote {
  text: string
  isAction?: boolean
  owner?: string
}

type RetroNotes = Record<string, StickyNote[]>

interface SessionState {
  savedAt?: number
  retroNotes?: RetroNotes
}

interface HistoryEntry {
  savedAt: number
  exportData?: { retroNotes?: RetroNotes }
}

export interface RetroActionSuggestion {
  title: string
  description: string
}

function actionNotes(notes: RetroNotes | undefined): Array<{ text: string; column: string; owner?: string }> {
  if (!notes) return []
  const result: Array<{ text: string; column: string; owner?: string }> = []
  for (const [column, columnNotes] of Object.entries(notes)) {
    for (const note of columnNotes) {
      if (note.isAction && note.text.trim()) result.push({ text: note.text.trim(), column, owner: note.owner })
    }
  }
  return result
}

/**
 * Up to 5 retro action items not already present (by trimmed,
 * case-insensitive title match) among `existingTitles`, newest source first.
 */
export function readScrumFacilitatorActionItems(existingTitles: string[]): RetroActionSuggestion[] {
  const existing = new Set(existingTitles.map(t => t.trim().toLowerCase()))
  const seen = new Set<string>()
  const suggestions: RetroActionSuggestion[] = []

  const addAll = (notes: Array<{ text: string; column: string; owner?: string }>) => {
    for (const { text, column, owner } of notes) {
      const key = text.toLowerCase()
      if (existing.has(key) || seen.has(key)) continue
      seen.add(key)
      const description = owner ? `${column} · ${owner}` : column
      suggestions.push({ title: text, description })
    }
  }

  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) {
      const session: SessionState = JSON.parse(raw)
      if (!session.savedAt || Date.now() - session.savedAt <= SESSION_STALE_MS) {
        addAll(actionNotes(session.retroNotes))
      }
    }
  } catch { /* ignore */ }

  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) {
      const history: HistoryEntry[] = JSON.parse(raw)
      if (Array.isArray(history)) {
        for (const entry of history) {
          addAll(actionNotes(entry.exportData?.retroNotes))
        }
      }
    }
  } catch { /* ignore */ }

  return suggestions.slice(0, 5)
}
