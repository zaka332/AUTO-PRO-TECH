import Stars from './Stars.jsx'
import Reveal from './Reveal.jsx'

const DATA = [
  {
    name: 'أحمد ب.', from: 'الجزائر العاصمة', rating: 5,
    text: 'طلبت أقمشة فرامل لغولف 8 ووصلت في 48 ساعة فقط. جودة أصيلة والسعر أحسن من السوق. أنصح بهم بقوة.',
  },
  {
    name: 'سفيان م.', from: 'وهران', rating: 5,
    text: 'كنت نبحث على فلتر تكييف لبيجو 308 من مدة طويلة، لقيته عندهم وساعدوني نختار اللي يوافق موديلي بالضبط.',
  },
  {
    name: 'ياسين ك.', from: 'سطيف', rating: 4.5,
    text: 'خدمة محترمة، ردّوا عليّ في واتساب في دقائق وبعثولي القطعة لمكتب التوصيل نفس اليوم. تجربة ممتازة.',
  },
  {
    name: 'أمينة ح.', from: 'قسنطينة', rating: 5,
    text: 'شريت بطارية لدياسيا داستر 2024. الشراء سهل والدفع عند الاستلام يعطي ثقة كاملة. شكراً AutoProTech!',
  },
]

export default function Testimonials() {
  return (
    <section className="section container">
      <Reveal>
        <div className="section-head">
          <h2>💬 آراء عملائنا</h2>
          <span className="testi-count">⭐ 4.9/5 — أكثر من 2400 عميل سعيد</span>
        </div>
      </Reveal>
      <div className="testi-grid">
        {DATA.map((t, i) => (
          <Reveal key={i} delay={i * 90}>
            <figure className="testi">
              <Stars val={t.rating} />
              <blockquote>“{t.text}”</blockquote>
              <figcaption>
                <span className="testi-avatar">{t.name[0]}</span>
                <div><b>{t.name}</b><small>{t.from}</small></div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
