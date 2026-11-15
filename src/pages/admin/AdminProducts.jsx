import { useEffect, useMemo, useState } from 'react'
import {
  fetchProducts, saveProduct, deleteProduct, uploadProductImage, demoMode,
} from '../../lib/db.js'
import { CATEGORIES, BRANDS, YEARS } from '../../data/catalog.js'
import { fmtPrice } from '../../lib/format.js'
import { EditIcon, TrashIcon, PlusIcon, XIcon } from '../../components/Icons.jsx'

const empty = {
  name: '', brand: '', model: '', year: YEARS[1], category: '',
  price: '', oldPrice: '', stock: '', sku: '', description: '',
  image: '', featured: false,
}

export default function AdminProducts() {
  const [products, setProducts] = useState(null)
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | product
  const [saving, setSaving] = useState(false)

  const load = () => fetchProducts(true).then(setProducts).catch(console.error)
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    if (!products) return []
    if (!q.trim()) return products
    const s = q.toLowerCase()
    return products.filter((p) => [p.name, p.brand, p.sku].join(' ').toLowerCase().includes(s))
  }, [products, q])

  const remove = async (p) => {
    if (!confirm(`حذف "${p.name}" نهائياً؟`)) return
    await deleteProduct(p.id)
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h2>🧰 إدارة المنتجات</h2>
        <button className="btn btn-primary" onClick={() => setEditing('new')}><PlusIcon size={17} /> منتج جديد</button>
      </div>

      <input className="admin-search" placeholder="🔎 بحث بالاسم أو المرجع…" value={q} onChange={(e) => setQ(e.target.value)} />

      {demoMode && (
        <div className="demo-banner">
          🧪 وضع العرض: الإضافات والتعديلات مؤقتة في هذه الجلسة. اضبط Firebase لتفعيل الحفظ الدائم.
        </div>
      )}

      {!products ? (
        <div className="admin-loading">⏳ تحميل المنتجات…</div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr><th>الصورة</th><th>الاسم</th><th>السيارة</th><th>الفئة</th><th>السعر</th><th>المخزون</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td><img className="tbl-img" src={p.image} alt="" /></td>
                    <td><b>{p.name}</b>{p.featured && <span className="chip chip-featured">⭐ مميز</span>}</td>
                    <td>{p.brand} {p.model} <small className="muted">{p.year}</small></td>
                    <td>{CATEGORIES.find((c) => c.id === p.category)?.name || p.category}</td>
                    <td><b>{fmtPrice(p.price)}</b></td>
                    <td>
                      <span className={`stock-pill ${p.stock <= 0 ? 'zero' : p.stock <= 5 ? 'low' : ''}`}>{p.stock}</span>
                    </td>
                    <td className="tbl-actions">
                      <button className="icon-btn" onClick={() => setEditing(p)} aria-label="تعديل"><EditIcon size={17} /></button>
                      <button className="icon-btn danger" onClick={() => remove(p)} aria-label="حذف"><TrashIcon size={17} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="muted center">لا نتائج — أضف منتجك الأول أو حمّل المنتجات التجريبية من الإعدادات</p>}
        </div>
      )}

      {editing && (
        <ProductForm
          initial={editing === 'new' ? empty : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
          saving={saving}
          setSaving={setSaving}
        />
      )}
    </div>
  )
}

function ProductForm({ initial, onClose, onSaved, saving, setSaving }) {
  const [f, setF] = useState({ ...empty, ...initial })
  const [uploading, setUploading] = useState(false)

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...f,
        price: Number(f.price) || 0,
        oldPrice: Number(f.oldPrice) || 0,
        stock: Number(f.stock) || 0,
      }
      await saveProduct(data, initial.id)
      onSaved()
    } catch (err) {
      console.error(err)
      alert('تعذر حفظ المنتج: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const pickImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadProductImage(file)
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
          <h3>{initial.id ? '✏️ تعديل منتج' : '➕ منتج جديد'}</h3>
          <button type="button" className="icon-btn" onClick={onClose}><XIcon size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="fgroup">
            <label>اسم القطعة *</label>
            <input required value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="مثال: فلتر زيت أصلي كليو 5" />
          </div>

          <div className="frow3">
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
            <div className="fgroup">
              <label>السنة *</label>
              <select required value={f.year} onChange={(e) => set('year', Number(e.target.value))}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="fgroup">
            <label>الفئة *</label>
            <select required value={f.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">اختر الفئة</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          <div className="frow3">
            <div className="fgroup">
              <label>السعر (دج) *</label>
              <input dir="ltr" required type="number" min="0" value={f.price} onChange={(e) => set('price', e.target.value)} />
            </div>
            <div className="fgroup">
              <label>السعر قبل (اختياري)</label>
              <input dir="ltr" type="number" min="0" value={f.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} />
            </div>
            <div className="fgroup">
              <label>المخزون *</label>
              <input dir="ltr" required type="number" min="0" value={f.stock} onChange={(e) => set('stock', e.target.value)} />
            </div>
          </div>

          <div className="fgroup">
            <label>المرجع SKU</label>
            <input dir="ltr" value={f.sku} onChange={(e) => set('sku', e.target.value)} placeholder="RN-FO-1109" />
          </div>

          <div className="fgroup">
            <label>صورة القطعة *</label>
            {f.image && <img src={f.image} alt="" className="img-preview" />}
            <input type="file" accept="image/*" onChange={pickImage} disabled={uploading} />
            {uploading && <small className="muted">⏳ جاري رفع الصورة…</small>}
          </div>

          <div className="fgroup">
            <label>الوصف</label>
            <textarea rows="3" value={f.description} onChange={(e) => set('description', e.target.value)}
              placeholder="تقني، ميزات، التوافق…" />
          </div>

          <label className="check-line">
            <input type="checkbox" checked={!!f.featured} onChange={(e) => set('featured', e.target.checked)} />
            ⭐ منتج مميز (يظهر في الصفحة الرئيسية)
          </label>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>إلغاء</button>
          <button className="btn btn-primary" disabled={saving || uploading}>
            {saving ? '⏳ حفظ…' : '💾 حفظ المنتج'}
          </button>
        </div>
      </form>
    </div>
  )
}
