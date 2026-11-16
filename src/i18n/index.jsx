// نظام اللغات — سياق React مع تبديل الاتجاه RTL/LTR وحفظ الاختيار
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { DICTS, LANGS } from './dict.js'
import { fmtPrice } from '../lib/format.js'
import { SITE } from '../config.js'

const LangCtx = createContext(null)
const LS_KEY = 'apt_lang'

// عملة كل لغة
const CURRENCIES = { ar: 'دج', fr: 'DA', en: 'DZD' }

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(LS_KEY) || 'ar' } catch { return 'ar' }
  })

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.title = `${SITE.name} | ${makeT(lang)('brand.tagline')}`
  }, [lang, dir])

  const setLang = (l) => {
    setLangState(l)
    try { localStorage.setItem(LS_KEY, l) } catch { /* تجاهل */ }
  }

  const t = useMemo(() => makeT(lang), [lang])
  const price = useMemo(
    () => (n) => fmtPrice(n, CURRENCIES[lang]),
    [lang],
  )

  const value = useMemo(
    () => ({ lang, setLang, t, dir, price, langs: LANGS }),
    [lang, t, dir, price],
  )

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}

// دالة ترجمة مستقلة (تُستخدم أيضاً خارج React مثل العناوين)
export function makeT(lang) {
  const dict = DICTS[lang] || DICTS.ar
  return (key, vars) => {
    let s = dict[key] ?? DICTS.ar[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v)
    }
    return s
  }
}

export function t(lang, key, vars) { return makeT(lang)(key, vars) }

export function useLang() {
  const ctx = useContext(LangCtx)
  if (!ctx) {
    // احتياط خارج المزود (يجب ألا يحدث)
    return { lang: 'ar', setLang: () => {}, t: makeT('ar'), dir: 'rtl', price: (n) => fmtPrice(n), langs: LANGS }
  }
  return ctx
}
