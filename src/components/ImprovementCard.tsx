import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ImprovementItem } from '../types'
import { getDueDateState, dueBadgeClasses, formatDueDate, getAgeState, ageDaysOld } from '../utils/dueDate'
import { buildChangePlannerUrl } from '../utils/changePlannerLink'
import { buildPokerUrl, getLastEstimate } from '../utils/planningPokerLink'
import { tagColorClasses } from '../utils/tagColor'
import { CloseIcon, ChatIcon, LinkIcon, CardsIcon } from './icons'

const CATEGORY_COLORS: Record<string, string> = {
  process: 'bg-blue-100 text-blue-700',
  technical: 'bg-purple-100 text-purple-700',
  people: 'bg-orange-100 text-orange-700',
  product: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-600',
}

interface Props {
  item: ImprovementItem
  onMoveForward?: () => void
  onDelete: () => void
  onDialogue?: () => void
  onVote?: () => void
  onRename?: (title: string) => void
  selectMode?: boolean
  selected?: boolean
  onToggleSelect?: () => void
}

export default function ImprovementCard({ item, onMoveForward, onDelete, onDialogue, onVote, onRename, selectMode, selected, onToggleSelect }: Props) {
  const { t } = useTranslation()
  const dueDateState = getDueDateState(item.dueDate, item.status === 'done')
  const ageState = getAgeState(item.updatedAt, item.status === 'done')
  const daysOld = ageDaysOld(item.updatedAt)
  const [editing, setEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(item.title)
  const lastEstimate = getLastEstimate(item.title)

  const startEditing = () => {
    if (!onRename) return
    setDraftTitle(item.title)
    setEditing(true)
  }

  const commitEdit = () => {
    const trimmed = draftTitle.trim()
    if (trimmed && trimmed !== item.title) onRename?.(trimmed)
    setEditing(false)
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border p-4 shadow-sm ${selected ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {selectMode && (
            <input
              type="checkbox"
              checked={!!selected}
              onChange={onToggleSelect}
              aria-label={t('board.select_item')}
              className="mr-0.5 shrink-0"
            />
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[item.category]}`}>
            {t(`add_form.categories.${item.category}`)}
          </span>
          {ageState === 'aging' && (
            <span
              className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0"
              title={t('board.age_aging_tooltip', { days: daysOld })}
            />
          )}
          {ageState === 'stale' && (
            <span
              className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0"
              title={t('board.age_stale_tooltip', { days: daysOld })}
            />
          )}
        </div>
        <button onClick={onDelete} aria-label={t('board.delete')} className="text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors text-xs">
          <CloseIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      {editing ? (
        <input
          autoFocus
          value={draftTitle}
          onChange={e => setDraftTitle(e.target.value)}
          onFocus={e => e.currentTarget.select()}
          onBlur={commitEdit}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); commitEdit() }
            if (e.key === 'Escape') { setDraftTitle(item.title); setEditing(false) }
          }}
          aria-label={t('board.edit_title')}
          className="font-semibold text-gray-900 dark:text-gray-50 text-sm mb-1 w-full bg-white dark:bg-gray-800 border border-brand-400 rounded px-1 -mx-1 focus:outline-none"
        />
      ) : (
        <h3
          onDoubleClick={startEditing}
          className={`font-semibold text-gray-900 dark:text-gray-50 text-sm mb-1 ${onRename ? 'cursor-text hover:underline decoration-dotted' : ''}`}
          title={onRename ? t('board.edit_title_hint') : undefined}
        >
          {item.title}
        </h3>
      )}
      {item.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">{item.description}</p>
      )}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.map(tag => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColorClasses(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="text-xs text-gray-400 dark:text-gray-500 space-y-0.5 mb-2">
        <div>{t('board.owner')}: <span className="text-gray-600 dark:text-gray-300">{item.owner || '—'}</span></div>
        <div>
          {t('board.copilot')}:{' '}
          <span className="text-gray-600 dark:text-gray-300">{item.copilot || t('board.no_copilot')}</span>
        </div>
      </div>
      {dueDateState !== 'none' && item.dueDate && (
        <div className="mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dueBadgeClasses(dueDateState)}`}>
            {dueDateState === 'overdue'
              ? t('board.overdue')
              : dueDateState === 'today'
              ? t('board.due_today')
              : `${t('board.due')}: ${formatDueDate(item.dueDate)}`}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {onMoveForward && (
            <button onClick={onMoveForward} className="btn-primary text-xs py-1 px-3">
              {item.status === 'identified' ? t('board.move_to_progress') : t('board.move_to_done')}
            </button>
          )}
          {onDialogue && item.status === 'in_progress' && (
            <button onClick={onDialogue} className="btn-secondary text-xs py-1 px-3">
              {t('board.start_dialogue')}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(item.comments?.length ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <ChatIcon className="w-3.5 h-3.5" /> {item.comments!.length}
            </span>
          )}
          {lastEstimate && (
            <span
              className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium"
              title={t('board.effort_badge_tooltip')}
            >
              {t('board.effort_badge', { sp: lastEstimate })}
            </span>
          )}
          <a
            href={buildPokerUrl(item.title)}
            target="_blank"
            rel="noopener noreferrer"
            title={t('board.estimate_in_poker')}
            aria-label={t('board.estimate_in_poker')}
            className="text-gray-400 dark:text-gray-500 hover:text-brand-600 transition-colors leading-none"
          >
            <CardsIcon className="w-3.5 h-3.5" />
          </a>
          <a
            href={buildChangePlannerUrl(item)}
            target="_blank"
            rel="noopener noreferrer"
            title={t('board.promote_to_change_planner')}
            aria-label={t('board.promote_to_change_planner')}
            className="text-gray-400 dark:text-gray-500 hover:text-brand-600 transition-colors leading-none"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onVote}
            title={t('board.vote')}
            aria-label={t('board.vote')}
            className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-brand-600 transition-colors"
          >
            <span>▲</span>
            <span className={item.votes ? 'text-brand-600 font-semibold' : ''}>{item.votes ?? 0}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
