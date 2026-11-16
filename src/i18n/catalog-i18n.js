// ترجمة أسماء البيانات (ماركات، طرازات، فئات، وقود، ولايات) للعرض فقط
// القيم المخزنة في قاعدة البيانات تبقى بالعربية — الترجمة طبقة عرض فوقها
import { CATEGORIES, FRENCH_BRANDS } from '../data/catalog.js'
import { WILAYAS } from '../data/wilayas.js'

/* ===== الفئات ===== */
const CAT_I18N = {
  filters:      { fr: ['Filtres', 'Huile, air, habitacle, carburant'], en: ['Filters', 'Oil, air, cabin, fuel'] },
  brakes:       { fr: ['Freinage', 'Plaquettes, disques, étriers'], en: ['Brakes', 'Pads, discs, calipers'] },
  oils:         { fr: ['Huiles & fluides', 'Moteur, refroidissement, freins'], en: ['Oils & fluids', 'Engine, coolant, brake'] },
  engine:       { fr: ['Moteur', 'Courroies, pompes, bougies'], en: ['Engine parts', 'Belts, pumps, spark plugs'] },
  suspension:   { fr: ['Suspension', 'Amortisseurs, rotules, silentblocs'], en: ['Suspension', 'Shocks, ball joints, bushings'] },
  electrical:   { fr: ['Électricité & batteries', 'Batteries, alternateurs, démarreurs'], en: ['Electrical & batteries', 'Batteries, alternators, starters'] },
  lighting:     { fr: ['Éclairage & carrosserie', 'Phares, pare-chocs, rétros'], en: ['Lighting & body', 'Headlights, bumpers, mirrors'] },
  cooling:      { fr: ['Refroidissement & clim', 'Radiateurs, compresseurs, ventilateurs'], en: ['Cooling & A/C', 'Radiators, compressors, fans'] },
  transmission: { fr: ['Transmission', 'Embrayage, boîte, huiles de boîte'], en: ['Transmission', 'Clutch, gearbox, gear oils'] },
  tires:        { fr: ['Roues & pneus', 'Pneus, jantes, capteurs'], en: ['Wheels & tires', 'Tires, rims, sensors'] },
  accessories:  { fr: ['Accessoires', 'Housses, tapis, décoration'], en: ['Accessories', 'Covers, mats, decor'] },
}

export function catName(id, lang = 'ar') {
  if (lang === 'ar') return CATEGORIES.find((c) => c.id === id)?.name || id
  const e = CAT_I18N[id]
  return e ? e[lang][0] : id
}
export function catDesc(id, lang = 'ar') {
  if (lang === 'ar') return CATEGORIES.find((c) => c.id === id)?.desc || ''
  const e = CAT_I18N[id]
  return e ? e[lang][1] : ''
}
export function catIcon(id) {
  return CATEGORIES.find((c) => c.id === id)?.icon || '🔧'
}

/* ===== الماركات ===== */
const BRAND_I18N = {
  'رينو': 'Renault', 'داسيا': 'Dacia', 'بيجو': 'Peugeot', 'ستروين': 'Citroën',
  'هيونداي': 'Hyundai', 'كيا': 'Kia', 'فولكسفاغن': 'Volkswagen', 'سيات': 'Seat',
  'سكودا': 'Škoda', 'تويوتا': 'Toyota', 'فيات': 'Fiat', 'شيري': 'Chery',
  'نيسان': 'Nissan', 'سوزوكي': 'Suzuki', 'فورد': 'Ford', 'أوبل': 'Opel',
}
export function brandDisplay(b, lang = 'ar') {
  if (lang === 'ar') return b
  return BRAND_I18N[b] || b
}
export { FRENCH_BRANDS }

