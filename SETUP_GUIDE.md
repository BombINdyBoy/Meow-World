# 🐱 Meow World V4.1 - Setup Guide

**วันที่:** 30 สิงหาคม 2026  
**สถานะ:** ✅ Login สำเร็จแล้ว | Deploy บน Vercel

---

## 📋 สรุปสิ่งที่ทำเสร็จแล้ว

### Phase 1: Foundation & Features (28 ส.ค.)
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

### Phase 2: Deployment & Auth (30 ส.ค.)
1. **แก้ Build Error - Supabase Prerender** ✅
   - ย้าย `createClient()` ออกจาก top-level component
   - สร้าง Supabase client ภายใน `useEffect` และ event handlers เท่านั้น
   - แก้ `QRInviteModal` prop mismatch (`createdBy` → ลบออก)

2. **แก้ OAuth Google Login** ✅
   - ตั้งค่า Google Cloud Console Authorized redirect URI:
     ```
     https://eqemlaqgzzjilshrhgdo.supabase.co/auth/v1/callback
     ```
   - อัปเดต Supabase URL Configuration:
     - Site URL: `https://meow-world-heart-edition.vercel.app`
     - Redirect URLs: `https://meow-world-heart-edition.vercel.app/auth/callback`
   - แก้ `auth/callback/route.tsx` - จัดการ `NEXT_REDIRECT` error ที่ `catch` block ดักจับผิด

3. **ย้าย Deploy ไป Vercel** ✅
   - Project: `meow-world-heart-edition`
   - Login สำเร็จ → สร้าง profile ใน Supabase แล้ว

---

## 🔗 OAuth Flow (ที่ทำงานแล้ว)

```
User → Login Page → Google OAuth → Supabase Callback → App Callback (/auth/callback) → Home (/)
```

| Step | URL |
|------|-----|
| Google Redirect URI | `https://eqemlaqgzzjilshrhgdo.supabase.co/auth/v1/callback` |
| Supabase Site URL | `https://meow-world-heart-edition.vercel.app` |
| App Callback | `https://meow-world-heart-edition.vercel.app/auth/callback` |

---

## 🐛 ปัญหาที่แก้แล้ว

| ปัญหา | สาเหตุ | วิธีแก้ |
|-------|--------|---------|
| `prerender error: URL and API key required` | `createClient()` ถูกเรียกตอน static generation | ย้ายเข้า `useEffect` |
| `redirect_uri_mismatch` | Google Cloud Console URI ไม่ตรง Supabase | ตั้งค่า URI ให้ตรง |
| Site not found (Netlify) | Supabase Site URL ชี้ไป Netlify เก่า | เปลี่ยนเป็น Vercel URL |
| `Unexpected error occurred` | `catch` block ดักจับ `NEXT_REDIRECT` ผิด | เช็ค `error.digest` ก่อน re-throw |

---

## 📁 ไฟล์สำคัญ

| ไฟล์ | คำอธิบาย |
|------|----------|
| `src/app/page.tsx` | หน้าแรก (Home Mode) - แก้ prerender issue |
| `src/app/login/page.tsx` | หน้า Login พร้อม Google OAuth |
| `src/app/auth/callback/route.tsx` | OAuth callback - แก้ NEXT_REDIRECT issue |
| `src/utils/supabase/client.ts` | Supabase Browser client |
| `src/utils/supabase/server.ts` | Supabase Server client |
| `src/utils/certTemplates.ts` | Certificate templates 6 แบบ |
| `src/components/certificate/CertificateFlipCard.tsx` | Flip Card component |
| `src/components/certificate/CertificateViewerModal.tsx` | ดูใบรับรอง |
| `src/components/passport/PassportView.tsx` | Passport view |

---

## 🎯 สิ่งที่ต้องทำต่อ

### Phase 3: ทดสอบ Full Flow
- [ ] ทดสอบ Login สำเร็จ → Home แสดงผลถูกต้อง
- [ ] ตรวจสอบว่าสร้างบ้านอัตโนมัติ (First Time User)
- [ ] เพิ่มสัตว์เลี้ยงตัวแรก (สร้าง Pet Passport)
- [ ] บันทึก Life Journey เหตุการณ์แรก
- [ ] ทดสอบ Flip Card Certificate Viewer
- [ ] ทดสอบ QR Invite Modal
- [ ] ทดสอบ Family Members Modal

### Phase 4: Deploy & Polish
- [ ] Login Vercel แล้ว run `vercel --prod`
- [ ] ตรวจสอบ error logs บน Vercel
- [ ] ทดสอบ Mobile responsiveness
- [ ] ปรับปรุง Loading states

### Phase 5: ฟีเจอร์เพิ่มเติม
- [ ] Life Journey - สร้าง/ดู/แก้ไข/ลบ เหตุการณ์
- [ ] Timeline sorting และ empty/loading/error states
- [ ] RLS verification กับ owner และ authenticated user ต่างกัน
- [ ] Dynamic QR Token
- [ ] Notification ที่มีคุณค่า

---

## 📞 ติดต่อ

- **GitHub:** [Meow World Repository](https://github.com/BombINdyBoy/Meow-World)
- **Vercel:** [Dashboard](https://vercel.com/dashboard)
- **Supabase:** [Dashboard](https://app.supabase.com)
- **App URL:** https://meow-world-heart-edition.vercel.app

---

## 💡 Tips

1. **รัน `npm run build` ก่อน push เสมอ** เพื่อเช็ค error
2. **อย่า commit `.env.local`** ใช้ `.env.local.example` แทน
3. **รัน `npm run lint`** เพื่อเช็ค code style
4. **`createClient()` ต้องอยู่ใน `useEffect`** ใน Next.js 16 เพื่อหลีกเลี่ยง prerender error

---

**สร้างโดย:** Codebuff AI Assistant  
**อัปเดตล่าสุด:** 30 สิงหาคม 2026  
**เวอร์ชัน:** Meow World V4.1 Heart Edition
