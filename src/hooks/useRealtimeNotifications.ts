'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Notification } from '@/types';

interface UseRealtimeNotificationsOptions {
  userId: string;
  familyId: string;
}

interface UseRealtimeNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  clearAll: () => void;
}

export function useRealtimeNotifications({
  userId,
  familyId,
}: UseRealtimeNotificationsOptions): UseRealtimeNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('family_id', familyId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      const formatted: Notification[] = data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        family_id: item.family_id,
        type: item.type,
        title: item.title,
        message: item.message,
        actor_name: item.actor_name,
        actor_avatar: item.actor_avatar,
        ref_id: item.ref_id,
        ref_type: item.ref_type,
        is_read: item.is_read,
        created_at: item.created_at,
      }));
      setNotifications(formatted);
      setUnreadCount(formatted.filter((n) => !n.is_read).length);
    }
  }, [userId, familyId, supabase]);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!userId || !familyId) return;

    // Fetch initial data
    fetchNotifications();

    // Subscribe to realtime changes on the notifications table
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotification: Notification = {
              id: payload.new.id,
              user_id: payload.new.user_id,
              family_id: payload.new.family_id,
              type: payload.new.type,
              title: payload.new.title,
              message: payload.new.message,
              actor_name: payload.new.actor_name,
              actor_avatar: payload.new.actor_avatar,
              ref_id: payload.new.ref_id,
              ref_type: payload.new.ref_type,
              is_read: payload.new.is_read,
              created_at: payload.new.created_at,
            };
            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Optional: play a gentle notification sound
            try {
              const audio = new Audio('/sounds/notification.mp3');
              audio.volume = 0.3;
              audio.play().catch(() => {}); // Silently fail if user hasn't interacted
            } catch {
              // Ignore audio errors
            }
          } else if (payload.eventType === 'UPDATE') {
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === payload.new.id
                  ? { ...n, is_read: payload.new.is_read }
                  : n
              )
            );
            // Recalculate unread count
            setNotifications((prev) => {
              setUnreadCount(prev.filter((n) => !n.is_read).length);
              return prev;
            });
          } else if (payload.eventType === 'DELETE') {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, familyId, fetchNotifications, supabase]);

  // Mark a single notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [userId, supabase]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [userId, supabase]);

  // Clear a single notification
  const clearNotification = useCallback(
    async (notificationId: string) => {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [userId, supabase]
  );

  // Clear all notifications
  const clearAll = useCallback(async () => {
    await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);

    setNotifications([]);
    setUnreadCount(0);
  }, [userId, supabase]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
  };
}
