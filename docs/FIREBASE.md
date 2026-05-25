# نشر MailGenie Pro على Firebase

يستخدم المشروع **Firebase App Hosting** (يدعم Next.js + API + NextAuth).

> **مهم:** SQLite لا يعمل على السحابة. تحتاج قاعدة **PostgreSQL** مجانية من [Neon](https://neon.tech).

---

## 1) قاعدة بيانات Neon (5 دقائق)

1. أنشئ مشروعاً على https://neon.tech  
2. انسخ **Connection string** (PostgreSQL)  
3. مثال: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

---

## 2) Firebase CLI

```powershell
npm install -g firebase-tools
firebase login
cd "d:\اضافة ايميل\mailgenie-pro"
```

تأكد أن مشروع Firebase اسمه **`email`** (كما في `.firebaserc`) أو عدّل `.firebaserc`.

---

## 3) تفعيل App Hosting (أول مرة)

### من Console (الأسهل)

1. https://console.firebase.google.com → مشروع **email**  
2. **Build → App Hosting → Get started**  
3. اربط **GitHub** (أو ارفع يدوياً لاحقاً عبر CLI)  
4. Root directory: `.`  
5. Backend ID: `mailgenie-pro` (نفس `firebase.json`)

### أو من الطرفية

```powershell
firebase init apphosting
# اختر مشروع email، backendId: mailgenie-pro
```

---

## 4) الأسرار (Secrets) في Firebase

**App Hosting → mailgenie-pro → Environment / Secrets**

أنشئ الأسرار التالية (نفس القيم من `.env` المحلي):

| Secret | مثال |
|--------|------|
| `AUTH_SECRET` | سلسلة عشوائية طويلة |
| `GOOGLE_CLIENT_ID` | من Google Cloud |
| `GOOGLE_CLIENT_SECRET` | من Google Cloud |
| `DATABASE_URL` | رابط Neon PostgreSQL |
| `ADMIN_EMAIL` | بريدك@gmail.com |
| `OPENAI_API_KEY` | اختياري |

---

## 5) تحديث Google OAuth

في **Google Cloud → Credentials → OAuth client**:

أضف **Authorized redirect URI** بعد أول نشر:

```
https://YOUR-APP-HOSTING-URL/api/auth/callback/google
```

الرابط يظهر في Firebase بعد النشر (مثل):

`https://mailgenie-pro--email.us-central1.hosted.app`

حدّث أيضاً في `apphosting.yaml` متغير `NEXTAUTH_URL` بنفس الرابط.

---

## 6) النشر

### عبر GitHub (موصى به)

ادفع الكود إلى GitHub → App Hosting يبني تلقائياً عند كل push.

### عبر CLI

```powershell
cd "d:\اضافة ايميل\mailgenie-pro"
firebase deploy --only apphosting
```

---

## 7) بعد النشر

- افتح: `https://YOUR-URL/en`  
- سجّل دخول Google  
- جرّب Inbox و Compose  

---

## استكشاف الأخطاء

| المشكلة | الحل |
|---------|------|
| `redirect_uri_mismatch` | أضف رابط الإنتاج في Google OAuth |
| فشل البناء / Prisma | تأكد من `DATABASE_URL` في Secrets (Neon) |
| 500 عند تسجيل الدخول | تحقق من `AUTH_SECRET` و `NEXTAUTH_URL` |
| Access blocked | أضف بريدك في OAuth **Test users** |

---

## التطوير المحلي

يبقى **SQLite** للتطوير على جهازك (`DATABASE_URL="file:./dev.db"`).

النشر على Firebase يستخدم `schema.postgresql.prisma` تلقائياً عبر `scripts/prepare-firebase.mjs`.
