import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container section empty-state">
      <span className="big" style={{ fontSize: 72 }}>🚧</span>
      <h3>الصفحة غير موجودة</h3>
      <p>يبدو أنك خرجت عن المسار… عُد إلى المتجر</p>
      <Link to="/" className="btn btn-primary">العودة للرئيسية</Link>
    </div>
  )
}
