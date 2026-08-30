# 🐱 Meow World — Team Handoff Document

**Version:** Prototype V0 (ต้นแบบ)
**Date:** 2026-08-31
**Branch:** `qwen-prototype-v0` (main branch สำหรับ development)
**Repository:** https://github.com/BombINdyBoy/Meow-World

---

## 📌 สรุปสำหรับผู้บริหาร (30 วินาที)

Meow World คือ **Living Passport & Life Journey** สำหรับสัตว์เลี้ยง — ไม่ใช่แค่แอพบันทึกข้อมูล แต่เป็น **ที่เก็บความทรงจำ** ที่ออกแบบมาให้ผู้ใช้รู้สึก **ผูกพัน** กับสัตว์เลี้ยงของตัวเอง

**สถานะปัจจุบัน:** Prototype V0 — มี UI ครบ แต่ database layer ยังมี blocker (RLS infinite recursion)

**สิ่งที่ต้องทำต่อ:** Fix RLS → ให้ flow ทำงานได้จริง → ทดสอบกับผู้ใช้จริง → Launch

---

## 🎨 UX Philosophy: Emotional Design

### แนวคิดหลัก

> "Meow World ไม่ใช่แค่แอพ แต่เป็น **ที่เก็บความทรงจำ** ที่ออกแบบมาให้ผู้ใช้รู้สึก **อบอุ่น** และ **ผูกพัน**"

### Emotional Journey ของผู้ใช้

```
┌─────────────────────────────────────────────────────────┐
│  Login: "A QUIET PLACE FOR BIG MEMORIES"                │
│         "Every chapter matters."                         │
│  → สื่อว่า: นี่คือที่เก็บความทรงจำ ไม่ใช่แค่แอพ          │
├─────────────────────────────────────────────────────────┤
│  Empty State: "ยินดีต้อนรับสู่ Meow World"              │
│               "ระบบกำลังเตรียมพื้นที่ส่วนตัวให้คุณ..."    │
│  → สื่อว่า: เริ่มต้น journey ใหม่                        │
├─────────────────────────────────────────────────────────┤
│  Nesting: 📦 "บ้านหลังใหม่พร้อมแล้ว!"                  │
│           "มาต้อนรับสมาชิกขนฟูคนแรกกันเถอะ"              │
│  → สื่อว่า: ความตื่นเต้นในการต้อนรับสัตว์เลี้ยงตัวแรก     │
├─────────────────────────────────────────────────────────┤
│  Living: 🏠 "บ้านของเรา"                                │
│          "2 สมาชิกขนฟู • 5 เรื่องราว"                   │
│  → สื่อว่า: ชีวิตที่เต็มไปด้วยความทรงจำ                  │
└─────────────────────────────────────────────────────────┘
```

### Design System

| Token | Color | สื่อความหมาย |
|---|---|---|
| `--brand-coral` | #E06D53 | อบอุ่น เป็นมิตร |
| `--brand-sage` | #6B8E68 | ธรรมชาติ ผ่อนคลาย |
| `--gold-cert` | #C89933 | หรูหรา มีคุณค่า |
| `--ink-primary` | #1F1E1D | เข้ม ชัดเจน |
| `--bg-warm` | #FAF7F2 | พื้นหลังอบอุ่น |

| Font | ใช้กับ | สื่อความหมาย |
|---|---|---|
| Playfair Display | หัวข้อ | หรูหราวิจิตร |
| Plus Jakarta Sans | เนื้อหา | ทันสมัย อ่านง่าย |
| DM Mono | Code/Eyebrow | เทคโนโลยี แม่นยำ |

### UX Flow

```
User เปิดแอพ
    │
    ▼
Login (_email/password หรือ Google OAuth_)
    │
    ▼
Empty State → สร้างบ้านอัตโนมัติ
    │
    ▼
Nesting State → กด "รับน้องเข้าบ้าน"
    │
    ▼
Pets Page → เพิ่มสัตว์เลี้ยง
    │
    ▼
Pet Detail → เพิ่ม Life Journey Event
    │
    ▼
Living State → เห็น Feed ความทรงจำ
```

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | Next.js (App Router) | 16.3.3 |
| **UI** | React | 19.2.8 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **Language** | TypeScript | 5.x |
| **Database** | Supabase (PostgreSQL) | — |
| **Auth** | Supabase Auth (Email + Google OAuth) | — |
| **Hosting** | Vercel | Hobby plan |
| **Version Control** | Git + GitHub | — |

### Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (ไม่มี custom fonts)
│   ├── page.tsx                # 🏠 Home page (3 states: empty/nesting/living)
│   ├── globals.css             # Tailwind v3 + custom CSS
│   ├── login/page.tsx          # 🔐 Google OAuth login
│   ├── auth/callback/route.tsx # OAuth callback handler
│   └── pets/
│       ├── page.tsx            # 📋 Pet list (CRUD)
│       ├── [id]/page.tsx       # 🐱 Pet detail + Life Journey
│       └── [id]/edit/page.tsx  # ✏️ Edit pet
├── components/
│   └── pets/
│       ├── PetCard.tsx         # Pet card component
│       └── PetForm.tsx         # Pet create/edit form
├── types/
│   └── pet.ts                  # TypeScript interfaces
├── utils/supabase/
│   ├── client.ts               # Browser Supabase client
│   ├── server.ts               # Server Supabase client
│   └── middleware.ts           # Session refresh middleware
└── middleware.ts                # Next.js middleware wrapper
```

---

## 🗄️ Database Schema

### Tables (จาก migration จริง)

```
auth.users (Supabase managed)
    │
    ▼
profiles
├── id: uuid (PK, FK → auth.users)
├── display_name: text
├── avatar_url: text
└── created_at: timestamptz

homes
├── id: uuid (PK)
├── name: text
├── description: text
├── owner_id: uuid (FK → profiles)
└── created_at: timestamptz

home_members
├── id: uuid (PK)
├── home_id: uuid (FK → homes)
├── user_id: uuid (FK → profiles)
├── role: text (default: 'member')
├── joined_at: timestamptz
└── UNIQUE(home_id, user_id)

pets
├── id: uuid (PK)
├── home_id: uuid (FK → homes) ← ไม่ใช่ owner_id!
├── name: text
├── nickname: text
├── species: text (default: 'Cat')
├── breed: text
├── gender: text
├── birth_date: date
├── color: text
├── avatar_url: text
├── is_active: boolean (default: true)
└── created_at: timestamptz

life_journey_events
├── id: uuid (PK)
├── home_id: uuid (FK → homes)
├── pet_id: uuid (FK → pets, nullable)
├── author_id: uuid (FK → profiles, nullable)
├── content: text
├── event_type: text (default: 'memory')
├── media_urls: text[]
├── participant_ids: uuid[]
└── created_at: timestamptz
```

### Relationships

```
profiles ──< homes (owner_id)
homes ──< home_members
homes ──< pets (home_id)
homes ──< life_journey_events (home_id)
pets ──< life_journey_events (pet_id)
```

**สำคัญ:** ตารางใช้ `home_id` ไม่ใช่ `owner_id` สำหรับ pets และ events

---

## ⚠️ Known Issues (CRITICAL)

### 1. `home_members` RLS Infinite Recursion

**Error:** `infinite recursion detected in policy for relation "home_members"`

**Cause:** Original migration สร้าง policy ที่ query `home_members` ตัวเอง:
```sql
-- ❌ Policy นี้ cause infinite recursion
CREATE POLICY "Members can view members" ON public.home_members
  FOR SELECT USING (
    home_id IN (SELECT home_id FROM home_members WHERE user_id = auth.uid())
  );
```

**Impact:** ไม่สามารถ query `homes`, `home_members`, `pets`, หรือ `life_journey_events` ผ่าน API ได้

**วิธีแก้:**
```sql
-- Step 1: ดู policy ที่มีอยู่จริง
SELECT * FROM pg_policies WHERE tablename = 'home_members';

-- Step 2: Drop policy ที่ cause recursion (ใช้ชื่อจริงจาก step 1)
DROP POLICY IF EXISTS "Members can view members" ON public.home_members;

-- Step 3: Recreate ไม่มี self-reference
CREATE POLICY "Users see own membership" ON public.home_members
  FOR SELECT USING (user_id = auth.uid());

-- Step 4: Verify
SELECT * FROM pg_policies WHERE tablename = 'home_members';
```

### 2. `handle_new_user()` Trigger ไม่ทำงาน

**Cause:** User signup ก่อน apply migration

**Workaround:**
```sql
INSERT INTO public.profiles (id, display_name)
VALUES ('USER_UUID_HERE', 'Display Name')
ON CONFLICT (id) DO NOTHING;
```

### 3. Home Page ติด Empty State

**Flow ที่เกิดขึ้น:**
1. User login → session สำเร็จ
2. Query `homes` → ❌ fail (RLS infinite recursion)
3. Code จับ error → setViewMode("empty")
4. แสดง "ยินดีต้อนรับสู่ Meow World"
5. กด "รีเฟรช" → วน loop เดิม

---

## 🚀 Deployment

### URLs

| Environment | URL |
|---|---|
| **Production** | `meow-world-heart-edition.vercel.app` |
| **Preview** | `meow-world-heart-edition-61blnekzx-thdev8studio.vercel.app` |
| **GitHub** | `github.com/BombINdyBoy/Meow-World` |

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://eqemlaqgzzjilshrhgdo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

**Vercel Settings:** ต้องเปิดทั้ง Production + Preview + Development

### Git Workflow

```
Branch: qwen-prototype-v0 (development)
    │
    ├─ git push origin qwen-prototype-v0 → Vercel Preview
    │
    └─ merge to main → Vercel Production
