import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import styles from './TeamsPage.module.css';
import { useFetchTeams } from '@/hooks/useQueries';
import { Team } from '@/types';
import { formatToMoscowDate, toMoscowDateObject } from '@/lib/date';
import { CloseSquare } from '@/shared/CloseSquare';
import { RatingTable } from '@/components/Table';
import { ColumnDef } from '@/types';

interface Teams {
  id: number;
  name: string;
  created: string;
  _createdRaw: Date;
  rank?: number;
  tasksCompleted?: number;
  lastActivity?: string;
}

export const TeamsPage: React.FC = () => {
  const { data: teams = [] } = useFetchTeams();
  const navigate = useNavigate();

  const ratingColumnsConfig: ColumnDef<Teams>[] = [
    {
      title: '№',
      dataIndex: 'rank',
      key: 'rank',
      align: 'center',
    },
    {
      title: 'Team name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Date of creation',
      dataIndex: 'created',
      key: 'created',
      align: 'center',
    },
  ];

  const data: Teams[] = teams
    .map((item: Team) => ({
      id: item.id,
      name: item.name,
      _createdRaw: toMoscowDateObject(item.created),
      created: formatToMoscowDate(item.created),
    }))
    // .sort((a, b) => b._createdRaw.getTime() - a._createdRaw.getTime())
    .map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

  return (
    <div className={styles.pageContainer}>
      <CloseSquare />
      <h1 className={styles.pageHeader}>Teams</h1>
      <div className={styles.tableWrapper}>
        {/* <Table
          columns={ratingColumnsConfig}
          dataSource={data}
          pagination={{ pageSize: 10, className: styles.customPagination }}
          rowKey="id"
        /> */}
        <RatingTable columns={ratingColumnsConfig} data={data} />
      </div>
    </div>
  );
};

export default TeamsPage;
