# Meow World V4.1 Heart Edition Tracking

**Updated:** 2026-08-28  
**Scope:** Roadmap 1 - Passport + Life Journey, Home, Shared Home, and Family

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Next.js project foundation | Done | Next.js 16, React 19, TypeScript, ESLint |
| Supabase client/server utilities | Done | Browser, server, and middleware helpers exist |
| Authentication flow | Not started | Session refresh middleware is wired; signup/login UI remains |
| Profile data | Foundation ready | `profiles` table and signup trigger are defined |
| Pet Passport | Foundation ready | `pets` table, ownership policies, and timestamps are defined |
| Life Journey | Foundation ready | `life_journey_events` table and ownership policies are defined |
| Home | UI ready | Overview of pets and recent activity is implemented |
| Shared Home | Foundation ready | Family sharing UI and RLS migration are implemented; Supabase verification remains |
| Family | UI ready | Create family, add member, and assign role controls are implemented |
| Passport and timeline UI | Not started | Create, view, edit, and delete screens remain |
| Real-data verification | Not started | Requires Supabase project configuration and end-to-end testing |
| Backup and recovery | Not started | Basic operational procedure and restore test remain |

## Roadmap 1 Checklist

- [ ] Configure Supabase environment variables
- [ ] Apply and verify the initial database migration
- [ ] Add signup, login, logout, and session persistence
- [ ] Add profile creation and account state handling
- [ ] Add Passport create, view, and edit flows
- [ ] Add Life Journey event create, view, edit, and delete flows
- [ ] Add timeline sorting and empty/loading/error states
- [ ] Add Home overview for pets and recent activity
- [ ] Add Shared Home access and member view
- [ ] Add Family members, roles, and permissions
- [ ] Define data model and RLS for shared access
- [x] Build initial Home, Shared Home, and Family interface
- [x] Add incremental migration for families, members, and pet shares
- [ ] Verify RLS with an owner and a different authenticated user
- [ ] Define the basic backup and recovery procedure
- [ ] Test with real user and pet data
- [ ] Document setup and first-use steps

## Foundation Reserved For Later

The schema keeps ownership and event boundaries explicit so Home, Shared Home, and Family can be added without changing the Roadmap 1 data contract unnecessarily. QR, storage, social, AI, and multi-species capabilities remain reserved for later work.

## Out Of Scope For This Iteration

QR, Marketplace, Biometrics, Advanced Storage, Social, AI Features, Gamification, Subscription, Multi-species ecosystem, and the full Graphic Engine.

## Validation Notes

- Migrations: `supabase/migrations/20260826000000_init_schema.sql` and `supabase/migrations/20260826100000_home_shared_home_family.sql`
- The Home/Shared Home/Family migration is a full reset of application tables in `public`; back up production data before applying it. Supabase Auth users are preserved.
- Run `npm run lint` before each commit.
- Run `npm run build` before pushing a release-ready change.
- Never commit `.env.local`; use `.env.local.example` for required variable names.

## Known Issues & Pending Tasks

### OAuth Google Login - redirect_uri_mismatch (2026-08-27)

**Status:** Pending fix  
**Error:** `400: redirect_uri_mismatch` after Google OAuth login on Netlify  

**Root Cause:** Google Cloud Console redirect URI ไม่ตรงกับที่ Supabase ส่งไป  

**วิธีแก้ (ยังไม่ได้ทำ):**

#### Google Cloud Console → OAuth 2.0 Client ID

ต้องตั้งค่า 2 ส่วน:

1. **Authorized JavaScript origins**
   ```
   https://meow-world-core.netlify.app
   ```

2. **Authorized redirect URIs**
   ```
   https://tnshkncxfzkmmrmbepyb.supabase.co/auth/v1/callback
   ```

   > ⚠️ ลบ URL อื่นๆ ออก ให้เหลือแค่ Supabase callback URL

#### ถ้ายังไม่ได้ ลองสร้าง OAuth Client ID ใหม่:

1. Google Cloud Console → APIs & Services → Credentials
2. กด "+ CREATE CREDENTIALS" → OAuth client ID
3. เลือก Web application
4. ตั้งค่าใหม่:
   - Name: Meow World
   - Authorized JavaScript origins: `https://meow-world-core.netlify.app`
   - Authorized redirect URIs: `https://tnshkncxfzkmmrmbepyb.supabase.co/auth/v1/callback`
5. กด Create → Copy Client ID และ Client Secret ใหม่
6. Supabase Dashboard → Authentication → Providers → Google → Update Client ID และ Client Secret ใหม่
7. กด Save

#### ทดสอบ

1. ไปที่ `https://meow-world-core.netlify.app/login`
2. กด เข้าสู่ระบบด้้วย Google

---

### Netlify Deployment (2026-08-27)

**Status:** Deployed ✅  
**URL:** `https://meow-world-core.netlify.app`  

**สิ่งที่ทำไปแล้ว:**
- สร้าง `netlify.toml` config
- Deploy สำเร็จบน Netlify
- เพิ่ม `.netlify/` ใน `.gitignore`

**ENV vars บน Netlify:**
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅

---

## Change Log

### 2026-08-27

- Fixed TypeScript build errors (3 errors in page.tsx and CreateMomentModal.tsx)
- Migrated middleware.ts to proxy.ts (Next.js 16 deprecated convention)
- Created netlify.toml for Netlify deployment config
- Deployed successfully on Netlify: https://meow-world-core.netlify.app
- Started OAuth Google login debugging (redirect_uri_mismatch issue)

### 2026-08-26

- Created the V4.1 Next.js/Supabase project foundation.
- Added the Roadmap 1 schema migration for profiles, pets, and Life Journey events.
- Added initial status tracking for implementation and verification work.
- Added Home, Shared Home, and Family to the active planning scope.
- Built the first working Home, Passport, Life Journey, Shared Home, and Family interface.
- Added the incremental Family and sharing migration with RLS policies.
