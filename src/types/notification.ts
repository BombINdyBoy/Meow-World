export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
