import { useEffect, useState } from 'react'
import { fetchSettings } from '../lib/db.js'
import { WhatsAppIcon } from './Icons.jsx'

// زر واتساب عائم للتواصل السريع مع المتجر
export default function FloatingWhatsApp() {
  const [settings, setSettings] = useState(null)
  const [showMsg, setShowMsg] = useState(false)

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {})
    const t = setTimeout(() => setShowMsg(true), 2500)
    const t2 = setTimeout(() => setShowMsg(false), 9000)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  if (!settings?.whatsapp) return null

  return (
    <div className="fab-wrap">
      {showMsg && <div className="fab-msg">هل تحتاج مساعدة؟ راسلنا! 💬</div>}
      <a
        className="fab"
        href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('مرحباً AutoProTech 👋 عندي استفسار')}`}
        target="_blank"
        rel="noreferrer"
        aria-label="تواصل عبر واتساب"
      >
        <WhatsAppIcon size={26} />
      </a>
    </div>
  )
}
