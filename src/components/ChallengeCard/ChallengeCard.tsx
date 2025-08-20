import React from 'react';
import styles from './ChallengeCard.module.css';
import { Flex } from 'antd';

interface Props {
  name: string;
  value: number;
  id: number;
  onClick: (id: number) => void;
}

export const ChallengeCard: React.FC<Props> = ({ name, value, id, onClick }) => {
  return (
    <div className={styles.wrapper} onClick={() => onClick(id)}>
      <Flex vertical gap="middle">
        <div className={styles.card}>
          <div className={styles.value}>›_{value}</div>
        </div>
        <div className={styles.filename}>{name}.txt</div>
      </Flex>
    </div>
  );
};
