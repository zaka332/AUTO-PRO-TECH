import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from './Toast.jsx'
import { fmtPrice } from '../lib/format.js'
import { categoryName, categoryIcon } from '../data/catalog.js'
import { trackAddToCart } from '../lib/pixel.js'
import Stars from './Stars.jsx'
import { CartIcon } from './Icons.jsx'

export default function ProductCard({ product }) {
  const { add, openCart } = useCart()
  const { notify } = useToast()
  const out = product.stock <= 0

  // تقييم عرض تقديري عند غياب البيانات من قاعدة البيانات
  const rating = Number(product.rating) || (4.4 + ((product.sold || 3) % 6) / 10)
  const reviews = product.reviews || Math.max(3, Math.round((product.sold || 8) / 4))

  const onAdd = () => {
    add(product)
    trackAddToCart(product)
    notify(`✅ أُضيفت «${product.name.slice(0, 28)}${product.name.length > 28 ? '…' : ''}» إلى السلة`, {
      actionLabel: 'عرض السلة',
      onAction: openCart,
    })
  }

  return (
    <article className="pcard">
      <Link to={`/product/${product.id}`} className="pcard-img">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.oldPrice > product.price && (
          <span className="pcard-off">
            -{Math.round(100 - (product.price / product.oldPrice) * 100)}%
          </span>
        )}
        {out && <span className="pcard-out">نفدت الكمية</span>}
        <span className="pcard-cat">{categoryIcon(product.category)} {categoryName(product.category)}</span>
      </Link>
      <div className="pcard-body">
        <div className="pcard-car">🚗 {product.brand} {product.model} • {product.year}</div>
        <Link to={`/product/${product.id}`} className="pcard-name">{product.name}</Link>
        <div className="pcard-rate">
          <Stars val={rating} size={13} />
          <b>{rating.toFixed(1)}</b>
          <small>· {reviews} تقييم</small>
        </div>
        <div className="pcard-foot">
          <div className="pcard-price">
            <b>{fmtPrice(product.price)}</b>
            {product.oldPrice > product.price && <s>{fmtPrice(product.oldPrice)}</s>}
          </div>
          <button className="btn-add" disabled={out} aria-label="أضف إلى السلة" onClick={onAdd}>
            <CartIcon size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}
