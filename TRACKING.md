# Meow World V4.1 Heart Edition Tracking

**Updated:** 2026-08-28  
**Scope:** Roadmap 1 - Passport + Life Journey, Home, Shared Home, and Family

## Current Status

| Area | Status | Notes |
| --- | --- | --- |
| Next.js project foundation | Done | Next.js 16, React 19, TypeScript, ESLint |
| Supabase client/server utilities | Done | Browser, server, and middleware helpers exist |
| Authentication flow | In Progress | Session refresh middleware is wired; login UI improved |
| Profile data | Foundation ready | `profiles` table and signup trigger are defined |
| Pet Passport | UI Ready | Passport view with unique ID format (MW-PET-YYYY-XXXXXXXX) |
| Digital Certificates | UI Ready | 6 unique templates with flip card viewer |
| Life Journey | Foundation ready | `life_journey_events` table and ownership policies are defined |
| Home | UI ready | Overview of pets and recent activity is implemented |
| Shared Home | Foundation ready | Family sharing UI and RLS migration are implemented |
| Family | UI ready | Create family, add member, and assign role controls are implemented |
| Vercel Deployment | Pending | Environment variables need to be configured |
| OAuth Google Login | Pending | redirect_uri_mismatch needs fix in Google Cloud Console |

## Roadmap 1 Checklist

- [ ] Configure Vercel environment variables
- [ ] Deploy on Vercel
- [ ] Fix OAuth Google redirect_uri_mismatch
- [ ] Verify authentication flow end-to-end
- [ ] Add profile creation and account state handling
- [x] Build Passport view with unique ID format
- [x] Create 6 unique Digital Certificate templates
- [x] Build Flip Card Document Viewer
- [ ] Add Life Journey event create, view, edit, and delete flows
- [ ] Add timeline sorting and empty/loading/error states
- [x] Build initial Home, Shared Home, and Family interface
- [x] Add incremental migration for families, members, and pet shares
- [ ] Verify RLS with an owner and a different authenticated user
- [ ] Test with real user and pet data
- [ ] Document setup and first-use steps

## Completed Features (2026-08-28)

### Unique Certificate Templates
- 👑 Pedigree: Gold ornate style with crown and laurel
- 💉 Vaccine: Blue medical style with shield and cross
- 📡 Microchip: Green tech style with holographic effect
- 🏠 Adoption: Pink hearts style with embossed effect
- 🩺 Health: Purple vet style with minimal design
- 📜 General: Orange classic style with scroll design

### Flip Card Document Viewer
- Front: Digital Certificate overlay with QR code
- Back: Original physical document
- 3D flip animation
- Template-aware colors per certificate type

### Enhanced Passport
- Unique ID format: `MW-PET-YYYY-XXXXXXXX`
- Enhanced identity card display
- Certificate gallery with template styles

## Foundation Reserved For Later

QR, Marketplace, Biometrics, Advanced Storage, Social, AI Features, Gamification, Subscription, Multi-species ecosystem, and the full Graphic Engine.

## Validation Notes

- Run `npm run lint` before each commit.
- Run `npm run build` before pushing a release-ready change.
- Never commit `.env.local`; use `.env.local.example` for required variable names.

## Known Issues

### OAuth Google Login - redirect_uri_mismatch (2026-08-27)

**Status:** Pending fix  
**Error:** `400: redirect_uri_mismatch` after Google OAuth login

**Fix:** Update Google Cloud Console redirect URI to:
```
https://tnshkncxfzkmmrmbepyb.supabase.co/auth/v1/callback
```

### Vercel Deployment (2026-08-28)

**Status:** Pending setup

**ENV vars needed on Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Change Log

### 2026-08-28

- Created unique certificate templates with distinct styles per type
- Built flip card document viewer with 3D animation
- Enhanced Passport ID with unique format (MW-PET-YYYY-XXXXXXXX)
- Updated CertificateViewerModal with flip card and template styles
- Updated DigitalCertificateModal header with template-aware colors
- Improved login page error display and auth callback logging
- Created SETUP_GUIDE.md with detailed setup instructions
- Committed and pushed to GitHub: `bb4b79f`

### 2026-08-27

- Fixed TypeScript build errors
- Migrated middleware.ts to proxy.ts (Next.js 16)
- Created netlify.toml for deployment config
- Deployed successfully on Netlify
- Started OAuth debugging

### 2026-08-26

- Created V4.1 Next.js/Supabase project foundation
- Added Roadmap 1 schema migration
- Built Home, Passport, Life Journey, Shared Home, and Family interface
- Added Family and sharing migration with RLS policies
