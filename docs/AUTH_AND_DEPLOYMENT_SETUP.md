# Meow World: Auth and Deployment Setup

คู่นี้อธิบายการตั้งค่า Supabase Auth และการ deploy Meow World V4.1 โดยไม่ใส่ secret จริงลงใน repository

## 1. สิ่งที่ต้องเตรียม

- GitHub repository ของโปรเจกต์
- Supabase project
- Google Cloud project สำหรับ Google Sign-In
- Meta developer app สำหรับ Facebook Login
- บัญชีนักพัฒนา LINE และ TikTok หากต้องการเปิด provider เหล่านี้
- บัญชี Vercel สำหรับ deploy

ค่าใช้จ่ายที่แนะนำสำหรับการเริ่มต้นคือ Supabase Free และ Vercel Hobby แต่ quota, ข้อจำกัด และนโยบายของผู้ให้บริการอาจเปลี่ยนแปลงได้ ควรตรวจสอบหน้าราคาและเงื่อนไขล่าสุดก่อนเปิดใช้งานจริง

## 2. ตั้งค่า Supabase project

1. เข้า [Supabase Dashboard](https://supabase.com/dashboard) แล้วสร้าง project
2. จดค่า `Project URL` และ `anon` key จาก `Project Settings > API`
3. สร้างไฟล์ `.env.local` ที่ root ของโปรเจกต์:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

4. ห้ามใช้ `service_role` key ใน browser, client component หรือไฟล์ที่ commit ขึ้น GitHub
5. ตรวจว่า `.env.local` อยู่ใน `.gitignore` และไม่ปรากฏใน `git status`
6. ตั้งค่า URL ใน `Authentication > URL Configuration`:
   - Local: `http://localhost:3000`
   - Production: `https://YOUR-VERCEL-DOMAIN.vercel.app`
   - เพิ่ม custom domain ใน Additional Redirect URLs หากใช้ domain ของตัวเอง

Supabase OAuth callback กลางคือ:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

ใช้ URL นี้ในหน้าตั้งค่าของ OAuth provider ที่รองรับ Supabase โดยตรง

## 3. Email and password Auth

1. ไปที่ `Authentication > Providers > Email`
2. เปิด Email provider
3. เลือกว่าจะเปิดหรือปิด Confirm email ตามสภาพแวดล้อม
4. ตั้งค่า SMTP สำหรับ production เพื่อให้ส่งอีเมลยืนยันและ reset password ได้จริง
5. ทดสอบ `Sign up`, ตรวจอีเมล, แล้วทดสอบ `Log in` และ `Sign out`

โปรเจกต์นี้สร้าง row ใน `public.profiles` จาก trigger เมื่อมี user ใหม่ใน `auth.users` จึงควรตรวจสอบ trigger หลัง apply migration

## 4. Google Sign-In

1. เปิด [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างหรือเลือก project แล้วตั้งค่า OAuth consent screen
3. เพิ่ม test users หากแอพยังอยู่ในสถานะ Testing
4. ไปที่ `APIs & Services > Credentials > Create Credentials > OAuth client ID`
5. เลือก `Web application`
6. เพิ่ม Authorized redirect URI:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

7. คัดลอก Client ID และ Client Secret
8. ใน Supabase ไปที่ `Authentication > Providers > Google`
9. เปิด provider แล้วกรอก Client ID และ Client Secret
10. บันทึก แล้วทดสอบ redirect กลับมายัง local และ production URL

อย่าใช้ client secret เป็น `NEXT_PUBLIC_` variable และอย่า commit secret ลง GitHub

## 5. Facebook Login

1. เปิด [Meta for Developers](https://developers.facebook.com/apps/)
2. สร้าง app แล้วเพิ่มผลิตภัณฑ์ Facebook Login
3. ตั้งค่า Valid OAuth Redirect URIs เป็น:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

4. ใส่ App Domains ให้ตรงกับ domain ที่ใช้จริง
5. ตรวจ Privacy Policy URL และเว็บไซต์ของแอพ หาก Meta ขอข้อมูลนี้
6. คัดลอก App ID และ App Secret
7. ใน Supabase ไปที่ `Authentication > Providers > Facebook`
8. เปิด provider แล้วใส่ App ID และ App Secret
9. บันทึกและทดสอบ login ทั้ง local และ production

ระหว่าง development แอพ Meta อาจรับเฉพาะบัญชีที่ถูกเพิ่มเป็น tester/developer เท่านั้น

## 6. LINE และ TikTok: ข้อควรรู้

Supabase ไม่ได้มี native provider สำหรับทุกผู้ให้บริการในทุกช่วงเวลา โดยเฉพาะ LINE และ TikTok ควรตรวจรายการ provider ที่มีอยู่จริงใน `Authentication > Providers` ของ project ก่อนเริ่มตั้งค่า อย่าวาง Client Secret ของสองบริการนี้ไว้ใน Next.js client

### ทางเลือกที่แนะนำ

มีสองแนวทางที่ปลอดภัย:

1. ใช้ identity broker เช่น Auth0, WorkOS หรือบริการที่รองรับ LINE/TikTok แล้วเชื่อมผลลัพธ์เข้ากับ Supabase ด้วย provider ที่รองรับ หรือทำ token exchange ฝั่ง server
2. สร้าง OAuth route ฝั่ง serverของ Meow World เอง โดยเก็บ secret ใน server environment, ตรวจ `state` และ PKCE, แลก authorization code ฝั่ง server แล้วเชื่อม user กับ Supabase

อย่าใช้การใส่ URL ของ LINE/TikTok ลงในปุ่มแล้วถือว่าเสร็จ เพราะต้องมี callback handling, การตรวจ state/PKCE, การ map identity และการจัดการ refresh/revoke token

### LINE

1. สร้าง provider ใน [LINE Developers Console](https://developers.line.biz/console/)
2. เปิด LINE Login และกำหนด callback URL ตามระบบที่เลือก
3. ใช้ OIDC เฉพาะเมื่อ broker หรือ implementation ที่เลือกประกาศว่ารองรับ LINE OIDC
4. เก็บ Channel secret ฝั่ง server เท่านั้น
5. ทดสอบกรณีผู้ใช้ยกเลิก consent, callback ซ้ำ และ account ที่ใช้อีเมลเดียวกัน

### TikTok

1. สร้าง app ใน [TikTok for Developers](https://developers.tiktok.com/)
2. ขอ product/scopes ที่จำเป็นและตั้ง Redirect URI ตาม OAuth app ของ TikTok
3. ตรวจว่า flow ที่เลือกคืนข้อมูล identity ที่เพียงพอสำหรับผูกกับ Supabase user
4. เก็บ Client Secret ฝั่ง server และใช้ authorization code + PKCE หาก flow รองรับ
5. ทดสอบ consent denied, scope ไม่ครบ, code หมดอายุ และการยกเลิกการเชื่อมบัญชี

สำหรับ repository ปัจจุบัน UI ยังมีเฉพาะ email/password; Google, Facebook, LINE และ TikTok ยังต้องเพิ่มปุ่มและ callback flow ในโค้ดก่อนจึงจะใช้งานจริงได้

## 7. Apply database migration

ใน Supabase Dashboard เปิด `SQL Editor` แล้วรัน migration ตามลำดับ:

1. `supabase/migrations/20260826000000_init_schema.sql`
2. `supabase/migrations/20260826100000_home_shared_home_family.sql`

migration ที่สองเป็น full reset ของ application tables ใน `public` แต่ไม่ลบผู้ใช้ใน Supabase Auth ควร backup ก่อนรันกับ project ที่มีข้อมูลจริง

ตรวจสอบหลังรัน:

- ตาราง `profiles`, `pets`, `life_journey_events`, `families`, `family_members`, `pet_shares` มีอยู่
- ทุกตารางเปิด RLS
- signup สร้าง profile ได้
- owner เห็นข้อมูลของตัวเองเท่านั้น
- viewer อ่าน shared pet ได้แต่แก้ไขไม่ได้
- ยกเลิกสมาชิกหรือ share แล้ว request ถัดไปไม่เห็นข้อมูลนั้น

## 8. Deploy ฟรีด้วย Vercel

Vercel เหมาะกับ Next.js repository นี้และมี Hobby plan สำหรับการเริ่มต้นส่วนตัว

1. Push repository ไป GitHub
2. เปิด [Vercel](https://vercel.com/) แล้วเลือก `Add New > Project`
3. Import `BombINdyBoy/Meow-World`
4. ให้ Vercel ตรวจเป็น Next.js project และใช้คำสั่งมาตรฐานของ `package.json`
5. ไปที่ `Settings > Environment Variables` แล้วเพิ่ม:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. เปิดใช้กับ `Production`, `Preview` และ `Development` ตามต้องการ
7. Deploy
8. นำ production URL ไปเพิ่มใน Supabase `URL Configuration`
9. นำ callback URL ของ Supabase ไปตรวจใน Google/Meta หรือ broker ที่ใช้
10. ทดสอบ signup, login, logout, refresh หน้า และ deep link ทุก environment

ทุกครั้งที่ push branch ที่เชื่อมกับ Vercel ระบบจะสร้าง deployment ใหม่อัตโนมัติ ควรใช้ Preview deployment ทดสอบก่อน Production

ทางเลือกอื่นคือ Cloudflare Pages/Workers แต่ Next.js server features และ Supabase middleware อาจต้องใช้ adapter หรือการตั้งค่าเพิ่ม ดังนั้น Vercel เป็นตัวเลือกเริ่มต้นที่ friction ต่ำกว่า

## 9. คำสั่งตรวจสอบในเครื่อง

```bash
npm install
npm run lint
npm run build
npm run dev
```

เปิด `http://localhost:3000` แล้วทดสอบตาม checklist:

- สมัครบัญชีและยืนยันอีเมลตามค่าที่ตั้งไว้
- login กลับเข้าบัญชีเดิมหลัง refresh
- สร้าง Passport และ Life Journey event
- สร้าง Family และตรวจ role
- share Passport แล้วทดสอบด้วยบัญชีสมาชิกอีกบัญชี
- ตรวจว่า viewer แก้ไขข้อมูลไม่ได้
- sign out แล้วตรวจว่า protected data ไม่แสดง

## 10. Security checklist ก่อนใช้งานจริง

- ไม่ commit `.env.local`, client secret หรือ service role key
- ใช้ HTTPS ใน production
- ตั้ง Site URL และ Redirect URLs ให้แคบที่สุด ไม่ใช้ wildcard โดยไม่จำเป็น
- เปิด email confirmation และตั้ง SMTP เมื่อพร้อม
- ตรวจ RLS ด้วย owner, editor และ viewer คนละบัญชี
- สำรองฐานข้อมูลก่อน migration ที่มี `drop table`
- ตรวจ logs ของ Supabase และ Vercel หลัง deploy
- หมุน key ทันทีหากเคยเผยแพร่ใน chat, issue, log หรือ repository

## เอกสารอ้างอิง

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Google provider](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Facebook provider](https://supabase.com/docs/guides/auth/social-login/auth-facebook)
- [Supabase OAuth providers](https://supabase.com/docs/guides/auth/social-login)
- [Vercel Git deployment](https://vercel.com/docs/deployments/git)
