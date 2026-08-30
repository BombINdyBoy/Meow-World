# Meow World V4.1 Heart Edition Tracking

**Updated:** 2026-08-31
**Active Branch:** `qwen-prototype-v0` (merge to `main` for Production)
**Scope:** Roadmap 1 - Passport + Life Journey, Home, Shared Home, and Family

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Next.js project foundation | Done | Next.js 16, React 19, TypeScript, ESLint |
| Supabase client/server utilities | Done | Browser, server, and middleware helpers exist |
| Authentication flow | ✅ Done | Email/password + Google OAuth working |
| Profile data | ⚠️ Done (manual) | Trigger `handle_new_user()` ไม่ทำงาน - ต้อง insert ด้วยตัวเอง |
| Pet Passport | UI Ready | CRUD pages at `/pets`, `/pets/[id]`, `/pets/[id]/edit` |
| Life Journey | UI Ready | Timeline on pet detail page |
| Home | ⚠️ Partial | หน้า Home queries ตารางจริงได้แล้ว แต่ติด RLS infinite recursion |
| Shared Home | Foundation ready | `home_members` table exists with RLS issues |
| Family | UI Ready | Family management UI exists |
| Vercel Deployment | ✅ Done | Production: `meow-world-heart-edition.vercel.app` |
| Tailwind CSS | ✅ Fixed | `tailwind.config.js` restored, CSS loads correctly |
| Environment Variables | ✅ Done | `.env.local` configured, Vercel Production + Preview set |

## ⚠️ Known Issues (2026-08-31)

### CRITICAL: `home_members` RLS Infinite Recursion
**Error:** `infinite recursion detected in policy for relation "home_members"`
**Cause:** Original migration `20260827130000_init_full_schema.sql` created a self-referencing policy:
```sql
-- This policy queries home_members from within home_members = infinite loop
CREATE POLICY "Members can view members" ON public.home_members
  FOR SELECT USING (home_id IN (SELECT home_id FROM home_members WHERE user_id = auth.uid()));
```
**Impact:** Cannot query `homes`, `home_members`, `pets`, or `life_journey_events` via API
**Status:** Not fixed yet - DROP POLICY ใช้ชื่อไม่ตรงกับที่อยู่จริงใน DB
**Fix Required:** ต้อง drop policy ด้วยชื่อจริง `"Members can view members"` แล้ว recreate

**ชื่อ policy ที่พบจริงใน DB:**
| Policy Name | Type | ปัญหา |
|---|---|---|
| `Members can view members` | SELECT | ❌ Self-reference → infinite recursion |
| `Owners can add members` | INSERT | Duplicate ของ "Owner manages members" |
| `Owner manages members` | INSERT | OK |
| `Owner updates members` | UPDATE | OK |
| `Owner deletes members` | DELETE | OK |
| `Users see own membership` | SELECT | OK |

### CRITICAL: `handle_new_user()` Trigger ไม่ทำงาน
**Cause:** User signup ก่อน apply migration หรือ trigger ไม่ถูกสร้าง
**Workaround:** Insert profile ด้วยตัวเอง:
```sql
INSERT INTO public.profiles (id, display_name)
VALUES ('9492124e-4f94-4770-91ae-ff302c5c5bab', 'BombINdyBoy')
ON CONFLICT (id) DO NOTHING;
```

### Home Page Flow (ติดอยู่ที่ Empty State)
1. User login → session สำเร็จ
2. Query `homes` → ❌ fail (RLS infinite recursion)
3. Code จับ error → setViewMode("empty")
4. แสดง "ยินดีต้อนรับสู่ Meow World"
5. กด "รีเฟรชหน้าจอ" → วน loop เดิม

## Database Schema (จาก migration จริง)

ตารางที่สร้างจาก `20260827130000_init_full_schema.sql`:

```
auth.users
  └── profiles (id, display_name, avatar_url, created_at)
       └── homes (id, name, description, owner_id, created_at)
            ├── home_members (id, home_id, user_id, role, joined_at)
            ├── pets (id, home_id, name, nickname, species, breed, gender, birth_date, color, avatar_url, is_active, created_at)
            └── life_journey_events (id, home_id, pet_id, author_id, content, event_type, media_urls, participant_ids, created_at)
```

**สำคัญ:** ตารางใช้ `home_id` ไม่ใช่ `owner_id` สำหรับ pets และ events

## Roadmap 1 Checklist

