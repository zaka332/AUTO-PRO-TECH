import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchCar, fetchCars, fetchSettings } from '../lib/db.js'
import { useLang } from '../i18n/index.jsx'
import { fmtPrice } from '../lib/format.js'
import { carInquiry } from '../lib/whatsapp.js'
import { carDisplayName, fuelDisplay, gearDisplay, colorDisplay } from '../i18n/catalog-i18n.js'
import { placeholderImage } from '../lib/placeholder.js'
import { WhatsAppIcon, PhoneIcon, ShieldIcon, CheckIcon } from '../components/Icons.jsx'
import CarCard from '../components/CarCard.jsx'

export default function CarDetails() {
  const { id } = useParams()
  const { t, lang } = useLang()
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
          document.title = `${c.name} ${c.year} | AutoProTech`
          fetchCars()
            .then((all) => setSimilar(all.filter((x) => x.id !== c.id && x.brand === c.brand).slice(0, 3)))
            .catch(() => {})
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
        <h3>{t('cd.nfT')}</h3>
        <Link to="/cars" className="btn btn-primary">{t('cd.nfBtn')}</Link>
      </div>
    )
  }

  const wa = settings?.whatsapp
  const name = carDisplayName(car, lang)
  const specs = [
    [t('cd.specYear'), car.year],
    [t('cd.specKm'), t('common.km', { n: Number(car.mileage).toLocaleString('en-US') })],
    [t('cd.specFuel'), fuelDisplay(car.fuel, lang)],
    [t('cd.specGear'), gearDisplay(car.transmission, lang)],
    [t('cd.specColor'), colorDisplay(car.color, lang)],
  ]

  return (
    <div className="container section pd-page">
      <nav className="breadcrumb" aria-label="breadcrumb">
        <Link to="/">{t('nav.home')}</Link> / <Link to="/cars">{t('cd.bcCars')}</Link> / <span>{name} {car.year}</span>
      </nav>

      <div className="pd-grid">
        <div className="pd-img-wrap">
          <img src={car.image} alt={name} className="pd-img"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholderImage(name, car.brand, car.imgSeed || 0, '🚗') }} />
          <span className="pd-cat">{t('cd.under3')}</span>
        </div>

        <div className="pd-info">
          <h1>{name} <span className="pd-year-inline">{car.year}</span></h1>

          <div className="car-specs">
            {specs.map(([label, val]) => (
              <div key={label} className="spec"><small>{label}</small><b>{val}</b></div>
            ))}
          </div>

          <div className="pd-price">
            <b>{fmtPrice(car.price)}</b>
            <span className="pd-save">{t('cd.negotiable')}</span>
          </div>

          <p className="pd-desc">{car.description}</p>

          <div className="pd-actions">
            {wa && (
              <a className="btn btn-wa btn-lg" href={carInquiry(car, wa)} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={19} /> {t('cd.wa')}
              </a>
            )}
            {settings?.phone && (
              <a className="btn btn-ghost btn-lg" href={`tel:+${settings.phone}`}><PhoneIcon size={18} /> {t('cd.call')}</a>
            )}
          </div>

          <div className="pd-perks">
            <div><ShieldIcon size={20} /> {t('cd.perk1')}</div>
            <div><CheckIcon size={20} /> {t('cd.perk2')}</div>
            <div>{t('cd.perk3')}</div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>{t('cd.similar')}</h2></div>
          <div className="grid-3">{similar.map((s) => <CarCard key={s.id} car={s} />)}</div>
        </section>
      )}
    </div>
  )
}
