import React, { useState, useEffect } from 'react';
import { Input, Button, Flex, ConfigProvider, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, ArrowLeftOutlined } from '@ant-design/icons';
import styles from './LoginPage.module.css';
import { useLogin, useCurrentUser } from '@/hooks/useQueries';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '@/store/userStore';
import { isValidEmail } from '@/lib/helpers';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const { clearUser } = useUserStore();

  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { refetch: refetchCurrentUser } = useCurrentUser();

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
    const value = e.target.value;
    if (!/[а-яё]/i.test(value)) {
      setPassword(value);
      if (passError) {
        setPassError('');
      }
    }
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/[а-яё]/i.test(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (!e) return;
    e.preventDefault();
    if (!email || !password) {
      messageApi.error('Fill in all the fields');
      return;
    }
    try {
      await loginMutation.mutateAsync({ email, password });
      await refetchCurrentUser();
      navigate('/menu');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        messageApi.error(
          error.response?.status === 401 ? 'Invalid email or password' : 'Server error',
        );
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.loginContainer}>
        <form onSubmit={handleSubmit}>
          <Flex vertical gap="middle" className={styles.loginForm}>
            <Button type="link" onClick={() => navigate('/menu')} className={styles.exitButton}>
              <ArrowLeftOutlined /> Back
            </Button>
            {emailError && <div className={styles.emailError}>{emailError}</div>}
            {passError && <div className={styles.emailError}>{passError}</div>}
            <div className={styles.inputGroup}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className={`${styles.loginInput} ${emailError ? styles.loginInputError : ''}`}
              />
              <ConfigProvider
                theme={{
                  components: {
                    Input: {
                      colorTextPlaceholder: 'rgba(255, 255, 255, 0.6)',
                    },
                  },
                }}
              >
                <Input.Password
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handlePasswordKeyPress}
                  className={`${styles.loginInput} ${passError ? styles.loginInputError : ''}`}
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    ) : (
                      <EyeInvisibleOutlined style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    )
                  }
                />
              </ConfigProvider>
            </div>
            <Button
              htmlType="submit"
              type="primary"
              className={styles.loginButton}
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Enter...' : 'Start'}
            </Button>
            <span className={styles.text}>
              The world is a dangerous place, not because of those who do evil, but because of those
              who look on and do nothing.
            </span>
          </Flex>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
