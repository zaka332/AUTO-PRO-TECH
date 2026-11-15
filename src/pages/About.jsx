import { SITE } from '../config.js'
import { TruckIcon, ShieldIcon, WrenchIcon, StarIcon } from '../components/Icons.jsx'

export default function About() {
  return (
    <div className="container section about-page">
      <div className="section-head">
        <h2>🔩 من نحن؟</h2>
      </div>
      <div className="card about-card">
        <p>
          <b>{SITE.name}</b> متجر جزائري متخصص في بيع <b>قطع غيار السيارات الأصلية</b> — تخصصنا الأساسي
          هو <b>السيارات الفرنسية</b> (رينو، بيجو، ستروين، داسيا) التي تملأ طرق الوطن، ونغطي كذلك
          كل الماركات الأخرى: هيونداي، كيا، فولكسفاغن، تويوتا، شيري وأكثر — <b>من موديلات 2005 حتى 2026</b>.
        </p>
        <p>
          نعرف أن أصحاب السيارات القديمة يعانون لإيجاد قطع مطابقة، وأصحاب السيارات الجديدة يبحثون عن
          أصلية بضمان — لذلك نوفر القطعة الصحيحة لكل سيارة مهما كان عمرها. كما نبيع <b>سيارات أقل من
          3 سنوات</b> مفحوصة بالكامل، بوثائق سليمة وكيلومتراج موثق.
        </p>

        <div className="features">
          <div className="feat"><ShieldIcon size={30} /><b>قطع أصلية 100%</b><span>موردون معتمدون وفواتير رسمية</span></div>
          <div className="feat"><WrenchIcon size={30} /><b>توجيه تقني مجاني</b><span>نساعدك في تحديد القطعة المناسبة لموديلك</span></div>
          <div className="feat"><TruckIcon size={30} /><b>توصيل سريع</b><span>24-72 ساعة لكل ولايات الوطن</span></div>
          <div className="feat"><StarIcon size={30} /><b>ضمان الاستبدال</b><span>أرجع القطعة إن لم تطابق سيارتك</span></div>
        </div>
      </div>
    </div>
  )
}
