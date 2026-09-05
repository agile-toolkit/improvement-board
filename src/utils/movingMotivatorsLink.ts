// Moving Motivators' App.tsx already reads a `?change=` query param and
// pre-fills its change-assessment screen (readChangeParam(), implemented in
// its own issue #22) — no changes needed on that side.
const MOVING_MOTIVATORS_BASE = 'https://agile-toolkit.github.io/moving-motivators/'

export function buildMovingMotivatorsUrl(title: string): string {
  const params = new URLSearchParams({ change: title })
  return `${MOVING_MOTIVATORS_BASE}?${params.toString()}`
}
