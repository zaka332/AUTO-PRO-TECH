import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { fetchSettings } from '../lib/db.js'
import { fmtPrice } from '../lib/format.js'
import { trackInitiateCheckout } from '../lib/pixel.js'
import { XIcon, PlusIcon, MinusIcon, TrashIcon } from './Icons.jsx'

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, remove, subtotal, clear } = useCart()
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
      <aside className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="سلة المشتريات">
        <div className="drawer-head">
          <h3>🛒 سلة المشتريات ({items.length})</h3>
          <button onClick={closeCart} aria-label="إغلاق"><XIcon /></button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <span className="big">🧰</span>
            <p>سلتك فارغة</p>
            <Link to="/products" className="btn btn-primary" onClick={closeCart}>تصفح القطع</Link>
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
                        <button onClick={() => setQty(it.id, it.qty - 1)} aria-label="نقصان"><MinusIcon size={15} /></button>
                        <span>{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} aria-label="زيادة"><PlusIcon size={15} /></button>
                      </div>
                      <b>{fmtPrice(it.price * it.qty)}</b>
                      <button className="d-del" onClick={() => remove(it.id)} aria-label="حذف"><TrashIcon size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-foot">
              {freeFrom > 0 && subtotal < freeFrom && (
                <div className="free-delivery">
                  🚚 أضف {fmtPrice(freeFrom - subtotal)} للاستفادة من التوصيل المجاني!
                </div>
              )}
              <div className="drawer-total">
                <span>المجموع</span>
                <b>{fmtPrice(subtotal)}</b>
              </div>
              <button className="btn btn-primary btn-lg" onClick={goCheckout}>
                إتمام الطلب ← الدفع عند الاستلام
              </button>
              <button className="btn-ghost" onClick={clear}>تفريغ السلة</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
