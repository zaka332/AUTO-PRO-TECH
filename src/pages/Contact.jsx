import { useEffect, useState } from 'react'
import { fetchSettings } from '../lib/db.js'
import { waLink } from '../lib/whatsapp.js'
import { useLang } from '../i18n/index.jsx'
import { PhoneIcon, LocationIcon, WhatsAppIcon } from '../components/Icons.jsx'

export default function Contact() {
  const { t } = useLang()
  const [settings, setSettings] = useState(null)
  const [msg, setMsg] = useState({ name: '', text: '' })

  useEffect(() => { fetchSettings().then(setSettings).catch(() => {}) }, [])

  const send = (e) => {
    e.preventDefault()
    if (!settings?.whatsapp) return
    const txt = `${t('float.waText')}\n${msg.name ? `${t('ct.namePh')}: ${msg.name}\n` : ''}${msg.text}`
    window.open(waLink(settings.whatsapp, txt), '_blank')
  }

  return (
    <div className="container section contact-page">
      <div className="section-head"><h2>{t('ct.title')}</h2></div>
      <div className="contact-grid">
        <div className="card contact-info">
          <h3>{t('ct.info')}</h3>
          {settings?.phone && (
            <a className="c-line" href={`tel:+${settings.phone}`}>
              <PhoneIcon /> <span dir="ltr">+{settings.phone}</span>
            </a>
          )}
          {settings?.whatsapp && (
            <a className="c-line wa" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> {t('ct.waLine')}
            </a>
          )}
          {settings?.address && (
            <div className="c-line"><LocationIcon /> {settings.address}</div>
          )}
          <div className="c-line">{t('ct.hours')}</div>
        </div>

        <form className="card contact-form" onSubmit={send}>
          <h3>{t('ct.formT')}</h3>
          <p className="hint">{t('ct.hint')}</p>
          <input placeholder={t('ct.namePh')} value={msg.name} onChange={(e) => setMsg({ ...msg, name: e.target.value })} />
          <textarea rows="5" required placeholder={t('ct.msgPh')}
            value={msg.text} onChange={(e) => setMsg({ ...msg, text: e.target.value })} />
          <button className="btn btn-wa btn-lg" disabled={!settings?.whatsapp}>
            <WhatsAppIcon size={19} /> {t('ct.send')}
          </button>
        </form>
      </div>
    </div>
  )
}
