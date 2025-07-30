import React from 'react';
import { RatingTable } from '@/components/Table';
import { ColumnDef } from '@/types';
import styles from './RatingPage.module.css';
import { CloseSquare } from '@/shared/CloseSquare';

export interface RatingItem {
  id: number;
  rank?: number;
  name: string;
  score: number;
  tasksCompleted: number;
  lastActivity: string;
}

const mockRatingData: RatingItem[] = [
  { id: 1, name: 'User 1', score: 150, tasksCompleted: 15, lastActivity: '2023-10-15' },
  { id: 2, name: 'User 2', score: 140, tasksCompleted: 14, lastActivity: '2023-10-14' },
  { id: 3, name: 'User 3', score: 160, tasksCompleted: 13, lastActivity: '2023-10-13' },
  { id: 4, name: 'User 4', score: 120, tasksCompleted: 12, lastActivity: '2023-10-13' },
  { id: 5, name: 'User 5', score: 110, tasksCompleted: 11, lastActivity: '2023-10-13' },
  { id: 6, name: 'User 6', score: 200, tasksCompleted: 10, lastActivity: '2023-10-13' },
  { id: 7, name: 'User 7', score: 90, tasksCompleted: 9, lastActivity: '2023-10-13' },
  { id: 8, name: 'User 8', score: 380, tasksCompleted: 8, lastActivity: '2023-10-13' },
];

const ratingColumnsConfig: ColumnDef<RatingItem>[] = [
  { title: '#', dataIndex: 'rank', key: 'rank', align: 'center' },
  { title: 'User name', dataIndex: 'name', key: 'name', align: 'center' },
  { title: 'Score', dataIndex: 'score', key: 'score', align: 'center' },
  { title: 'Tasks', dataIndex: 'tasksCompleted', key: 'tasksCompleted', align: 'center' },
  { title: 'Activity', dataIndex: 'lastActivity', key: 'lastActivity', align: 'left' },
];

export const RatingPage: React.FC = () => {
  const data = [...mockRatingData]
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  return (
    <>
      <div className={styles.pageContainer}>
        <CloseSquare />
        <h1 className={styles.pageHeader}>Rating of participants</h1>
        <RatingTable columns={ratingColumnsConfig} data={data} pageSize={5} />
      </div>
    </>
  );
};

export default RatingPage;
