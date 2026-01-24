# ArabFXReview

منصة عربية لتقييم شركات الفوركس، عرض الأخبار، وإدارة روابط الإحالة.

تشغيل محلي:

1. npm install
2. npm run dev

ملاحظات:
- الشعارات الافتراضية مضافة الآن في `public/brokers/` بصيغة SVG عالية الدقة (`*.svg`). يمكنك استبدالها بشعارات رسمية بصيغة WebP/PNG بحجم موصى به **560x280** بامتداد `.webp` أو `.png` للحفاظ على جودة العرض.

نشر إلى GitHub (باختصار):

1. git init
2. git checkout -b feature/news-ads-integration
3. git add . && git commit -m "chore: scaffold project + news/ads integration"
4. git remote add origin https://github.com/<your-username>/ArabFXReview.git
5. git push -u origin feature/news-ads-integration

ثم افتح PR من `feature/news-ads-integration` إلى `main` عبر: https://github.com/<your-username>/ArabFXReview/compare/main...feature/news-ads-integration?expand=1
