ملف التعليمات لتشغيل مشروع B2B (واجهة أمامية + خلفية)

الهدف
- تشغيل الواجهة الأمامية (Vite) والواجهة الخلفية (Flask) بطريقة قابلة للتطوير وخالية من أخطاء الربط.

الخيارات
1) تطوير محلي (dev): تشغيل الخادمين بشكل منفصل. يستخدم هذا نمط HMR للواجهة الأمامية.
2) إنتاج محلي (prod): بناء الواجهة الأمامية ونشر الملفات في مجلد `business-platform-api/src/static` ليخدمها Flask مباشرة.

الأوامر (PowerShell - Windows)

A) تشغيل واجهة أمامية (dev)

```powershell
cd .\enhanced-business-platform
pnpm install
pnpm dev
```

الواجهة ستعمل عادة على http://localhost:5173 (راجع المخرجات).

B) تشغيل واجهة خلفية (Flask)

```powershell
cd .\business-platform-api
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
python src\main.py
```

الخادم الخلفي يعمل على http://0.0.0.0:5000

ملاحظات الربط في أثناء التطوير
- الملف `business-platform-api/src/main.py` قد فعّل CORS مع origins="*" لذا طلبات من واجهة Vite ستنجح بدون إعداد إضافي. إذا أردت تقييد النطاق في الإنتاج، عدّل `origins` إلى نطاق الواجهة فقط.

C) إنتاج محلي — بناء الواجهة الأمامية وتوزيعها على مجلد static الخاص بالواجهة الخلفية

```powershell
# من مجلد المشروع الجذري
# سكربت جاهز يقوم بالتثبيت والبناء والنسخ
.
\scripts\build_and_deploy_frontend_to_backend.ps1

# ثم شغّل الخادم الخلفي كما في القسم B أعلاه
```

ماذا فعلت لك
- أنشأت سكربت PowerShell: `scripts/build_and_deploy_frontend_to_backend.ps1` لبناء الواجهة ونسخها إلى `business-platform-api/src/static`.
- أضفت ملف `DEVELOPMENT.md` يشرح أوامر التشغيل بالضبط.

الخطوات التالية الموصى بها
- شغّل أوامر التطوير أعلاه في نافذتين: واحدة لـ `pnpm dev` وأخرى للخادم Flask.
- لاختبار إنتاج محلي، نفّذ السكربت ثم شغّل Flask؛ افتح http://localhost:5000

إذا تريد، أقدر:
- تشغيل فحص سريع هنا للتأكد من أن الملفات موجودة وبنية المسارات صحيحة.
- إضافة سكربت PowerShell آخر يفتح نافذتي طرفية تلقائياً ويدير الخادمين.
