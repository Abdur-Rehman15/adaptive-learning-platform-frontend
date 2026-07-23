import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import { fetchNotifications, markNotificationAsRead } from '../api/notifications.api';
import type { Notification } from '../types/notifications.types';

export const useNotifications = () => {
  const { token } = useAuth();

  return useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: () => {
      if (!token) return [];
      return fetchNotifications(token);
    },
    enabled: !!token,
  });
};

export const useMarkAllAsRead = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationIds: number[]) => {
      if (!token || notificationIds.length === 0) return;
      await Promise.all(
        notificationIds.map((id) => markNotificationAsRead(token, id))
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
