# 🐱 Meow World V4.1 - Setup Guide

**วันที่:** 28 สิงหาคม 2026  
**สถานะ:** พร้อม Deploy บน Vercel

---

## 📋 สรุปสิ่งที่ทำเสร็จแล้ว (End of Day)

### ✅ วันนี้ทำอะไรบ้าง

1. **Commit & Push โค้ดขึ้น GitHub** ✅
   - ลบ `netlify.toml` (ย้ายจาก Netlify ไป Vercel)
   - ลบ `tailwind.config.js`
   - ลบ `lightningcss-linux-x64-gnu` dependency
   - แก้ `next-env.d.ts` import paths

2. **สร้าง Unique Certificate Templates** ✅
   - 6 แบบไม่ซ้ำกัน: Pedigree, Vaccine, Microchip, Adoption, Health, General
   - แต่ละแบบมีสีและสไตล์เฉพาะตัว

3. **สร้าง Flip Card Document Viewer** ✅
   - ด้านหน้า: Digital Certificate Overlay
   - ด้านหลัง: เอกสารจริงต้นฉบับ
   - 3D Flip Animation

4. **Enhance Pet Passport ID** ✅
   - รูปแบบ: `MW-PET-2026-XXXXXXXX`

5. **ปรับปรุง Login Page** ✅
   - แสดง Error Message บนหน้า Login
   - เพิ่ม Debug Log ใน Auth Callback

---

## 🔧 สิ่งที่ต้องทำต่อ (เมื่อกลับมา)

### Step 1: ตั้งค่า Vercel Environment Variables

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจค **Meow World**
3. ไปที่ **Settings** → **Environment Variables**
4. เพิ่ม 2 ตัวนี้:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tnshkncxfzkmmrmbepyb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuc2hrbmN4ZnprbW1ybWJlcHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTQzNjYsImV4cCI6MjA5NzA5MDM2Nn0.MUDH8i3_YX58-inhC2flsyHGLl8VplaGf274XBNPa0o` |

5. เลือก Environment: **Production**
6. กด **Save**

---

### Step 2: Deploy บน Vercel

รันคำสั่งใน terminal:

```bash
vercel --prod
```

หรือถ้าまだไม่ได้ Login:

```bash
vercel login
vercel --prod
```

---

### Step 3: Fix OAuth Google Login

#### แก้ไขใน Google Cloud Console

1. ไปที่ [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. คลิกที่ **OAuth 2.0 Client ID** ของ Meow World
3. แก้ไข **Authorized redirect URIs**:

```
https://tnshkncxfzkmmrmbepyb.supabase.co/auth/v1/callback
```

> ⚠️ **สำคัญ:** ลบ URL อื่นๆ ออก ให้เหลือแค่ตัวนี้

4. กด **Save**

#### ตรวจสอบใน Supabase Dashboard

1. ไปที่ [Supabase Dashboard](https://app.supabase.com) → Project → **Authentication** → **Providers**
2. คลิก **Google**
3. ตรวจสอบว่า **Client ID** และ **Client Secret** ตรงกับที่ Google Cloud Console
4. กด **Save**

---

### Step 4: ทดสอบ

1. ไปที่ `https://your-app.vercel.app/login`
2. คลิก "เข้าสู่ระบบด้วย Google"
3. เลือก Google Account
4. **คาดหวัง:** Redirect กลับหน้า Home สำเร็จ

---

## 🐛 ถ้าเจอ Error

| Error | วิธีแก้ |
|-------|---------|
| `redirect_uri_mismatch` | แก้ Google Cloud Console redirect URI |
| `Invalid code` | ตรวจสอบ Supabase Provider config |
| `No authentication code` | ปัญหา OAuth flow |
| `NEXT_PUBLIC_SUPABASE_URL is not defined` | เพิ่ม ENV บน Vercel |

---

## 📁 ไฟล์สำคัญ

| ไฟล์ | คำอธิบาย |
|------|----------|
| `src/utils/certTemplates.ts` | Certificate templates 6 แบบ |
| `src/components/certificate/CertificateFlipCard.tsx` | Flip Card component |
| `src/components/certificate/CertificateViewerModal.tsx` | ดูใบรับรอง |
| `src/components/passport/PassportView.tsx` | Passport view |
| `src/app/login/page.tsx` | หน้า Login |
| `src/app/auth/callback/route.tsx` | OAuth callback |

---

## 🎯 แผนงานถัดไป (Roadmap 1)

### Phase 1: Deployment & Auth (สัปดาห์นี้)
- [x] ตั้งค่า Vercel ENV
- [x] Deploy บน Vercel
- [ ] Fix OAuth Google Login
- [ ] ทดสอบ Login สำเร็จ

### Phase 2: Passport & Certificate (สัปดาห์หน้า)
- [ ] ทดสอบสร้าง Pet Passport
- [ ] ทดสอบออก Digital Certificate
- [ ] ทดสอบ Flip Card Viewer
- [ ] ทดสอบ Home Mode ครบทุกฟีเจอร์

### Phase 3: Life Journey (สัปดาห์ถัดไป)
- [ ] สร้าง Moment ใหม่
- [ ] ดู Timeline
- [ ] Like & Comment
- [ ] กรองตามหมวดหมู่

---

## 📞 ติดต่อ

- **GitHub:** [Meow World Repository](https://github.com/BombINdyBoy/Meow-World)
- **Vercel:** [Dashboard](https://vercel.com/dashboard)
- **Supabase:** [Dashboard](https://app.supabase.com)

---

## 💡 Tips

1. **รัน `npm run build` ก่อน push เสมอ** เพื่อเช็ค error
2. **อย่า commit `.env.local`** ใช้ `.env.local.example` แทน
3. **รัน `npm run lint`** เพื่อเช็ค code style

---

**สร้างโดย:** Codebuff AI Assistant  
**วันที่:** 28 สิงหาคม 2026  
**เวอร์ชัน:** Meow World V4.1 Heart Edition
