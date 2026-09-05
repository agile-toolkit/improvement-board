# Changelog

## Unreleased

## 0.4.0 — Tags, sprint history, Planning Poker & Scrum Facilitator integrations, CSV export (2026-09-05)

- **feature**: custom labels/tags on improvement items
  (`ImprovementItem.tags?: string[]`). Add tags in the "New Improvement
  Item" modal (pill input, Enter/comma to commit, hash-derived colour
  so the same tag always renders the same colour) and the Kanban
  inline-add form (comma-separated text field); both offer autocomplete
  from tags already used on the board via a native `<datalist>`. Tags
  display as pills on cards in both Board and Kanban views, and a tag
  filter bar (click a pill to filter, click again to clear) appears in
  both view headers once at least one item has a tag. Tags carry
  forward into `SprintArchive` unchanged, since archiving just snapshots
  the full item. ([#39](https://github.com/agile-toolkit/improvement-board/issues/39))
- **feature**: sprint history analytics — a new **History** nav item and
  screen (`HistoryView.tsx`) visualizing `improvement-board:sprintHistory`
  as a pure-SVG bar chart (items completed per sprint) plus a
  category-breakdown table with a sprint-over-sprint trend indicator.
  Note: `SprintArchive.items` only ever holds the *done* items from a
  sprint (see `handleEndSprint` in `App.tsx`) — the "identified vs. done"
  split proposed in the issue isn't recoverable from this data model, so
  the chart shows completed-item velocity instead, which is what the
  data actually supports. Scoped to completed archived sprints only, no
  "live" in-progress column. Empty state when no sprint has been
  archived yet. ([#37](https://github.com/agile-toolkit/improvement-board/issues/37))
- **feature**: Planning Poker effort estimates on cards. A new "Estimate
  in Planning Poker" link (`src/utils/planningPokerLink.ts`) opens
  Planning Poker with the item's title prefilled; if a past Planning
  Poker session already estimated a story with a matching title
  (trimmed, case-insensitive), its final estimate shows as an "N SP"
  badge directly on the card in both Board and Kanban views. Reads the
  actual `planning-poker:history` key (`SessionHistoryEntry[]`) — the
  issue's proposed key (`pp-session-history`) doesn't exist in that
  app's source, confirmed by reading it directly; card values are
  free-form strings (some decks use "☕"/"?", not just numbers), so the
  badge and lookup handle non-numeric estimates too.
  ([#40](https://github.com/agile-toolkit/improvement-board/issues/40))
- **feature**: import retro action items from Scrum Facilitator. A
  collapsible "Import from Scrum Facilitator" section in the "New
  Improvement Item" modal (mirrors the existing Moving Motivators import
  pattern) lists up to 5 action items (`StickyNote.isAction === true`)
  from the current/most recent ceremony (`scrum-facilitator-session`,
  ignored if older than 24h) and from `scrum-facilitator-history`,
  already-imported titles skipped. Clicking one pre-fills the title and
  a description noting the retro column (and note owner, if set).
  Opening Improvement Board from Scrum Facilitator's own deep-link
  (`?utm_source=scrum-facilitator`) shows the same banner pattern
  already used for Sprint Metrics and Moving Motivators.
  ([#38](https://github.com/agile-toolkit/improvement-board/issues/38))
- **feature**: CSV and Markdown-text export
  (`src/utils/csvExport.ts`) alongside the existing PNG export, in both
  Board and Kanban view headers. Exports respect the current tag filter
  and sort order — the same items and order the view currently shows.
  Columns: Title, Category, Status, Owner, Copilot, Due Date, Votes,
  Comments (count), Tags, Created, Updated.
  ([#41](https://github.com/agile-toolkit/improvement-board/issues/41))
- **chore**: closed [#42](https://github.com/agile-toolkit/improvement-board/issues/42)
  (inline quick-edit of item title) as already fully shipped in both
  `ImprovementCard.tsx` and `ImprovementBoard.tsx` — double-click to
  edit, Enter/blur to save, Escape to revert, matching the issue's own
  proposed interaction model exactly. Just missed being closed at the
  time.

## 0.3.2 — Add glass effect to the header (2026-09-04)

- **fix**: `AppHeader.tsx`'s background changed from opaque
  `bg-white`/`dark:bg-gray-900` to `bg-[var(--glass)] backdrop-blur-sm` —
  the Dashboard's own nav has always had this translucent blur effect,
  but the shared header every app copies did not. User-reported
  inconsistency. This app's local nav-pill/icon dark-mode shade
  variations from the canonical source were left untouched — only the
  background line changed. Verified in both themes.

- **chore**: Synced the shared `icons.tsx` (now 64 icons) and replaced the
  remaining decorative emoji it now covers: `LearnView`'s three topic icons
  (💬🤝⏱ → `ChatIcon`/`TeamIcon`/`StopwatchIcon`, the field is now a component
  reference instead of a string), the comment-count 💬 and change-planner ↗
  link on both `ImprovementCard` and `ImprovementBoard` (→ `ChatIcon`/
  `LinkIcon`), `TeamView`'s 👤 assignee tag (→ `PersonIcon`), `BoardView`'s
  📊/🎯 cross-app banners, ☑ select-items toggle, 📋 empty-state hero and 📊
  sprint-metrics footer link (→ `ChartIcon`/`TargetIcon`/`CheckboxCheckedIcon`/
  `ClipboardIcon`), `DialogueView`'s 💬 comment count (→ `ChatIcon`), and
  `AddItemModal`'s 🔄 import-toggle label (→ `RefreshIcon`), and
  `ImprovementBoard`'s move-forward buttons, which used a bare typographic
  `→` rather than an emoji (→ `ArrowRightIcon`). Moving Motivators'
  `MOTIVATOR_EMOJI` map in `movingMotivatorsImport.ts` stays real emoji — it
  mirrors that app's own motivator cards, not UI chrome — and the `→`/`←`
  that show up in `tokens.css` comments and in-sentence copy stay text too.
- **ci**: CI Node bumped 20 → 22 and `engines` declared. `jsdom@30` requires
  Node `^22.22.2 || ^24.15.0 || >=26`, so the test step could never have passed
  on the pinned Node 20 — invisible until this release started running the
  tests in CI at all. Builds were unaffected (vite and tsc do not load jsdom).


## 0.3.0 — Error boundary and test-gated deploys (2026-09-03)

- **feat**: `ErrorBoundary` at the root of the app. Every app in the suite reads
  payloads written by *other* apps, historically through `JSON.parse(raw) as T`
  with no runtime check; an unexpected shape threw during render, unmounted the
  tree and left a blank page that a reload could not fix, because the offending
  data was still in localStorage. The fallback offers "clear this app's saved
  data", scoped to this app's own key prefixes so recovery cannot destroy a
  neighbouring app's data on the shared origin.
- **ci**: `npm test` now runs before `npm run build` in `deploy.yml`. The suite
  had 301 passing tests and CI ran them in exactly one repo of eleven.

## 0.2.8 — Facilitator Mode persists across suite apps (2026-09-03)

- **fix**: `useFacilitatorMode`'s storage key changed from
  `'improvement-board:facilitatorMode'` to the shared
  `'agile-toolkit:facilitatorMode'` — user-requested so Facilitator Mode
  survives navigating to another suite app in the same tab instead of
  resetting. sessionStorage is already shared per-origin-per-tab; this
  was previously app-prefixed specifically to keep it isolated, which
  turned out to be the wrong default for a cross-app presentation
  session.

## 0.2.7 — Fix a card delete button using the × variant (2026-09-03)

- **fix (follow-up)**: `ImprovementBoard.tsx`'s card delete button used
  `×` (multiplication sign, U+00D7) rather than `✕`, a variant the
  original emoji→SVG sweep's grep missed. Replaced with `CloseIcon`.

## 0.2.6 — Replace decorative ✕/✓ emoji with SVG icons (2026-09-03)

- **feat**: replaced 3 decorative `✕`/`✓` text glyphs (card delete
  button, Learn page's principles-list bullet, the problem timer's
  finished-state indicator) with `CloseIcon`/`CheckIcon` from the new
  shared `icons.tsx`. Part of a suite-wide emoji→SVG sweep the user
  asked for.

## 0.2.5 — Facilitator Mode (2026-09-03)

- **feat**: added Facilitator (projector) Mode — a presentation toggle for
  in-room retros/coaching conversations, bigger UI via one CSS rule
  (everything sized in `rem` scales automatically) plus hiding the nav
  pills and language picker while active. Toggled from a new header
  button next to the theme toggle, session-scoped via `sessionStorage`.
  Adopted from the shared design-system pattern
  (`useFacilitatorMode.ts` + `FacilitatorToggle.tsx`), originally built
  for Team Identity.

## 0.2.4 — Fix LanguagePicker dark mode (2026-09-02)

- **fix**: `LanguagePicker.tsx` had zero `dark:` classes — the
  design-system's canonical copy never got dark-mode classes, and this
  app's copy inherited the gap. Synced with the now-fixed design-system
  source.

## 0.2.3 — Confirm before delete; fix low-contrast delete icons (2026-09-02)

- **fix**: single-item delete (both the Board/list view and the Kanban
  card) had no confirmation, unlike bulk delete which already confirms
  via `window.confirm`. Added the same confirm to both single-item
  delete paths (`App.tsx`, `ImprovementBoard.tsx`'s `deleteItem`).
- **fix**: delete "✕"/"×" buttons in `ImprovementCard.tsx` and
  `ImprovementBoard.tsx` used `text-gray-300`/`slate-300`, below WCAG AA
  contrast and nearly invisible until hover. Bumped to `gray-400`/
  `slate-400`.
- Found via a suite-wide UX/scope audit.

## 0.2.2 — Remove Management 3.0 references (2026-09-02)

- **content**: removed "Management 3.0" text from the Problem Time
  description, `index.html`'s meta description, and `README.md` —
  reworded to reference the Improvement Dialogues/Copilot Programs/
  Problem Time practices directly rather than the framework brand. All
  4 locales updated.

## 0.2.1 — Fix invisible brand-color borders/backgrounds + utils test coverage (2026-09-02)

- **fix**: `brand-200`/`brand-300`/`brand-800`/`brand-900` were referenced
  in 4 components (`ProblemTimer.tsx`, `TeamView.tsx`, `AppHeader.tsx`,
  `DialogueView.tsx`) but never defined in `tailwind.config.js` — Tailwind
  silently emits no class for an undefined shade, so these rendered as
  invisible borders/backgrounds/text in both light and dark mode. Found
  during a suite-wide UX audit (the same class of bug as Kanban Designer's
  `brand-200` gap). Completed the `brand` scale with Tailwind's own
  `green` values — the 6 existing shades were already drawn from that
  palette verbatim.
- **test**: added `vitest` + `jsdom` (this repo's first automated test
  coverage). 26 tests across all four `src/utils/*.ts` modules —
  `dueDate.ts`'s overdue/today/soon/future/done + aging state machines,
  `kanbanLink.ts`/`changePlannerLink.ts`'s deep-link URL builders, and
  `movingMotivatorsImport.ts`'s session parsing and bottom-motivator
  selection. `npm test` now passes cleanly.

## 0.2.0 — E3 (partial): inline quick-edit of card title (2026-09-02)

- **feat**: double-click a card's title in either Board or Kanban view to
  rename it in place — Enter or blur commits, Escape reverts, no need to
  open the full item modal for a small correction. Double-click (not
  single-click) was chosen deliberately since the Kanban card title is
  already a single-click expand/collapse toggle. i18n:
  `board.edit_title`/`board.edit_title_hint` in EN/ES/BE/RU.
- **docs**: refresh `GOAL.md` from the suite-wide `GOALS.md` platform
  thesis and rebuild `ROADMAP.md` around it.
- **chore**: closed 10 stale `approved` GitHub issues that were already
  implemented, per this repo's long-standing agent-log note — no
  functional change, repo housekeeping only.
- Docs-only: added `.artefacts/GOAL.md` and `.artefacts/ROADMAP.md`, filled in `README.md` (dev commands, localStorage keys, tech notes), and added this changelog. No behavior change — documents existing functionality that previously only lived in `.artefacts/BRIEF.md`.
- docs: move GOAL.md and ROADMAP.md from .artefacts/ to the repo root.
