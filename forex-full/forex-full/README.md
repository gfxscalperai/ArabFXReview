# FXPro Arabia — دليل الإعداد الكامل

## هيكل المشروع

```
forex-full/
├── public/
│   └── index.html          ← الموقع الكامل
├── api/
│   ├── ai-publish.js       ← API النشر بالذكاء الاصطناعي
│   ├── cron-news.js        ← جلب الأخبار أوتوماتيكياً
│   ├── content.js          ← API قراءة المحتوى
│   └── save-post.js        ← API حفظ المقالات
├── supabase-schema.sql     ← كود قاعدة البيانات
├── vercel.json             ← إعدادات Vercel + Cron
├── package.json
└── README.md
```

---

## خطوات النشر (15 دقيقة فقط)

### 1. إعداد قاعدة البيانات (Supabase)
1. افتح [supabase.com](https://supabase.com) وأنشئ حساباً مجانياً
2. أنشئ مشروعاً جديداً
3. اذهب إلى **SQL Editor** وانسخ محتوى ملف `supabase-schema.sql` وشغّله
4. احفظ هذه القيم من **Settings → API**:
   - `Project URL` → هذا هو `SUPABASE_URL`
   - `service_role` key → هذا هو `SUPABASE_SERVICE_KEY`

### 2. رفع المشروع على GitHub
1. أنشئ مستودعاً جديداً على [github.com](https://github.com)
2. ارفع جميع الملفات (اسحب وأفلت أو استخدم git)
3. تأكد من رفع جميع المجلدات: `public/`, `api/`, وجميع الملفات

### 3. النشر على Vercel
1. افتح [vercel.com](https://vercel.com) وسجّل بحساب GitHub
2. اضغط **"Add New Project"** واختر مستودعك
3. في **Build & Output Settings**: اضبط Output Directory على `public`
4. اضغط **Environment Variables** وأضف:

```
CLAUDE_API_KEY     = sk-ant-api03-...   (من console.anthropic.com)
SUPABASE_URL       = https://xxx.supabase.co
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIs...
CRON_SECRET        = أي_كلمة_سر_عشوائية_مثل_forex2024
```

5. اضغط **Deploy** ✓

---

## كيف يعمل نظام الأخبار الأوتوماتيكي

- كل ساعة، Vercel يشغّل تلقائياً `/api/cron-news`
- يجلب الأخبار من 4 مصادر: ForexLive, FXStreet, Investing.com, DailyFX
- يترجمها ويعيد صياغتها بـ Claude AI
- يحفظها في Supabase وتظهر فوراً في صفحة الأخبار

## كيف يعمل نشر المؤشرات

1. افتح لوحة التحكم في موقعك
2. اختر نوع المحتوى (مؤشر / إكسبيرت / شركة)
3. أدخل رابط MQL5 أو أي رابط
4. اضغط "جلب وصياغة"
5. راجع المقال وعدّله
6. اضغط "نشر الآن"

---

## متغيرات البيئة المطلوبة

| المتغير | الوصف | كيف تحصل عليه |
|---------|-------|--------------|
| `CLAUDE_API_KEY` | مفتاح Anthropic API | console.anthropic.com |
| `SUPABASE_URL` | رابط مشروع Supabase | Settings → API |
| `SUPABASE_SERVICE_KEY` | مفتاح الخدمة | Settings → API → service_role |
| `CRON_SECRET` | كلمة سر للحماية | اخترها أنت |

---

## إضافة مصادر أخبار جديدة

في ملف `api/cron-news.js`، أضف مصدراً جديداً في مصفوفة `RSS_SOURCES`:

```javascript
{
  name: 'اسم المصدر',
  url: 'رابط RSS feed',
  category: 'التصنيف'
}
```

---

## إضافة شركة جديدة

في ملف `public/index.html`، أضف في مصفوفة `BROKERS`:

```javascript
{
  name: 'اسم الشركة',
  short: 'اختصار',
  color: '#لون',
  rating: 4.8,
  stars: '★★★★★',
  badges: [['ميزة 1','bg'], ['ميزة 2','ba']],
  desc: 'وصف الشركة...',
  specs: [{v:'0.0',l:'سبريد'},{v:'1:500',l:'رافعة'},{v:'سريع',l:'سحب'}],
  link: 'رابط الأفلييت الخاص بك'
}
```
