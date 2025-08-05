import React from 'react';
import styles from './DescriptionText.module.css';
import { Typography } from 'antd';

interface Props {
  children: React.ReactNode;
}

export const DescriptionText: React.FC<Props> = ({ children }) => {
  return <Typography.Text className={styles.text}>{children}</Typography.Text>;
};
