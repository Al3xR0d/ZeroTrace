import React, { useEffect, useState } from 'react';
import { Button, Flex, Switch, Badge } from 'antd';
import styles from './MenuPage.module.css';
import { UserOutlined, AudioOutlined, AudioMutedOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { useAudioStore } from '@/store/audioStore';
import { useNotificationsSSE } from '@/hooks/useQueries';
import { useNotificationStore } from '@/store/notificationsStore';
import { NotificationModal } from '@/components/Modal/NotificationModal';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotificationStore();
  const [isModalOpen, setModalOpen] = useState(false);

  const clearUser = useUserStore((store) => store.clearUser);
  const currentUser = useUserStore((store) => store.currentUser);
  const isAuthenticated = !!currentUser?.name;
  const { enabled, setEnabled } = useAudioStore();

  useNotificationsSSE();

  const handleProfileClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    clearUser();
    queryClient.removeQueries();
    await useUserStore.persist.clearStorage();
    document.cookie = 'duck=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // useNotificationStore.getState().clearAll();
    // await useNotificationStore.persist.clearStorage();
    navigate('/menu', { replace: true });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/menu', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileWrapper}>
        <div
          className={`${styles.profileContainer} ${isAuthenticated ? styles.noHover : ''}`}
          onClick={handleProfileClick}
        >
          <UserOutlined className={styles.profileIcon} />
          <span className={styles.profileText}>
            {isAuthenticated ? currentUser?.name : 'Profile'}
          </span>
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
            <div className={styles.audioToggle}>
              <Switch
                checked={enabled}
                onChange={(val) => setEnabled(val)}
                checkedChildren={<AudioOutlined />}
                unCheckedChildren={<AudioMutedOutlined />}
              />
            </div>
          </>
        )}
      </Flex>

      {isModalOpen && <NotificationModal open={isModalOpen} onCancel={() => setModalOpen(false)} />}
    </div>
  );
};

export default MenuPage;
