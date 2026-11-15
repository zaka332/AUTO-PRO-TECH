import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { fmtPrice } from '../lib/format.js'
import { categoryName, categoryIcon } from '../data/catalog.js'
import { trackAddToCart } from '../lib/pixel.js'
import { CartIcon } from './Icons.jsx'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const out = product.stock <= 0

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
        <div className="pcard-foot">
          <div className="pcard-price">
            <b>{fmtPrice(product.price)}</b>
            {product.oldPrice > product.price && <s>{fmtPrice(product.oldPrice)}</s>}
          </div>
          <button
            className="btn-add"
            disabled={out}
            aria-label="أضف إلى السلة"
            onClick={() => { add(product); trackAddToCart(product) }}
          >
            <CartIcon size={18} />
          </button>
        </div>
      </div>
    </article>
  )
}
