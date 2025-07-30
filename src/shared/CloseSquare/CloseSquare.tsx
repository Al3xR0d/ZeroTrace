import React from 'react';
import { CloseSquareOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './CloseSquare.module.css';

export const CloseSquare: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <CloseSquareOutlined className={styles.closeIcon} onClick={() => navigate('/menu')} />
    </>
  );
};
