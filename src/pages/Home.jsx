import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCars, fetchSettings } from '../lib/db.js'
import { CATEGORIES, BRAND_NAMES, FRENCH_BRANDS } from '../data/catalog.js'
import { waLink } from '../lib/whatsapp.js'
import ProductCard from '../components/ProductCard.jsx'
import CarCard from '../components/CarCard.jsx'
import CarSelector from '../components/CarSelector.jsx'
import Testimonials from '../components/Testimonials.jsx'
import FAQ from '../components/FAQ.jsx'
import Reveal from '../components/Reveal.jsx'
import { TruckIcon, ShieldIcon, StarIcon, WrenchIcon } from '../components/Icons.jsx'

const TRUST = [
  { icon: '🚚', title: 'توصيل 24-72 ساعة', sub: 'لكل الولايات الـ58' },
  { icon: '💵', title: 'الدفع عند الاستلام', sub: 'تفحص قبل أن تدفع' },
  { icon: '🛡️', title: 'ضمان المطابقة', sub: 'استبدال خلال 7 أيام' },
  { icon: '🎧', title: 'دعم واتساب سريع', sub: 'رد خلال دقائق' },
]

export default function Home() {
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
            <span className="hero-badge">🇫🇷 متخصصون في السيارات الفرنسية — وكل الماركات</span>
            <h1>
              قطع غيار <span className="grad">أصلية</span> لسيارتك
              <br /> قديمة أو حديثة — وسيارات &lt;3 سنوات للبيع
            </h1>
            <p>
              قطع غيار أصلية مضمونة المطابقة للسيارات الفرنسية (رينو، بيجو، ستروين، داسيا)
              وكل الماركات الأخرى — من 2005 حتى 2026. كما نبيع سيارات أقل من 3 سنوات مفحوصة 100%.
            </p>
            <div className="hero-cta">
              <Link to="/products" className="btn btn-primary btn-lg">🛒 تصفح قطع الغيار</Link>
              <Link to="/cars" className="btn btn-ghost btn-lg">🚗 سيارات للبيع</Link>
            </div>
            <div className="hero-stats">
              <div><b>+5000</b><span>قطعة متوفرة</span></div>
              <div><b>58</b><span>ولاية للتوصيل</span></div>
              <div><b>4.9⭐</b><span>تقييم العملاء</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-ring r1" />
            <div className="hero-ring r2" />
            <div className="hero-gear">⚙️</div>
            <div className="hero-chip c1">🇫🇷 قطع فرنسية أصلية</div>
            <div className="hero-chip c2">🛑 فرامل</div>
            <div className="hero-chip c3">🚗 سيارات &lt;3 سنوات</div>
            <div className="hero-chip c4">🛢️ زيوت</div>
          </div>
        </div>
      </section>

      {/* شريط الثقة */}
      <section className="trustbar-wrap container" aria-label="لماذا تثق بنا">
        <Reveal>
          <div className="trustbar">
            {TRUST.map((t) => (
              <div className="titem" key={t.title}>
                <span>{t.icon}</span>
                <div><b>{t.title}</b><small>{t.sub}</small></div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* اختر سيارتك */}
      <section className="section container">
        <Reveal>
          <div className="section-head">
            <h2>🔎 ابحث بسيارتك</h2>
            <p>اختر الماركة والطراز وسنة الصنع لعرض القطع المتوافقة — من أقدم الموديلات لأحدثها</p>
          </div>
          <CarSelector />
        </Reveal>
      </section>

      {/* الفئات */}
      <section className="section container">
        <Reveal>
          <div className="section-head">
            <h2>🗂️ تصفح حسب الفئة</h2>
            <Link to="/products" className="see-all">عرض الكل ←</Link>
          </div>
        </Reveal>
        <div className="cats-grid">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={i * 40} className="reveal-card">
              <Link to={`/products?cat=${c.id}`} className="cat-card">
                <span className="cat-icon">{c.icon}</span>
                <b>{c.name}</b>
                <small>{c.desc}</small>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* منتجات مميزة */}
      <section className="section container">
        <Reveal>
          <div className="section-head">
            <h2>⭐ القطع الأكثر طلباً</h2>
            <Link to="/products" className="see-all">عرض الكل ←</Link>
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
            <h2>🚗 سيارات أقل من 3 سنوات للبيع</h2>
            <Link to="/cars" className="see-all">كل السيارات ←</Link>
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
            { ic: <TruckIcon size={30} />, t: 'توصيل لكل الولايات', s: 'للمنزل أو مكتب التوصيل، مع الدفع عند الاستلام' },
            { ic: <ShieldIcon size={30} />, t: 'ضمان المطابقة', s: 'قطع أصلية أو بديلة معتمدة بضمان الاستبدال' },
            { ic: <WrenchIcon size={30} />, t: 'خبرة تقنية', s: 'فريق يساعدك في اختيار القطعة الصحيحة لسيارتك مهما كان موديلها' },
            { ic: <StarIcon size={30} />, t: 'سيارات مفحوصة', s: 'سيارات أقل من 3 سنوات بوثائق كاملة وكيلومتراج موثق' },
          ].map((f, i) => (
            <Reveal key={f.t} delay={i * 80}><div className="feat">{f.ic}<b>{f.t}</b><span>{f.s}</span></div></Reveal>
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
                <h2>لم تجد القطعة التي تبحث عنها؟ 🔍</h2>
                <p>أرسل لنا موديل سيارتك ورقم الهيكل (VIN) — نؤمّن لك القطعة الأصلية في أقرب وقت وبأفضل سعر في السوق.</p>
              </div>
              <div className="cta-actions">
                <a
                  className="btn btn-wa btn-lg"
                  href={waLink(settings.whatsapp, 'مرحباً AutoProTech 👋 أبحث عن قطعة غيار، موديل سيارتي:')}
                  target="_blank" rel="noreferrer"
                >
                  📲 راسلنا واتساب
                </a>
                {settings.phone && (
                  <a className="btn btn-ghost btn-lg cta-ghost" href={`tel:+${settings.phone}`}>📞 اتصل بنا</a>
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
            <h2>🚙 نغطي أحدث وأقدم الطرازات</h2>
            <span className="chip">🇫🇷 تخصصنا: رينو • بيجو • ستروين • داسيا</span>
          </div>
          <div className="brands-strip">
            {FRENCH_BRANDS.map((b) => <span key={b} className="brand-chip fr">{b}</span>)}
            {BRAND_NAMES.filter((b) => !FRENCH_BRANDS.includes(b)).map((b) => <span key={b} className="brand-chip">{b}</span>)}
          </div>
        </Reveal>
      </section>
    </>
  )
}
