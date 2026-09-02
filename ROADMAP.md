# Improvement Board — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E1: Cross-app estimation & retro-import integrations** — serves signal #1 (loop closes faster when items arrive pre-populated instead of re-typed). Two `needs-review` integration issues, both past the 7-day staleness threshold: [#40](https://github.com/agile-toolkit/improvement-board/issues/40) (Planning Poker deep-link for effort estimation, reading `pp-session-history`) and [#38](https://github.com/agile-toolkit/improvement-board/issues/38) (Scrum Facilitator retro action-item import, mirroring the existing Moving Motivators import pattern). Both follow the established deep-link + localStorage-read convention already used for Sprint Metrics and Moving Motivators.
2. **E2: Reporting & analytics** — serves signal #2, #3. Two `needs-review` issues past the 7-day staleness threshold: [#41](https://github.com/agile-toolkit/improvement-board/issues/41) (CSV/text export of all items for management reporting) and [#37](https://github.com/agile-toolkit/improvement-board/issues/37) (sprint history analytics tab visualising the existing `improvement-board:sprintHistory` archive). Both give facilitators and management a structured view beyond the live board.
3. **E3 remainder: custom tags** — serves signal #1, #2. [#39](https://github.com/agile-toolkit/improvement-board/issues/39) (custom tags for cross-cutting themes, filterable alongside existing sort/status controls) — `needs-review`, past the 7-day staleness threshold.

## Recently shipped
**E3 (partial): inline quick-edit of card title** (2026-09-02) — see `## Shipped`. [#42](https://github.com/agile-toolkit/improvement-board/issues/42) shipped; #39 (custom tags) remains queued above as the rest of E3.

## Repo cleanup (2026-09-02)
Closed 10 stale `approved` issues (#3, #7–#12, #15, #17, #19) that were
already implemented per this file's own long-standing note — confirmed,
just awaiting a human close since Project status couldn't be set from prior
sessions' environments.

## Polish backlog
- No polish-only items without a filed issue at this time — everything currently queued is tracked above or already shipped.

## Shipped
- ~~Board (list) and Kanban views with categories, due dates, aging indicators, and multi-mode sort (default/due/votes/stale)~~
- ~~EN/RU/ES/BE localization across all wired UI strings~~
- ~~Team priority voting (upvote, sort-by-votes, reset) on improvement items~~
- ~~Sprint cycle reset — archive done items to `improvement-board:sprintHistory` with a sprint counter~~
- ~~Item comment thread in Dialogue view (timestamped async notes, migrated from legacy single-note field)~~
- ~~Bulk status actions — multi-select cards with a sticky action bar (mark status / delete) in Board view~~
- ~~Keyboard accessibility & ARIA audit — modal focus trap, `aria-label`s, `N` shortcut for new item~~
- ~~Light/dark theme support via `ThemeToggle` and Tailwind `dark:` variants~~
- ~~Unified `AppHeader` + `LanguagePicker` header across the suite's design system~~
- ~~PWA offline mode for in-room facilitation (installable, cache-first service worker, update toast)~~
- ~~Export board snapshot as PNG for stakeholder reporting~~
- ~~Cross-app deep-link integrations: Sprint Metrics → Improvement Board (prefill), Moving Motivators → Improvement Board (bottom-motivator import), Improvement Board → Kanban Designer (item export), Improvement Board → Change Planner (promote item)~~
- ~~`improvement-board:lastSession` summary key for the suite Dashboard hub card~~

**v0.2.0 — [E3 (partial): inline quick-edit of card title](https://github.com/agile-toolkit/improvement-board/issues/42)** (2026-09-02):
- ~~Double-click a card's title in Board or Kanban view to rename in place
  — Enter/blur commits, Escape reverts~~
