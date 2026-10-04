# موقع الاقتراحات والشكاوى — المتوسطة التاسعة والستون + المتوسطة الثانية لتحفيظ القرآن

## خطوات التشغيل
1. إنشاء Google Sheet جديد > Extensions > Apps Script، ولصق `apps-script.gs`.
2. تغيير `ACCESS_KEY` و`ALERT_EMAIL` داخل الملف.
3. Deploy > New deployment > Web app (Execute as: Me، Who has access: Anyone) ونسخ الرابط.
4. وضع الرابط مكان `ضع_رابط_Apps_Script_هنا` في `index.html` و`dashboard.html`.
5. رفع الملفات إلى مستودع GitHub جديد وتفعيل GitHub Pages.

## الملفات
`index.html` (النموذج) · `dashboard.html` (لوحة التوجيه) · `style.css` (نفس ملف الغياب) · `theme.css` (الهوية البنفسجية) · `moe-logo.png` · `apps-script.gs`
