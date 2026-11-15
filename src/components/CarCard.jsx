import { Link } from 'react-router-dom'
import { fmtPrice } from '../lib/format.js'

// بطاقة سيارة معروضة للبيع (أقل من 3 سنوات)
export default function CarCard({ car }) {
  return (
    <article className="ccard">
      <Link to={`/car/${car.id}`} className="ccard-img">
        <img src={car.image} alt={car.name} loading="lazy" />
        <span className="ccard-year">📅 {car.year}</span>
        {car.featured && <span className="ccard-feat">⭐ مميزة</span>}
      </Link>
      <div className="ccard-body">
        <Link to={`/car/${car.id}`} className="ccard-name">{car.name}</Link>
        <div className="ccard-meta">
          <span>📊 {Number(car.mileage).toLocaleString('en-US')} كم</span>
          <span>⛽ {car.fuel}</span>
          <span>⚙️ {car.transmission}</span>
        </div>
        <div className="ccard-foot">
          <b className="ccard-price">{fmtPrice(car.price)}</b>
          <Link to={`/car/${car.id}`} className="btn btn-ghost btn-sm">التفاصيل ←</Link>
        </div>
      </div>
    </article>
  )
}
