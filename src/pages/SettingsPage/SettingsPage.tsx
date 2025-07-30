import React from 'react';
import { Tabs, Tooltip, ConfigProvider, Switch } from 'antd';
import type { TabsProps } from 'antd';
import { LockOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import styles from './SettingsPage.module.css';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import { useAudioStore } from '@/store/audioStore';
import { CloseSquare } from '@/shared/CloseSquare';

export const SettingsPage: React.FC = () => {
  const { enabled, setEnabled } = useAudioStore();

  const settings = [
    {
      title: 'Account Security',
      icon: <LockOutlined />,
      items: [
        { label: 'Password', action: 'Change Password', tooltip: 'Update your login credentials' },
        {
          label: 'Two-factor Authentication',
          action: 'Enable',
          tooltip: 'Add an extra layer of security',
        },
      ],
    },
    {
      title: 'Privacy',
      icon: <UserOutlined />,
      items: [
        {
          label: 'Profile Visibility',
          action: 'Public',
          tooltip: 'Control who can see your profile',
        },
        { label: 'Data Sharing', action: 'Limited', tooltip: 'Manage data sharing preferences' },
      ],
    },
    {
      title: 'Notifications',
      icon: <NotificationOutlined />,
      items: [
        {
          label: 'Email Notifications',
          action: 'Enabled',
          tooltip: 'Configure email alert settings',
        },
      ],
    },
    {
      title: 'Music',
      icon: <AudioOutlined />,
      items: [
        {
          label: 'Background Music',
          action: (
            <Switch
              checked={useAudioStore.getState().enabled}
              onChange={(val) => useAudioStore.getState().setEnabled(val)}
              checkedChildren={<AudioOutlined />}
              unCheckedChildren={<AudioMutedOutlined />}
            />
          ),
          tooltip: 'Toggle background music',
        },
      ],
    },
  ];

  const tabs: TabsProps['items'] = settings.map((sec, i) => ({
    key: String(i),
    label: (
      <div className={styles.tabLabel}>
        {sec.icon}
        <span>{sec.title}</span>
      </div>
    ),
    children: (
      <div className={styles.tabContent}>
        {sec.items.map((it, idx) => (
          <div key={idx} className={styles.settingRow}>
            <div className={styles.settingLabel}>{it.label}</div>
            <div className={styles.settingAction}>
              <Tooltip title={it.tooltip} placement="right" rootClassName={styles.customTooltip}>
                <button className={styles.settingButton}>{it.action}</button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00db00',
          colorBgContainer: '#ffffff',
          colorBorder: '#d9d9d9',
          borderRadius: 4,
        },
      }}
    >
      <div className={styles.backgroundContainer}>
        <div className={styles.pageWrapper}>
          <CloseSquare />
          <h2 className={styles.title}>SYSTEM SETTINGS</h2>
          <Tabs defaultActiveKey="0" items={tabs} className={styles.customTabs} animated={false} />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default SettingsPage;
