import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, filterProducts } from '../lib/db.js'
import { CATEGORIES, BRANDS, YEARS } from '../data/catalog.js'
import ProductCard from '../components/ProductCard.jsx'
import { SearchIcon } from '../components/Icons.jsx'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('new')

  const cat = params.get('cat') || ''
  const brand = params.get('brand') || ''
  const model = params.get('model') || ''
  const year = params.get('year') || ''
  const q = params.get('q') || ''

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error).finally(() => setLoading(false))
  }, [])

  const setParam = (key, val) => {
    const next = new URLSearchParams(params)
    if (val) next.set(key, val)
    else next.delete(key)
    if (key === 'brand') next.delete('model')
    setParams(next)
  }

  const list = useMemo(() => {
    let l = filterProducts(products, { category: cat, brand, model, year, q })
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'best') l = [...l].sort((a, b) => (b.sold || 0) - (a.sold || 0))
    return l
  }, [products, cat, brand, model, year, q, sort])

  const title = cat ? CATEGORIES.find((c) => c.id === cat)?.name
    : brand ? `${brand}${model ? ' ' + model : ''}`
    : q ? `نتائج البحث: ${q}`
    : 'كل القطع'

  return (
    <div className="container section products-page">
      <div className="section-head">
        <h2>🧰 {title} <span className="count-chip">{list.length} قطعة</span></h2>
      </div>

      <div className="products-layout">
        {/* المرشحات */}
        <aside className="filters">
          <div className="filter-box">
            <h4>الفئة</h4>
            <div className="f-list">
              <button className={!cat ? 'active' : ''} onClick={() => setParam('cat', '')}>الكل</button>
              {CATEGORIES.map((c) => (
                <button key={c.id} className={cat === c.id ? 'active' : ''} onClick={() => setParam('cat', c.id)}>
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-box">
            <h4>الماركة</h4>
            <select value={brand} onChange={(e) => setParam('brand', e.target.value)}>
              <option value="">كل الماركات</option>
              {Object.keys(BRANDS).map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            {brand && (
              <select className="mt" value={model} onChange={(e) => setParam('model', e.target.value)}>
                <option value="">كل الطرازات</option>
                {BRANDS[brand].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            )}
          </div>

          <div className="filter-box">
            <h4>سنة الصنع</h4>
            <select value={year} onChange={(e) => setParam('year', e.target.value)}>
              <option value="">كل السنوات (2005 – 2026)</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {(cat || brand || model || year || q) && (
            <button className="btn btn-ghost w100" onClick={() => setParams(new URLSearchParams())}>
              ✖ إزالة كل المرشحات
            </button>
          )}
        </aside>

        {/* الشبكة */}
        <div>
          <div className="products-toolbar">
            <label className="sort">
              ترتيب:
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="new">الأحدث</option>
                <option value="price-asc">السعر: الأقل أولاً</option>
                <option value="price-desc">السعر: الأعلى أولاً</option>
                <option value="best">الأكثر مبيعاً</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div className="grid-3">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="skeleton-card" />)}</div>
          ) : list.length === 0 ? (
            <div className="empty-state">
              <span className="big">🔍</span>
              <h3>لا توجد نتائج مطابقة</h3>
              <p>جرّب تغيير المرشحات أو تواصل معنا عبر واتساب — نؤمن لك القطعة!</p>
            </div>
          ) : (
            <div className="grid-3">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
