import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { fetchCars } from '../lib/db.js'
import { BRAND_NAMES } from '../data/catalog.js'
import CarCard from '../components/CarCard.jsx'

export default function Cars() {
  const [params, setParams] = useSearchParams()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  const brand = params.get('brand') || ''
  const sort = params.get('sort') || 'new'

  useEffect(() => {
    fetchCars().then(setCars).catch(console.error).finally(() => setLoading(false))
  }, [])

  const setParam = (key, val) => {
    const next = new URLSearchParams(params)
    if (val) next.set(key, val)
    else next.delete(key)
    setParams(next)
  }

  const list = useMemo(() => {
    let l = cars
    if (brand) l = l.filter((c) => c.brand === brand)
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'mileage') l = [...l].sort((a, b) => a.mileage - b.mileage)
    return l
  }, [cars, brand, sort])

  return (
    <div className="container section cars-page">
      <div className="cars-hero">
        <h2>🚗 سيارات للبيع — أقل من 3 سنوات</h2>
        <p>سيارات مفحوصة 100%، وثائق كاملة، كيلومتراج حقيقي موثق — المعاينة والاستفسار مباشرة عبر واتساب</p>
      </div>

      <div className="cars-filter-bar">
        <select value={brand} onChange={(e) => setParam('brand', e.target.value)} aria-label="ماركة السيارة">
          <option value="">🚗 كل الماركات</option>
          {BRAND_NAMES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={sort} onChange={(e) => setParam('sort', e.target.value)} aria-label="ترتيب">
          <option value="new">الأحدث أولاً</option>
          <option value="price-asc">السعر: الأقل أولاً</option>
          <option value="price-desc">السعر: الأعلى أولاً</option>
          <option value="mileage">الأقل كيلومتراجاً</option>
        </select>
        <span className="count-chip">{list.length} سيارة معروضة</span>
        {brand && (
          <button className="btn btn-ghost btn-sm" onClick={() => setParam('brand', '')}>✖ إزالة الفلتر</button>
        )}
      </div>

      {loading ? (
        <div className="grid-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" />)}</div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          <span className="big">🚙</span>
          <h3>لا توجد سيارات معروضة حالياً بهذه المعايير</h3>
          <p>جاري تجهيز دفعات جديدة — أو راسلنا على واتساب وسنجد لك السيارة المناسبة!</p>
          <Link to="/contact" className="btn btn-primary">اطلب سيارة بالمواصفات</Link>
        </div>
      ) : (
        <div className="grid-3">{list.map((c) => <CarCard key={c.id} car={c} />)}</div>
      )}
    </div>
  )
}
