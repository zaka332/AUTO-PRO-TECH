import { Link } from 'react-router-dom'
import { useLang } from '../i18n/index.jsx'

export default function NotFound() {
  const { t } = useLang()
  return (
    <div className="container section empty-state">
      <span className="big" style={{ fontSize: 72 }}>🚧</span>
      <h3>{t('nf.t')}</h3>
      <p>{t('nf.p')}</p>
      <Link to="/" className="btn btn-primary">{t('nf.btn')}</Link>
    </div>
  )
}
