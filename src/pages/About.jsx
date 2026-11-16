import { useLang } from '../i18n/index.jsx'
import { TruckIcon, ShieldIcon, WrenchIcon, StarIcon } from '../components/Icons.jsx'

export default function About() {
  const { t } = useLang()
  return (
    <div className="container section about-page">
      <div className="section-head">
        <h2>{t('nav.about')} — 🔩</h2>
      </div>
      <div className="card about-card">
        <p><b>AutoProTech</b> {t('about.p1')}</p>
        <p>{t('about.p2')}</p>

        <div className="features">
          <div className="feat"><ShieldIcon size={30} /><b>{t('feat.f2t')}</b><span>{t('feat.f2s')}</span></div>
          <div className="feat"><WrenchIcon size={30} /><b>{t('feat.f3t')}</b><span>{t('feat.f3s')}</span></div>
          <div className="feat"><TruckIcon size={30} /><b>{t('feat.f1t')}</b><span>{t('feat.f1s')}</span></div>
          <div className="feat"><StarIcon size={30} /><b>{t('feat.f4t')}</b><span>{t('feat.f4s')}</span></div>
        </div>
      </div>
    </div>
  )
}
