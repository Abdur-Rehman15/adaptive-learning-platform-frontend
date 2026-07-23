import { apiFetch } from '@/api/client';
import type { Notification } from '../types/notifications.types';

const withAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const fetchNotifications = async (token: string): Promise<Notification[]> => {
  return apiFetch<Notification[]>('/notifications', {
    method: 'GET',
    headers: withAuthHeaders(token),
  });
};

export const markNotificationAsRead = async (
  token: string,
  notificationId: number
): Promise<void> => {
  await apiFetch<null>(`/notification/${notificationId}/read`, {
    method: 'PATCH',
    headers: withAuthHeaders(token),
  });
};
