import { useEffect, useState } from 'react'
import { subscribeOrders, updateOrderStatus, demoMode } from '../../lib/db.js'
import { ORDER_STATUS } from '../../config.js'
import { fmtPrice, fmtDate } from '../../lib/format.js'
import { WhatsAppIcon, XIcon } from '../../components/Icons.jsx'
import { normalizePhone } from '../../lib/whatsapp.js'

export default function AdminOrders() {
  const [orders, setOrders] = useState(null)
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)

  useEffect(() => subscribeOrders(setOrders, console.error), [])

  if (!orders) return <div className="admin-loading">⏳ تحميل الطلبات…</div>

  const shown = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const changeStatus = async (o, status) => {
    await updateOrderStatus(o.id, status)
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h2>🛒 إدارة الطلبات</h2>
        {demoMode && <span className="chip chip-warn">وضع العرض</span>}
      </div>

      <div className="status-filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          الكل ({orders.length})
        </button>
        {Object.entries(ORDER_STATUS).map(([id, s]) => (
          <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}
            style={filter === id ? { borderColor: s.color, color: s.color } : {}}>
            {s.label} ({orders.filter((o) => o.status === id).length})
          </button>
        ))}
      </div>

      <div className="card">
        {shown.length === 0 ? (
          <p className="muted center">لا توجد طلبات في هذه الحالة</p>
        ) : (
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr><th>الطلب</th><th>العميل</th><th>الولاية</th><th>القطع</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th><th></th></tr>
              </thead>
              <tbody>
                {shown.map((o) => (
                  <tr key={o.id} className={o.status === 'new' ? 'row-new' : ''}>
                    <td dir="ltr"><b>#{o.seq ? String(o.seq).padStart(4, '0') : o.id.slice(-6).toUpperCase()}</b></td>
                    <td>
                      {o.customer?.name}
                      <div className="tbl-actions-h">
                        <a className="icon-btn" href={`tel:+${normalizePhone(o.customer?.phone)}`} aria-label="اتصال">📞</a>
                        <a className="icon-btn" target="_blank" rel="noreferrer"
                          href={`https://wa.me/${normalizePhone(o.customer?.phone)}`} aria-label="واتساب"><WhatsAppIcon size={14} /></a>
                      </div>
                    </td>
                    <td>{o.customer?.wilaya}<br /><small className="muted">{o.deliveryType === 'desk' ? 'مكتب' : 'منزل'}</small></td>
                    <td>{o.items?.reduce((a, i) => a + i.qty, 0)} قطعة</td>
                    <td><b>{fmtPrice(o.total)}</b></td>
                    <td>
                      <select className="st-select" value={o.status}
                        style={{ color: ORDER_STATUS[o.status]?.color }}
                        onChange={(e) => changeStatus(o, e.target.value)}>
                        {Object.entries(ORDER_STATUS).map(([id, s]) => (
                          <option key={id} value={id}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="muted">{fmtDate(o.createdAt)}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(o)}>تفاصيل</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>طلب #{open.seq ? String(open.seq).padStart(4, '0') : open.id.slice(-6).toUpperCase()}</h3>
              <button className="icon-btn" onClick={() => setOpen(null)}><XIcon size={18} /></button>
            </div>
            <div className="modal-body">
              <h4>📦 القطع المطلوبة</h4>
              <ul className="order-items">
                {open.items?.map((i) => (
                  <li key={i.id}>
                    <span>{i.name} × {i.qty}</span>
                    <b>{fmtPrice(i.price * i.qty)}</b>
                  </li>
                ))}
              </ul>
              <div className="sum-rows">
                <div><span>المجموع الفرعي</span><b>{fmtPrice(open.subtotal)}</b></div>
                <div><span>التوصيل ({open.deliveryType === 'desk' ? 'مكتب' : 'منزل'})</span><b>{fmtPrice(open.deliveryFee)}</b></div>
                <div className="sum-total"><span>الإجمالي</span><b>{fmtPrice(open.total)}</b></div>
              </div>
              <h4 style={{ marginTop: 16 }}>🚚 معلومات التوصيل</h4>
              <div className="order-cust">
                <div>👤 {open.customer?.name}</div>
                <div dir="ltr">📱 {open.customer?.phone}</div>
                <div>📍 {open.customer?.wilaya} — {open.customer?.commune}</div>
                {open.customer?.address && <div>🏠 {open.customer?.address}</div>}
                {open.customer?.notes && <div>📝 {open.customer?.notes}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
