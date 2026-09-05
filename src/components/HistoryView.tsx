import { useTranslation } from 'react-i18next'
import type { SprintArchive, Category } from '../types'
import { ChartIcon, TrendUpIcon, TrendDownIcon } from './icons'

interface Props {
  sprintHistory: SprintArchive[]
}

const CATEGORIES: Category[] = ['process', 'technical', 'people', 'product', 'other']

const CHART_HEIGHT = 160
const BAR_WIDTH = 36
const BAR_GAP = 24
const TOP_PADDING = 20

export default function HistoryView({ sprintHistory }: Props) {
  const { t } = useTranslation()

  if (sprintHistory.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">{t('history.title')}</h1>
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <ChartIcon className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-gray-600" />
          <p>{t('history.empty')}</p>
        </div>
      </div>
    )
  }

  const counts = sprintHistory.map(s => s.items.length)
  const maxCount = Math.max(...counts, 1)
  const chartWidth = sprintHistory.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('history.title')}</h1>

      <div className="card p-5 overflow-x-auto">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          {t('history.chart_title')}
        </h2>
        <svg viewBox={`0 0 ${chartWidth} ${TOP_PADDING + CHART_HEIGHT + 40}`} width={chartWidth} height={TOP_PADDING + CHART_HEIGHT + 40}>
          {sprintHistory.map((archive, i) => {
            const count = archive.items.length
            const barHeight = (count / maxCount) * CHART_HEIGHT
            const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP)
            const y = TOP_PADDING + CHART_HEIGHT - barHeight
            return (
              <g key={archive.sprintNumber}>
                <title>{t('history.bar_tooltip', { n: archive.sprintNumber, count })}</title>
                <rect x={x} y={y} width={BAR_WIDTH} height={barHeight} rx={4} className="fill-brand-600" />
                <text x={x + BAR_WIDTH / 2} y={y - 6} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-xs font-medium">
                  {count}
                </text>
                <text x={x + BAR_WIDTH / 2} y={TOP_PADDING + CHART_HEIGHT + 20} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500 text-xs">
                  {t('history.sprint_n', { n: archive.sprintNumber })}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
          {t('history.breakdown_title')}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                <th className="pb-2 pr-4">{t('history.sprint_column')}</th>
                {CATEGORIES.map(c => (
                  <th key={c} className="pb-2 pr-4">{t(`add_form.categories.${c}`)}</th>
                ))}
                <th className="pb-2 pr-4">{t('history.total')}</th>
                <th className="pb-2">{t('history.trend')}</th>
              </tr>
            </thead>
            <tbody>
              {sprintHistory.map((archive, i) => {
                const prev = i > 0 ? sprintHistory[i - 1].items.length : null
                const count = archive.items.length
                const delta = prev !== null ? count - prev : null
                return (
                  <tr key={archive.sprintNumber} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4 font-medium text-gray-700 dark:text-gray-300">
                      {t('history.sprint_n', { n: archive.sprintNumber })}
                    </td>
                    {CATEGORIES.map(c => (
                      <td key={c} className="py-2 pr-4 text-gray-500 dark:text-gray-400">
                        {archive.items.filter(item => item.category === c).length}
                      </td>
                    ))}
                    <td className="py-2 pr-4 font-semibold text-gray-800 dark:text-gray-200">{count}</td>
                    <td className="py-2">
                      {delta === null ? (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      ) : delta > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-green-600 dark:text-green-400">
                          <TrendUpIcon className="w-3.5 h-3.5" /> +{delta}
                        </span>
                      ) : delta < 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-red-500 dark:text-red-400">
                          <TrendDownIcon className="w-3.5 h-3.5" /> {delta}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">{t('history.no_change')}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
