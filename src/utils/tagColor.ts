// A small fixed palette, hash-picked per tag name so the same tag always
// renders the same colour across sessions without needing to persist a
// tag→colour mapping anywhere.
const TAG_PALETTE = [
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-lime-100 text-lime-700',
  'bg-emerald-100 text-emerald-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-slate-200 text-slate-700',
]

export function tagColorClasses(tag: string): string {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) | 0
  }
  const index = Math.abs(hash) % TAG_PALETTE.length
  return TAG_PALETTE[index]
}
