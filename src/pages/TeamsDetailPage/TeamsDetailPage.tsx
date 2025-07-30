import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Alert, Table } from 'antd';
import { useFetchCurrentTeam } from '@/hooks/useQueries';
import styles from './TeamsDetailPage.module.css';
import type { ColumnsType } from 'antd/es/table';
import { useFetchTeamMembers } from '@/hooks/useQueries';
import { User } from '@/types';

// interface MembersTable {
//   name: string;
//   score?: number;
// }

const membersColumnsConfig: ColumnsType<User> = [
  {
    title: 'User name',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    align: 'center',
  },
];

export const TeamsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: team, isLoading, isError, error } = useFetchCurrentTeam(id!);
  const { data: members } = useFetchTeamMembers(id!);

  if (isLoading) return <Spin />;
  if (isError)
    return <Alert type="error" message="Command loading error" description={String(error)} />;

  return (
    <div className={styles.pageContainer}>
      <Button onClick={() => navigate(-1)}>← Back</Button>
      <span className={styles.teamName}>{team && team.name}</span>
      <Table
        columns={membersColumnsConfig}
        dataSource={members}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />
    </div>
  );
};

export default TeamsDetailPage;
