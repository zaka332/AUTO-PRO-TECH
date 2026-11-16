import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { fetchCars } from '../lib/db.js'
import { BRAND_NAMES } from '../data/catalog.js'
import { useLang } from '../i18n/index.jsx'
import { brandDisplay } from '../i18n/catalog-i18n.js'
import CarCard from '../components/CarCard.jsx'

export default function Cars() {
  const { t, lang } = useLang()
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
        <h2>{t('cars.title')}</h2>
        <p>{t('cars.sub')}</p>
      </div>

      <div className="cars-filter-bar">
        <select value={brand} onChange={(e) => setParam('brand', e.target.value)} aria-label="brand">
          <option value="">{t('pp.allBrands')}</option>
          {BRAND_NAMES.map((b) => <option key={b} value={b}>{brandDisplay(b, lang)}</option>)}
        </select>
        <select value={sort} onChange={(e) => setParam('sort', e.target.value)} aria-label="sort">
          <option value="new">{t('cars.sNew')}</option>
          <option value="price-asc">{t('pp.sAsc')}</option>
          <option value="price-desc">{t('pp.sDesc')}</option>
          <option value="mileage">{t('cars.sKm')}</option>
        </select>
        <span className="count-chip">{t('cars.counted', { n: list.length })}</span>
        {brand && (
          <button className="btn btn-ghost btn-sm" onClick={() => setParam('brand', '')}>✖</button>
        )}
      </div>

      {loading ? (
        <div className="grid-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" />)}</div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          <span className="big">🚙</span>
          <h3>{t('cars.emptyT')}</h3>
          <p>{t('cars.emptyP')}</p>
          <Link to="/contact" className="btn btn-primary">{t('cars.orderBtn')}</Link>
        </div>
      ) : (
        <div className="grid-3">{list.map((c) => <CarCard key={c.id} car={c} />)}</div>
      )}
    </div>
  )
}
