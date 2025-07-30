import React, { useState, useEffect } from 'react';
import { Modal, Input, Flex, Button } from 'antd';
import { isValidEmail } from '@/lib/helpers';
import styles from './CreateUserModal.module.css';
import { useCreateUser } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateUserModal: React.FC<Props> = ({ open, onCancel, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');

  const createUserMutation = useCreateUser();

  const isDisabled = !name.trim() || !!emailError || !!passError || !email || !password;

  useEffect(() => {
    if (open) {
      setName('');
      setEmail('');
      setPassword('');
      setEmailError('');
      setPassError('');
    }
  }, [open]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value === '') {
      setEmailError('');
    } else if (!isValidEmail(value) || /[а-яё]/i.test(value)) {
      setEmailError('Enter the correct email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/[а-яё]/i.test(val)) {
      setPassError('Password must not contain Cyrillic characters');
    } else {
      setPassError('');
      setPassword(val);
    }
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/[а-яё]/i.test(e.key)) {
      e.preventDefault();
      setPassError('Password must not contain Cyrillic characters');
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    if (emailError || passError || !email || !password) return;
    createUserMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
    setName('');
    setEmail('');
    setPassword('');
    setEmailError('');
    setPassError('');
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        onOk={onSuccess}
        title="Create User"
        closable={false}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreate} disabled={isDisabled}>
            Create
          </Button>,
        ]}
      >
        <Flex gap="middle" vertical>
          <Input placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
          <Input type="email" placeholder="Email" onChange={handleEmailChange} value={email} />
          {emailError && <div className={styles.emailError}>{emailError}</div>}
          <Input.Password
            placeholder="Password"
            onChange={handlePasswordChange}
            onKeyDown={handlePasswordKeyPress}
            value={password}
          />
          {passError && <div className={styles.emailError}>{passError}</div>}
        </Flex>
      </Modal>
    </>
  );
};
