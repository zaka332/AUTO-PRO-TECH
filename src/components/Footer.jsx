import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchSettings } from '../lib/db.js'
import { CATEGORIES } from '../data/catalog.js'
import { SITE } from '../config.js'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, PhoneIcon, LocationIcon } from './Icons.jsx'

export default function Footer() {
  const [settings, setSettings] = useState(null)
  useEffect(() => { fetchSettings().then(setSettings).catch(() => {}) }, [])

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo footer-logo">
            <span className="logo-badge">⚙️</span>
            <span className="logo-txt"><b>AUTO<i>PRO</i>TECH</b></span>
          </div>
          <p className="footer-desc">
            متجرك الموثوق لقطع غيار السيارات الأصلية — متخصصون في السيارات الفرنسية ونغطي كل الماركات القديمة والحديثة.
            أيضاً: سيارات أقل من 3 سنوات للبيع. توصيل لكل ولايات الوطن مع الدفع عند الاستلام.
          </p>
          <div className="socials">
            {settings?.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer" aria-label="فيسبوك"><FacebookIcon /></a>}
            {settings?.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer" aria-label="إنستغرام"><InstagramIcon /></a>}
            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" aria-label="واتساب"><WhatsAppIcon /></a>
            )}
          </div>
        </div>

        <div>
          <h4>الفئات</h4>
          <ul className="footer-links">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}><Link to={`/products?cat=${c.id}`}>{c.icon} {c.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>روابط سريعة</h4>
          <ul className="footer-links">
            <li><Link to="/products">كل القطع</Link></li>
            <li><Link to="/cars">سيارات للبيع</Link></li>
            <li><Link to="/about">من نحن</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
            <li><Link to="/admin/login">لوحة التحكم</Link></li>
          </ul>
        </div>

        <div>
          <h4>تواصل معنا</h4>
          <ul className="footer-contact">
            {settings?.phone && <li><PhoneIcon size={17} /> <span dir="ltr">+{settings.phone}</span></li>}
            {settings?.address && <li><LocationIcon size={17} /> {settings.address}</li>}
            <li>🕘 من السبت إلى الخميس: 8:30 – 18:00</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} {SITE.name} — جميع الحقوق محفوظة | صُنع بـ ❤️ في الجزائر
        </div>
      </div>
    </footer>
  )
}
