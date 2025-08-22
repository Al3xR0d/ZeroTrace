import React, { useState, useCallback, useMemo } from 'react';
import { Collapse, Typography } from 'antd';
import { ChallengesLayout } from '@/components/Layout/ChallengesLayout';
import { categoriesMap } from '@/lib/categories';
import styles from './TasksPage.module.css';
import { useFetchCurrentChallengeUser } from '@/hooks/useQueries';
import { ChallengeModal } from '@/components/Modal/ChallengeModal';
import { PanelContent } from '@/components/PanelContent';

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

  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [challengeModalOpen, setChallengeModalOpen] = useState<boolean>(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

  const { data: currentChallenge } = useFetchCurrentChallengeUser(selectedChallengeId ?? 0);

  const handleChallengeClick = useCallback((id: number, categoryName: string) => {
    setChallengeModalOpen(true);
    setSelectedChallengeId(id);
    setSelectedCategoryName(categoryName);
  }, []);

  const collapseItems = useMemo(
    () =>
      categories.map(([id, name]) => ({
        key: id.toString(),
        label: <HeaderLabel name={name} />,
        forceRender: true,
        children: (
          <PanelContent
            categoryId={id}
            categoryName={name}
            onChallengeClick={handleChallengeClick}
          />
        ),
      })),
    [categories, handleChallengeClick],
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
            setSelectedCategoryName(null);
          }}
          currentChallenge={currentChallenge}
          categoryName={selectedCategoryName}
        />
      )}
    </ChallengesLayout>
  );
};

export default TasksPage;
