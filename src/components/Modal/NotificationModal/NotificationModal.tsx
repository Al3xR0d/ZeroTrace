import React from 'react';
import { Modal, List, Typography, Flex } from 'antd';
import { useNotificationStore } from '@/store/notificationsStore';
import { ClientNotification } from '@/types';
import styles from './NotificationModal.module.css';
import { CloseSquare } from '@/shared/CloseSquare';

interface NotificationModalProps {
  open: boolean;
  onCancel: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ open, onCancel }) => {
  const { notifications, unreadCount, markAsRead } = useNotificationStore();

  return (
    <Modal
      open={open}
      title={`​/:// ALERTS — ${unreadCount} NEW`}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      wrapClassName={styles.modal}
      closeIcon={<CloseSquare />}
      className={styles.customModal}
    >
      <div className={styles.header}>
        <Typography.Text className={styles.headerText}>● SYSTEM NOTIFICATIONS</Typography.Text>
      </div>
      <div className={styles.listContainer}>
        <List<ClientNotification>
          dataSource={notifications}
          locale={{ emptyText: <span className={styles.empty}>no alerts</span> }}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className={`${styles.item} ${item.isRead ? styles.read : styles.unread}`}
              onClick={() => markAsRead(item.id)}
            >
              <div className={styles.meta}>
                <Typography.Text className={styles.title}>{item.title}</Typography.Text>
                <Typography.Text className={styles.desc}>{item.content}</Typography.Text>
              </div>
              <Typography.Text className={styles.date}>
                <Flex vertical align="center">
                  <span className={styles.datePart}>
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <span className={styles.timePart}>
                    {new Date(item.date).toLocaleTimeString()}
                  </span>
                </Flex>
              </Typography.Text>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};
