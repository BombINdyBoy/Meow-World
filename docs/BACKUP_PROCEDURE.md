# 🔄 Backup & Recovery Procedure

## Backup Strategy

### 1. Database Backup (Supabase)

**Automatic:**
- Supabase Free: Daily backups (7 days retention)
- Supabase Pro: Point-in-time recovery

**Manual Backup:**
```bash
# Export schema
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Or use Supabase Dashboard
# Settings > Database > Backups > Download backup
```

### 2. Code Backup (GitHub)

- All code is on GitHub (remote backup)
- Branch protection rules recommended
- Tags for releases

### 3. Environment Variables

- Store in password manager (not in repo)
- Document required variables in `.env.local.example`

## Recovery Steps

### Scenario 1: Database Corruption

```sql
-- 1. Stop the app (set Vercel to maintenance mode)
-- 2. Restore from backup
psql $DATABASE_URL < backup_20260831.sql

-- 3. Verify tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- 4. Test RLS
SELECT * FROM homes LIMIT 5;
SELECT * FROM pets LIMIT 5;

-- 5. Restart the app
```

### Scenario 2: Accidental Data Deletion

```sql
-- 1. Check if data exists in trash (Supabase Pro)
-- 2. Or restore from backup
-- 3. Or use soft deletes (recommended)

-- Add soft delete column if not exists
ALTER TABLE pets ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE life_journey_events ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Instead of DELETE, use:
UPDATE pets SET deleted_at = NOW() WHERE id = 'xxx';

-- Query active records:
SELECT * FROM pets WHERE deleted_at IS NULL;
```

### Scenario 3: RLS Policy Broken

```sql
-- 1. Check current policies
SELECT * FROM pg_policies WHERE tablename = 'xxx';

-- 2. Drop problematic policy
DROP POLICY IF EXISTS "policy_name" ON public.tablename;

-- 3. Recreate correct policy
CREATE POLICY "correct_policy" ON public.tablename
  FOR SELECT USING (condition);

-- 4. Verify
SELECT * FROM pg_policies WHERE tablename = 'xxx';
```

## Preventive Measures

| Measure | Frequency |
|---|---|
| Database backup (automatic) | Daily |
| Code backup (GitHub) | Every commit |
| Test backup restore | Monthly |
| Review RLS policies | After any migration |
| Monitor error logs | Daily |
| Update dependencies | Weekly |

## Emergency Contacts

- **Supabase Support:** support@supabase.com
- **Vercel Support:** support@vercel.com
- **GitHub Support:** support@github.com

## Quick Commands

```bash
# Check database status
curl -s $SUPABASE_URL/rest/v1/ | head -20

# Check RLS
psql $DATABASE_URL -c "SELECT * FROM pg_policies;"

# Export all data
pg_dump $DATABASE_URL > full_backup.sql

# Import data
psql $DATABASE_URL < full_backup.sql
```
