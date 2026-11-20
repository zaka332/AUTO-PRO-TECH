import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/index.jsx'
import { PaletteIcon, XIcon } from './Icons.jsx'

const LS_KEY = 'apt_appearance'
export const APPEARANCE_DEFAULTS = { theme: 'dark', bg: 'aurora', accent: 'orange', glass: 'medium' }

export function loadAppearance() {
  try { return { ...APPEARANCE_DEFAULTS, ...JSON.parse(localStorage.getItem(LS_KEY) || '{}') } }
  catch { return { ...APPEARANCE_DEFAULTS } }
}

export function applyAppearance(a) {
  const d = document.documentElement.dataset
  d.theme = a.theme
  d.bg = a.bg
  d.accent = a.accent
  d.glass = a.glass
}

const BGS = ['aurora', 'mesh', 'carbon', 'sunset', 'clean']
const ACCENTS = [
  { id: 'orange', from: '#f97316', to: '#fb923c' },
  { id: 'blue', from: '#2563eb', to: '#0ea5e9' },
  { id: 'green', from: '#059669', to: '#10b981' },
  { id: 'purple', from: '#7c3aed', to: '#c026d3' },
]

// لوحة المظهر — الوضع / الخلفية / اللون / شدة الزجاج (تُحفظ محلياً)
export default function AppearancePanel() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [ap, setAp] = useState(loadAppearance)
  const ref = useRef(null)

  const update = (patch) => {
    let next = { ...ap, ...patch }
    // «نقي» فاتح بطبيعته — بدّل للوضع الفاتح تلقائياً لضمان القراءة
    if (patch.bg === 'clean' && next.theme === 'dark') next.theme = 'light'
    if (patch.theme === 'dark' && next.bg === 'clean') next.bg = 'aurora'
    setAp(next)
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch { /* تجاهل */ }
    applyAppearance(next)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <>
      <button
        className={`theme-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={t('app.title')}
        title={t('app.title')}
      >
        <PaletteIcon size={20} />
      </button>

      {open && (
        <div className="appearance-pop" ref={ref} role="dialog" aria-label={t('app.title')}>
          <div className="ap-head">
            <b>{t('app.title')}</b>
            <button className="ap-x" onClick={() => setOpen(false)} aria-label="close"><XIcon size={16} /></button>
          </div>

          <div className="ap-row">
            <span className="ap-lbl">{t('app.theme')}</span>
            <div className="ap-seg">
              <button className={ap.theme === 'dark' ? 'active' : ''} onClick={() => update({ theme: 'dark' })}>🌙 {t('app.dark')}</button>
              <button className={ap.theme === 'light' ? 'active' : ''} onClick={() => update({ theme: 'light' })}>☀️ {t('app.light')}</button>
            </div>
          </div>

          <div className="ap-row">
            <span className="ap-lbl">{t('app.bg')}</span>
            <div className="ap-bgs">
              {BGS.map((b) => (
                <button key={b} className={`ap-swatch sw-${b} ${ap.bg === b ? 'active' : ''}`}
                  onClick={() => update({ bg: b })}
                  title={t(`app.bg${b.charAt(0).toUpperCase()}${b.slice(1)}`)} />
              ))}
            </div>
          </div>

          <div className="ap-row">
            <span className="ap-lbl">{t('app.accent')}</span>
            <div className="ap-accents">
              {ACCENTS.map((a) => (
                <button key={a.id} className={`ap-dot ${ap.accent === a.id ? 'active' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
                  onClick={() => update({ accent: a.id })} aria-label={a.id} />
              ))}
            </div>
          </div>

          <div className="ap-row">
            <span className="ap-lbl">{t('app.glass')}</span>
            <div className="ap-seg">
              {['low', 'medium', 'high'].map((g) => (
                <button key={g} className={ap.glass === g ? 'active' : ''} onClick={() => update({ glass: g })}>
                  {t(`app.${g}`)}
                </button>
              ))}
            </div>
          </div>

          <button className="ap-reset" onClick={() => update({ ...APPEARANCE_DEFAULTS })}>
            {t('app.reset')}
          </button>
        </div>
      )}
    </>
  )
}
