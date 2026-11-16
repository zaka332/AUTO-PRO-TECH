import { Link } from 'react-router-dom'
import { useLang } from '../i18n/index.jsx'
import { fmtPrice } from '../lib/format.js'
import { carDisplayName } from '../i18n/catalog-i18n.js'
import { placeholderImage } from '../lib/placeholder.js'

// بطاقة سيارة معروضة للبيع (أقل من 3 سنوات)
export default function CarCard({ car }) {
  const { t, lang } = useLang()
  const name = carDisplayName(car, lang)

  return (
    <article className="ccard">
      <Link to={`/car/${car.id}`} className="ccard-img">
        <img src={car.image} alt={name} loading="lazy"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImage(name, car.brand, car.imgSeed || 0, '🚗') }} />
        <span className="ccard-year">📅 {car.year}</span>
        {car.featured && <span className="ccard-feat">{t('card.feat')}</span>}
      </Link>
      <div className="ccard-body">
        <Link to={`/car/${car.id}`} className="ccard-name">{name}</Link>
        <div className="ccard-meta">
          <span>📊 {t('common.km', { n: Number(car.mileage).toLocaleString('en-US') })}</span>
          <span>⛽ {car.fuel}</span>
          <span>⚙️ {car.transmission}</span>
        </div>
        <div className="ccard-foot">
          <b className="ccard-price">{fmtPrice(car.price)}</b>
          <Link to={`/car/${car.id}`} className="btn btn-ghost btn-sm">{t('card.details')}</Link>
        </div>
      </div>
    </article>
  )
}
