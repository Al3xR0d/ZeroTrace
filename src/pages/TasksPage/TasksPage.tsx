import React, { useState, useCallback, useMemo } from 'react';
import { Collapse, Typography, Spin } from 'antd';
import { ChallengesLayout } from '@/components/Layout/ChallengesLayout';
import { categoriesMap } from '@/lib/categories';
import styles from './TasksPage.module.css';
import {
  useFetchAllChallenges,
  useFetchCurrentChallengeUser,
  useFetchChallengeFilesUser,
} from '@/hooks/useQueries';
import { ChallengeCard } from '@/components/ChallengeCard';
import { ChallengeModal } from '@/components/Modal/ChallengeModal';

const { Title } = Typography;

const HeaderLabel: React.FC<{ name: string }> = ({ name }) => (
  <div className={styles.headerLabel}>
    <span className={styles.slash}>/</span>
    <span className={styles.keyword}>challenge</span>
    <span className={styles.slash}>/</span>
    <span className={styles.categoryName}>{name}</span>
  </div>
);

export const TasksPage: React.FC = () => {
  const categories = Array.from(categoriesMap.entries());
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [challengeModalOpen, setChallengeModalOpen] = useState<boolean>(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

  const {
    data: challenges = [],
    isLoading: challengesLoading,
    isError: challengesError,
  } = useFetchAllChallenges(challengeId ?? 0);

  const {
    data: currentChallenge,
    isLoading: currentLoading,
    isError: currentError,
  } = useFetchCurrentChallengeUser(selectedChallengeId ?? 0);

  const handleCollapseChange = useCallback((activeKey: string | string[]) => {
    if (!activeKey) {
      setChallengeId(null);
      setSelectedCategoryName(null);
      return;
    }
    const key = Array.isArray(activeKey) ? activeKey[0] : activeKey;
    const id = parseInt(key, 10);
    if (!Number.isNaN(id)) {
      setChallengeId(id);
      const categoryName = categoriesMap.get(id) ?? null;
      setSelectedCategoryName(categoryName);
    } else {
      setChallengeId(null);
      setSelectedCategoryName(null);
    }
  }, []);

  const handleChallengeClick = useCallback((id: number) => {
    setChallengeModalOpen(true);
    setSelectedChallengeId(id);
  }, []);

  const collapseItems = useMemo(
    () =>
      categories.map(([id, name]) => ({
        key: id.toString(),
        label: <HeaderLabel name={name} />,
        children: (
          <div className={styles.panelBody}>
            {challengesLoading && <Spin />}
            {challengesError && <span className={styles.message}>Download error</span>}
            {!challengesLoading && !challengesError && (
              <div className={styles.cardsGrid}>
                {challenges.length > 0 ? (
                  challenges
                    .sort((a, b) => a.value - b.value)
                    .map((challenge) => (
                      <ChallengeCard
                        key={challenge.id}
                        id={challenge.id}
                        name={challenge.name}
                        value={challenge.value}
                        onClick={handleChallengeClick}
                      />
                    ))
                ) : (
                  <span className={styles.message}>No challenges yet</span>
                )}
              </div>
            )}
          </div>
        ),
      })),
    [categories, challenges, challengesLoading, challengesError],
  );

  return (
    <ChallengesLayout>
      <div className={styles.page}>
        <Title level={2} className={styles.title}>
          Challenges
        </Title>

        <div className={styles.content}>
          <Collapse
            accordion
            bordered={false}
            className={styles.collapse}
            expandIconPosition="end"
            onChange={handleCollapseChange}
            items={collapseItems}
          />
        </div>
      </div>
      {challengeModalOpen && currentChallenge && selectedCategoryName && (
        <ChallengeModal
          open={challengeModalOpen}
          onCancel={() => {
            setChallengeModalOpen(false);
            setSelectedChallengeId(null);
          }}
          currentChallenge={currentChallenge}
          categoryName={selectedCategoryName}
        />
      )}
    </ChallengesLayout>
  );
};

export default TasksPage;
