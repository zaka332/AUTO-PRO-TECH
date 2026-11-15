// إعدادات المتجر العامة
export const SITE = {
  name: 'AutoProTech',
  nameAr: 'أوتو برو تك',
  tagline: 'قطع غيار أصلية • سيارات للبيع',
  description: 'قطع غيار أصلية للسيارات الفرنسية وكل الماركات — القديمة والحديثة + بيع سيارات أقل من 3 سنوات',
  url: import.meta.env.VITE_SITE_URL || 'https://auto-pro-tech.web.app',
}

export const ENV = {
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  adminEmail: (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase(),
  pixelId: import.meta.env.VITE_FB_PIXEL_ID || '',
}

// حالات الطلب
export const ORDER_STATUS = {
  new: { label: 'جديد', color: '#38bdf8' },
  confirmed: { label: 'مؤكد', color: '#a78bfa' },
  preparing: { label: 'قيد التحضير', color: '#fbbf24' },
  shipped: { label: 'مُرسل', color: '#fb923c' },
  delivered: { label: 'مُسلَّم', color: '#34d399' },
  canceled: { label: 'ملغى', color: '#f87171' },
}

// رسوم التوصيل الافتراضية (تُعدَّل من لوحة التحكم)
export const DEFAULT_SETTINGS = {
  whatsapp: ENV.whatsapp,
  phone: ENV.whatsapp,
  address: 'الجزائر العاصمة، الجزائر',
  email: 'contact@autoprotech.dz',
  facebookUrl: 'https://facebook.com/autoprotech',
  instagramUrl: 'https://instagram.com/autoprotech',
  announcement: '🚚 توصيل لكل ولايات الوطن • الدفع عند الاستلام • ضمان مطابقة القطعة',
  deliveryHome: 600,
  deliveryDesk: 350,
  freeDeliveryFrom: 30000,
}
