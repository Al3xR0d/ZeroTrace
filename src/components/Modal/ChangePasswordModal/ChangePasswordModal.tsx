import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { useChangePassword } from '@/hooks/useQueries';
import styles from './ChangePasswordModal.module.css';

interface Props {
  open: boolean;
  onCancel: () => void;
}

export const ChangePasswordModal: React.FC<Props> = ({ open, onCancel }) => {
  const [passwordValue, setPasswordValue] = useState<string>('');

  const mutation = useChangePassword();

  const handleSubmit = () => {
    mutation.mutate(
      { password: passwordValue },
      {
        onSuccess: () => {
          setPasswordValue('');
          onCancel();
        },
      },
    );
  };

  return (
    <Modal
      className={styles.modal}
      open={open}
      maskClosable={false}
      onCancel={onCancel}
      onOk={handleSubmit}
      closable={false}
      centered
      title="Change password"
      okText="Change"
    >
      <Input
        placeholder="Enter a new password"
        onChange={(e) => setPasswordValue(e.target.value)}
      />
    </Modal>
  );
};
