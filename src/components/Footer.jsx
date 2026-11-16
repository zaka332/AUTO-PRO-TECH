import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchSettings } from '../lib/db.js'
import { CATEGORIES } from '../data/catalog.js'
import { useLang } from '../i18n/index.jsx'
import { catName } from '../i18n/catalog-i18n.js'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, PhoneIcon, LocationIcon } from './Icons.jsx'

export default function Footer() {
  const { t, lang } = useLang()
  const [settings, setSettings] = useState(null)
  useEffect(() => { fetchSettings().then(setSettings).catch(() => {}) }, [])

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="footer-logo">
            <img src="/logo.png" alt="AutoProTech" className="logo-img" />
          </Link>
          <p className="footer-desc">{t('foot.desc')}</p>
          <div className="socials">
            {settings?.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer" aria-label="facebook"><FacebookIcon /></a>}
            {settings?.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer" aria-label="instagram"><InstagramIcon /></a>}
            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" aria-label="whatsapp"><WhatsAppIcon /></a>
            )}
          </div>
        </div>

        <div>
          <h4>{t('foot.cats')}</h4>
          <ul className="footer-links">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}><Link to={`/products?cat=${c.id}`}>{c.icon} {catName(c.id, lang)}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>{t('foot.links')}</h4>
          <ul className="footer-links">
            <li><Link to="/products">{t('nav.products')}</Link></li>
            <li><Link to="/cars">{t('nav.cars')}</Link></li>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><Link to="/contact">{t('nav.contact')}</Link></li>
            <li><Link to="/admin/login">لوحة التحكم</Link></li>
          </ul>
        </div>

        <div>
          <h4>{t('foot.contact')}</h4>
          <ul className="footer-contact">
            {settings?.phone && <li><PhoneIcon size={17} /> <span dir="ltr">+{settings.phone}</span></li>}
            {settings?.address && <li><LocationIcon size={17} /> {settings.address}</li>}
            <li>{t('ct.hours')}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-badges">
            <span className="footer-badge">{t('foot.b1')}</span>
            <span className="footer-badge">{t('foot.b2')}</span>
            <span className="footer-badge">{t('foot.b3')}</span>
            <span className="footer-badge">{t('foot.b4')}</span>
          </div>
          <div>© {new Date().getFullYear()} AutoProTech — {t('foot.rights')}</div>
        </div>
      </div>
    </footer>
  )
}
