# คู่มือการตั้งค่า Social Login

คู่มือนี้ใช้สำหรับตั้งค่า Supabase Auth กับ Google, Facebook, LINE และ TikTok ภายหลัง
โดยไม่ต้องเก็บ client secret ไว้ใน Git หรือในโค้ดฝั่ง browser

## ภาพรวม

แอปใช้ Supabase Auth เป็นศูนย์กลาง ผู้ใช้จะต้องผ่าน provider login ก่อนจึงจะได้ Supabase session และข้อมูล Passport/ Life Journey จะถูกผูกกับ `auth.users.id`

ลำดับการตั้งค่าทั่วไป:

1. สร้าง OAuth app ใน provider console
2. ตั้งค่า callback URL ของ Supabase
3. คัดลอก Client ID และ Client Secret เข้า Supabase Dashboard
4. ตั้งค่า Site URL และ Redirect URLs
5. เพิ่มปุ่ม OAuth ในแอปด้วย `signInWithOAuth`
6. ทดสอบ login, logout, session persistence และ RLS

## ค่าที่ต้องรู้ก่อนเริ่ม

### Supabase callback URL

ใช้ URL นี้เป็น OAuth redirect/callback URL ของทุก provider:

```text
https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

ตัวอย่าง project ref ของโปรเจกต์นี้อยู่ใน URL Supabase แต่ให้คัดลอกจาก Dashboard เพื่อป้องกันการตั้งค่าผิด

### Local redirect URL

สำหรับ local development ให้ตั้งค่าใน Supabase Dashboard ที่:

`Authentication -> URL Configuration -> Redirect URLs`

เพิ่ม:

```text
http://localhost:3000/auth/callback
http://127.0.0.1:3000/auth/callback
```

สำหรับ production ให้เพิ่ม domain จริง เช่น:

```text
https://your-domain.example/auth/callback
```

อย่าใช้ wildcard กว้าง ๆ ใน production

### Environment variables

ไฟล์ `.env.local` ต้องมีค่า public URL และ public/anon key เท่านั้น:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_OR_PUBLISHABLE_KEY>
```

ห้ามใส่ค่าเหล่านี้ใน browser หรือ commit:

- OAuth Client Secret
- Supabase `service_role` key
- private key หรือ signing secret

## ตั้งค่า Supabase URL

ใน Supabase Dashboard:

1. ไปที่ `Authentication -> URL Configuration`
2. ตั้ง `Site URL` เป็น URL ของแอป production
3. เพิ่ม local และ production callback ใน `Redirect URLs`
4. ไปที่ `Authentication -> Providers`
5. เปิด provider ที่ต้องการ
6. วาง Client ID และ Client Secret
7. บันทึกการตั้งค่า

## 1. Google Login

### สร้าง OAuth Client

1. เปิด Google Cloud Console
2. สร้างหรือเลือก project
3. เปิดใช้งาน OAuth consent screen
4. ตั้งค่า application name, support email และ developer contact
5. สร้าง `OAuth Client ID` ประเภท `Web application`
6. เพิ่ม Authorized redirect URI เป็น:

```text
https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

7. คัดลอก Client ID และ Client Secret

ถ้าแอปอยู่ในสถานะ testing ให้เพิ่มอีเมลผู้ทดสอบใน Test users

### ตั้งค่าใน Supabase

เปิด Google provider แล้ววาง Client ID และ Client Secret จาก Google Cloud Console

### ข้อควรตรวจ

- ใช้ callback URL ของ Supabase ไม่ใช่ `/auth/callback` ของแอปโดยตรงใน Google Console
- `localhost` และ production ต้องเป็น URL ที่อนุญาตใน Supabase Redirect URLs
- อีเมล Google ที่ login สำเร็จจะสร้างหรือเชื่อมกับ Supabase user ตาม identity ที่ provider ส่งมา

## 2. Facebook Login

### สร้าง Facebook App

1. เปิด Meta for Developers
2. สร้าง App ประเภทที่รองรับ Facebook Login
3. เพิ่มผลิตภัณฑ์ `Facebook Login for Web`
4. ตั้งค่า Valid OAuth Redirect URI เป็น:

```text
https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

5. คัดลอก App ID และ App Secret
6. ตรวจ App Mode และสิทธิ์การใช้งานก่อนเปิดให้ผู้ใช้จริง

### ตั้งค่าใน Supabase

ใน Facebook provider ของ Supabase:

- App ID ใช้ Facebook App ID
- Client Secret ใช้ Facebook App Secret

จากนั้นเปิด provider และบันทึก

### ข้อควรตรวจ

- Domain ของเว็บต้องอยู่ใน App Domains ของ Meta
- ต้องใช้ HTTPS ใน production
- ทดสอบบัญชี Facebook ที่มีสิทธิ์เข้าถึงแอปก่อนเปิด public

## 3. LINE Login

