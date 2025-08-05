import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClientNotification, ServerNotification } from '@/types/domain/Notifications';

interface NotificationStore {
  notifications: ClientNotification[];
  unreadCount: number;
  addNotification: (notif: ServerNotification) => void;
  markAsRead: (id: number) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (server) => {
        if (get().notifications.find((n) => n.id === server.id)) return;
        const client: ClientNotification = { ...server, isRead: false };
        set((state) => ({
          notifications: [client, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          );
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.isRead).length,
          };
        });
      },

      clearAll: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),
    }),
    {
      name: 'notification-storage',
    },
  ),
);
