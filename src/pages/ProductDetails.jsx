import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchProduct, fetchProducts, fetchSettings } from '../lib/db.js'
import { useCart } from '../context/CartContext.jsx'
import { fmtPrice } from '../lib/format.js'
import { categoryName, categoryIcon } from '../data/catalog.js'
import { productInquiry } from '../lib/whatsapp.js'
import { trackViewProduct, trackAddToCart } from '../lib/pixel.js'
import ProductCard from '../components/ProductCard.jsx'
import { CartIcon, WhatsAppIcon, TruckIcon, ShieldIcon, CheckIcon } from '../components/Icons.jsx'
import Stars from '../components/Stars.jsx'
import { useToast } from '../components/Toast.jsx'

export default function ProductDetails() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)
  const [qty, setQty] = useState(1)
  const [related, setRelated] = useState([])
  const { add, openCart } = useCart()
  const { notify } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    fetchProduct(id)
      .then((prod) => {
        setP(prod)
        if (prod) {
          trackViewProduct(prod)
          document.title = `${prod.name} | AutoProTech`
          fetchProductsForRelated(prod)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
    fetchSettings().then(setSettings).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchProductsForRelated(prod) {
    try {
      const all = await fetchProducts()
      setRelated(all.filter((x) => x.category === prod.category && x.id !== prod.id).slice(0, 4))
    } catch { /* تجاهل */ }
  }

  if (loading) return <div className="container section"><div className="pd-skeleton" /></div>

  if (!p) {
    return (
      <div className="container section empty-state">
        <span className="big">🤷‍♂️</span>
        <h3>القطعة غير موجودة</h3>
        <Link to="/products" className="btn btn-primary">تصفح المتجر</Link>
      </div>
    )
  }

  const out = p.stock <= 0
  const wa = settings?.whatsapp

  const buyNow = () => {
    add(p, qty)
    navigate('/checkout')
  }

  const addToCart = () => {
    add(p, qty)
    trackAddToCart(p)
    notify('✅ أُضيفت القطعة إلى السلة', { actionLabel: 'عرض السلة', onAction: openCart })
  }

  const rating = Number(p.rating) || (4.4 + ((p.sold || 3) % 6) / 10)
  const reviews = p.reviews || Math.max(3, Math.round((p.sold || 8) / 4))

  return (
    <div className="container section pd-page">
      <nav className="breadcrumb" aria-label="مسار التنقل">
        <Link to="/">الرئيسية</Link> / <Link to="/products">القطع</Link> /{' '}
        <Link to={`/products?cat=${p.category}`}>{categoryName(p.category)}</Link> / <span>{p.name}</span>
      </nav>

      <div className="pd-grid">
        <div className="pd-img-wrap">
          <img src={p.image} alt={p.name} className="pd-img" />
          <span className="pd-cat">{categoryIcon(p.category)} {categoryName(p.category)}</span>
        </div>

        <div className="pd-info">
          <h1>{p.name}</h1>
          <div className="pd-car-chips">
            <span>🚗 {p.brand}</span>
            <span>{p.model}</span>
            <span>📅 {p.year}</span>
            {p.sku && <span>🔖 {p.sku}</span>}
          </div>

          <div className="pd-rating">
            <Stars val={rating} size={16} />
            <b>{rating.toFixed(1)}</b>
            <small>({reviews} تقييم)</small>
            <span className="dot">·</span>
            <small>{p.sold || 0} مبيع</small>
          </div>

          <div className="pd-price">
            <b>{fmtPrice(p.price)}</b>
            {p.oldPrice > p.price && <s>{fmtPrice(p.oldPrice)}</s>}
            {p.oldPrice > p.price && (
              <span className="pd-save">وفّر {fmtPrice(p.oldPrice - p.price)}</span>
            )}
          </div>

          <div className="pd-stock">
            {out ? <span className="out">⛔ نفدت الكمية — اطلبها بالطلب المسبق</span>
              : p.stock < 10 ? <span className="low">⚠️ آخر {p.stock} قطع!</span>
              : <span className="in"><CheckIcon size={16} /> متوفرة — جاهزة للشحن</span>}
          </div>

          <p className="pd-desc">{p.description}</p>

          <div className="pd-actions">
            <div className="qty qty-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="نقصان">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="زيادة">+</button>
            </div>
            <button className="btn btn-primary btn-lg" disabled={out} onClick={addToCart}>
              <CartIcon size={19} /> أضف إلى السلة
            </button>
            <button className="btn btn-orange btn-lg" disabled={out} onClick={buyNow}>⚡ اشترِ الآن</button>
          </div>

          {wa && (
            <a className="pd-wa" href={productInquiry(p, wa)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={19} /> استفسر عن هذه القطعة عبر واتساب
            </a>
          )}

          <div className="pd-perks">
            <div><TruckIcon size={20} /> توصيل لكل الولايات (للمنزل / المكتب)</div>
            <div><ShieldIcon size={20} /> ضمان مطابقة القطعة مع سيارتك</div>
            <div>💵 الدفع عند الاستلام</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>🔄 قطع مشابهة</h2></div>
          <div className="grid-4">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}
    </div>
  )
}
