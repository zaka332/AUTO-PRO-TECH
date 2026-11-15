import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { adminSignIn, persistDemoAdmin, isAdminUser, demoMode } from '../../lib/db.js'
import { ENV } from '../../config.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const user = await adminSignIn(email.trim(), pw)
      if (!demoMode && !isAdminUser(user)) {
        setErr('هذا الحساب ليس حساب مدير المتجر. استخدم البريد المصرّح به.')
        return
      }
      if (demoMode) persistDemoAdmin({ email: email.trim() })
      navigate(location.state?.from || '/admin')
    } catch (e2) {
      setErr('بيانات الدخول غير صحيحة. تحقق من البريد وكلمة المرور.')
      console.error(e2)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login-page">
      <form className="card admin-login" onSubmit={submit}>
        <img src="/logo.png" alt="AutoProTech" className="admin-logo-img" />
        <h2>لوحة تحكم AutoProTech</h2>
        <p className="hint">الدخول مخصص لإدارة المتجر فقط</p>

        {demoMode && (
          <div className="demo-banner">
            🧪 وضع العرض التجريبي: أدخل أي بريد وكلمة مرور للتجربة (Firebase غير مضبوط بعد)
          </div>
        )}

        <div className="fgroup">
          <label>البريد الإلكتروني</label>
          <input dir="ltr" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={ENV.adminEmail || 'admin@autoprotech.dz'} />
        </div>
        <div className="fgroup">
          <label>كلمة المرور</label>
          <input dir="ltr" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
        </div>

        {err && <div className="form-err">{err}</div>}

        <button className="btn btn-primary btn-lg w100" disabled={busy}>
          {busy ? '⏳ جاري الدخول…' : '🔓 تسجيل الدخول'}
        </button>

        <Link to="/" className="back-home">→ العودة للمتجر</Link>
      </form>
    </div>
  )
}
