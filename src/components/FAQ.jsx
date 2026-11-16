import { useLang } from '../i18n/index.jsx'

const FAQS = {
  ar: [
    { q: 'هل كل القطع أصلية 100%؟', a: 'نعم، نتعامل مباشرة مع موردين معتمدين. نوفر قطعاً أصلية (OEM) وبدائل معتمدة عالية الجودة، مع فاتورة رسمية وضمان مطابقة لكل عملية شراء.' },
    { q: 'كيف أتأكد أن القطعة تناسب سيارتي؟', a: 'استخدم أداة «ابحث بسيارتك» بتحديد الماركة والطراز وسنة الصنع، أو راسلنا على واتساب مع رقم الهيكل (VIN) وسنتأكد لك من التوافق 100% قبل الشراء.' },
    { q: 'هل توفرون قطعاً للسيارات القديمة؟', a: 'نعم، نغطي الموديلات من 2005 حتى 2026. تخصصنا الأساسي هو السيارات الفرنسية (رينو، بيجو، ستروين، داسيا)، لكن نوفر قطعاً لكل الماركات المنتشرة في الجزائر.' },
    { q: 'كم تستغرق مدة التوصيل وكم تكلف؟', a: 'من 24 إلى 72 ساعة حسب الولاية. التوصيل متاح للمنزل أو لمكتب التوصيل، والتكلفة تظهر لك بدقة في صفحة إتمام الطلب قبل التأكيد.' },
    { q: 'كيف يتم الدفع؟', a: 'الدفع عند الاستلام نقداً — تفحص القطعة عند التسليم وتدفع فقط إذا كانت مطابقة لطلبك. لا نطلب أي دفع مسبق.' },
    { q: 'هل يمكن إرجاع أو استبدال القطعة؟', a: 'نعم، خلال 7 أيام من الاستلام إذا كانت القطعة غير مطابقة وغير مستعملة، مع الحفاظ على تغليفها الأصلي. الاستبدال مجاني في حال الخطأ من جهتنا.' },
  ],
  fr: [
    { q: "Toutes les pièces sont-elles 100% d'origine ?", a: 'Oui, nous travaillons directement avec des fournisseurs agréés. Nous offrons des pièces OEM d’origine et des adaptees certifiées de haute qualité, avec facture officielle et garantie de compatibilité pour chaque achat.' },
    { q: 'Comment être sûr que la pièce convient à ma voiture ?', a: 'Utilisez « Cherchez par voiture » en choisissant marque, modèle et année, ou écrivez-nous sur WhatsApp avec votre numéro VIN — nous vérifions la compatibilité à 100% avant l’achat.' },
    { q: 'Fournissez-vous des pièces pour les voitures anciennes ?', a: 'Oui, nous couvrons les modèles de 2005 à 2026. Notre spécialité : les voitures françaises (Renault, Peugeot, Citroën, Dacia), mais nous offrons aussi des pièces pour toutes les marques répandues en Algérie.' },
    { q: 'Quels sont les délais et coûts de livraison ?', a: 'De 24 à 72 heures selon la wilaya. Livraison à domicile ou au bureau de livraison ; le coût s’affiche exactement sur la page de commande avant confirmation.' },
    { q: 'Comment se passe le paiement ?', a: 'Paiement à la livraison en espèces — inspectez la pièce à la réception et payez seulement si elle correspond à votre commande. Aucun paiement d’avance.' },
    { q: 'Puis-je retourner ou échanger la pièce ?', a: 'Oui, dans les 7 jours suivant la réception si la pièce n’est pas compatible et n’a pas été utilisée, dans son emballage d’origine. L’échange est gratuit en cas d’erreur de notre part.' },
  ],
  en: [
    { q: 'Are all parts 100% genuine?', a: 'Yes, we work directly with certified suppliers. We offer genuine OEM parts and high-quality certified aftermarket, with an official invoice and fit guarantee for every purchase.' },
    { q: 'How can I be sure the part fits my car?', a: 'Use “Search by your car” to pick brand, model and year, or message us on WhatsApp with your VIN — we verify 100% compatibility before you buy.' },
    { q: 'Do you supply parts for older cars?', a: 'Yes, we cover models from 2005 to 2026. Our core specialty is French cars (Renault, Peugeot, Citroën, Dacia), but we stock parts for every brand common in Algeria.' },
    { q: 'How long does delivery take and what does it cost?', a: '24 to 72 hours depending on the wilaya. Home or pickup-office delivery, with the exact cost shown at checkout before you confirm.' },
    { q: 'How do I pay?', a: 'Cash on delivery — inspect the part when it arrives and pay only if it matches your order. No upfront payment.' },
    { q: 'Can I return or exchange a part?', a: 'Yes, within 7 days of receipt if the part doesn’t fit and is unused, in its original packaging. Exchange is free if the mistake is ours.' },
  ],
}

export default function FAQ() {
  const { t, lang } = useLang()
  const list = FAQS[lang] || FAQS.ar

  return (
    <section className="section container">
      <div className="faq-grid">
        <div className="faq-head">
          <h2>{t('faq.title')}</h2>
          <p>{t('faq.sub')}</p>
          <div className="faq-cta">
            <span>{t('faq.ctaQ')}</span>
            <a href="#/contact" className="btn btn-ghost btn-sm">{t('faq.ctaBtn')}</a>
          </div>
        </div>
        <div className="faq-list">
          {list.map((f, i) => (
            <details key={i} className="faq-item" {...(i === 0 ? { open: true } : {})}>
              <summary>{f.q}<span className="faq-chev">▾</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