LINE Login อาจไม่ได้แสดงเป็น provider สำเร็จรูปในทุกแผนหรือทุกเวอร์ชันของ Supabase จึงต้องตรวจใน `Authentication -> Providers` ก่อน

### สร้าง LINE Channel

1. เปิด LINE Developers Console
2. สร้าง Provider และ Channel ประเภท LINE Login
3. ตั้งค่า Web app callback URL เป็น:

```text
https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

4. คัดลอก Channel ID และ Channel Secret
5. ตั้ง scopes ที่ต้องการ เช่น `openid`, `profile` และ `email` โดยขอ email เฉพาะเมื่อ channel ได้รับสิทธิ์แล้ว

### ถ้ามี LINE provider ใน Supabase

ตั้งค่า Client ID/Secret ตามชื่อ field ที่ Supabase แสดง แล้วทดสอบผ่าน `signInWithOAuth`

### ถ้าไม่มี LINE provider ใน Supabase

ใช้หนึ่งในแนวทางนี้:

- ใช้ Custom OIDC provider หากโปรเจกต์/แผน Supabase รองรับ
- สร้าง server-side auth adapter หรือ auth gateway ที่ทำ OAuth code exchange แล้วออก session ให้ Supabase
- ใช้ผู้ให้บริการ identity broker ที่รองรับ LINE แล้วเชื่อมต่อกับ Supabase

อย่าแลก authorization code หรือใช้ Channel Secret ใน client component

### การตรวจสอบ LINE

- ตรวจว่า callback URL ตรงทุกตัวอักษร
- ตรวจว่า channel เปิดใช้งาน Web Login
- ตรวจ scope และการขอ email
- ทดสอบบน mobile browser เพราะ LINE มักเปิด flow ผ่าน in-app browser

## 4. TikTok Login

TikTok Login ต้องตรวจความพร้อมของผลิตภัณฑ์และภูมิภาคใน TikTok for Developers ก่อน และโดยทั่วไปไม่ควรสมมติว่าเป็น Supabase provider สำเร็จรูป

### สร้าง TikTok app

1. เปิด TikTok for Developers
2. สร้าง app และเปิดผลิตภัณฑ์ Login Kit
3. ตั้ง redirect URI เป็น callback ของ integration ที่เลือก
4. คัดลอก Client Key และ Client Secret
5. ตั้ง scopes เท่าที่จำเป็น เช่น `user.info.basic`

### การเชื่อมกับ Supabase

ตรวจใน `Authentication -> Providers` ก่อน หากมี TikTok provider ให้ใช้ callback URL และ field ตามที่ Supabase ระบุ

หากไม่มี provider ให้ใช้ Custom OIDC/adapter หรือ identity broker โดยให้ server เป็นผู้ถือ Client Secret และแลก code กับ TikTok เท่านั้น

TikTok อาจใช้ชื่อ credential และ endpoint ต่างจาก OAuth provider ทั่วไป จึงต้องยึดเอกสาร TikTok และชนิด provider ที่ Supabase รองรับในขณะตั้งค่าจริง

### การตรวจสอบ TikTok

- ตรวจ app review และ product approval
- ตรวจ redirect URI ที่อนุญาต
- ตรวจ scopes ที่ได้รับอนุมัติ
- ทดสอบบน domain HTTPS จริงก่อนเปิดใช้งาน production

## เพิ่มปุ่ม Social Login ในแอป

หลังเปิด provider ใน Supabase ให้เรียกจาก client component:

```ts
const supabase = createClient();

await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

เปลี่ยน `provider` ตาม provider ที่ Supabase รองรับจริง เช่น `google` หรือ `facebook`

สำหรับ LINE/TikTok ที่ใช้ custom adapter ให้เรียก endpoint ของ adapter แทนการส่ง secret ไป browser

## ต้องมี Auth Callback Route

หลัง provider login สำเร็จ แอปต้องมี route เช่น:

```text
src/app/auth/callback/route.ts
```

route นี้รับ `code`, แลก code เป็น session ด้วย Supabase server client แล้ว redirect กลับหน้า Home

อย่าใช้ client-side code exchange แทน server route ใน production

## ตัวอย่าง flow ที่ต้องทดสอบ

- Login สำเร็จแล้วกลับมาที่ Home
- Refresh หน้าแล้ว session ยังอยู่
- Logout แล้ว session หาย
- Login ด้วย provider เดิมซ้ำแล้วได้ user เดิม
- Login ด้วย provider อื่นที่ใช้อีเมลเดียวกัน ได้ผลตาม identity linking policy ที่กำหนด
- ผู้ใช้เห็นเฉพาะ pets และ events ที่ RLS อนุญาต
- สมาชิก Family เห็นเฉพาะ Passport ที่ share
- Viewer ไม่สามารถ insert/update/delete
- OAuth error หรือ user ยกเลิก flow แสดงข้อความที่เข้าใจได้

