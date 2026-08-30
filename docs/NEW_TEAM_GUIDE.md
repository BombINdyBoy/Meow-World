# 🚀 New Team Guide: เริ่มต้น Meow World จากศูนย์

**สำหรับ:** ทีมพัฒนาใหม่ที่เริ่มจากโปรเจกต์เปล่า
**อ้างอิง:** Prototype V0 (ต้นแบบ)

---

## 📋 สิ่งที่ต้องรู้ก่อนเริ่ม

### Meow World คืออะไร?
> แอพสำหรับเก็บความทรงจำสัตว์เลี้ยง — ไม่ใช่แค่ข้อมูล แต่เป็น **อารมณ์** และ **ความผูกพัน**

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 3.4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Hosting | Vercel |
| Version Control | Git + GitHub |

---

## 🏗️ Architecture Overview

```
Meow World
├── 🏠 Home Mode (หน้าหลัก)
│   ├── 🪺 Nest System (รังส่วนตัว)
│   ├── 🎨 Decoration (ตกแต่งบ้าน)
│   └── 💾 Family Package (พื้นที่จัดเก็บ)
│
├── 📋 Passport (ข้อมูลสัตว์เลี้ยง)
├── 📸 Life Journey (ความทรงจำ)
├── 🏘️ Community (ชุมชน)
└── 🏪 Vet Market (ตลาดสัตวแพทย์)
```

---

## 🗄️ Database Schema

### Tables หลัก

```sql
-- ข้อมูลผู้ใช้
profiles (id, display_name, avatar_url, created_at)

-- บ้าน
homes (id, name, description, owner_id, created_at)

-- สมาชิกบ้าน
home_members (id, home_id, user_id, role, joined_at)

-- รังส่วนตัว
nests (id, home_id, owner_id, nest_name, description, theme, created_at)

-- สัตว์เลี้ยง
pets (id, home_id, nest_id, name, species, breed, birth_date, created_at)

-- ความทรงจำ
life_journey_events (id, home_id, nest_id, pet_id, author_id, content, event_type, created_at)

-- ของตกแต่ง
decorations (id, nest_id, home_id, decoration_type, position_x, position_y, season, created_at)

-- พื้นที่จัดเก็บ
family_packages (id, home_id, storage_limit, storage_used, plan_type, created_at)

-- ชุมชน
community_posts (id, author_id, nest_id, title, content, media_urls, created_at)

-- ตลาด
market_categories (id, name, slug, icon, created_at)
market_items (id, seller_id, category_id, name, price, images, created_at)

-- Feature Flags
feature_flags (id, flag_name, is_enabled, rollout_percentage, created_at)
```

---

## 🔧 วิธีตั้งค่า

### Step 1: Clone & Install
```bash
git clone -b qwen-prototype-v0 https://github.com/BombINdyBoy/Meow-World.git
cd Meow-World
npm install
```

### Step 2: Environment Variables
```bash
cp .env.local.example .env.local
# ใส่ Supabase credentials ใน .env.local
```

### Step 3: Database Migration
ไปที่ Supabase SQL Editor แล้วรัน migrations ตามลำดับ:
1. `20260827130000_init_full_schema.sql`
2. `20260831300000_feature_flags.sql`
3. `20260831400000_nest_system.sql`
4. `20260831500000_decoration_system.sql`
5. `20260831600000_family_package.sql`
6. `20260831700000_community.sql`
7. `20260831800000_vet_market.sql`

### Step 4: Fix RLS (CRITICAL!)
```sql
-- ดู policy ที่มีอยู่
SELECT * FROM pg_policies WHERE tablename = 'home_members';

-- Drop policy ที่ cause recursion (ใช้ชื่อจริง)
-- DROP POLICY IF EXISTS "ชื่อpolicyจริง" ON public.home_members;

-- Recreate
CREATE POLICY "Users see own membership" ON public.home_members
  FOR SELECT USING (user_id = auth.uid());
```

### Step 5: Run
```bash
npm run dev
# เปิด http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home (3 states: empty/nesting/living)
│   ├── landing/page.tsx      # Landing page
│   ├── login/page.tsx        # Login
│   ├── login/forgot-password # Forgot password
│   ├── login/reset-password  # Reset password
│   ├── pets/page.tsx         # Pet list
│   ├── pets/[id]/page.tsx    # Pet detail
│   ├── nests/page.tsx        # Nest list
│   ├── admin/dashboard       # Admin dashboard
│   └── admin/flags           # Feature flags
│
├── components/
│   ├── ErrorBoundary.tsx     # Error handler
│   ├── Loading.tsx           # Loading states
│   ├── FeedbackButton.tsx    # User feedback
│   ├── nests/NestCard.tsx    # Nest card
│   └── pets/
│       ├── PetCard.tsx       # Pet card
│       ├── PetForm.tsx       # Pet form
│       └── SpeciesPicker.tsx # Species selector
│
├── hooks/
│   └── useFeatureFlag.ts     # Feature flag hook
│
├── types/
│   ├── pet.ts                # Pet types
│   ├── nest.ts               # Nest types
│   ├── species.ts            # Species config
│   ├── feature-flags.ts      # Feature flag types
│   └── notification.ts       # Notification types
│
└── utils/supabase/
    ├── client.ts             # Browser client
    ├── server.ts             # Server client
    └── middleware.ts         # Session middleware
```

---

## ⚙️ Feature Flags

### วิธีใช้
```tsx
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

function MyComponent() {
  const showNest = useFeatureFlag('nest_system');
  
  if (!showNest) return null;
  
  return <div>แสดงรังส่วนตัว</div>;
}
```

### Flags ที่มี
| Flag | Description |
|---|---|
| `home_mode` | Home Mode - หน้าหลัก |
| `nest_system` | Nest System - รังส่วนตัว |
| `decoration` | Decoration - ตกแต่งบ้าน |
| `family_package` | Family Package - พื้นที่จัดเก็บ |
| `community` | Community - ชุมชน |
| `vet_market` | Vet Market - ตลาดสัตวแพทย์ |

---

## 🚨 Known Issues

### 1. RLS Infinite Recursion (CRITICAL)
- **Error:** `infinite recursion detected in policy for relation "home_members"`
- **Fix:** Drop policy ด้วยชื่อจริง แล้ว recreate

### 2. handle_new_user() Trigger
- **Issue:** ไม่ทำงานหลัง signup
- **Workaround:** Insert profile ด้วยตัวเอง

---

## 📚 เอกสารอ้างอิง

| เอกสาร | ที่อยู่ |
|---|---|
| HANDOFF.md | `docs/HANDOFF.md` |
| Backup Procedure | `docs/BACKUP_PROCEDURE.md` |
| Feature Flag Roadmap | `docs/FEATURE_FLAG_ROADMAP.md` |
| Auth Setup | `docs/AUTH_AND_DEPLOYMENT_SETUP.md` |
| MVP Spec | `docs/MEOW_WORLD_MVP_V4.1_HEART_EDITION.md` |

---

*สร้างเมื่อ: 2026-08-31*
*สำหรับ: ทีมพัฒนาใหม่*
