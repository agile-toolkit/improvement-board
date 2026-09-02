import { describe, it, expect } from 'vitest'
import { buildKanbanUrl } from './kanbanLink'
import type { ImprovementItem } from '../types'

function item(overrides: Partial<ImprovementItem>): ImprovementItem {
  return {
    id: 'i1', title: 'Untitled', description: '', category: 'process',
    status: 'identified', owner: '', copilot: '', dialogueNotes: '',
    createdAt: 0, updatedAt: 0,
    ...overrides,
  }
}

describe('buildKanbanUrl', () => {
  it('points at the Kanban Designer prefill endpoint with a utm_source tag', () => {
    const url = new URL(buildKanbanUrl([]))
    expect(url.origin + url.pathname).toBe('https://agile-toolkit.github.io/kanban-designer/')
    expect(url.searchParams.get('utm_source')).toBe('improvement-board')
  })

  it('sorts items into one column per status, preserving titles', () => {
    const items = [
      item({ id: 'a', title: 'A', status: 'identified' }),
      item({ id: 'b', title: 'B', status: 'in_progress' }),
      item({ id: 'c', title: 'C', status: 'done' }),
    ]
    const url = new URL(buildKanbanUrl(items))
    const board = JSON.parse(url.searchParams.get('prefill')!)
    expect(board.columns).toHaveLength(3)
    expect(board.columns[0].cards.map((c: { title: string }) => c.title)).toEqual(['A'])
    expect(board.columns[1].cards.map((c: { title: string }) => c.title)).toEqual(['B'])
    expect(board.columns[2].cards.map((c: { title: string }) => c.title)).toEqual(['C'])
  })

  it('omits an empty description rather than sending an empty string', () => {
    const url = new URL(buildKanbanUrl([item({ description: '' })]))
    const board = JSON.parse(url.searchParams.get('prefill')!)
    expect(board.columns[0].cards[0].description).toBeUndefined()
  })
})
