import { useEffect, useMemo, useState } from 'react'
import { fetchCars, saveCar, deleteCar, uploadProductImage, demoMode } from '../../lib/db.js'
import { BRANDS, YEARS, CAR_YEARS } from '../../data/catalog.js'
import { fmtPrice } from '../../lib/format.js'
import { EditIcon, TrashIcon, PlusIcon, XIcon } from '../../components/Icons.jsx'

const empty = {
  name: '', brand: '', model: '', year: CAR_YEARS[1],
  price: '', mileage: '', fuel: 'بنزين', transmission: 'مانيوال',
  color: '', description: '', image: '', featured: false,
}

export default function AdminCars() {
  const [cars, setCars] = useState(null)
  const [editing, setEditing] = useState(null)

  const load = () => fetchCars(true).then(setCars).catch(console.error)
  useEffect(() => { load() }, [])

  const remove = async (c) => {
    if (!confirm(`حذف إعلان "${c.name}"؟`)) return
    await deleteCar(c.id)
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h2>🚗 السيارات المعروضة للبيع</h2>
        <button className="btn btn-primary" onClick={() => setEditing('new')}><PlusIcon size={17} /> إعلان سيارة جديد</button>
      </div>

      {demoMode && (
        <div className="demo-banner">🧪 وضع العرض: الإعلانات مؤقتة في هذه الجلسة. اضبط Firebase للحفظ الدائم.</div>
      )}

      {!cars ? (
        <div className="admin-loading">⏳ تحميل السيارات…</div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr><th>الصورة</th><th>السيارة</th><th>السنة</th><th>السعر</th><th>الكيلومتراج</th><th>الوقود/العلبة</th><th></th></tr>
              </thead>
              <tbody>
                {cars.map((c) => (
                  <tr key={c.id}>
                    <td><img className="tbl-img" src={c.image} alt="" /></td>
                    <td><b>{c.name}</b>{c.featured && <span className="chip chip-featured">⭐ مميزة</span>}</td>
                    <td>{c.year}</td>
                    <td><b>{fmtPrice(c.price)}</b></td>
                    <td>{Number(c.mileage).toLocaleString('en-US')} كم</td>
                    <td>{c.fuel} / {c.transmission}</td>
                    <td className="tbl-actions">
                      <button className="icon-btn" onClick={() => setEditing(c)} aria-label="تعديل"><EditIcon size={17} /></button>
                      <button className="icon-btn danger" onClick={() => remove(c)} aria-label="حذف"><TrashIcon size={17} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cars.length === 0 && <p className="muted center">لا سيارات معروضة — أضف أول إعلان</p>}
        </div>
      )}

      {editing && (
        <CarForm
          initial={editing === 'new' ? empty : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
        />
      )}
    </div>
  )
}

function CarForm({ initial, onClose, onSaved }) {
  const [f, setF] = useState({ ...empty, ...initial })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveCar({
        ...f,
        price: Number(f.price) || 0,
        mileage: Number(f.mileage) || 0,
        year: Number(f.year),
      }, initial.id)
      onSaved()
    } catch (err) {
      console.error(err)
      alert('تعذر حفظ الإعلان: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const pickImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadProductImage(file, 'cars')
      set('image', url)
    } catch (err) {
      alert('تعذر رفع الصورة: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <h3>{initial.id ? '✏️ تعديل إعلان' : '🚗 إعلان سيارة جديد'}</h3>
          <button type="button" className="icon-btn" onClick={onClose}><XIcon size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="frow2">
            <div className="fgroup">
              <label>الماركة *</label>
              <select required value={f.brand} onChange={(e) => { set('brand', e.target.value); set('model', '') }}>
                <option value="">اختر</option>
                {Object.keys(BRANDS).map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="fgroup">
              <label>الطراز *</label>
              <select required value={f.model} onChange={(e) => set('model', e.target.value)}>
                <option value="">اختر</option>
                {(BRANDS[f.brand] || []).map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="frow2">
            <div className="fgroup">
              <label>سنة الصنع * (أقل من 3 سنوات)</label>
              <select required value={f.year} onChange={(e) => set('year', Number(e.target.value))}>
                {CAR_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="fgroup">
              <label>السعر (دج) *</label>
              <input dir="ltr" required type="number" min="0" value={f.price} onChange={(e) => set('price', e.target.value)} />
            </div>
          </div>

          <div className="frow3">
            <div className="fgroup">
              <label>الكيلومتراج *</label>
              <input dir="ltr" required type="number" min="0" value={f.mileage} onChange={(e) => set('mileage', e.target.value)} placeholder="12000" />
            </div>
            <div className="fgroup">
              <label>نوع الوقود *</label>
              <select value={f.fuel} onChange={(e) => set('fuel', e.target.value)}>
                <option value="بنزين">بنزين</option>
                <option value="ديزل">ديزل</option>
                <option value="هجين">هجين</option>
                <option value="GPL">GPL</option>
              </select>
            </div>
            <div className="fgroup">
              <label>ناقل الحركة *</label>
              <select value={f.transmission} onChange={(e) => set('transmission', e.target.value)}>
                <option value="مانيوال">مانيوال</option>
                <option value="أوتوماتيك">أوتوماتيك</option>
              </select>
            </div>
          </div>

          <div className="fgroup">
            <label>اللون</label>
            <input value={f.color} onChange={(e) => set('color', e.target.value)} placeholder="أبيض، أسود…" />
          </div>

          <div className="fgroup">
            <label>صورة السيارة *</label>
            {f.image && <img src={f.image} alt="" className="img-preview" />}
            <input type="file" accept="image/*" onChange={pickImage} disabled={uploading} />
            {uploading && <small className="muted">⏳ جاري رفع الصورة…</small>}
          </div>

          <div className="fgroup">
            <label>الوصف</label>
            <textarea rows="3" value={f.description} onChange={(e) => set('description', e.target.value)}
              placeholder="التجهيزات، حالة السيارة، الوثائق…" />
          </div>

          <label className="check-line">
            <input type="checkbox" checked={!!f.featured} onChange={(e) => set('featured', e.target.checked)} />
            ⭐ إعلان مميز (يظهر في الصفحة الرئيسية)
          </label>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>إلغاء</button>
          <button className="btn btn-primary" disabled={saving || uploading}>
            {saving ? '⏳ حفظ…' : '💾 حفظ الإعلان'}
          </button>
        </div>
      </form>
    </div>
  )
}
