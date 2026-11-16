import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { fetchSettings } from '../lib/db.js'
import { useLang } from '../i18n/index.jsx'
import { trackInitiateCheckout } from '../lib/pixel.js'
import { XIcon, PlusIcon, MinusIcon, TrashIcon } from './Icons.jsx'

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, remove, subtotal, clear } = useCart()
  const { t, price } = useLang()
  const [settings, setSettings] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchSettings().then(setSettings).catch(() => {}) }, [])

  if (!isOpen) return null

  const goCheckout = () => {
    closeCart()
    trackInitiateCheckout(subtotal)
    navigate('/checkout')
  }

  const freeFrom = Number(settings?.freeDeliveryFrom) || 0

  return (
    <div className="drawer-overlay" onClick={closeCart}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="cart">
        <div className="drawer-head">
          <h3>{t('cart.title', { n: items.length })}</h3>
          <button onClick={closeCart} aria-label="close"><XIcon /></button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <span className="big">🧰</span>
            <p>{t('cart.empty')}</p>
            <Link to="/products" className="btn btn-primary" onClick={closeCart}>{t('cart.browse')}</Link>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((it) => (
                <div key={it.id} className="d-item">
                  <img src={it.image} alt={it.name} />
                  <div className="d-info">
                    <Link to={`/product/${it.id}`} onClick={closeCart} className="d-name">{it.name}</Link>
                    <span className="d-car">{it.brand} {it.model}</span>
                    <div className="d-row">
                      <div className="qty">
                        <button onClick={() => setQty(it.id, it.qty - 1)} aria-label="-"><MinusIcon size={15} /></button>
                        <span>{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} aria-label="+"><PlusIcon size={15} /></button>
                      </div>
                      <b>{price(it.price * it.qty)}</b>
                      <button className="d-del" onClick={() => remove(it.id)} aria-label="delete"><TrashIcon size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-foot">
              {freeFrom > 0 && subtotal < freeFrom && (
                <div className="free-delivery">{t('cart.free', { v: price(freeFrom - subtotal) })}</div>
              )}
              <div className="drawer-total">
                <span>{t('cart.subtotal')}</span>
                <b>{price(subtotal)}</b>
              </div>
              <button className="btn btn-primary btn-lg" onClick={goCheckout}>
                {t('cart.checkout')}
              </button>
              <button className="btn-ghost-btn" onClick={clear}>{t('cart.clear')}</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
