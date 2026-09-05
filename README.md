# Improvement Board

A team improvement tracking tool built around Improvement Dialogues and Copilot Programs — capture problems, run structured dialogues, assign peer coaches, and track progress. Items move through Identified → In Progress → Done in both a Board (list) and a Kanban view, with due dates, aging indicators, voting, and an async comment thread per item. All state lives in the browser (no backend); the app deep-links into the wider agile-toolkit suite (Sprint Metrics, Moving Motivators, Kanban Designer, Change Planner, Planning Poker).

Part of the [Agile Tools](https://github.com/bthos) suite built on ICAgile source materials.

See `GOAL.md` for why this app exists and `ROADMAP.md` for what's shipped and queued next.

## Stack
React 18 · TypeScript · Vite · Tailwind CSS · react-i18next (EN/ES/BE/RU)

## Dev commands
```bash
npm install       # install dependencies
npm run dev       # start Vite dev server
npm run build     # tsc typecheck + production build
npm run preview   # preview the production build locally
npm test          # vitest run — src/utils/*.ts
```

## Deploy
GitHub Pages via GitHub Actions on push to `main`.

## localStorage keys

| Key | Shape | Purpose |
|-----|-------|---------|
| `improvement-board-items` | `ImprovementItem[]` | The board's items — written by `saveItems()` in `App.tsx` on every mutation. |
| `improvement-board-members` | `TeamMember[]` | Team roster used for owner/copilot/comment-author selection — written by `saveMembers()` in `App.tsx`. |
| `improvement-board:lastSession` | `{ identified, inProgress, done, total, memberCount, lastUpdated }` | Compact summary written on every item/member update; read by the suite Dashboard (`agile-toolkit.github.io`) to render a live preview card. |
| `improvement-board:sprintHistory` | `SprintArchive[]` — `{ sprintNumber, archivedAt, items[] }[]` | Archive of items snapshotted by "End Sprint"; written by `handleEndSprint()` in `App.tsx`. `items` are the sprint's *done* items only — visualized by the History screen (`HistoryView.tsx`) as completed-per-sprint, not identified-vs-done. |
| `theme` | `'light' \| 'dark'` | User's theme preference, written by `ThemeToggle.tsx`. |
| `improvement-board:facilitatorMode` (`sessionStorage`) | `'1' \| '0'` | Facilitator (projector) mode toggle — per-tab, not persisted across sessions. See `src/components/useFacilitatorMode.ts`. |

## Tech notes
- **State management:** plain React state in `App.tsx` (no store library); all mutations flow through a small set of handlers (`updateItems`, `updateMembers`, `handleEndSprint`, `handleBulkStatus`/`handleBulkDelete`, `handleVote`) that also persist to localStorage, so the two are always kept in sync.
- **i18n:** `react-i18next`, 4 locales (`en`, `es`, `be`, `ru`) under `src/i18n/`; category labels use dynamic keys (`` t(`add_form.categories.${id}`) ``) so they aren't picked up by literal-key audits — re-run a manual audit after large copy changes and keep all four locale files in sync.
- **Theming:** `ThemeToggle.tsx` toggles a `data-theme` attribute on `<html>`, matched by Tailwind's `dark:` variants (configured via the `[data-theme="dark"]` selector strategy in `tailwind.config.js`); an anti-flash script in `index.html` applies the stored/preferred theme before first paint.
- **PWA:** `vite-plugin-pwa` with `registerType: 'autoUpdate'` — precaches JS/CSS/HTML/icons for offline in-room facilitation; `UpdateToast.tsx` surfaces a reload prompt via `useRegisterSW` when a new version is cached.
- **Cross-app integrations (read/deep-link, not owned by this app):** `src/utils/movingMotivatorsImport.ts` reads `moving-motivators:lastSession` to suggest the bottom-ranked motivators as one-click item pre-fills; `src/utils/scrumFacilitatorImport.ts` reads `scrum-facilitator-session` (ignored once older than 24h) and `scrum-facilitator-history` for retro sticky notes flagged `isAction: true`, offered the same way; `src/utils/planningPokerLink.ts` reads `planning-poker:history` to show a past final estimate as an "N SP" badge on a card whose title matches (trimmed, case-insensitive) a previously estimated story — card values are free-form strings (not all decks are numeric), so estimates round-trip as strings; `src/utils/kanbanLink.ts` and `src/utils/changePlannerLink.ts` build outbound deep-link URLs (`?prefill=...&utm_source=improvement-board`) to Kanban Designer and Change Planner; `src/utils/movingMotivatorsLink.ts` builds an outbound `?change=<title>` deep-link to Moving Motivators (which already reads and pre-fills that param — no MM-side change needed), shown as an icon link on every card; the app also accepts inbound `?prefill=<title>&utm_source=...` from Sprint Metrics, Moving Motivators, and Scrum Facilitator to auto-open the Add Item modal (with a matching banner).
- **Board export:** "Export PNG" uses `html2canvas` to capture the columns grid, clipboard-first with a file-download fallback. "Download CSV" and "Copy as text" (`src/utils/csvExport.ts`) export the same items currently shown (respecting the active tag filter and sort order) as CSV or a Markdown table.
- **Tags:** `ImprovementItem.tags?: string[]`, added via a pill input in the Add Item modal or a comma-separated field in the Kanban inline-add form, both offering `<datalist>` autocomplete from tags already used on the board. Displayed as colour-coded pills on cards (`src/utils/tagColor.ts` hashes the tag name to a fixed palette entry, so a given tag always renders the same colour without persisting a colour map) and as a click-to-filter pill bar in both view headers.
- **Sprint history:** the **History** nav screen (`HistoryView.tsx`) reads `improvement-board:sprintHistory` and renders a pure-SVG bar chart of items completed per archived sprint, plus a per-category breakdown table with a sprint-over-sprint trend indicator. Since an archived sprint's `items` are only ever its *done* items, there's no "identified" count to chart per sprint — this shows completed-item velocity, not a resolution rate.
- **Inline title editing:** double-click a card's title (Board view's `ImprovementCard.tsx`, Kanban view's `ItemCard` in `ImprovementBoard.tsx`) to rename in place — Enter/blur commits, Escape reverts. Double-click was chosen over single-click specifically because the Kanban card's title is already a single-click expand/collapse toggle; reusing the same element for two single-click behaviors would have been ambiguous.
- **`brand` color scale** (`tailwind.config.js`) — Tailwind's stock `green` palette. Only keep shades that are actually referenced in `className`s (currently 50/100/200/300/400/500/600/700/800/900) — an unreferenced shade silently renders as no class at all (invisible border/background/text, not an error), which is what happened to `brand-200`/`300`/`800`/`900` before a suite-wide audit caught it.
- **Test coverage:** `src/utils/*.test.ts` covers every utility module — `dueDate.ts`'s state machine (overdue/today/soon/future/done, aging thresholds), `kanbanLink.ts`/`changePlannerLink.ts`/`planningPokerLink.ts`'s deep-link URL builders and estimate lookup, `movingMotivatorsImport.ts`'s session parsing and bottom-motivator selection, `scrumFacilitatorImport.ts`'s action-item extraction and dedup, `tagColor.ts`'s hash stability, and `csvExport.ts`'s CSV/Markdown row rendering.

## Source materials
See `.artefacts/BRIEF.md` for the full agent-maintained feature checklist and run-by-run narrative log (issue research, implementation decisions).
