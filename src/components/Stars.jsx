// نجوم التقييم بتعبة جزئية (4.5 → نصف نجمة ممتلئة)
export default function Stars({ val = 5, size = 14, className = '' }) {
  const pct = Math.max(0, Math.min(100, (Number(val) / 5) * 100))
  return (
    <span className={`stars ${className}`} style={{ fontSize: size }} aria-label={`التقييم ${val} من 5`}>
      <span className="stars-bg" aria-hidden="true">★★★★★</span>
      <span className="stars-fill" style={{ width: `${pct}%` }} aria-hidden="true">★★★★★</span>
    </span>
  )
}
