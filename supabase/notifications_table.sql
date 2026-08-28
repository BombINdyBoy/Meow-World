-- ============================================
-- Meow World: Notifications Table (Supabase)
-- ============================================
-- Run this SQL in Supabase SQL Editor (Dashboard > SQL Editor)
-- to create the notifications table for real-time notifications.

-- 1. Create the notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id   UUID NOT NULL,
  type        TEXT NOT NULL CHECK (type IN (
    'new_event', 'new_comment', 'new_like',
    'new_member', 'pet_added', 'certificate_issued'
  )),
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  actor_name  TEXT NOT NULL,
  actor_avatar TEXT,
  ref_id      UUID,
  ref_type    TEXT CHECK (ref_type IN ('event', 'pet', 'comment', 'member', 'certificate')),
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_family_id ON notifications(family_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: System/authenticated users can insert notifications
-- (In practice, this is done via Supabase client or Edge Functions)
CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 4. Enable Realtime for this table
-- Run this in Supabase Dashboard > Database > Replication > Enable replication for notifications
-- OR run:
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 5. Helper function: Mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_notifications_read(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET is_read = TRUE
  WHERE user_id = p_user_id AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Helper function: Get unread count for a user
CREATE OR REPLACE FUNCTION get_unread_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM notifications
    WHERE user_id = p_user_id AND is_read = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
