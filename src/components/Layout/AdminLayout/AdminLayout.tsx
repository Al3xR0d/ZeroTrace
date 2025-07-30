import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button, Menu } from 'antd';
import type { MenuProps } from 'antd';
import styles from './AdminLayout.module.css';
import { CloseSquare } from '@/shared/CloseSquare';

const items: MenuProps['items'] = [
  {
    label: 'CTFs settings',
    key: 'ctf',
    children: [
      {
        type: 'group',
        label: 'Access',
        children: [
          { label: 'Visibility', key: 'ctf/visibility' },
          { label: 'Start and End Time', key: 'ctf/times' },
        ],
      },
    ],
  },
  {
    label: 'Users settings',
    key: 'users',
  },
  {
    label: 'Teams settings',
    key: 'teams',
  },
  {
    label: 'Notifications',
    key: 'notifications',
  },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = pathname.replace(/^\/admin\/?/, '') || 'ctf';

  const onClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key as string);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CloseSquare />
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
