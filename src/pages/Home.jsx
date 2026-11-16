import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCars, fetchSettings } from '../lib/db.js'
import { CATEGORIES, BRAND_NAMES, FRENCH_BRANDS } from '../data/catalog.js'
import { useLang } from '../i18n/index.jsx'
import { catName, catDesc, brandDisplay } from '../i18n/catalog-i18n.js'
import { waLink } from '../lib/whatsapp.js'
import ProductCard from '../components/ProductCard.jsx'
import CarCard from '../components/CarCard.jsx'
import CarSelector from '../components/CarSelector.jsx'
import Testimonials from '../components/Testimonials.jsx'
import FAQ from '../components/FAQ.jsx'
import Reveal from '../components/Reveal.jsx'
import { TruckIcon, ShieldIcon, StarIcon, WrenchIcon } from '../components/Icons.jsx'

export default function Home() {
  const { t, lang } = useLang()
  const [products, setProducts] = useState([])
  const [cars, setCars] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCars(), fetchSettings()])
      .then(([prods, carList, st]) => { setProducts(prods); setCars(carList); setSettings(st) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const featured = products.filter((p) => p.featured).slice(0, 8)
  const shown = featured.length ? featured : products.slice(0, 8)
  const featuredCars = cars.filter((c) => c.featured).slice(0, 4)

  return (
    <>
      {/* الواجهة البطلة */}
      <section className="hero">
        <div className="container hero-in">
          <div className="hero-txt">
            <span className="hero-badge">{t('hero.badge')}</span>
            <h1>
              {t('hero.pre')} <span className="grad">{t('hero.grad')}</span> {t('hero.post')}
              <br /> {t('hero.line2')}
            </h1>
            <p>{t('hero.p')}</p>
            <div className="hero-cta">
              <Link to="/products" className="btn btn-primary btn-lg">{t('hero.cta1')}</Link>
              <Link to="/cars" className="btn btn-ghost btn-lg">{t('hero.cta2')}</Link>
            </div>
            <div className="hero-stats">
              <div><b>+5000</b><span>{t('hero.s1l')}</span></div>
              <div><b>58</b><span>{t('hero.s2l')}</span></div>
              <div><b>4.9⭐</b><span>{t('hero.s3l')}</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-ring r1" />
            <div className="hero-ring r2" />
            <div className="hero-gear">⚙️</div>
            <div className="hero-chip c1">🇫🇷 {lang === 'ar' ? 'قطع فرنسية أصلية' : lang === 'fr' ? "Pièces françaises d'origine" : 'Genuine French parts'}</div>
            <div className="hero-chip c2">🛑 {catName('brakes', lang)}</div>
            <div className="hero-chip c3">🚗 {lang === 'ar' ? 'سيارات <3 سنوات' : lang === 'fr' ? 'Voitures <3 ans' : 'Cars <3 years'}</div>
            <div className="hero-chip c4">🛢️ {catName('oils', lang)}</div>
          </div>
        </div>
      </section>

      {/* شريط الثقة */}
      <section className="trustbar-wrap container" aria-label="trust">
        <Reveal>
          <div className="trustbar">
            {[
              ['🚚', t('trust.t1t'), t('trust.t1s')],
              ['💵', t('trust.t2t'), t('trust.t2s')],
              ['🛡️', t('trust.t3t'), t('trust.t3s')],
              ['🎧', t('trust.t4t'), t('trust.t4s')],
            ].map(([ic, ti, su]) => (
              <div className="titem" key={ti}>
                <span>{ic}</span>
                <div><b>{ti}</b><small>{su}</small></div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* اختر سيارتك */}
      <section className="section container">
        <Reveal>
          <div className="section-head">
            <h2>{t('sec.find')}</h2>
            <p>{t('sec.findSub')}</p>
          </div>
          <CarSelector />
        </Reveal>
      </section>

      {/* الفئات */}
      <section className="section container">
        <Reveal>
          <div className="section-head">
            <h2>{t('sec.cats')}</h2>
            <Link to="/products" className="see-all">{t('sec.seeAll')}</Link>
          </div>
        </Reveal>
        <div className="cats-grid">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 40} className="reveal-card">
              <Link to={`/products?cat=${c.id}`} className="cat-card">
                <span className="cat-icon">{c.icon}</span>
                <b>{catName(c.id, lang)}</b>
                <small>{catDesc(c.id, lang)}</small>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* منتجات مميزة */}
      <section className="section container">
        <Reveal>
          <div className="section-head">
            <h2>{t('sec.best')}</h2>
            <Link to="/products" className="see-all">{t('sec.seeAll')}</Link>
          </div>
        </Reveal>
        {loading ? (
          <div className="grid-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton-card" />)}</div>
        ) : (
          <div className="grid-4">{shown.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </section>

      {/* سيارات للبيع */}
      <section className="section container">
        <Reveal>
          <div className="section-head">
            <h2>{t('sec.cars')}</h2>
            <Link to="/cars" className="see-all">{t('sec.allCars')}</Link>
          </div>
        </Reveal>
        {loading ? (
          <div className="grid-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-card" />)}</div>
        ) : (
          <div className="grid-3">{featuredCars.map((c) => <CarCard key={c.id} car={c} />)}</div>
        )}
      </section>

      {/* لماذا نحن */}
      <section className="section container">
        <div className="features">
          {[
            { ic: <TruckIcon size={30} />, t: t('feat.f1t'), s: t('feat.f1s') },
            { ic: <ShieldIcon size={30} />, t: t('feat.f2t'), s: t('feat.f2s') },
            { ic: <WrenchIcon size={30} />, t: t('feat.f3t'), s: t('feat.f3s') },
            { ic: <StarIcon size={30} />, t: t('feat.f4t'), s: t('feat.f4s') },
          ].map((f, i) => (
            <Reveal key={i} delay={i * 80}><div className="feat">{f.ic}<b>{f.t}</b><span>{f.s}</span></div></Reveal>
          ))}
        </div>
      </section>

      {/* آراء العملاء */}
      <Testimonials />

      {/* أسئلة شائعة */}
      <FAQ />

      {/* دعوة للتواصل */}
      {settings?.whatsapp && (
        <section className="section container">
          <Reveal>
            <div className="cta-banner">
              <div>
                <h2>{t('cta.title')}</h2>
                <p>{t('cta.p')}</p>
              </div>
              <div className="cta-actions">
                <a
                  className="btn btn-wa btn-lg"
                  href={waLink(settings.whatsapp, t('float.waText'))}
                  target="_blank" rel="noreferrer"
                >
                  {t('cta.wa')}
                </a>
                {settings.phone && (
                  <a className="btn btn-ghost btn-lg cta-ghost" href={`tel:+${settings.phone}`}>{t('cta.call')}</a>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* شريط الماركات */}
      <section className="section container">
        <Reveal>
          <div className="section-head">
            <h2>{t('sec.brands')}</h2>
            <span className="chip">{t('sec.brandsChip')}</span>
          </div>
          <div className="brands-strip">
            {FRENCH_BRANDS.map((b) => <span key={b} className="brand-chip fr">{brandDisplay(b, lang)}</span>)}
            {BRAND_NAMES.filter((b) => !FRENCH_BRANDS.includes(b)).map((b) => <span key={b} className="brand-chip">{brandDisplay(b, lang)}</span>)}
          </div>
        </Reveal>
      </section>
    </>
  )
}
