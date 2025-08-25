import React, { useEffect, useState } from 'react';
import { Button, Flex, Switch, Badge } from 'antd';
import styles from './MenuPage.module.css';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { useNotificationsSSE, useCurrentUser } from '@/hooks/useQueries';
import { useNotificationStore } from '@/store/notificationsStore';
import { NotificationModal } from '@/components/Modal/NotificationModal';
import Cookies from 'js-cookie';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotificationStore();
  const { data: userData, refetch } = useCurrentUser();
  const [isModalOpen, setModalOpen] = useState(false);

  const clearUser = useUserStore((store) => store.clearUser);
  const currentUser = useUserStore((store) => store.currentUser);
  const isAuthenticated = !!currentUser?.name;

  const location = useLocation();

  useNotificationsSSE();

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    try {
      clearUser();
      await useUserStore.persist.clearStorage();
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      document.cookie = 'duck=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      navigate('/menu', { replace: true });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/menu') {
      navigate('/menu', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    if (location.pathname === '/menu' && isAuthenticated) {
      refetch();
    }
  }, [location.pathname, isAuthenticated, refetch]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileWrapper}>
        <div
          className={`${styles.profileContainer} ${isAuthenticated ? styles.noHover : ''}`}
          onClick={handleProfileClick}
        >
          <Flex vertical gap="middle">
            <Flex align="center" gap="small">
              <UserOutlined className={styles.profileIcon} />
              <span className={styles.profileText}>
                {isAuthenticated ? currentUser?.name : 'Profile'}
              </span>
            </Flex>
            <span className={styles.profileText}>
              {isAuthenticated ? `score: ${currentUser?.score}` : ''}
            </span>
          </Flex>
        </div>
        {isAuthenticated && unreadCount > 0 && (
          <div className={styles.bellWrapper} onClick={() => setModalOpen(true)}>
            <Badge count={unreadCount} size="small" overflowCount={99}>
              <BellOutlined className={styles.bellIcon} />
            </Badge>
          </div>
        )}
      </div>
      <Flex gap="large" vertical className={styles.menu}>
        {isAuthenticated && (
          <Button className="custom-btn" onClick={() => navigate('/tasks')}>
            Tasks
          </Button>
        )}
        <Button className="custom-btn" onClick={() => navigate('/rating')}>
          Rating
        </Button>
        <Button className="custom-btn" onClick={() => navigate('/teams')}>
          Teams
        </Button>
        {isAuthenticated && (
          <>
            <Button className="custom-btn" onClick={() => navigate('/admin')}>
              Admin
            </Button>
            <Button className="custom-btn" onClick={() => navigate('/settings')}>
              Settings
            </Button>
            <Button className="custom-btn" onClick={handleLogout}>
              Exit
            </Button>
          </>
        )}
      </Flex>

      {isModalOpen && <NotificationModal open={isModalOpen} onCancel={() => setModalOpen(false)} />}
    </div>
  );
};

export default MenuPage;
