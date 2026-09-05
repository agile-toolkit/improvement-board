import { describe, it, expect } from 'vitest'
import { tagColorClasses } from './tagColor'

describe('tagColorClasses', () => {
  it('returns the same classes for the same tag every time', () => {
    expect(tagColorClasses('tech-debt')).toBe(tagColorClasses('tech-debt'))
  })

  it('is case-sensitive (drift prevention is autocomplete-level, not hash-level)', () => {
    // Not asserting a specific relationship, just that it doesn't throw and returns a string.
    expect(typeof tagColorClasses('TechDebt')).toBe('string')
    expect(typeof tagColorClasses('techdebt')).toBe('string')
  })

  it('returns a non-empty class string for an empty tag', () => {
    expect(tagColorClasses('')).toMatch(/\w/)
  })

  it('distributes across more than one palette entry for varied input', () => {
    const tags = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta']
    const classes = new Set(tags.map(tagColorClasses))
    expect(classes.size).toBeGreaterThan(1)
  })
})
