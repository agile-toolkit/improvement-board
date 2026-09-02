# Changelog

## Unreleased

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
