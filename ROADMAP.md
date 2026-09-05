# Improvement Board — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
None — idle. See `## Recently shipped` below.

## Recently shipped
**E1 + E2 + E3 remainder: cross-app integrations, reporting & analytics, tags** (2026-09-05) — see `## Shipped`. Closes [#39](https://github.com/agile-toolkit/improvement-board/issues/39) (custom tags, filterable, hash-derived colours), [#37](https://github.com/agile-toolkit/improvement-board/issues/37) (sprint history analytics — a completed-items-per-sprint bar chart + category breakdown; the "identified vs. done" split originally proposed isn't recoverable from `SprintArchive`'s data model, which only stores an archived sprint's *done* items), [#40](https://github.com/agile-toolkit/improvement-board/issues/40) (Planning Poker effort-estimate badge and deep-link — reads the actual `planning-poker:history` key, not the issue's guessed `pp-session-history`), [#38](https://github.com/agile-toolkit/improvement-board/issues/38) (Scrum Facilitator retro action-item import), and [#41](https://github.com/agile-toolkit/improvement-board/issues/41) (CSV/Markdown-text export). Also closed [#42](https://github.com/agile-toolkit/improvement-board/issues/42) as an oversight — inline title quick-edit was already fully shipped 2026-09-02, so only #39/#37/#40/#38/#41 needed new code this round.

**Add glass effect to the header** (2026-09-04) — see `## Shipped`. `AppHeader.tsx`'s background changed to a translucent blur, matching the Dashboard's own nav — user-reported inconsistency.

**Facilitator Mode persists across suite apps** (2026-09-03) — see `## Shipped`. `useFacilitatorMode`'s storage key changed to the shared `agile-toolkit:facilitatorMode` so the mode survives switching to another suite app in the same tab, per direct user request.

**Fix a card delete button using the × variant** (2026-09-03) — see `## Shipped`. Follow-up to the emoji→SVG sweep — this button used `×` (multiplication sign) rather than `✕`, missed by the original grep.

**Replace decorative ✕/✓ emoji with SVG icons** (2026-09-03) — see `## Shipped`. Part of a suite-wide emoji→SVG sweep the user asked for.

**Facilitator Mode** (2026-09-03) — see `## Shipped`. A user asked for the presentation/projector mode already built for Team Identity to be adopted suite-wide; this is repo 6 of an 11-repo rollout, adopting the pattern now shared in `design-system/`.

**Fix LanguagePicker dark mode** (2026-09-02) — see `## Shipped`. The design-system's canonical `LanguagePicker.tsx` never got dark-mode classes; this app's copy inherited the gap. Synced with the now-fixed design-system source.

**Confirm before delete; fix low-contrast delete icons** (2026-09-02) — see `## Shipped`. A suite-wide UX audit found single-item delete had no confirmation (unlike bulk delete, which already confirms) and that delete-icon buttons used near-invisible `text-gray-300`/`slate-300`. Fixed both.

**Fix: invisible brand-color borders/backgrounds + utils test coverage** (2026-09-02) — see `## Shipped`. A suite-wide audit found `brand-200`/`300`/`800`/`900` referenced in 4 files (`ProblemTimer.tsx`, `TeamView.tsx`, `AppHeader.tsx`, `DialogueView.tsx`) but undefined in `tailwind.config.js` — invisible borders/backgrounds/text in both light and dark mode. Completed the `brand` scale with Tailwind's own `green` values (the palette the existing 6 shades were already drawn from). Also added this repo's first automated test coverage.

**E3 (partial): inline quick-edit of card title** (2026-09-02) — see `## Shipped`. [#42](https://github.com/agile-toolkit/improvement-board/issues/42) shipped; #39 (custom tags) shipped 2026-09-05, see above.

## Repo cleanup (2026-09-02)
Closed 10 stale `approved` issues (#3, #7–#12, #15, #17, #19) that were
already implemented per this file's own long-standing note — confirmed,
just awaiting a human close since Project status couldn't be set from prior
sessions' environments.

## Polish backlog
- No polish-only items without a filed issue at this time — everything currently queued is tracked above or already shipped.

## Shipped
- ~~Custom tags on improvement items, filterable board-wide, with
  hash-derived colours and autocomplete~~ (2026-09-05)
- ~~Sprint history analytics tab — items-completed-per-sprint bar chart,
  category breakdown, sprint-over-sprint trend~~ (2026-09-05)
- ~~Planning Poker effort-estimate badge and deep-link on cards~~ (2026-09-05)
- ~~Scrum Facilitator retro action-item import in the add-item modal~~ (2026-09-05)
- ~~CSV and Markdown-text export of all improvement items~~ (2026-09-05)
- ~~Add glass/backdrop-blur effect to the header, matching the Dashboard's own nav~~
- ~~Unify Facilitator Mode's storage key to the shared `agile-toolkit:facilitatorMode` so it persists across suite apps~~
- ~~Fix a card delete button using the × variant instead of ✕~~
- ~~Replace decorative ✕/✓ text-glyph buttons with shared SVG icons~~
- ~~Facilitator Mode — bigger UI + hidden nav/language picker for in-room presentation, adopted from the shared design-system pattern~~
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

**v0.2.1 — Fix invisible brand-color borders/backgrounds + utils test coverage** (2026-09-02):
- ~~Completed the `brand` Tailwind color scale (200/300/800/900 were
  missing, used in 4 files) — invisible borders/backgrounds/text in both
  light and dark mode~~
- ~~Added `vitest` + `jsdom`; tests for all four `src/utils/*.ts` modules~~

**v0.2.3 — Confirm before delete; fix low-contrast delete icons** (2026-09-02):
- ~~Added a confirm dialog to single-item delete in both Board/list and
  Kanban view, matching the existing bulk-delete confirm~~
- ~~Bumped delete-icon colors from `gray-300`/`slate-300` to
  `gray-400`/`slate-400`~~

**v0.2.4 — Fix LanguagePicker dark mode** (2026-09-02):
- ~~Synced `LanguagePicker.tsx` with the design-system's now-fixed
  canonical copy — full `dark:` coverage~~
