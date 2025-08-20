import React from 'react';
import { CloseSquare } from '@/shared/CloseSquare';
import styles from './ChallengesLayout.module.css';

interface Props {
  children: React.ReactNode;
}

export const ChallengesLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <CloseSquare />
        </div>
        {children}
      </div>
    </>
  );
};
