import { describe, it, expect } from 'vitest'
import { buildCsv, buildMarkdownTable } from './csvExport'
import type { ImprovementItem } from '../types'

function item(overrides: Partial<ImprovementItem>): ImprovementItem {
  return {
    id: 'i1', title: 'Untitled', description: '', category: 'process',
    status: 'identified', owner: '', copilot: '', dialogueNotes: '',
    createdAt: 0, updatedAt: 0,
    ...overrides,
  }
}

describe('buildCsv', () => {
  it('includes a header row with all expected columns', () => {
    const csv = buildCsv([])
    expect(csv).toBe('Title,Category,Status,Owner,Copilot,Due Date,Votes,Comments,Tags,Created,Updated')
  })

  it('renders one row per item with basic fields', () => {
    const csv = buildCsv([item({ title: 'Reduce build times', category: 'technical', status: 'in_progress', owner: 'Alice', votes: 3 })])
    const rows = csv.split('\n')
    expect(rows[1]).toBe('Reduce build times,technical,in_progress,Alice,,,3,0,,1/1/1970,1/1/1970')
  })

  it('quotes fields containing a comma', () => {
    const csv = buildCsv([item({ title: 'Reduce build times, take 2' })])
    expect(csv.split('\n')[1]).toContain('"Reduce build times, take 2"')
  })

  it('joins tags with a semicolon', () => {
    const csv = buildCsv([item({ tags: ['tech-debt', 'Q2 OKR'] })])
    expect(csv.split('\n')[1]).toContain('tech-debt; Q2 OKR')
  })

  it('counts comments rather than embedding their text', () => {
    const csv = buildCsv([item({ comments: [{ id: 'c1', text: 'x', author: 'a', createdAt: 0 }, { id: 'c2', text: 'y', author: 'a', createdAt: 0 }] })])
    const cells = csv.split('\n')[1].split(',')
    expect(cells[7]).toBe('2')
  })
})

describe('buildMarkdownTable', () => {
  it('renders a header row and a separator row', () => {
    const table = buildMarkdownTable([])
    const lines = table.split('\n')
    expect(lines[0]).toBe('| Title | Category | Status | Owner | Copilot | Due Date | Votes | Comments | Tags | Created | Updated |')
    expect(lines[1]).toMatch(/^\| --- \|/)
  })

  it('renders one row per item', () => {
    const table = buildMarkdownTable([item({ title: 'Reduce build times' })])
    expect(table.split('\n')).toHaveLength(3)
  })

  it('escapes pipe characters in cell values', () => {
    const table = buildMarkdownTable([item({ title: 'Before | After' })])
    expect(table).toContain('Before \\| After')
  })
})
