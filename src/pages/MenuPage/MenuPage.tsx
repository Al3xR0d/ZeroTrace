import React from 'react';
import { Button, Flex, Switch } from 'antd';
import styles from './MenuPage.module.css';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import { useAudioStore } from '@/store/audioStore';

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const queryClient = useQueryClient();

  const currentUser = useUserStore((store) => store.currentUser);
  const { enabled, setEnabled } = useAudioStore();

  const handleProfileClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    queryClient.removeQueries({ queryKey: ['currentUser'] });
    useUserStore.persist.clearStorage();
    useUserStore.getState().clearUser();
    navigate('/menu', { replace: true });
  };

  return (
    <div className={styles.pageContainer}>
      <div
        className={`${styles.profileContainer} ${isAuthenticated ? styles.noHover : ''}`}
        onClick={handleProfileClick}
      >
        <UserOutlined className={styles.profileIcon} />
        <span className={styles.profileText}>
          {isAuthenticated ? currentUser?.name : 'Profile'}
        </span>
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
    </div>
  );
};

export default MenuPage;
