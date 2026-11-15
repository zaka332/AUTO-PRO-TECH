import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeOrders, fetchProducts, fetchCars, demoMode } from '../../lib/db.js'
import { ORDER_STATUS } from '../../config.js'
import { fmtPrice, fmtDate } from '../../lib/format.js'

export default function Dashboard() {
  const [orders, setOrders] = useState(null)
  const [products, setProducts] = useState([])
  const [cars, setCars] = useState([])

  useEffect(() => {
    const unsub = subscribeOrders(setOrders, console.error)
    fetchProducts(true).then(setProducts).catch(console.error)
    fetchCars(true).then(setCars).catch(console.error)
    return unsub
  }, [])

  if (!orders) return <div className="admin-loading">⏳ تحميل البيانات…</div>

  const today = new Date().toDateString()
  const valid = orders.filter((o) => o.status !== 'canceled')
  const revenue = valid.reduce((a, o) => a + (o.total || 0), 0)
  const todayOrders = orders.filter((o) => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt)
    return d.toDateString() === today
  })
  const lowStock = products.filter((p) => p.stock <= 5)
  const newCount = orders.filter((o) => o.status === 'new').length

  const cards = [
    { label: 'طلبات اليوم', val: todayOrders.length, icon: '📅', to: '/admin/orders' },
    { label: 'طلبات جديدة', val: newCount, icon: '🔔', to: '/admin/orders', hot: newCount > 0 },
    { label: 'إجمالي المبيعات', val: fmtPrice(revenue), icon: '💰', to: '/admin/orders' },
    { label: 'عدد المنتجات', val: products.length, icon: '🧰', to: '/admin/products' },
    { label: 'سيارات معروضة', val: cars.length, icon: '🚗', to: '/admin/cars' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h2>📊 لوحة القيادة</h2>
        {demoMode && <span className="chip chip-warn">وضع العرض — البيانات تجريبية</span>}
      </div>

      <div className="stat-cards">
        {cards.map((c) => (
          <Link to={c.to} key={c.label} className={`stat-card ${c.hot ? 'hot' : ''}`}>
            <span className="stat-ic">{c.icon}</span>
            <div><small>{c.label}</small><b>{c.val}</b></div>
          </Link>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div className="admin-warn">
          ⚠️ <b>{lowStock.length}</b> منتجات على وشك النفاد: {' '}
          {lowStock.slice(0, 5).map((p) => `${p.name} (${p.stock})`).join(' • ')}
          <Link to="/admin/products"> — إدارتها ←</Link>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h3>🛒 أحدث الطلبات</h3>
          <Link to="/admin/orders" className="see-all">كل الطلبات ←</Link>
        </div>
        {orders.length === 0 ? (
          <p className="muted">لا طلبات بعد — شارك رابط المتجر لتبدأ البيع!</p>
        ) : (
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr><th>الطلب</th><th>العميل</th><th>الولاية</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((o) => (
                  <tr key={o.id}>
                    <td dir="ltr">#{o.seq ? String(o.seq).padStart(4, '0') : o.id.slice(-6).toUpperCase()}</td>
                    <td>{o.customer?.name}<br /><small className="muted" dir="ltr">{o.customer?.phone}</small></td>
                    <td>{o.customer?.wilaya}</td>
                    <td><b>{fmtPrice(o.total)}</b></td>
                    <td><span className="st" style={{ '--sc': ORDER_STATUS[o.status]?.color }}>{ORDER_STATUS[o.status]?.label || o.status}</span></td>
                    <td className="muted">{fmtDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
