import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { fetchSettings } from '../lib/db.js'
import { CartIcon, SearchIcon, MenuIcon, XIcon, WhatsAppIcon } from './Icons.jsx'

export default function Header() {
  const { count, openCart } = useCart()
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
          <Link to="/" className="logo" aria-label="AutoProTech — الرئيسية">
            <img src="/logo.png" alt="AutoProTech — Diagnostic • Repair • Performance" className="logo-img" />
          </Link>

          <form className="search" onSubmit={search} role="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن قطعة، ماركة، طراز…"
              aria-label="البحث"
            />
            <button type="submit" aria-label="ابحث"><SearchIcon size={19} /></button>
          </form>

          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" end>الرئيسية</NavLink>
            <NavLink to="/products">كل القطع</NavLink>
            <NavLink to="/cars">سيارات للبيع</NavLink>
            <NavLink to="/about">من نحن</NavLink>
            <NavLink to="/contact">اتصل بنا</NavLink>
            {settings?.whatsapp && (
              <a className="nav-wa" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={17} /> واتساب
              </a>
            )}
          </nav>

          <div className="header-actions">
            <button className="cart-btn" onClick={openCart} aria-label="سلة المشتريات">
              <CartIcon />
              {count > 0 && <span className="cart-count">{count}</span>}
            </button>
            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="القائمة">
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
