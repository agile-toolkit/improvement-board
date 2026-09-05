import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import html2canvas from 'html2canvas'
import type { ImprovementItem, ImprovementStatus } from '../types'
import ImprovementCard from './ImprovementCard'
import AddItemModal from './AddItemModal'
import { buildKanbanUrl } from '../utils/kanbanLink'
import { downloadCsv, buildMarkdownTable } from '../utils/csvExport'
import { tagColorClasses } from '../utils/tagColor'
import { ChartIcon, TargetIcon, CheckboxCheckedIcon, ClipboardIcon, DownloadIcon, TagIcon, RefreshIcon } from './icons'

const COLUMNS: ImprovementStatus[] = ['identified', 'in_progress', 'done']
const SPRINT_METRICS_URL = 'https://agile-toolkit.github.io/sprint-metrics/'
const MOVING_MOTIVATORS_URL = 'https://agile-toolkit.github.io/moving-motivators/'
const SCRUM_FACILITATOR_URL = 'https://agile-toolkit.github.io/scrum-facilitator/'

type SortMode = 'default' | 'due' | 'stale' | 'votes'

interface Props {
  items: ImprovementItem[]
  onAdd: (item: ImprovementItem) => void
  onUpdate: (item: ImprovementItem) => void
  onDelete: (id: string) => void
  onDialogue: (item: ImprovementItem) => void
  onVote: (id: string) => void
  onResetVotes: () => void
  onBulkStatus: (ids: string[], status: ImprovementStatus) => void
  onBulkDelete: (ids: string[]) => void
  prefillTitle?: string
  fromSprintMetrics?: boolean
  fromMovingMotivators?: boolean
  fromScrumFacilitator?: boolean
  currentSprint: number
  onEndSprint: () => void
}

