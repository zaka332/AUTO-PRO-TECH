import { useEffect, useState } from 'react'
import { fetchSettings } from '../lib/db.js'
import { waLink } from '../lib/whatsapp.js'
import { PhoneIcon, LocationIcon, WhatsAppIcon } from '../components/Icons.jsx'

export default function Contact() {
  const [settings, setSettings] = useState(null)
  const [msg, setMsg] = useState({ name: '', text: '' })

  useEffect(() => { fetchSettings().then(setSettings).catch(() => {}) }, [])

  const send = (e) => {
    e.preventDefault()
    if (!settings?.whatsapp) return
    const txt = `مرحباً AutoProTech 👋\nأنا ${msg.name || 'زائر'}\n${msg.text}`
    window.open(waLink(settings.whatsapp, txt), '_blank')
  }

  return (
    <div className="container section contact-page">
      <div className="section-head"><h2>📞 اتصل بنا</h2></div>
      <div className="contact-grid">
        <div className="card contact-info">
          <h3>معلومات التواصل</h3>
          {settings?.phone && (
            <a className="c-line" href={`tel:+${settings.phone}`}>
              <PhoneIcon /> <span dir="ltr">+{settings.phone}</span>
            </a>
          )}
          {settings?.whatsapp && (
            <a className="c-line wa" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> واتساب — رد سريع خلال دقائق
            </a>
          )}
          {settings?.address && (
            <div className="c-line"><LocationIcon /> {settings.address}</div>
          )}
          <div className="c-line">🕘 السبت – الخميس: 8:30 – 18:00</div>
        </div>

        <form className="card contact-form" onSubmit={send}>
          <h3>أرسل رسالة سريعة</h3>
          <p className="hint">تُرسل الرسالة مباشرة إلى واتساب المتجر</p>
          <input placeholder="اسمك" value={msg.name} onChange={(e) => setMsg({ ...msg, name: e.target.value })} />
          <textarea rows="5" required placeholder="اكتب استفسارك هنا… (مثال: أبحث عن فلتر هواء كليو 5 موديل 2025)"
            value={msg.text} onChange={(e) => setMsg({ ...msg, text: e.target.value })} />
          <button className="btn btn-wa btn-lg" disabled={!settings?.whatsapp}>
            <WhatsAppIcon size={19} /> إرسال عبر واتساب
          </button>
        </form>
      </div>
    </div>
  )
}
