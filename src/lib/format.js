export function fmtPrice(n) {
  if (n == null || isNaN(n)) return '—'
  return Number(n).toLocaleString('en-US') + ' دج'
}

export function fmtDate(ts) {
  if (!ts) return '—'
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-DZ') + ' ' + d.toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' })
}

export function timeAgo(ts) {
  if (!ts) return ''
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 60) return 'الآن'
  if (s < 3600) return `قبل ${Math.floor(s / 60)} دقيقة`
  if (s < 86400) return `قبل ${Math.floor(s / 3600)} ساعة`
  return `قبل ${Math.floor(s / 86400)} يوم`
}
