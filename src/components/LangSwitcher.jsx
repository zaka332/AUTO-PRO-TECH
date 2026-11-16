import { useLang } from '../i18n/index.jsx'

// مبدّل اللغة — عربية / Français / English
export default function LangSwitcher() {
  const { lang, setLang, langs } = useLang()

  return (
    <div className="lang-sw" role="group" aria-label="اللغة / Langue / Language">
      {langs.map((l) => (
        <button
          key={l.id}
          className={lang === l.id ? 'active' : ''}
          onClick={() => setLang(l.id)}
          title={l.label}
        >
          {l.id === 'ar' ? 'ع' : l.label.slice(0, 2)}
        </button>
      ))}
    </div>
  )
}