## Security Checklist

- [ ] ใช้ `anon` หรือ publishable key เท่านั้นใน `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] ไม่ commit `.env.local`
- [ ] ไม่ใส่ Client Secret ใน React component
- [ ] ตั้ง callback URL แบบเจาะจง
- [ ] ใช้ HTTPS ใน production
- [ ] เปิด RLS ทุกตารางข้อมูล
- [ ] ทดสอบด้วยบัญชี owner และบัญชี member แยกกัน
- [ ] Rotate secret ทันทีหากเคยเผยแพร่
- [ ] บันทึก provider configuration และ recovery contact ไว้ใน password manager

## Troubleshooting

### `redirect_uri_mismatch`

ตรวจ callback URL ใน provider console ให้ตรงกับ:

```text
https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

### Login สำเร็จแต่กลับหน้าเว็บไม่ได้

ตรวจ `Authentication -> URL Configuration -> Redirect URLs` และค่า `redirectTo` ในแอป

### ได้ user ใหม่ทุกครั้ง

ตรวจ provider configuration, scopes, identity linking และอย่าสร้าง profile เองจากอีเมลโดยไม่ตรวจ `auth.users.id`

### Login ได้แต่ข้อมูลว่าง

ตรวจว่า session ถูกตั้งใน server cookie แล้ว และตรวจ RLS policy ด้วย user ID ของบัญชีที่ login

## ลำดับการเปิดใช้งานที่แนะนำ

1. เริ่มจาก Email/Password ที่ระบบมีอยู่
2. เพิ่ม Google และทดสอบ end-to-end
3. เพิ่ม Facebook หลังตรวจ App Mode และ permissions
4. เพิ่ม LINE ผ่าน provider ที่ Supabase รองรับ หรือ adapter ฝั่ง server
5. เพิ่ม TikTok หลังตรวจ product approval และ scopes
6. ทดสอบ RLS, session persistence และ account recovery ทุกครั้งก่อนเปิด provider ให้ผู้ใช้จริง

## ตั้งค่า Vercel ร่วมกับ Supabase Auth

### Deploy โปรเจกต์

1. เปิด Vercel แล้วเลือก `Add New -> Project`
2. Import repository `BombINdyBoy/Meow-World`
3. เลือก branch `main`
4. ตรวจให้ Framework เป็น `Next.js` และ Root Directory เป็นโฟลเดอร์โปรเจกต์
5. กด Deploy หลังตั้งค่า environment variables

### Environment Variables ใน Vercel

ไปที่ `Project Settings -> Environment Variables` แล้วเพิ่มค่าต่อไปนี้ใน `Production`, `Preview` และ `Development` ตามที่ต้องการ:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_OR_PUBLISHABLE_KEY>
```

ห้ามเพิ่ม `service_role` key ใน Vercel ตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` อาจถูกส่งไป browser ได้ จึงใช้ได้เฉพาะ URL และ anon/publishable key เท่านั้น

### Supabase Production URL

หลังได้ domain จาก Vercel ให้ไปที่ `Supabase -> Authentication -> URL Configuration` แล้วตั้งค่า:

- `Site URL`: `https://<your-project>.vercel.app`
- `Redirect URLs`: `https://<your-project>.vercel.app/auth/callback`

ถ้าใช้ custom domain ให้เพิ่ม callback URL ของ custom domain ด้วย และคง `localhost` ไว้สำหรับ local development

### Provider Callback

OAuth provider แต่ละรายยังต้องใช้ callback ของ Supabase ไม่ใช่ Vercel callback โดยตรง:

```text
https://<PROJECT_REF>.supabase.co/auth/v1/callback
```

ส่วน `redirectTo` ในแอปให้ชี้กลับไปที่:

```text
https://<your-project>.vercel.app/auth/callback
```

### ตรวจสอบหลัง Deploy

1. เปิด Vercel deployment URL
2. สมัครหรือล็อกอินด้วย Email/Password
3. สร้าง Passport และ Life Journey event
4. Refresh หน้า แล้วตรวจว่า session และข้อมูลยังอยู่
5. ทดสอบ logout แล้ว login กลับเข้ามาใหม่
6. ตรวจ Vercel Runtime Logs หากเกิด error
7. ตรวจ Supabase Auth Logs และ Postgres Logs หาก login หรือ RLS ผิดปกติ

### ก่อนเปิดใช้งานจริง

- [ ] Apply migration และ backup database แล้ว
- [ ] ตั้ง Vercel environment variables ครบทุก environment
- [ ] เปลี่ยน Supabase Site URL เป็น domain จริง
- [ ] เพิ่ม production redirect URL แบบตรงตัว
- [ ] ตรวจว่า OAuth provider ใช้ callback URL ที่ถูกต้อง
- [ ] ทดสอบ RLS ด้วย owner และ member คนละบัญชี
- [ ] Redeploy หลังแก้ environment variables
