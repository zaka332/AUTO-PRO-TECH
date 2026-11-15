import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchCar, fetchCars, fetchSettings } from '../lib/db.js'
import { fmtPrice } from '../lib/format.js'
import { carInquiry } from '../lib/whatsapp.js'
import { WhatsAppIcon, PhoneIcon, ShieldIcon, CheckIcon } from '../components/Icons.jsx'
import CarCard from '../components/CarCard.jsx'

export default function CarDetails() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)
  const [similar, setSimilar] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    fetchCar(id)
      .then((c) => {
        setCar(c)
        if (c) {
          document.title = `${c.name} ${c.year} للبيع | AutoProTech`
          fetchCars().then((all) =>
            setSimilar(all.filter((x) => x.id !== c.id && x.brand === c.brand).slice(0, 3)),
          ).catch(() => {})
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
    fetchSettings().then(setSettings).catch(() => {})
  }, [id])

  if (loading) return <div className="container section"><div className="pd-skeleton" /></div>

  if (!car) {
    return (
      <div className="container section empty-state">
        <span className="big">🚗</span>
        <h3>السيارة غير موجودة أو تم بيعها</h3>
        <Link to="/cars" className="btn btn-primary">تصفح السيارات المتوفرة</Link>
      </div>
    )
  }

  const wa = settings?.whatsapp
  const specs = [
    ['📅 سنة الصنع', car.year],
    ['📊 الكيلومتراج', `${Number(car.mileage).toLocaleString('en-US')} كم`],
    ['⛽ نوع الوقود', car.fuel],
    ['⚙️ ناقل الحركة', car.transmission],
    ['🎨 اللون', car.color],
  ]

  return (
    <div className="container section pd-page">
      <nav className="breadcrumb" aria-label="مسار التنقل">
        <Link to="/">الرئيسية</Link> / <Link to="/cars">سيارات للبيع</Link> / <span>{car.name} {car.year}</span>
      </nav>

      <div className="pd-grid">
        <div className="pd-img-wrap">
          <img src={car.image} alt={car.name} className="pd-img" />
          <span className="pd-cat">🚗 أقل من 3 سنوات</span>
        </div>

        <div className="pd-info">
          <h1>{car.name} <span className="pd-year-inline">{car.year}</span></h1>

          <div className="car-specs">
            {specs.map(([label, val]) => (
              <div key={label} className="spec"><small>{label}</small><b>{val}</b></div>
            ))}
          </div>

          <div className="pd-price">
            <b>{fmtPrice(car.price)}</b>
            <span className="pd-save">قابل للتفاوض بعد المعاينة</span>
          </div>

          <p className="pd-desc">{car.description}</p>

          <div className="pd-actions">
            {wa && (
              <a className="btn btn-wa btn-lg" href={carInquiry(car, wa)} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={19} /> استفسر عبر واتساب
              </a>
            )}
            {settings?.phone && (
              <a className="btn btn-ghost btn-lg" href={`tel:+${settings.phone}`}><PhoneIcon size={18} /> اتصال هاتفي</a>
            )}
          </div>

          <div className="pd-perks">
            <div><ShieldIcon size={20} /> مفحوصة 100% — وثائق كاملة وجاهزة</div>
            <div><CheckIcon size={20} /> كيلومتراج حقيقي موثق — أول يد</div>
            <div>📍 المعاينة بموعد مسبق في معرض المتجر</div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>🚙 سيارات مشابهة</h2></div>
          <div className="grid-3">{similar.map((s) => <CarCard key={s.id} car={s} />)}</div>
        </section>
      )}
    </div>
  )
}
