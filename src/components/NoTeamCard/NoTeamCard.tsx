import React from 'react';
import styles from './NoTeamCard.module.css';
import { CloseSquare } from '@/shared/CloseSquare';
import { Button } from 'antd';

export const NoTeamCard: React.FC = () => {
  return (
    <>
      <div className={styles.pageContainer}>
        <CloseSquare />
        <span>Welcome</span>
        <span>To participate, you are required to either join or form a team.</span>
        <Button>Create team</Button>
        <Button>Join team</Button>
      </div>
    </>
  );
};