export default function BoardView({ items, onAdd, onUpdate, onDelete, onDialogue, onVote, onResetVotes, onBulkStatus, onBulkDelete, prefillTitle, fromSprintMetrics, fromMovingMotivators, fromScrumFacilitator, currentSprint, onEndSprint }: Props) {
  const { t } = useTranslation()
  const [showAdd, setShowAdd] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const [exportState, setExportState] = useState<'idle' | 'busy' | 'done'>('idle')
  const [csvState, setCsvState] = useState<'idle' | 'done'>('idle')
  const [textCopyState, setTextCopyState] = useState<'idle' | 'done'>('idle')
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const allTags = Array.from(new Set(items.flatMap(i => i.tags ?? []))).sort()
  const tagFilteredItems = tagFilter ? items.filter(i => i.tags?.includes(tagFilter)) : items

  useEffect(() => {
    if (prefillTitle) setShowAdd(true)
  }, [prefillTitle])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectMode) {
        setSelectMode(false)
        setSelectedIds(new Set())
        return
      }
      if (e.key !== 'n' && e.key !== 'N') return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      e.preventDefault()
      setShowAdd(true)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selectMode])

  const toggleSelectMode = () => {
    setSelectMode(prev => !prev)
    setSelectedIds(new Set())
  }

  const toggleSelectItem = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelectAll = () => setSelectedIds(new Set(items.map(i => i.id)))
  const handleDeselectAll = () => setSelectedIds(new Set())

  const handleBulkMark = (status: ImprovementStatus) => {
    onBulkStatus(Array.from(selectedIds), status)
    setSelectedIds(new Set())
  }

  const handleBulkDeleteClick = () => {
    if (window.confirm(t('board.delete_selected_confirm', { count: selectedIds.size }))) {
      onBulkDelete(Array.from(selectedIds))
      setSelectedIds(new Set())
    }
  }

  async function handleExport() {
    if (!boardRef.current || exportState === 'busy') return
    setExportState('busy')
    try {
      const canvas = await html2canvas(boardRef.current, { useCORS: true, backgroundColor: '#f9fafb' })
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
      if (blob && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      } else {
        const date = new Date().toISOString().slice(0, 10)
        const link = document.createElement('a')
        link.download = `improvement-board-${date}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
      setExportState('done')
      setTimeout(() => setExportState('idle'), 2000)
    } catch {
      setExportState('idle')
    }
  }

  const getNext = (status: ImprovementStatus): ImprovementStatus | null => {
    if (status === 'identified') return 'in_progress'
    if (status === 'in_progress') return 'done'
    return null
  }

  const colItems = (status: ImprovementStatus) => {
    const filtered = tagFilteredItems.filter(i => i.status === status)
    if (sortMode === 'due') {
      return [...filtered].sort((a, b) => {
        if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate
        if (a.dueDate) return -1
        if (b.dueDate) return 1
        return 0
      })
    }
    if (sortMode === 'stale') {
      return [...filtered].sort((a, b) => a.updatedAt - b.updatedAt)
    }
    if (sortMode === 'votes') {
      return [...filtered].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
    }
    return filtered
  }

  // Same items and order the board currently shows, respecting the tag filter
  // and sort mode — CSV/text export mirrors what's on screen.
  const exportableItems = COLUMNS.flatMap(colItems)

  function handleDownloadCsv() {
    downloadCsv(exportableItems)
    setCsvState('done')
    setTimeout(() => setCsvState('idle'), 2000)
  }

  async function handleCopyText() {
    try {
      await navigator.clipboard.writeText(buildMarkdownTable(exportableItems))
      setTextCopyState('done')
      setTimeout(() => setTextCopyState('idle'), 2000)
    } catch { /* clipboard unavailable — no-op */ }
  }

  return (
    <div className={selectMode && selectedIds.size > 0 ? 'pb-20' : undefined}>
      {fromSprintMetrics && (
        <div className="mb-4 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
          <ChartIcon className="w-4 h-4" />
          <span>{t('board.from_sprint_metrics')}</span>
          <a
            href={SPRINT_METRICS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto underline hover:text-amber-900 text-xs"
          >
            {t('board.open_sprint_metrics')}
          </a>
        </div>
      )}
      {fromMovingMotivators && (
        <div className="mb-4 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
          <TargetIcon className="w-4 h-4" />
          <span>{t('board.from_moving_motivators')}</span>
          <a
            href={MOVING_MOTIVATORS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto underline hover:text-amber-900 text-xs"
          >
            {t('board.open_moving_motivators')}
          </a>
        </div>
      )}
      {fromScrumFacilitator && (
        <div className="mb-4 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
          <RefreshIcon className="w-4 h-4" />
          <span>{t('board.from_scrum_facilitator')}</span>
          <a
            href={SCRUM_FACILITATOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto underline hover:text-amber-900 text-xs"
          >
            {t('board.open_scrum_facilitator')}
          </a>
        </div>
      )}
      {allTags.length > 0 && (
        <div className="mb-4 flex items-center gap-2 flex-wrap" role="group" aria-label={t('board.filter_by_tag')}>
          <TagIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(f => (f === tag ? null : tag))}
              className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all ${tagColorClasses(tag)} ${
                tagFilter === tag ? 'ring-2 ring-brand-400' : tagFilter ? 'opacity-40' : ''
              }`}
            >
              {tag}
            </button>
          ))}
          {tagFilter && (
            <button
              onClick={() => setTagFilter(null)}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline"
            >
              {t('board.clear_tag_filter')}
            </button>
          )}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('board.title')}</h1>
          <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
            {t('board.sprint_count', { n: currentSprint })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-xs">
            <button
              onClick={() => setSortMode('default')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                sortMode === 'default' ? 'bg-brand-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t('board.sort_default')}
            </button>
            <button
              onClick={() => setSortMode('due')}
              className={`px-3 py-1.5 font-medium transition-colors border-l border-gray-200 dark:border-gray-700 ${
                sortMode === 'due' ? 'bg-brand-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t('board.sort_due')}
            </button>
            <button
              onClick={() => setSortMode('stale')}
              className={`px-3 py-1.5 font-medium transition-colors border-l border-gray-200 dark:border-gray-700 ${
                sortMode === 'stale' ? 'bg-brand-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t('board.sort_stale_first')}
            </button>
            <button
              onClick={() => setSortMode('votes')}
              className={`px-3 py-1.5 font-medium transition-colors border-l border-gray-200 dark:border-gray-700 ${
                sortMode === 'votes' ? 'bg-brand-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t('board.sort_votes')}
            </button>
          </div>
          {items.some(i => (i.votes ?? 0) > 0) && (
            <button
              onClick={() => {
                if (window.confirm(t('board.reset_votes_confirm'))) onResetVotes()
              }}
              className="btn-secondary text-xs"
            >
              {t('board.reset_votes')}
            </button>
          )}
          <a
            href={buildKanbanUrl(items)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs"
            title={t('board.open_kanban_designer_title')}
          >
            {t('board.open_kanban_designer')}
          </a>
          <button
            onClick={handleExport}
            disabled={exportState === 'busy'}
            className="btn-secondary text-xs"
          >
            {exportState === 'busy'
              ? t('board.export_downloading')
              : exportState === 'done'
              ? t('board.export_copied')
              : t('board.export_png')}
          </button>
          <button onClick={handleDownloadCsv} className="btn-secondary text-xs inline-flex items-center gap-1">
            <DownloadIcon className="w-3.5 h-3.5" />
            {csvState === 'done' ? t('board.export_csv_done') : t('board.export_csv')}
          </button>
          <button onClick={handleCopyText} className="btn-secondary text-xs">
            {textCopyState === 'done' ? t('board.copy_text_done') : t('board.copy_text')}
          </button>
          {items.some(i => i.status === 'done') && (
            <button
              onClick={() => {
                const count = items.filter(i => i.status === 'done').length
                if (window.confirm(t('board.end_sprint_confirm', { count, next: currentSprint + 1 }))) {
                  onEndSprint()
                }
              }}
              className="btn-secondary text-xs"
            >
              {t('board.end_sprint')}
            </button>
          )}
          <button
            onClick={toggleSelectMode}
            aria-pressed={selectMode}
            className={`btn-secondary text-xs inline-flex items-center gap-1 ${selectMode ? 'bg-brand-600 text-white' : ''}`}
          >
            <CheckboxCheckedIcon className="w-3.5 h-3.5" /> {t('board.select_items')}
          </button>
          <button onClick={() => setShowAdd(true)} title={t('board.add_shortcut_hint')} className="btn-primary">
            + {t('board.add')}
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <ClipboardIcon className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-gray-600" />
          <p>{t('board.empty')}</p>
        </div>
      )}

      <div ref={boardRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => (
          <div key={col}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                {t(`board.${col}`)}
              </h2>
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                {colItems(col).length}
              </span>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {colItems(col).map(item => (
                <ImprovementCard
                  key={item.id}
                  item={item}
                  onDelete={() => onDelete(item.id)}
                  onMoveForward={
                    getNext(item.status)
                      ? () => onUpdate({ ...item, status: getNext(item.status)!, updatedAt: Date.now() })
                      : undefined
                  }
                  onDialogue={item.status === 'in_progress' ? () => onDialogue(item) : undefined}
                  onVote={() => onVote(item.id)}
                  onRename={title => onUpdate({ ...item, title, updatedAt: Date.now() })}
                  selectMode={selectMode}
                  selected={selectedIds.has(item.id)}
                  onToggleSelect={() => toggleSelectItem(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{t('board.suite_link_label')}</span>
        <a
          href={SPRINT_METRICS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-brand-600 transition-colors"
        >
          <ChartIcon className="w-3.5 h-3.5" /> {t('board.open_sprint_metrics')}
        </a>
      </div>

      {showAdd && (
        <AddItemModal
          onAdd={item => { onAdd(item); setShowAdd(false) }}
          onClose={() => setShowAdd(false)}
          initialTitle={prefillTitle}
          existingItems={items}
        />
      )}

      {selectMode && selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap justify-center sm:justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {t('board.selected_count', { count: selectedIds.size })}
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button onClick={handleSelectAll} className="btn-secondary text-xs">{t('board.select_all')}</button>
              <button onClick={handleDeselectAll} className="btn-secondary text-xs">{t('board.deselect_all')}</button>
              <button onClick={() => handleBulkMark('identified')} className="btn-secondary text-xs">{t('board.mark_identified')}</button>
              <button onClick={() => handleBulkMark('in_progress')} className="btn-secondary text-xs">{t('board.mark_in_progress')}</button>
              <button onClick={() => handleBulkMark('done')} className="btn-secondary text-xs">{t('board.mark_done')}</button>
              <button onClick={handleBulkDeleteClick} className="btn-secondary text-xs text-red-600 dark:text-red-400">
                {t('board.delete_selected')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
