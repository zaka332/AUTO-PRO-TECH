import { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { subscribeAuth, adminSignOut, isAdminUser, demoMode } from '../../lib/db.js'
import { DashboardIcon, BoxIcon, CartIcon, SettingsIcon, LogoutIcon, CarIcon } from '../../components/Icons.jsx'

// حماية صفحات لوحة التحكم
export function AdminRoute({ children }) {
  const [user, setUser] = useState(undefined) // undefined = جاري التحقق
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      const ok = demoMode ? !!u : !!u && isAdminUser(u)
      if (!ok) {
        navigate('/admin/login', { replace: true })
      } else {
        setUser(u)
      }
    })
    return unsub
  }, [navigate])

  if (user === undefined) {
    return <div className="admin-loading">⏳ جاري التحقق من الصلاحيات…</div>
  }
  return <AdminLayout user={user}>{children}</AdminLayout>
}

function AdminLayout({ user, children }) {
  const navigate = useNavigate()

  const logout = async () => {
    await adminSignOut()
    if (demoMode) localStorage.removeItem('apt_demo_admin')
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Link to="/admin" className="admin-brand">⚙️ <span>AUTO<i>PRO</i>ADMIN</span></Link>
        <nav>
          <NavLink to="/admin" end><DashboardIcon size={18} /> لوحة القيادة</NavLink>
          <NavLink to="/admin/products"><BoxIcon size={18} /> المنتجات</NavLink>
          <NavLink to="/admin/cars"><CarIcon size={18} /> السيارات</NavLink>
          <NavLink to="/admin/orders"><CartIcon size={18} /> الطلبات</NavLink>
          <NavLink to="/admin/settings"><SettingsIcon size={18} /> الإعدادات</NavLink>
        </nav>
        <div className="admin-side-foot">
          <div className="admin-user">👤 {user?.email || 'مدير تجريبي'}</div>
          <div className="admin-links">
            <Link to="/" target="_blank">🖥️ عرض المتجر</Link>
            <button onClick={logout}><LogoutIcon size={15} /> خروج</button>
          </div>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
