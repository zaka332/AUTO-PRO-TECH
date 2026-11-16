// سيارات تجريبية معروضة للبيع — أقل من 3 سنوات (2024-2026)
// الصور: صور حقيقية للسيارات مخزنة محلياً في public/img/cars

export const carImg = (file) => `/img/cars/${file}.jpg`

export const seedCars = [
  {
    name: 'رينو كليو 5',
    brand: 'رينو', model: 'كليو 5', year: 2025,
    price: 2850000, mileage: 12000, fuel: 'بنزين', transmission: 'مانيوال', color: 'أبيض ثلجي',
    description: 'كليو 5 الجديدة كلياً بحالة الوكالة، طراز Evolution بمحرك 1.0 TCe 90 حصان. أول يد، الوثائق كاملة، الكيلومتراج حقيقي وموثق. مقبولة للمعاينة في معرضنا بالجزائر العاصمة.',
    featured: true, image: carImg('clio'), imgSeed: 0,
  },
  {
    name: 'بيجو 208 Active',
    brand: 'بيجو', model: '208', year: 2024,
    price: 2720000, mileage: 19000, fuel: 'بنزين', transmission: 'مانيوال', color: 'رمادي تيتانيوم',
    description: 'بيجو 208 طراز Active بمحرك 1.2 PureTech، حالة ممتازة بدون أي خدوش. صيانة وكالة كاملة بالفاتورة، إطارات جديدة. سيارة اقتصادية ومثالية للمدينة.',
    featured: true, image: carImg('peugeot-208'), imgSeed: 1,
  },
  {
    name: 'داسيا سانديرو 3',
    brand: 'داسيا', model: 'سانديرو 3', year: 2025,
    price: 2390000, mileage: 8500, fuel: 'بنزين', transmission: 'مانيوال', color: 'أزرق سماوي',
    description: 'سانديرو 3 الجديدة طراز Expression محرك 1.0 SCe 65 حصان. سيارة أول يد لم تخرج من الجزائر، الكيلومتراج بضمان المعاينة. ضمان الوكالة ساري.',
    featured: true, image: carImg('sandero'), imgSeed: 2,
  },
  {
    name: 'هيونداي أكسنت أوتوماتيك',
    brand: 'هيونداي', model: 'أكسنت', year: 2024,
    price: 3050000, mileage: 15000, fuel: 'بنزين', transmission: 'أوتوماتيك', color: 'أسود ميتاليك',
    description: 'أكسنت 2024 علبة أوتوماتيكية كاملة التجهيز (Full Option): شاشة لمس، كاميرا رجوع، كروم ميتاليك. حالة الوكالة، استهلاك وقود منخفض جداً.',
    image: carImg('accent'), imgSeed: 3,
  },
  {
    name: 'شيري تيجو 4 برو',
    brand: 'شيري', model: 'تيجو 4 برو', year: 2025,
    price: 3590000, mileage: 9000, fuel: 'بنزين', transmission: 'أوتوماتيك', color: 'أبيض لؤلؤي',
    description: 'تيجو 4 برو SUV موديل 2025، تجهيز فاخر: مقاعد جلد، سقف بانورامي، شاشتان رقميتان. ضمان الوكالة 5 سنوات ساري وقابل للتحويل.',
    image: carImg('tiggo'), imgSeed: 4,
  },
  {
    name: 'سيات إبيزا FR',
    brand: 'سيات', model: 'إبيزا', year: 2024,
    price: 3150000, mileage: 21000, fuel: 'بنزين', transmission: 'مانيوال', color: 'أحمر إمبريال',
    description: 'إبيزا FR خط رياضي بمحرك 1.0 TSI 110 حصان. حالة ممتازة، فرامل ومساعدات جديدة، الوثائق كاملة وجاهزة للبيع الفوري.',
    image: carImg('ibiza'), imgSeed: 5,
  },
].map((c, i) => ({
  ...c,
  id: `car-${i + 1}`,
  active: true,
  createdAt: Date.now() - (i + 1) * 86400000,
}))
