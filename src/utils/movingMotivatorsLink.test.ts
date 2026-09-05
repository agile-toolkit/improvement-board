import { describe, it, expect } from 'vitest'
import { buildMovingMotivatorsUrl } from './movingMotivatorsLink'

describe('buildMovingMotivatorsUrl', () => {
  it('points at the Moving Motivators endpoint with the title as the change param', () => {
    const url = new URL(buildMovingMotivatorsUrl('Improve team autonomy'))
    expect(url.origin + url.pathname).toBe('https://agile-toolkit.github.io/moving-motivators/')
    expect(url.searchParams.get('change')).toBe('Improve team autonomy')
  })

  it('encodes special characters in the title', () => {
    const url = new URL(buildMovingMotivatorsUrl('Reduce build times & flakiness'))
    expect(url.searchParams.get('change')).toBe('Reduce build times & flakiness')
  })
})
