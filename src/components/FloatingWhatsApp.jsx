import { useEffect, useState } from 'react'
import { fetchSettings } from '../lib/db.js'
import { useLang } from '../i18n/index.jsx'
import { WhatsAppIcon } from './Icons.jsx'

// زر واتساب عائم للتواصل السريع مع المتجر
export default function FloatingWhatsApp() {
  const { t } = useLang()
  const [settings, setSettings] = useState(null)
  const [showMsg, setShowMsg] = useState(false)

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {})
    const t1 = setTimeout(() => setShowMsg(true), 2500)
    const t2 = setTimeout(() => setShowMsg(false), 9000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!settings?.whatsapp) return null

  return (
    <div className="fab-wrap">
      {showMsg && <div className="fab-msg">{t('float.bubble')}</div>}
      <a
        className="fab"
        href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(t('float.waText'))}`}
        target="_blank"
        rel="noreferrer"
        aria-label="whatsapp"
      >
        <WhatsAppIcon size={26} />
      </a>
    </div>
  )
}
