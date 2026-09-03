# Changelog

## Unreleased

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