/* ===== الطرازات (استبدال كلمات معروفة داخل النص) ===== */
const MODEL_I18N = {
  'كليو': 'Clio', 'سيمبول': 'Symbol', 'فلوانس': 'Fluence', 'ميجان': 'Mégane',
  'ستوبواي': 'Stepway', 'داستر': 'Duster', 'كابتور': 'Captur', 'أرخانا': 'Arkana',
  'سانديرو': 'Sandero', 'لوغان': 'Logan', 'جوغر': 'Jogger', 'دوكر': 'Dokker',
  'سبارك': 'Spring', 'بارتنر': 'Partner', 'إكسبرت': 'Expert', 'بيرلينغو': 'Berlingo',
  'جادي': 'Jumpy', 'كسارا': 'Xsara', 'أكسنت': 'Accent', 'إلنترا': 'Elantra',
  'توسان': 'Tucson', 'سانتافي': 'Santa', 'بايس': 'Bayon', 'بكانتو': 'Picanto',
  'ريو': 'Rio', 'سيراتو': 'Cerato', 'سبورتاج': 'Sportage', 'سيلتوس': 'Seltos',
  'سورينتو': 'Sorento', 'بولو': 'Polo', 'غولف': 'Golf', 'ت-روك': 'T-Roc',
  'تيغوان': 'Tiguan', 'جيتا': 'Jetta', 'إبيزا': 'Ibiza', 'ليون': 'León',
  'أتيكا': 'Ateca', 'أرونا': 'Arona', 'تاراكو': 'Tarraco', 'فابيا': 'Fabia',
  'أوكتافيا': 'Octavia', 'كاميق': 'Kamiq', 'كودياك': 'Kodiaq', 'سوبرب': 'Superb',
  'كورولا': 'Corolla', 'ياريس': 'Yaris', 'هايلوكس': 'Hilux', 'كروزر': 'Cruiser',
  'تيبو': 'Tipo', 'دوبلو': 'Doblo', 'بونتو': 'Punto', 'ألبيا': 'Albea',
  'تيجو': 'Tiggo', 'برو': 'Pro', 'أريزو': 'Arrizo', 'ميكرا': 'Micra',
  'قاشقاي': 'Qashqai', 'جوك': 'Juke', 'نوتب': 'Note', 'سيليرو': 'Celerio',
  'فيتارا': 'Vitara', 'جيمني': 'Jimny', 'سواس': 'Swift', 'بالتاز': 'Baleno',
  'فييستا': 'Fiesta', 'فوكس': 'Focus', 'إكوسبورت': 'EcoSport', 'كا': 'Ka',
  'إكسبلورر': 'Explorer', 'كورسا': 'Corsa', 'أسترا': 'Astra', 'موكا': 'Mokka',
  'غراندلاند': 'Grandland', 'إلكترونيك': '',
}
const MODEL_MULTI = {
  'كليو 5': 'Clio 5', 'كليو 4': 'Clio 4', 'كليو 3': 'Clio 3',
  'سيمبول 5': 'Symbol 5', 'سانديرو 3': 'Sandero 3', 'سانديرو 2': 'Sandero 2',
  'لوغان 3': 'Logan 3', 'لوغان 2': 'Logan 2', 'داستر 3': 'Duster 3', 'داستر 2': 'Duster 2',
  'ميجان E-Tech': 'Mégane E-Tech', 'غولف 8': 'Golf 8', 'ياريس كروس': 'Yaris Cross',
  'لاند كروزر': 'Land Cruiser', 'C-إليزي': 'C-Elysée',
  'C3-إيركروس': 'C3 Aircross', 'C4-ككتروس': 'C4 Cactus',
  'تيجو 4 برو': 'Tiggo 4 Pro', 'تيجو 7 برو': 'Tiggo 7 Pro', 'تيجو 8 برو': 'Tiggo 8 Pro',
  'إبيزا كلاسيك': 'Ibiza Classic', 'كورسا D': 'Corsa D',
}
export function modelDisplay(m, lang = 'ar') {
  if (lang === 'ar') return m
  const s = String(m)
  if (MODEL_MULTI[s]) return MODEL_MULTI[s]
  return s.split(' ').map((w) => (MODEL_I18N[w] !== undefined ? MODEL_I18N[w] : w)).filter(Boolean).join(' ')
}

/* ===== اسم السيارة المعروضة ===== */
export function carDisplayName(car, lang = 'ar') {
  if (lang === 'ar') return car.name
  return `${brandDisplay(car.brand, lang)} ${modelDisplay(car.model, lang)}`
}

/* ===== وقود / علبة سرعة / ألوان ===== */
const FUEL_I18N = { 'بنزين': { fr: 'Essence', en: 'Petrol' }, 'ديزل': { fr: 'Diesel', en: 'Diesel' }, 'هجين': { fr: 'Hybride', en: 'Hybrid' }, 'GPL': { fr: 'GPL', en: 'LPG' } }
const GEAR_I18N = { 'مانيوال': { fr: 'Manuelle', en: 'Manual' }, 'أوتوماتيك': { fr: 'Automatique', en: 'Automatic' } }
const COLOR_I18N = {
  'أبيض': { fr: 'Blanc', en: 'White' }, 'أسود': { fr: 'Noir', en: 'Black' },
  'رمادي': { fr: 'Gris', en: 'Grey' }, 'أحمر': { fr: 'Rouge', en: 'Red' },
  'أزرق': { fr: 'Bleu', en: 'Blue' }, 'أبيض ثلجي': { fr: 'Blanc nacré', en: 'Pearl white' },
  'رمادي تيتانيوم': { fr: 'Gris titane', en: 'Titanium grey' }, 'أزرق سماوي': { fr: 'Bleu ciel', en: 'Sky blue' },
  'أسود ميتاليك': { fr: 'Noir métallisé', en: 'Metallic black' }, 'أبيض لؤلؤي': { fr: 'Blanc nacré', en: 'Pearl white' },
  'أحمر إمبريال': { fr: 'Rouge impérial', en: 'Imperial red' },
}
export const fuelDisplay = (v, lang = 'ar') => (lang === 'ar' ? v : FUEL_I18N[v]?.[lang] || v)
export const gearDisplay = (v, lang = 'ar') => (lang === 'ar' ? v : GEAR_I18N[v]?.[lang] || v)
export const colorDisplay = (v, lang = 'ar') => (lang === 'ar' ? v : COLOR_I18N[v]?.[lang] || v)

/* ===== الولايات (أسماء فرنسية/إنجليزية الرسمية بنفس الترتيب) ===== */
const WILAYAS_LATIN = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane',
  'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet',
  "El M'Ghair", 'El Meniaa',
]
export function wilayaDisplay(w, lang = 'ar') {
  if (lang === 'ar') return w
  const i = WILAYAS.indexOf(w)
  return i >= 0 ? WILAYAS_LATIN[i] || w : w
}
