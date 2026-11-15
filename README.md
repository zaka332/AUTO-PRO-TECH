# ⚙️ AutoProTech — قطع غيار أصلية وسيارات للبيع

متجر إلكتروني كامل:
- 🔧 **قطع غيار أصلية للسيارات الفرنسية** (رينو، بيجو، ستروين، داسيا) وكل الماركات الأخرى — **القديمة والحديثة (2005–2026)**
- 🚗 **قسم بيع السيارات** الأقل من 3 سنوات (موديلات 2024–2026) — معاينة والاستفسار عبر واتساب

مبني بـ:

- ⚛️ **React + Vite** — واجهة عربية RTL سريعة
- 🔥 **Firebase** — Firestore (المنتجات والطلبات) + Authentication (لوحة التحكم) + Storage (الصور) + Hosting (النشر)
- 🐙 **GitHub + GitHub Actions** — رفع الكود والنشر التلقائي عند كل تحديث
- 📲 **WhatsApp Business** — تأكيد الطلبات والاستفسارات عبر واتساب مباشرة
- 📘 **Meta Business** — Facebook Pixel لتتبع الطلبات + تصدير كتالوج CSV لفيسبوك/إنستغرام شوب
- 💵 الدفع **عند الاستلام** مع توصيل للمنزل/مكتب لكل ولايات الوطن (58 ولاية)

---

## 🚀 التشغيل السريع (وضع العرض التجريبي)

المتجر يعمل فوراً حتى بدون ضبط Firebase — ببيانات تجريبية:

```bash
npm install
npm run dev
```

ثم افتح http://localhost:5173

> 🧪 في الوضع التجريبي: المنتجات التجريبية تظهر تلقائياً، الطلبات تُحفظ محلياً في المتصفح،
> ولوحة التحكم تقبل أي بريد/كلمة مرور. عند ضبط Firebase يتحول كل شيء للوضع الحقيقي.

---

## 🔥 ضبط Firebase (خطوات مفصلة)

