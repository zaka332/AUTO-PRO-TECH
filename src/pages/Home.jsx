import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCars } from '../lib/db.js'
import { CATEGORIES, BRAND_NAMES, FRENCH_BRANDS } from '../data/catalog.js'
import ProductCard from '../components/ProductCard.jsx'
import CarCard from '../components/CarCard.jsx'
import CarSelector from '../components/CarSelector.jsx'
import { TruckIcon, ShieldIcon, StarIcon, WrenchIcon } from '../components/Icons.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCars()])
      .then(([prods, carList]) => { setProducts(prods); setCars(carList) })
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
            <span className="hero-badge">🔧 متخصصون في السيارات الفرنسية — وكل الماركات</span>
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
              <div><b>2005-2026</b><span>كل سنوات السيارات</span></div>
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

      {/* اختر سيارتك */}
      <section className="section container">
        <div className="section-head">
          <h2>🔎 ابحث بسيارتك</h2>
          <p>اختر الماركة والطراز وسنة الصنع لعرض القطع المتوافقة — من أقدم الموديلات لأحدثها</p>
        </div>
        <CarSelector />
      </section>

      {/* الفئات */}
      <section className="section container">
        <div className="section-head">
          <h2>🗂️ تصفح حسب الفئة</h2>
          <Link to="/products" className="see-all">عرض الكل ←</Link>
        </div>
        <div className="cats-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/products?cat=${c.id}`} className="cat-card">
              <span className="cat-icon">{c.icon}</span>
              <b>{c.name}</b>
              <small>{c.desc}</small>
            </Link>
          ))}
        </div>
      </section>

      {/* منتجات مميزة */}
      <section className="section container">
        <div className="section-head">
          <h2>⭐ القطع الأكثر طلباً</h2>
          <Link to="/products" className="see-all">عرض الكل ←</Link>
        </div>
        {loading ? (
          <div className="grid-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton-card" />)}</div>
        ) : (
          <div className="grid-4">{shown.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </section>

      {/* سيارات للبيع */}
      <section className="section container">
        <div className="section-head">
          <h2>🚗 سيارات أقل من 3 سنوات للبيع</h2>
          <Link to="/cars" className="see-all">كل السيارات ←</Link>
        </div>
        {loading ? (
          <div className="grid-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-card" />)}</div>
        ) : (
          <div className="grid-3">{featuredCars.map((c) => <CarCard key={c.id} car={c} />)}</div>
        )}
      </section>

      {/* لماذا نحن */}
      <section className="section container">
        <div className="features">
          <div className="feat"><TruckIcon size={30} /><b>توصيل لكل الولايات</b><span>للمنزل أو مكتب التوصيل، مع الدفع عند الاستلام</span></div>
          <div className="feat"><ShieldIcon size={30} /><b>ضمان المطابقة</b><span>قطع أصلية أو بديلة معتمدة بضمان الاستبدال</span></div>
          <div className="feat"><WrenchIcon size={30} /><b>خبرة تقنية</b><span>فريق يساعدك في اختيار القطعة الصحيحة لسيارتك مهما كان موديلها</span></div>
          <div className="feat"><StarIcon size={30} /><b>سيارات مفحوصة</b><span>سيارات أقل من 3 سنوات بوثائق كاملة وكيلومتراج موثق</span></div>
        </div>
      </section>

      {/* شريط الماركات */}
      <section className="section container">
        <div className="section-head">
          <h2>🚙 نغطي أحدث وأقدم الطرازات</h2>
          <span className="chip">🇫🇷 تخصصنا: رينو • بيجو • ستروين • داسيا</span>
        </div>
        <div className="brands-strip">
          {FRENCH_BRANDS.map((b) => <span key={b} className="brand-chip fr">{b}</span>)}
          {BRAND_NAMES.filter((b) => !FRENCH_BRANDS.includes(b)).map((b) => <span key={b} className="brand-chip">{b}</span>)}
        </div>
      </section>
    </>
  )
}
