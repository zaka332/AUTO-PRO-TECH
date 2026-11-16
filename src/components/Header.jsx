import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { fetchSettings } from '../lib/db.js'
import { useLang } from '../i18n/index.jsx'
import LangSwitcher from './LangSwitcher.jsx'
import { CartIcon, SearchIcon, MenuIcon, XIcon, WhatsAppIcon } from './Icons.jsx'

export default function Header() {
  const { count, openCart } = useCart()
  const { t } = useLang()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchSettings().then(setSettings).catch(() => {}) }, [])

  const search = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : '/products')
    setMenuOpen(false)
  }

  return (
    <>
      {settings?.announcement && (
        <div className="announce">{settings.announcement}</div>
      )}
      <header className="header">
        <div className="container header-in">
          <Link to="/" className="logo" aria-label="AutoProTech">
            <img src="/logo.png" alt="AutoProTech — Diagnostic • Repair • Performance" className="logo-img" />
          </Link>

          <form className="search" onSubmit={search} role="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('search.ph')}
              aria-label={t('search.ph')}
            />
            <button type="submit" aria-label="search"><SearchIcon size={19} /></button>
          </form>

          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" end>{t('nav.home')}</NavLink>
            <NavLink to="/products">{t('nav.products')}</NavLink>
            <NavLink to="/cars">{t('nav.cars')}</NavLink>
            <NavLink to="/about">{t('nav.about')}</NavLink>
            <NavLink to="/contact">{t('nav.contact')}</NavLink>
            {settings?.whatsapp && (
              <a className="nav-wa" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={17} /> {t('nav.wa')}
              </a>
            )}
          </nav>

          <div className="header-actions">
            <LangSwitcher />
            <button className="cart-btn" onClick={openCart} aria-label="cart">
              <CartIcon />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="menu">
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