### 1. إنشاء المشروع
1. افتح [console.firebase.google.com](https://console.firebase.google.com) وأنشئ مشروعاً جديداً باسم `auto-pro-tech`
2. أنشئ داخل المشروع **تطبيق ويب (Web App)** من أيقونة `</>` وسيمّه `AutoProTech Web`

### 2. نسخ المفاتيح
من **Project Settings ← Your apps ← Config** انسخ القيم إلى ملف `.env` (أنشئه بنسخ `.env.example`):

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=auto-pro-tech.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=auto-pro-tech
VITE_FIREBASE_STORAGE_BUCKET=auto-pro-tech.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
VITE_FIREBASE_APP_ID=1:123...:web:abc...
```

### 3. تفعيل الخدمات
| الخدمة | أين | الإعداد |
|---|---|---|
| **Firestore** | Build ← Firestore Database | Create database ← Production mode ← الموقع `eur3` (أوروبا) |
| **Authentication** | Build ← Authentication | Sign-in method ← فعّل **Email/Password** |
| **Storage** | Build ← Storage | Get started |

### 4. إنشاء حساب المدير
- Build ← Authentication ← Users ← **Add user**
- أدخل بريدك (مثلاً `zaka@autoprotech.dz`) وكلمة مرور قوية
- ضع نفس البريد في `.env` → `VITE_ADMIN_EMAIL=...`
- **استبدل** `ADMIN_EMAIL@EXAMPLE.COM` في `firestore.rules` و `storage.rules` بنفس البريد

### 5. نشر قواعد الأمان والفهارس
```bash
npm install -g firebase-tools
firebase login
firebase use --add          # اختر مشروعك
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 6. تحميل المنتجات التجريبية (اختياري)
بعد الضبط: لوحة التحكم ← الإعدادات ← **«تحميل منتجات تجريبية»** ثم عدّلها أو احذفها وأضف منتجاتك.
سيارات القسم التجريبي (6 سيارات) تظهر تلقائياً في وضع العرض — أضف سياراتك الحقيقية من لوحة التحكم ← السيارات.

---

## 📲 ضبط WhatsApp Business

1. حمّل تطبيق [WhatsApp Business](https://www.whatsapp.com/business) على رقم المتجر
2. فعّل ملف الشركة (الاسم، الشعار، الوصف، العنوان، الساعات)
3. ضع الرقم بالصيغة الدولية في `.env` → `VITE_WHATSAPP_NUMBER=213xxxxxxxxx` (بدون + وأصفار)
4. عند كل طلب جديد يُفتح واتساب برسالة جاهزة فيها تفاصيل الطلب كاملة — أو من لوحة التحكم ← الطلبات

---

## 📘 ضبط Meta Business

### Facebook Pixel (تتبع الزيارات والطلبات)
1. افتح [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Connect Data ← Web ← Facebook Pixel ← سمّه `AutoProTech`
3. انسخ **Pixel ID** (رقم 15-16 خانة) وضعه في `.env` → `VITE_FB_PIXEL_ID=...`
4. المتجر يرسل تلقائياً: PageView، ViewContent، AddToCart، InitiateCheckout، Purchase

### كتالوج فيسبوك/إنستغرام شوب
1. افتح [Commerce Manager](https://business.facebook.com/commerce) ← Create catalog ← نوع "قطع غيار"
2. لوحة التحكم ← الإعدادات ← **«تصدير كتالوج فيسبوك CSV»**
3. في Commerce Manager: Catalog ← Items ← **Bulk upload** ← ارفع ملف CSV
4. أرسل المتجر للمراجعة من Meta، واربط الكتالوج بحسابك في Instagram Shopping / Facebook Shop

---

## 🐙 الرفع إلى GitHub والنشر التلقائي

### 1. رفع الكود
```bash
git init
git add .
git commit -m "🚀 إطلاق متجر AutoProTech"
git branch -M main
git remote add origin https://github.com/zaka332/AUTO-PRO-TECH.git
git push -u origin main
```

### 2. إضافة الأسرار في GitHub
من إعدادات المستودع: **Settings ← Secrets and variables ← Actions ← New repository secret**

| السر | القيمة |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Console ← Project Settings ← Service accounts ← **Generate new private key** ← الصق محتوى JSON كاملاً |
| `FIREBASE_PROJECT_ID` | `auto-pro-tech` |
| `VITE_FIREBASE_API_KEY` (وسائر مفاتيح VITE_*) | نفس قيم ملف `.env` |

### 3. النشر
- **تلقائي**: كل `git push` إلى `main` يشغّل النشر عبر `.github/workflows/firebase-deploy.yml`
- **يدوي** من جهازك: `npm run build` ثم `firebase deploy --only hosting`
- رابط متجرك: `https://YOUR_PROJECT.web.app` (يمكن ربط دومين خاص من Hosting ← Add custom domain)

---

## 🗂️ هيكل المشروع

```
├── .github/workflows/     # النشر التلقائي على Firebase Hosting
├── public/                # الأيقونات و robots
├── src/
│   ├── components/        # Header, Footer, سلة، بطاقة منتج، بطاقة سيارة، اختيار سيارة، واتساب عائم
│   ├── context/           # سلة المشتريات (CartContext)
│   ├── data/              # الفئات، الماركات، الولايات 58، منتجات وسيارات تجريبية
│   ├── lib/               # db (Firebase/عرض)، واتساب، Pixel، تنسيق أسعار
│   ├── pages/             # الرئيسية، القطع، السيارات للبيع، الدفع، لوحة التحكم
│   ├── firebase.js        # تهيئة Firebase + كشف وضع العرض
│   └── index.css          # التنسيق الكامل RTL
├── firestore.rules        # قواعد أمان قاعدة البيانات (products + cars + orders + settings)
├── storage.rules          # قواعد أمان التخزين (صور المنتجات والسيارات)
└── firebase.json          # إعداد Hosting
```

## 🚗 قسم بيع السيارات (أقل من 3 سنوات)

- مجموعة `cars` في Firestore — كل سيارة: الماركة، الطراز، السنة (2024–2026)، السعر، الكيلومتراج، الوقود، ناقل الحركة، اللون، الصورة، الوصف
- إدارة كاملة من لوحة التحكم ← **السيارات** (إضافة/تعديل/حذف + إعلان مميز في الرئيسية)
- الزائر يستفسر عبر واتساب برسالة جاهزة فيها مواصفات السيارة — البيع يتم بالمعاينة والتفاوض

## 🔐 ملاحظات أمنية مهمة

- ملف `.env` **مستثنى من Git** (في `.gitignore`) — لا ترفعه أبداً
- مفاتيح Firebase للويب ليست سرية بطبيعتها، الحماية الفعلية في **قواعد الأمان** المنشورة أعلاه
- الطلبات: يمكن للزوار *إنشاء* طلب فقط، وقراءتها/تعديلها للمدير حصراً
- الصور: رفعها محصور بالمدير وبحجم أقصى 5MB

## 🛠️ أوامر مفيدة

```bash
npm run dev        # تشغيل محلي
npm run build      # بناء للنشر
npm run preview    # معاينة نسخة البناء
firebase deploy --only hosting    # نشر يدوي
```

---

صُنع بـ ❤️ للسوق الجزائري — **AUTO-PRO-TECH**