```

---

## 📋 Roadmap

### Phase 1: MVP (ตอนนี้) ← We are here

- [x] Next.js project foundation
- [x] Supabase client/server utilities
- [x] Authentication flow (Email + Google OAuth)
- [x] Pet Passport CRUD UI
- [x] Life Journey timeline UI
- [x] Home / Family UI
- [x] Vercel deployment
- [x] Tailwind CSS styling
- [ ] **Fix RLS infinite recursion** ← BLOCKER
- [ ] Fix home page flow (empty → nesting → living)
- [ ] Test with real user data
- [ ] Launch to 10-50 beta users

### Phase 2: Growth

- [ ] Family sharing & permissions
- [ ] Pet avatars & photos
- [ ] Life Journey events with media
- [ ] Push notifications
- [ ] Multi-language support

### Phase 3: Monetization

- [ ] Premium features (Freemium model)
- [ ] Digital certificates
- [ ] QR sharing
- [ ] Marketplace integration

### Out of Scope (for now)

QR, Marketplace, Biometrics, Advanced Storage, Social, AI Features, Gamification, Subscription, Multi-species ecosystem, Graphic Engine

---

## 📁 Files Summary

### Configuration Files

| File | Purpose |
|---|---|
| `package.json` | Dependencies (Tailwind v3, Supabase, Next.js 16) |
| `tsconfig.json` | TypeScript config |
| `tailwind.config.js` | Tailwind v3 content paths |
| `postcss.config.js` | PostCSS with tailwindcss + autoprefixer |
| `.env.local` | Supabase credentials (not committed) |
| `.env.local.example` | Template for env vars |
| `.gitignore` | Git ignore rules |

### Source Files

| File | Purpose |
|---|---|
| `src/app/page.tsx` | Home page (3 states) |
| `src/app/login/page.tsx` | Login page (Google OAuth) |
| `src/app/pets/page.tsx` | Pet list (CRUD) |
| `src/app/pets/[id]/page.tsx` | Pet detail + Life Journey |
| `src/app/pets/[id]/edit/page.tsx` | Edit pet |
| `src/components/pets/PetForm.tsx` | Pet form component |
| `src/components/pets/PetCard.tsx` | Pet card component |
| `src/types/pet.ts` | TypeScript interfaces |
| `src/utils/supabase/client.ts` | Browser client |
| `src/utils/supabase/server.ts` | Server client |
| `src/utils/supabase/middleware.ts` | Session middleware |

### Database Migrations

| File | Purpose |
|---|---|
| `20260827130000_init_full_schema.sql` | Main schema (homes, home_members, pets, events) |
| `20260831000000_fix_rls_and_profile.sql` | Fix RLS + insert profile |
| `20260831100000_fix_rls_recursion.sql` | Fix recursion (incomplete) |
| `20260831200000_nuclear_rls_fix.sql` | Nuclear fix (incomplete) |

---

## 🎯 How to Start (สำหรับ developer ใหม่)

### Step 1: Clone & Setup

```bash
git clone -b qwen-prototype-v0 https://github.com/BombINdyBoy/Meow-World.git
cd Meow-World
npm install
cp .env.local.example .env.local
# ใส่ Supabase credentials ใน .env.local
npm run dev
```

### Step 2: Fix Database (BLOCKER)

ไปที่ Supabase SQL Editor แล้วรัน:

```sql
-- ดู policy ที่มีอยู่
SELECT * FROM pg_policies WHERE tablename = 'home_members';

-- Drop ตัวที่ cause recursion (ใช้ชื่อจริงจากผลลัพธ์ข้างบน)
-- DROP POLICY IF EXISTS "ชื่อpolicyจริง" ON public.home_members;

-- Recreate
CREATE POLICY "Users see own membership" ON public.home_members
  FOR SELECT USING (user_id = auth.uid());
```

### Step 3: Test

```bash
npm run build    # ตรวจสอบ build สำเร็จ
npm run dev      # รัน local
# เปิด http://localhost:3000
# Login → ควรเห็น Home state
```

### Step 4: Deploy

```bash
git push origin qwen-prototype-v0
# Vercel auto-deploy Preview
# Merge to main → Production
```

---

## 📞 Contact

- **Repository:** https://github.com/BombINdyBoy/Meow-World
- **Branch:** `qwen-prototype-v0`

---

*เอกสารนี้สร้างขึ้นเมื่อ 2026-08-31 โดย AI Codebuff*
*สำหรับทีมพัฒนา Meow World V4.1 Heart Edition*
