'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Notification } from '@/types';

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
}

function getNotificationIcon(type: string): string {
  switch (type) {
    case 'new_event':
      return '📝';
    case 'new_comment':
      return '💬';
    case 'new_like':
      return '❤️';
    case 'new_member':
      return '👤';
    case 'pet_added':
      return '🐱';
    case 'certificate_issued':
      return '🏅';
    default:
      return '🔔';
  }
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'เมื่อสักครู่';
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
  if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`;
  if (diffDay < 7) return `${diffDay} วันที่แล้ว`;
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[#59554F] hover:bg-[#F3EFEA] hover:text-[#1F1E1D] transition-all"
        title="การแจ้งเตือน"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#E06D53] text-white text-[10px] font-bold rounded-full px-1 shadow-md animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] bg-white rounded-2xl border border-[#E8E2D9] shadow-xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#E8E2D9] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-sm text-[#1F1E1D]">การแจ้งเตือน</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#E06D53] text-white text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-[#6B8E68] hover:bg-[#EBF1E8] transition-colors"
                >
                  <Check className="w-3 h-3" />
                  อ่านทั้งหมด
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-[#E06D53] hover:bg-[#FDEEEB] transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  ล้างทั้งหมด
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-[400px]">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-4xl mb-3">🔔</div>
                <p className="text-sm text-[#8C867E] font-medium">ยังไม่มีการแจ้งเตือน</p>
                <p className="text-xs text-[#B5AFA8] mt-1">
                  เมื่อมีกิจกรรมใหม่ในบ้าน จะปรากฏที่นี่
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-[#F3EFEA] hover:bg-[#FAF7F2] transition-colors cursor-pointer group ${
                    !notification.is_read ? 'bg-[#FDF9F3]' : ''
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      onMarkAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon or Avatar */}
                    <div className="relative shrink-0">
                      {notification.actor_avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={notification.actor_avatar}
                          alt={notification.actor_name}
                          className="w-10 h-10 rounded-full object-cover border border-[#E8E2D9]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#EBF1E8] flex items-center justify-center text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                      {!notification.is_read && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#E06D53] rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1F1E1D] leading-snug">
                        <span className="font-bold">{notification.actor_name}</span>{' '}
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[#8C867E]">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                        <span className="text-[11px] text-[#B5AFA8]">•</span>
                        <span className="text-[11px] text-[#8C867E]">
                          {notification.title}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearNotification(notification.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[#8C867E] hover:text-[#E06D53] hover:bg-[#FDEEEB] transition-all shrink-0"
                      title="ลบการแจ้งเตือน"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[#E8E2D9] bg-[#FAF7F2] text-center">
              <span className="text-[11px] text-[#8C867E]">
                {notifications.length} การแจ้งเตือน •{' '}
                {unreadCount > 0 ? `${unreadCount} ยังไม่อ่าน` : 'อ่านทั้งหมดแล้ว'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