- [x] Configure Vercel environment variables (Production + Preview)
- [x] Deploy on Vercel (both branches)
- [x] Fix OAuth Google redirect_uri_mismatch
- [x] Fix Tailwind CSS not loading (`tailwind.config.js` missing)
- [x] Fix home page to use correct DB tables (homes, home_members, home_id)
- [x] Fix `.gitignore` (removed markdown code fences, added negation for `.env.local.example`)
- [ ] **Fix `home_members` RLS infinite recursion** ← BLOCKER
- [ ] Fix `handle_new_user()` trigger or manual profile creation
- [ ] Test home page flow (empty → nesting → living)
- [ ] Add Life Journey event create, view, edit, and delete flows
- [ ] Verify RLS with owner and member users
- [ ] Test with real user and pet data
- [ ] Document setup and first-use steps

## Files Changed in This Session (qwen-prototype-v0)

| File | Change |
|---|---|
| `.gitignore` | Fixed markdown code fences, added `!.env.local.example`, ignore `tsconfig.tsbuildinfo` |
| `.env.local.example` | Created (placeholder values for developers) |
| `tailwind.config.js` | Created (Tailwind v3 config with content paths) |
| `postcss.config.js` | Reverted to v3 syntax (matching `package.json`) |
| `src/app/globals.css` | Reverted to v3 syntax (`@tailwind base/components/utilities`) |
| `src/app/page.tsx` | Rewritten to use `homes`, `home_members`, `pets.home_id`, `life_journey_events.home_id` |
| `supabase/migrations/20260831000000_fix_rls_and_profile.sql` | Fix RLS + insert profile |
| `supabase/migrations/20260831100000_fix_rls_recursion.sql` | Fix infinite recursion (incomplete) |
| `supabase/migrations/20260831200000_nuclear_rls_fix.sql` | Nuclear RLS fix (still incomplete) |

## Git History (qwen-prototype-v0)

```
cff74d8 fix: break infinite recursion in homes and home_members RLS
a66698f fix: align home page with actual DB schema and fix RLS
f9160c0 fix: rewrite home page to use correct database tables
969062e fix: add missing tailwind.config.js for Tailwind CSS v3
1dc484c chore: fix .gitignore and add .env.local.example
dbe1501 fix: trigger build for Prototype V0
74fda24 feat: Initialize Meow World Prototype V0 Branch
```

## Merge History

```
main ← qwen-prototype-v0 (merged multiple times)
```

## How to Continue

### ขั้นตอนถัดไป (BLOCKER: RLS)

1. **Fix RLS** — ไปที่ Supabase SQL Editor แล้วรัน:
```sql
-- Drop the problematic self-referencing policy
DROP POLICY IF EXISTS "Members can view members" ON public.home_members;
DROP POLICY IF EXISTS "Owners can add members" ON public.home_members;

-- Verify no more recursion
SELECT * FROM pg_policies WHERE tablename = 'home_members';
```

2. **Test API** — หลัง drop ให้ทดสอบ:
```sql
SELECT * FROM homes LIMIT 5;
SELECT * FROM home_members LIMIT 5;
```

3. **Login ทดสอบ** — ถ้า RLS หาย หน้า Home ควรแสดง "Nesting" state

4. **เพิ่มแมว** — กด "รับน้องเข้าบ้าน" → ไปหน้า `/pets`

## Validation Notes

- Run `npm run lint` before each commit.
- Run `npm run build` before pushing a release-ready change.
- Never commit `.env.local`; use `.env.local.example` for required variable names.
- Branch `qwen-prototype-v0` ต้อง merge ไป `main` ก่อน Vercel Production จะ update

## Change Log

### 2026-08-31
- Fixed `.gitignore` (markdown code fences, negation pattern, build artifact)
- Created `.env.local.example` for developer reference
- Created `tailwind.config.js` to fix CSS not loading on Vercel
- Fixed `postcss.config.js` and `globals.css` to match Tailwind v3 packages
- Rewrote `page.tsx` to use correct DB tables (homes, home_members, home_id)
- Added RLS fix migrations (still incomplete - self-referencing policy persists)
- Merged `qwen-prototype-v0` ↔ `main` multiple times
- Documented all issues and current status

### 2026-08-30
- Fixed Supabase prerender error
- Fixed OAuth redirect_uri_mismatch
- Updated Supabase URL Configuration
- Fixed auth callback NEXT_REDIRECT error
- Successfully deployed and tested login on Vercel

### 2026-08-28
- Created unique certificate templates
- Built flip card document viewer
- Enhanced Passport ID format
- Created SETUP_GUIDE.md

### 2026-08-27
- Fixed TypeScript build errors
- Migrated middleware.ts to proxy.ts

### 2026-08-26
- Created V4.1 project foundation
- Added Roadmap 1 schema migration
- Built Home, Passport, Life Journey, Shared Home, Family interface
- Added Family and sharing migration with RLS
