import type { ImprovementItem } from '../types'

const COLUMNS = ['Title', 'Category', 'Status', 'Owner', 'Copilot', 'Due Date', 'Votes', 'Comments', 'Tags', 'Created', 'Updated'] as const

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

function rowValues(item: ImprovementItem): string[] {
  return [
    item.title,
    item.category,
    item.status,
    item.owner || '',
    item.copilot || '',
    item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '',
    String(item.votes ?? 0),
    String(item.comments?.length ?? 0),
    (item.tags ?? []).join('; '),
    new Date(item.createdAt).toLocaleDateString(),
    new Date(item.updatedAt).toLocaleDateString(),
  ]
}

export function buildCsv(items: ImprovementItem[]): string {
  const lines = [COLUMNS.join(',')]
  for (const item of items) {
    lines.push(rowValues(item).map(csvCell).join(','))
  }
  return lines.join('\n')
}

export function buildMarkdownTable(items: ImprovementItem[]): string {
  const lines = [
    `| ${COLUMNS.join(' | ')} |`,
    `| ${COLUMNS.map(() => '---').join(' | ')} |`,
  ]
  for (const item of items) {
    lines.push(`| ${rowValues(item).map(v => v.replace(/\|/g, '\\|')).join(' | ')} |`)
  }
  return lines.join('\n')
}

export function downloadCsv(items: ImprovementItem[]): void {
  const csv = buildCsv(items)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `improvement-board-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
