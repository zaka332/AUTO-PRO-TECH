import Stars from './Stars.jsx'
import Reveal from './Reveal.jsx'
import { useLang } from '../i18n/index.jsx'

const DATA = {
  ar: [
    { name: 'أحمد ب.', from: 'الجزائر العاصمة', rating: 5, text: 'طلبت أقمشة فرامل لغولف 8 ووصلت في 48 ساعة فقط. جودة أصيلة والسعر أحسن من السوق. أنصح بهم بقوة.' },
    { name: 'سفيان م.', from: 'وهران', rating: 5, text: 'كنت نبحث على فلتر تكييف لبيجو 308 من مدة طويلة، لقيته عندهم وساعدوني نختار اللي يوافق موديلي بالضبط.' },
    { name: 'ياسين ك.', from: 'سطيف', rating: 4.5, text: 'خدمة محترمة، ردّوا عليّ في واتساب في دقائق وبعثولي القطعة لمكتب التوصيل نفس اليوم. تجربة ممتازة.' },
    { name: 'أمينة ح.', from: 'قسنطينة', rating: 5, text: 'شريت بطارية لدياسيا داستر 2024. الشراء سهل والدفع عند الاستلام يعطي ثقة كاملة. شكراً AutoProTech!' },
  ],
  fr: [
    { name: 'Ahmed B.', from: 'Alger', rating: 5, text: "J'ai commandé des plaquettes de frein pour Golf 8, livrées en 48h. Qualité d'origine et prix meilleur qu'au marché. Je recommande vivement." },
    { name: 'Sofiane M.', from: 'Oran', rating: 5, text: "Je cherchais un filtre d'habitacle pour Peugeot 308 depuis longtemps — je l'ai trouvé ici et ils m'ont aidé à choisir la pièce exacte pour mon modèle." },
    { name: 'Yacine K.', from: 'Sétif', rating: 4.5, text: "Service respectueux, réponse sur WhatsApp en quelques minutes et pièce expédiée au bureau de livraison le jour même. Excellente expérience." },
    { name: 'Amine H.', from: 'Constantine', rating: 5, text: "J'ai acheté une batterie pour Dacia Duster 2024. Achat facile et le paiement à la livraison donne une confiance totale. Merci AutoProTech !" },
  ],
  en: [
    { name: 'Ahmed B.', from: 'Algiers', rating: 5, text: 'Ordered brake pads for a Golf 8 and they arrived in just 48 hours. Genuine quality and a better price than the market. Highly recommended.' },
    { name: 'Sofiane M.', from: 'Oran', rating: 5, text: "I'd been hunting a cabin filter for my Peugeot 308 forever — found it here, and they helped me pick the exact match for my model." },
    { name: 'Yacine K.', from: 'Sétif', rating: 4.5, text: 'Great service — they replied on WhatsApp within minutes and shipped my part to the pickup office the same day. Excellent experience.' },
    { name: 'Amine H.', from: 'Constantine', rating: 5, text: 'Bought a battery for a 2024 Dacia Duster. Easy purchase and cash on delivery gives full confidence. Thank you AutoProTech!' },
  ],
}

export default function Testimonials() {
  const { t, lang } = useLang()
  const list = DATA[lang] || DATA.ar

  return (
    <section className="section container">
      <Reveal>
        <div className="section-head">
          <h2>{t('testi.title')}</h2>
          <span className="testi-count">{t('testi.count')}</span>
        </div>
      </Reveal>
      <div className="testi-grid">
        {list.map((tm, i) => (
          <Reveal key={i} delay={i * 90}>
            <figure className="testi">
              <Stars val={tm.rating} />
              <blockquote>“{tm.text}”</blockquote>
              <figcaption>
                <span className="testi-avatar">{tm.name[0]}</span>
                <div><b>{tm.name}</b><small>{tm.from}</small></div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
