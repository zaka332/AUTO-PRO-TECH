// منتجات تجريبية لعرض المتجر — تُحمَّل من لوحة التحكم أو تلقائياً في وضع العرض
// الصور: صور حقيقية لقطع الغيار مخزنة محلياً في public/img/parts
import { placeholderImage as ph } from '../lib/placeholder.js'

// صورة بديلة تلقائية إن فشل تحميل الصورة الأصلية
export const partImg = (file) => `/img/parts/${file}.jpg`

export const seedProducts = [
  {
    name: 'فلتر زيت أصلي رينو كليو 5 / سيمبول 5',
    brand: 'رينو', model: 'كليو 5', year: 2025, category: 'filters',
    price: 1800, oldPrice: 2200, stock: 40, sku: 'RN-FO-1109',
    description: 'فلتر زيت أصلي رينو مناسب لكليو 5 وسيمبول 5 بمحركات TCe وSCe. يحافظ على نظافة المحرك ويضمن تزييتاً مثالياً. قطعة أصلية بضمان المطابقة.',
    featured: true, image: partImg('oil-filter'), imgSeed: 0,
  },
  {
    name: 'طقم أقمشة فرامل أمامية فولكسفاغن غولف 8',
    brand: 'فولكسفاغن', model: 'غولف 8', year: 2025, category: 'brakes',
    price: 8500, oldPrice: 9800, stock: 25, sku: 'VW-BP-2088',
    description: 'طقم أقمشة فرامل أمامية عالية الجودة لغولف 8 وت-روك وبولو GTI. خامة سيراميك هادئة مع تبريد ممتاز ومقاومة للتلاشي عند الحرارة العالية.',
    featured: true, image: partImg('brake-pads'), imgSeed: 1,
  },
  {
    name: 'بطارية 70 أمبير AGM هيونداي أكسنت / إلنترا',
    brand: 'هيونداي', model: 'أكسنت', year: 2024, category: 'electrical',
    price: 22000, stock: 15, sku: 'HY-BT-70AGM',
    description: 'بطارية AGM بسعة 70 أمبير و760 أمبير إقلاع، مثالية للسيارات المزودة بنظام Start/Stop. عمر افتراضي طويل وضمان سنة كاملة.',
    featured: true, image: partImg('battery'), imgSeed: 2,
  },
  {
    name: 'زيت محرك توتال كوارتز 5W-30 — 5 لتر',
    brand: 'رينو', model: 'كليو 5', year: 2026, category: 'oils',
    price: 7500, oldPrice: 8200, stock: 60, sku: 'OIL-TQ-5W30',
    description: 'زيت محرك تصنيعي كامل توتال كوارتز 9000 5W-30، معتمد ACEA C3/C4 لمحركات البنزين والديزل الحديثة. عبوة 5 لتر كافية لتغيير كامل مع الفلتر.',
    featured: true, image: partImg('engine-oil'), imgSeed: 3,
  },
  {
    name: 'طقم بوجات إريديوم تويوتا كورولا (4 حبات)',
    brand: 'تويوتا', model: 'كورولا', year: 2025, category: 'engine',
    price: 9800, stock: 20, sku: 'TY-SP-IR4',
    description: 'طقم 4 بوجات إريديوم أصلية NGK لكورولا وياريس بمحركات 1.6 و1.8. إشعال أقوى، استهلاك وقود أقل، وعمر يصل إلى 100.000 كم.',
    image: partImg('spark-plugs'), imgSeed: 4,
  },
  {
    name: 'طقم مساحات سيليكون سيات إبيزا / ليون',
    brand: 'سيات', model: 'إبيزا', year: 2025, category: 'lighting',
    price: 3200, stock: 35, sku: 'SE-WP-DUO',
    description: 'طقم مساحات سيليكون مقاس 24/22 إنش بإطار هيبريد مضاد للضجيج، مسح نظيف بلا خطوط حتى في السرعات العالية. تركيب مباشر دون قطع.',
    image: partImg('wipers'), imgSeed: 5,
  },
  {
    name: 'مصابيح أمامية LED H7 بيجو 308 / 2008',
    brand: 'بيجو', model: '308', year: 2024, category: 'lighting',
    price: 4500, oldPrice: 5200, stock: 30, sku: 'PG-LD-H7X2',
    description: 'زوج مصابيح LED H7 بقوة 12000 لومان وضوء أبيض 6000K، مراوح نحاسية للتبريد وشريحة CANbus لتفادي أخطاء الكمبيوتر. رؤية ليلية استثنائية.',
    featured: true, image: partImg('led-bulb'), imgSeed: 6,
  },
  {
    name: 'كمبروسر تكييف كيا سبورتاج / سيلتوس',
    brand: 'كيا', model: 'سبورتاج', year: 2025, category: 'cooling',
    price: 48000, stock: 6, sku: 'KI-AC-CMP',
    description: 'كمبروسر تكييف أصلي بضغط متغير لمحركات 1.6 و2.0 كريت. يشتمل على كلتش مغناطيسي وبكرات. ضمان 6 أشهر مع فاتورة.',
    image: partImg('ac-compressor'), imgSeed: 7,
  },
  {
    name: 'مساعدات أمامية غاز+زيت داسيا داستر 3',
    brand: 'داسيا', model: 'داستر 3', year: 2025, category: 'suspension',
    price: 18000, stock: 12, sku: 'DC-SH-F2',
    description: 'زوج مساعدات أمامية هيدروليكي-غازي أداء أصلي، يعيد راحة القيادة والثبات على الطرق الوعرة. مناسبة لداستر 3 الجديدة كلياً.',
    image: partImg('shock-absorber'), imgSeed: 8,
  },
  {
    name: 'أقراص فرامل خلفية مثقبة شيري تيجو 7 برو',
    brand: 'شيري', model: 'تيجو 7 برو', year: 2024, category: 'brakes',
    price: 11500, stock: 18, sku: 'CY-BD-R2',
    description: 'زوج أقراص فرامل خلفية مثقبة ومهوّاة بطبقة ضد الصدأ، تحسن التبريد وتقلل اهتزاز الفرامل. مقاس أصلي 288mm.',
    image: partImg('brake-disc'), imgSeed: 9,
  },
  {
    name: 'فلتر هواء رياضي ك&ن سكودا أوكتافيا',
    brand: 'سكودا', model: 'أوكتافيا', year: 2024, category: 'filters',
    price: 9500, stock: 10, sku: 'SK-FA-KN',
    description: 'فلتر هواء رياضي قابل للغسل وإعادة الاستخدام مدى حياة السيارة، يحسن تدفق الهواء بنسبة 35% ويعزز استجابة المحرك. يغسل كل 80.000 كم.',
    image: partImg('air-filter'), imgSeed: 10,
  },
  {
    name: 'طلمبة ماء (مضخة تبريد) نيسان قاشقاي',
    brand: 'نيسان', model: 'قاشقاي', year: 2025, category: 'cooling',
    price: 12500, stock: 8, sku: 'NS-WP-QQ',
    description: 'طلمبة ماء تبريد أصلية لمحركات نيسان-رينو HR16DE وH4GK. جسم ألمنيوم وحشوات مقاومة للتسريب. تُنصح بالتبديل مع طقم التوزيع.',
    image: partImg('water-pump'), imgSeed: 11,
  },
  {
    name: 'إطار ميشلان 205/55 R16 بريماسي 4',
    brand: 'فورد', model: 'فييستا', year: 2026, category: 'tires',
    price: 16500, stock: 32, sku: 'TYR-MI-20555',
    description: 'إطار ميشلان بريماسي 4 مقاس 205/55 R16، تصنيف A في الرطوبة، ثبات مذهل على الماء وعمر ممتاز. مناسب لغالبية السيارات المدينية الحديثة.',
    featured: true, image: partImg('tire'), imgSeed: 12,
  },
  {
    name: 'طقم كلتش كامل فيات تيبو 1.4',
    brand: 'فيات', model: 'تيبو', year: 2024, category: 'transmission',
    price: 42000, stock: 5, sku: 'FT-CL-14',
    description: 'طقم كلتش كامل (قرص + دوران + رمان بلي) لفيات تيبو وأوبل كورسا بمحرك 1.4. خفات معايرة أصلية لنقل ناعم دون اهتزاز.',
    image: partImg('clutch-kit'), imgSeed: 13,
  },
  {
    name: 'حساس موقف عمود المرفق ستروين C3',
    brand: 'ستروين', model: 'C3', year: 2025, category: 'electrical',
    price: 6800, stock: 14, sku: 'CT-CPS-C3',
    description: 'حساس موقف الكرنك (PKS) أصلي لمحركات PureTech 1.2. يحل مشاكل التقطيف وصعوبة الإقلاع. سهل التركيب مع قابس مقاوم للماء.',
    image: partImg('sensor'), imgSeed: 14,
  },
  {
    name: 'غطاء مقاعد جلد فاخر — تصميم رياضي',
    brand: 'هيونداي', model: 'توسان', year: 2026, category: 'accessories',
    price: 14000, oldPrice: 17000, stock: 22, sku: 'ACC-SC-LX',
    description: 'طقم غطاء مقاعد جلد PU فاخر بتخطيط أحمر رياضي، مقاوم للماء والخدوش، سهل التنظيف. يناسب أغلب السيارات مع فتحات Airbag الجانبية.',
    image: partImg('seat-covers'), imgSeed: 15,
  },
].map((p, i) => ({
  ...p,
  id: `demo-${i + 1}`,
  active: true,
  sold: Math.floor(Math.random() * 120) + 8,
  createdAt: Date.now() - (i + 1) * 86400000,
}))
