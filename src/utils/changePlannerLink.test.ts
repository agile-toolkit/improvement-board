import { describe, it, expect } from 'vitest'
import { buildChangePlannerUrl } from './changePlannerLink'
import type { ImprovementItem } from '../types'

function item(overrides: Partial<ImprovementItem>): ImprovementItem {
  return {
    id: 'i1', title: 'Untitled', description: '', category: 'process',
    status: 'identified', owner: '', copilot: '', dialogueNotes: '',
    createdAt: 0, updatedAt: 0,
    ...overrides,
  }
}

describe('buildChangePlannerUrl', () => {
  it('points at the Change Planner endpoint with the title prefilled and a utm_source tag', () => {
    const url = new URL(buildChangePlannerUrl(item({ title: 'Reduce build times' })))
    expect(url.origin + url.pathname).toBe('https://agile-toolkit.github.io/change-planner/')
    expect(url.searchParams.get('prefill')).toBe('Reduce build times')
    expect(url.searchParams.get('utm_source')).toBe('improvement-board')
  })

  it('includes the description only when present', () => {
    const withDesc = new URL(buildChangePlannerUrl(item({ description: 'Some context' })))
    expect(withDesc.searchParams.get('description')).toBe('Some context')

    const withoutDesc = new URL(buildChangePlannerUrl(item({ description: '' })))
    expect(withoutDesc.searchParams.has('description')).toBe(false)
  })
})
