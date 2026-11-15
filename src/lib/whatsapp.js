// أدوات WhatsApp Business — روابط wa.me مع رسائل جاهزة
import { SITE } from '../config.js'
import { fmtPrice } from './format.js'

export function normalizePhone(p) {
  if (!p) return ''
  return String(p).replace(/[^\d]/g, '').replace(/^0/, '213')
}

export function waLink(phone, text) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`
}

// الاستفسار عن منتج
export function productInquiry(product, storePhone) {
  const txt =
    `مرحباً ${SITE.name} 👋\n` +
    `أرغب في الاستفسار عن هذه القطعة:\n\n` +
    `🔧 ${product.name}\n` +
    `🚗 ${product.brand} ${product.model} — ${product.year}\n` +
    `💰 السعر: ${fmtPrice(product.price)}\n` +
    `🔖 المرجع: ${product.sku || product.id}\n\n` +
    `هل هي متوفرة؟`
  return waLink(storePhone, txt)
}

// الاستفسار عن سيارة معروضة للبيع
export function carInquiry(car, storePhone) {
  const txt =
    `مرحباً ${SITE.name} 👋\n` +
    `أرغب في الاستفسار عن هذه السيارة المعروضة للبيع:\n\n` +
    `🚗 ${car.name} — ${car.year}\n` +
    `📊 الكيلومتراج: ${Number(car.mileage).toLocaleString('en-US')} كم\n` +
    `⛽ ${car.fuel} — ⚙️ ${car.transmission} — 🎨 ${car.color}\n` +
    `💰 السعر: ${fmtPrice(car.price)}\n` +
    `🔖 المرجع: ${car.id}\n\n` +
    `هل هي متوفرة؟ وأرغب في تحديد موعد للمعاينة.`
  return waLink(storePhone, txt)
}

// رسالة تأكيد الطلب
export function orderMessage(order) {
  const lines = order.items
    .map((it) => `• ${it.name} × ${it.qty} = ${fmtPrice(it.price * it.qty)}`)
    .join('\n')
  const c = order.customer || {}
  const txt =
    `🛒 *طلب جديد من متجر ${SITE.name}*\n\n` +
    `رقم الطلب: #${String(order.seq || order.id?.slice(-6) || '').toUpperCase()}\n\n` +
    `*القطع:*\n${lines}\n\n` +
    `المجموع: ${fmtPrice(order.subtotal)}\n` +
    `التوصيل: ${fmtPrice(order.deliveryFee)}\n` +
    `*الإجمالي: ${fmtPrice(order.total)}*\n\n` +
    `*معلومات التوصيل:*\n` +
    `👤 ${c.name}\n📱 ${c.phone}\n📍 ${c.wilaya} — ${c.commune}\n` +
    `🏠 ${order.deliveryType === 'desk' ? 'مكتب التوصيل' : 'توصيل للمنزل'}\n` +
    (c.address ? `📌 ${c.address}\n` : '') +
    (c.notes ? `📝 ${c.notes}\n` : '') +
    `\nأرجو تأكيد الطلب 🙏`
  return txt
}
