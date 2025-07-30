import React from 'react';
import styles from './DescriptionText.module.css';
import { Typography } from 'antd';

interface Props {
  text: string;
}

const { Text } = Typography;

export const DescriptionText: React.FC<Props> = ({ text }) => {
  return (
    <>
      <Text className={styles.text}>{text}</Text>
    </>
  );
};
