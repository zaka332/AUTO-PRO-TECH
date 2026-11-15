import { useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { fmtPrice } from '../lib/format.js'
import { CheckIcon } from '../components/Icons.jsx'

export default function OrderSuccess() {
  const { id } = useParams()
  const { state } = useLocation()
  const order = state?.order
  const wa = state?.wa

  useEffect(() => {
    document.title = 'تم استلام طلبك | AutoProTech'
    if (wa) {
      const t = setTimeout(() => { window.open(wa, '_blank') }, 1200)
      return () => clearTimeout(t)
    }
  }, [wa])

  return (
    <div className="container section order-success">
      <div className="card success-card">
        <div className="success-anim"><CheckIcon size={46} /></div>
        <h2>تم استلام طلبك بنجاح! 🎉</h2>
        <p className="success-sub">
          رقم طلبك: <b dir="ltr">#{order?.seq ? String(order.seq).padStart(4, '0') : id?.toUpperCase()}</b>
          <br />
          سنتواصل معك هاتفياً لتأكيد التوصيل. الدفع عند الاستلام 💵
        </p>

        {order && (
          <div className="success-details">
            <div className="sum-items">
              {order.items?.map((i) => (
                <div key={i.id} className="sum-item">
                  <img src={i.image} alt="" />
                  <span className="s-name">{i.name} <small>× {i.qty}</small></span>
                  <b>{fmtPrice(i.price * i.qty)}</b>
                </div>
              ))}
            </div>
            <div className="sum-rows">
              <div><span>التوصيل</span><b>{fmtPrice(order.deliveryFee)}</b></div>
              <div className="sum-total"><span>الإجمالي</span><b>{fmtPrice(order.total)}</b></div>
            </div>
          </div>
        )}

        <div className="success-actions">
          {wa && (
            <a className="btn btn-wa btn-lg" href={wa} target="_blank" rel="noreferrer">
              📲 إرسال الطلب عبر واتساب
            </a>
          )}
          <Link to="/products" className="btn btn-primary btn-lg">🛒 متابعة التسوق</Link>
        </div>
        {state?.demo && (
          <small className="demo-note">وضع العرض التجريبي — الطلب محفوظ محلياً ولم يُرسل للمتجر</small>
        )}
      </div>
    </div>
  )
}
