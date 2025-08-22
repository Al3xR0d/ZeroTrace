import React from 'react';
import { Spin } from 'antd';
import styles from './PanelContent.module.css';
import { useFetchAllChallenges } from '@/hooks/useQueries';
import { ChallengeCard } from '@/components/ChallengeCard';

interface PanelContentProps {
  categoryId: number;
  categoryName: string;
  onChallengeClick: (id: number, categoryName: string) => void;
}

export const PanelContent: React.FC<PanelContentProps> = ({
  categoryId,
  categoryName,
  onChallengeClick,
}) => {
  const { data: challenges = [], isLoading, isError } = useFetchAllChallenges(categoryId);

  return (
    <div className={styles.panelBody}>
      <div className={styles.panelContent}>
        {isLoading ? (
          <Spin />
        ) : isError ? (
          <span className={styles.message}>Download error</span>
        ) : challenges.length > 0 ? (
          <div className={styles.cardsGrid}>
            {challenges
              .sort((a, b) => a.value - b.value)
              .map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  id={challenge.id}
                  name={challenge.name}
                  value={challenge.value}
                  onClick={() => onChallengeClick(challenge.id, categoryName)}
                  done={challenge.solved_by_me}
                />
              ))}
          </div>
        ) : (
          <span className={styles.message}>No challenges yet</span>
        )}
      </div>
    </div>
  );
};
