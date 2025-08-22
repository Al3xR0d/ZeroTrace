import React, { useEffect, useState } from 'react';
import { Button, Flex, Switch, Badge } from 'antd';
import styles from './MenuPage.module.css';
import { UserOutlined, AudioOutlined, AudioMutedOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { useAudioStore } from '@/store/audioStore';
import { useNotificationsSSE, useCurrentUser } from '@/hooks/useQueries';
import { useNotificationStore } from '@/store/notificationsStore';
import { NotificationModal } from '@/components/Modal/NotificationModal';
import { useLocation } from 'react-router-dom';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notifications, unreadCount, markAsRead, clearAll } = useNotificationStore();
  const { refetch } = useCurrentUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const clearUser = useUserStore((store) => store.clearUser);
  const currentUser = useUserStore((store) => store.currentUser);
  const isAuthenticated = !!currentUser?.name;
  const { enabled, setEnabled } = useAudioStore();

  const location = useLocation();

  useNotificationsSSE();

  const handleProfileClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    clearUser();
    await useUserStore.persist.clearStorage();
    queryClient.clear();
    document.cookie = 'duck=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setLoggedOut(true);
    console.log(currentUser);
    navigate('/menu', { replace: true });
  };

  if (!isAuthenticated && location.pathname !== '/menu') {
    navigate('/menu', { replace: true });
  }

  useEffect(() => {
    if (location.pathname === '/menu' && !loggedOut) {
      refetch();
    }
  }, [location.pathname, loggedOut]);

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
            {/* <div className={styles.audioToggle}>
              <Switch
                checked={enabled}
                onChange={(val) => setEnabled(val)}
                checkedChildren={<AudioOutlined />}
                unCheckedChildren={<AudioMutedOutlined />}
              />
            </div> */}
          </>
        )}
      </Flex>

      {isModalOpen && <NotificationModal open={isModalOpen} onCancel={() => setModalOpen(false)} />}
    </div>
  );
};

export default MenuPage;
