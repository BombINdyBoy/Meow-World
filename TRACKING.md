# Meow World V4.1 Heart Edition Tracking

**Updated:** 2026-08-26  
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
| Home | Not started | Basic overview of pets and recent activity remains |
| Shared Home | Not started | Shared access boundary and member view remain |
| Family | Not started | Member roles and permissions remain |
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
- [ ] Verify RLS with an owner and a different authenticated user
- [ ] Define the basic backup and recovery procedure
- [ ] Test with real user and pet data
- [ ] Document setup and first-use steps

## Foundation Reserved For Later

The schema keeps ownership and event boundaries explicit so Home, Shared Home, and Family can be added without changing the Roadmap 1 data contract unnecessarily. QR, storage, social, AI, and multi-species capabilities remain reserved for later work.

## Out Of Scope For This Iteration

QR, Marketplace, Biometrics, Advanced Storage, Social, AI Features, Gamification, Subscription, Multi-species ecosystem, and the full Graphic Engine.

## Validation Notes

- Migration: `supabase/migrations/20260826000000_init_schema.sql`
- Run `npm run lint` before each commit.
- Run `npm run build` before pushing a release-ready change.
- Never commit `.env.local`; use `.env.local.example` for required variable names.

## Change Log

### 2026-08-26

- Created the V4.1 Next.js/Supabase project foundation.
- Added the Roadmap 1 schema migration for profiles, pets, and Life Journey events.
- Added initial status tracking for implementation and verification work.
- Added Home, Shared Home, and Family to the active planning scope.
