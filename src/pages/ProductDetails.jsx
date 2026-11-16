import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchProduct, fetchProducts, fetchSettings } from '../lib/db.js'
import { useCart } from '../context/CartContext.jsx'
import { useLang } from '../i18n/index.jsx'
import { fmtPrice } from '../lib/format.js'
import { categoryName, categoryIcon } from '../data/catalog.js'
import { productInquiry } from '../lib/whatsapp.js'
import { trackViewProduct, trackAddToCart } from '../lib/pixel.js'
import { placeholderImage } from '../lib/placeholder.js'
import ProductCard from '../components/ProductCard.jsx'
import Stars from '../components/Stars.jsx'
import { useToast } from '../components/Toast.jsx'
import { CartIcon, WhatsAppIcon, TruckIcon, ShieldIcon, CheckIcon } from '../components/Icons.jsx'

export default function ProductDetails() {
  const { id } = useParams()
  const { t, lang, price } = useLang()
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
          fetchProducts()
            .then((all) => setRelated(all.filter((x) => x.category === prod.category && x.id !== prod.id).slice(0, 4)))
            .catch(() => {})
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
    fetchSettings().then(setSettings).catch(() => {})
  }, [id])

  if (loading) return <div className="container section"><div className="pd-skeleton" /></div>

  if (!p) {
    return (
      <div className="container section empty-state">
        <span className="big">🤷‍♂️</span>
        <h3>{t('pd.nfT')}</h3>
        <Link to="/products" className="btn btn-primary">{t('pd.nfBtn')}</Link>
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
    notify(t('toast.added', { n: p.name.slice(0, 28) }), { actionLabel: t('toast.view'), onAction: openCart })
  }

  const rating = Number(p.rating) || (4.4 + ((p.sold || 3) % 6) / 10)
  const reviews = p.reviews || Math.max(3, Math.round((p.sold || 8) / 4))

  return (
    <div className="container section pd-page">
      <nav className="breadcrumb" aria-label="breadcrumb">
        <Link to="/">{t('nav.home')}</Link> / <Link to="/products">{t('nav.products')}</Link> /{' '}
        <Link to={`/products?cat=${p.category}`}>{categoryName(p.category, lang)}</Link> / <span>{p.name}</span>
      </nav>

      <div className="pd-grid">
        <div className="pd-img-wrap">
          <img src={p.image} alt={p.name} className="pd-img"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImage(p.name, p.brand, p.imgSeed || 0) }} />
          <span className="pd-cat">{categoryIcon(p.category)} {categoryName(p.category, lang)}</span>
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
            <small>({t('common.reviewsN', { n: reviews })})</small>
            <span className="dot">·</span>
            <small>{t('common.sold')} {p.sold || 0}</small>
          </div>

          <div className="pd-price">
            <b>{price(p.price)}</b>
            {p.oldPrice > p.price && <s>{fmtPrice(p.oldPrice)}</s>}
            {p.oldPrice > p.price && (
              <span className="pd-save">{t('pd.save', { v: fmtPrice(p.oldPrice - p.price) })}</span>
            )}
          </div>

          <div className="pd-stock">
            {out ? <span className="out">{t('pd.out')}</span>
              : p.stock < 10 ? <span className="low">{t('pd.low', { n: p.stock })}</span>
              : <span className="in"><CheckIcon size={16} /> {t('pd.in')}</span>}
          </div>

          <p className="pd-desc">{p.description}</p>

          <div className="pd-actions">
            <div className="qty qty-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="-">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="+">+</button>
            </div>
            <button className="btn btn-primary btn-lg" disabled={out} onClick={addToCart}>
              <CartIcon size={19} /> {t('pd.addToCart')}
            </button>
            <button className="btn btn-orange btn-lg" disabled={out} onClick={buyNow}>{t('pd.buyNow')}</button>
          </div>

          {wa && (
            <a className="pd-wa" href={productInquiry(p, wa)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={19} /> {t('pd.wa')}
            </a>
          )}

          <div className="pd-perks">
            <div><TruckIcon size={20} /> {t('pd.perk1')}</div>
            <div><ShieldIcon size={20} /> {t('pd.perk2')}</div>
            <div>{t('pd.perk3')}</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>{t('pd.related')}</h2></div>
          <div className="grid-4">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}
    </div>
  )
}
