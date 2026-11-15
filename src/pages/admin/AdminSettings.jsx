import { useEffect, useState } from 'react'
import { fetchSettings, saveSettings, fetchProducts, seedDemoProducts, exportFacebookCatalog, demoMode } from '../../lib/db.js'
import { DownloadIcon } from '../../components/Icons.jsx'

export default function AdminSettings() {
  const [s, setS] = useState(null)
  const [saved, setSaved] = useState(false)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => { fetchSettings().then(setS).catch(console.error) }, [])

  if (!s) return <div className="admin-loading">⏳ تحميل الإعدادات…</div>

  const set = (k, v) => { setS((x) => ({ ...x, [k]: v })); setSaved(false) }

  const submit = async (e) => {
    e.preventDefault()
    await saveSettings(s)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const doSeed = async () => {
    if (!confirm('تحميل 16 منتجاً تجريبياً إلى قاعدة البيانات؟')) return
    setSeeding(true)
    try {
      await seedDemoProducts()
      alert('✅ تم تحميل المنتجات التجريبية بنجاح!')
    } catch (err) {
      alert('تعذر التحميل: ' + err.message)
    } finally {
      setSeeding(false)
    }
  }

  const exportCatalog = async () => {
    const products = await fetchProducts(true)
    exportFacebookCatalog(products)
  }

  return (
    <div className="admin-page">
      <div className="admin-head"><h2>⚙️ إعدادات المتجر</h2></div>
      {demoMode && (
        <div className="demo-banner">🧪 وضع العرض: الإعدادات محفوظة محلياً فقط في هذه الجلسة</div>
      )}

      <form className="card settings-form" onSubmit={submit}>
        <h3>📞 التواصل</h3>
        <div className="frow2">
          <div className="fgroup">
            <label>رقم واتساب المتجر (بالصيغة الدولية، مثال 213xxxxxxxxx)</label>
            <input dir="ltr" value={s.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} placeholder="213550000000" />
          </div>
          <div className="fgroup">
            <label>رقم الهاتف</label>
            <input dir="ltr" value={s.phone || ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </div>
        <div className="fgroup">
          <label>العنوان</label>
          <input value={s.address || ''} onChange={(e) => set('address', e.target.value)} />
        </div>
        <div className="frow2">
          <div className="fgroup">
            <label>رابط صفحة فيسبوك</label>
            <input dir="ltr" value={s.facebookUrl || ''} onChange={(e) => set('facebookUrl', e.target.value)} />
          </div>
          <div className="fgroup">
            <label>رابط حساب إنستغرام</label>
            <input dir="ltr" value={s.instagramUrl || ''} onChange={(e) => set('instagramUrl', e.target.value)} />
          </div>
        </div>
        <div className="fgroup">
          <label>الشريط الإعلاني أعلى الموقع</label>
          <input value={s.announcement || ''} onChange={(e) => set('announcement', e.target.value)} />
        </div>

        <h3 style={{ marginTop: 24 }}>🚚 التوصيل (بالدينار)</h3>
        <div className="frow3">
          <div className="fgroup">
            <label>توصيل للمنزل</label>
            <input dir="ltr" type="number" min="0" value={s.deliveryHome ?? 600} onChange={(e) => set('deliveryHome', Number(e.target.value))} />
          </div>
          <div className="fgroup">
            <label>مكتب التوصيل</label>
            <input dir="ltr" type="number" min="0" value={s.deliveryDesk ?? 350} onChange={(e) => set('deliveryDesk', Number(e.target.value))} />
          </div>
          <div className="fgroup">
            <label>توصيل مجاني انطلاقاً من</label>
            <input dir="ltr" type="number" min="0" value={s.freeDeliveryFrom ?? 30000} onChange={(e) => set('freeDeliveryFrom', Number(e.target.value))} />
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary" type="submit">
            {saved ? '✅ تم الحفظ!' : '💾 حفظ الإعدادات'}
          </button>
        </div>
      </form>

      <div className="card settings-tools">
        <h3>🧪 أدوات</h3>
        <div className="tool-row">
          <div>
            <b>تحميل منتجات تجريبية</b>
            <p className="muted">16 قطعة جاهزة لتجربة المتجر — مفيدة قبل إضافة منتجاتك الحقيقية</p>
          </div>
          <button className="btn btn-ghost" onClick={doSeed} disabled={seeding || demoMode}>
            {seeding ? '⏳ جاري التحميل…' : 'تحميل'}
          </button>
        </div>
        <div className="tool-row">
          <div>
            <b>تصدير كتالوج فيسبوك / إنستغرام (Meta Business)</b>
            <p className="muted">
              ملف CSV بصيغة كتالوجات ميتا الرسمية — ارفعه في Meta Business Suite ← Commerce Manager ← Catalog ← Bulk upload
            </p>
          </div>
          <button className="btn btn-ghost" onClick={exportCatalog}><DownloadIcon size={16} /> تصدير CSV</button>
        </div>
      </div>
    </div>
  )
}
