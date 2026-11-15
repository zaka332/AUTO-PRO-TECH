import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BRANDS, YEARS } from '../data/catalog.js'

// أداة "اختر سيارتك": ماركة ← طراز ← سنة، ثم يعرض القطع المطابقة
export default function CarSelector({ compact = false, defaults = {} }) {
  const [brand, setBrand] = useState(defaults.brand || '')
  const [model, setModel] = useState(defaults.model || '')
  const [year, setYear] = useState(defaults.year || '')
  const navigate = useNavigate()

  useEffect(() => { setModel('') }, [brand])

  const go = () => {
    const p = new URLSearchParams()
    if (brand) p.set('brand', brand)
    if (model) p.set('model', model)
    if (year) p.set('year', year)
    navigate(`/products?${p.toString()}`)
  }

  return (
    <div className={`car-sel ${compact ? 'compact' : ''}`}>
      <div className="car-sel-fields">
        <select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="الماركة">
          <option value="">🔎 اختر الماركة</option>
          {Object.keys(BRANDS).map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!brand} aria-label="الطراز">
          <option value="">🚗 اختر الطراز</option>
          {(BRANDS[brand] || []).map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} aria-label="سنة الصنع">
          <option value="">📅 سنة الصنع</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <button className="btn btn-primary" onClick={go} disabled={!brand && !model && !year}>
          عرض القطع المتوافقة
        </button>
      </div>
    </div>
  )
}
