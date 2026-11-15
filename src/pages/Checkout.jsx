import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { fetchSettings, createOrder, demoMode } from '../lib/db.js'
import { WILAYAS } from '../data/wilayas.js'
import { fmtPrice } from '../lib/format.js'
import { waLink, orderMessage } from '../lib/whatsapp.js'
import { trackPurchase } from '../lib/pixel.js'
import { SITE } from '../config.js'

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const [settings, setSettings] = useState(null)
  const [form, setForm] = useState({
    name: '', phone: '', wilaya: '', commune: '', address: '', notes: '',
    deliveryType: 'home',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchSettings().then(setSettings).catch(() => {}) }, [])
  useEffect(() => { if (items.length === 0 && !submitting) navigate('/products') }, [items, submitting, navigate])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const fee = Number(form.deliveryType === 'desk' ? settings?.deliveryDesk : settings?.deliveryHome) || 0
  const freeFrom = Number(settings?.freeDeliveryFrom) || 0
  const finalFee = freeFrom > 0 && subtotal >= freeFrom ? 0 : fee
  const total = subtotal + finalFee

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = 'أدخل الاسم الكامل'
    if (!/^0[5-7]\d{8}$/.test(form.phone.trim())) e.phone = 'رقم هاتف جزائري غير صحيح (مثال: 0550123456)'
    if (!form.wilaya) e.wilaya = 'اختر الولاية'
    if (form.commune.trim().length < 2) e.commune = 'أدخل البلدية'
    if (form.deliveryType === 'home' && form.address.trim().length < 5) e.address = 'أدخل عنوان التوصيل'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const order = {
      items: items.map(({ id, name, price, qty, brand, model }) => ({ id, name, price, qty, brand, model })),
      subtotal, deliveryFee: finalFee, total,
      deliveryType: form.deliveryType,
      customer: {
        name: form.name.trim(), phone: form.phone.trim(),
        wilaya: form.wilaya, commune: form.commune.trim(),
        address: form.address.trim(), notes: form.notes.trim(),
      },
      source: 'web',
    }

    try {
      const saved = await createOrder(order)
      trackPurchase({ ...order, id: saved.id })
      clear()
      const phone = settings?.whatsapp || ''
      const wa = phone ? waLink(phone, orderMessage({ ...order, ...saved })) : ''
      navigate(`/order/${saved.id}`, { state: { order: { ...order, ...saved }, wa, demo: demoMode } })
    } catch (err) {
      console.error(err)
      alert('عذراً، حدث خطأ أثناء تسجيل الطلب. حاول مجدداً أو تواصل معنا عبر واتساب.')
      setSubmitting(false)
    }
  }

  if (!items.length) return null

  return (
    <div className="container section checkout-page">
      <div className="section-head"><h2>🧾 إتمام الطلب</h2></div>
      <form className="checkout-grid" onSubmit={submit} noValidate>
        <div className="checkout-form card">
          <h3>📋 معلومات التوصيل</h3>

          <div className="fgroup">
            <label>الاسم الكامل *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="مثال: محمد أمين" />
            {errors.name && <span className="err">{errors.name}</span>}
          </div>

          <div className="fgroup">
            <label>رقم الهاتف *</label>
            <input dir="ltr" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="05 / 06 / 07 xxxxxxx" />
            {errors.phone && <span className="err">{errors.phone}</span>}
          </div>

          <div className="frow2">
            <div className="fgroup">
              <label>الولاية *</label>
              <select value={form.wilaya} onChange={(e) => set('wilaya', e.target.value)}>
                <option value="">اختر الولاية</option>
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.wilaya && <span className="err">{errors.wilaya}</span>}
            </div>
            <div className="fgroup">
              <label>البلدية *</label>
              <input value={form.commune} onChange={(e) => set('commune', e.target.value)} placeholder="مثال: باب الزوار" />
              {errors.commune && <span className="err">{errors.commune}</span>}
            </div>
          </div>

          <div className="fgroup">
            <label>طريقة التوصيل *</label>
            <div className="deliv-types">
              <label className={`deliv ${form.deliveryType === 'home' ? 'active' : ''}`}>
                <input type="radio" name="dtype" checked={form.deliveryType === 'home'} onChange={() => set('deliveryType', 'home')} />
                <span>🏠 توصيل للمنزل</span>
                <b>{fmtPrice(settings?.deliveryHome ?? 600)}</b>
              </label>
              <label className={`deliv ${form.deliveryType === 'desk' ? 'active' : ''}`}>
                <input type="radio" name="dtype" checked={form.deliveryType === 'desk'} onChange={() => set('deliveryType', 'desk')} />
                <span>🏢 مكتب التوصيل</span>
                <b>{fmtPrice(settings?.deliveryDesk ?? 350)}</b>
              </label>
            </div>
          </div>

          {form.deliveryType === 'home' && (
            <div className="fgroup">
              <label>العنوان الكامل *</label>
              <input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="الحي، الشارع، رقم العمارة…" />
              {errors.address && <span className="err">{errors.address}</span>}
            </div>
          )}

          <div className="fgroup">
            <label>ملاحظات (اختياري)</label>
            <textarea rows="2" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="أي تفاصيل إضافية تساعد في التوصيل…" />
          </div>
        </div>

        <div className="checkout-summary card">
          <h3>🛒 ملخص الطلب</h3>
          <div className="sum-items">
            {items.map((i) => (
              <div key={i.id} className="sum-item">
                <img src={i.image} alt="" />
                <span className="s-name">{i.name} <small>× {i.qty}</small></span>
                <b>{fmtPrice(i.price * i.qty)}</b>
              </div>
            ))}
          </div>
          <div className="sum-rows">
            <div><span>المجموع الفرعي</span><b>{fmtPrice(subtotal)}</b></div>
            <div>
              <span>التوصيل</span>
              <b>{finalFee === 0 && fee > 0 ? '🎉 مجاني' : fmtPrice(finalFee)}</b>
            </div>
            <div className="sum-total"><span>الإجمالي (عند الاستلام)</span><b>{fmtPrice(total)}</b></div>
          </div>
          <button className="btn btn-primary btn-lg w100" disabled={submitting}>
            {submitting ? '⏳ جاري تسجيل الطلب…' : '✅ تأكيد الطلب'}
          </button>
          <p className="pay-note">
            💵 الدفع <b>عند الاستلام</b> — بعد التأكيد سيُفتح واتساب لإرسال تفاصيل طلبك إلى المتجر.
          </p>
          <Link to="/products" className="cont-shopping">← متابعة التسوق</Link>
        </div>
      </form>
    </div>
  )
}
