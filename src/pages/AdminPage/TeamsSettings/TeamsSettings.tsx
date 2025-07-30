import React, { useState } from 'react';
import { Tag, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useFetchTeamsAdmin } from '@/hooks/useQueries';
import { Team } from '@/types';
import { DeleteTeamsButton } from '@/shared/DeleteTeamsButton';
import { EditTeamModal } from '@/components/Modal/EditTeamModal';
import { TableSettings } from '@/shared/TableSettings';
import type { ColumnsType } from 'antd/lib/table';
import type { DefaultOptionType } from 'antd/lib/select';
import { CreateTeamModal } from '@/components/Modal/CreateTeamModal';

export const TeamsSettings: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(
    parseInt(localStorage.getItem('tablePageSize') || '10'),
  );
  const { data: allTeams = [], isLoading, isError, error } = useFetchTeamsAdmin();
  const [editTeamOpen, setEditTeamOpen] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const handleEditSuccess = () => {
    setEditTeamOpen(false);
    setEditingTeam(null);
  };

  const filterOptions: DefaultOptionType[] = [
    { value: 'name', label: 'Name' },
    { value: 'id', label: 'ID' },
  ];

  const columns: ColumnsType<Team> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Team',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      key: 'verified',
      render: (verified) => (verified ? <Tag color="green">verified</Tag> : null),
    },
    {
      title: 'Hidden',
      dataIndex: 'hidden',
      key: 'hidden',
      render: (hidden) => (hidden ? <Tag color="red">hidden</Tag> : null),
    },
    {
      title: 'Banned',
      dataIndex: 'banned',
      key: 'banned',
      render: (banned) => (banned ? <Tag color="red">banned</Tag> : null),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingTeam(record);
              setEditTeamOpen(true);
            }}
          />
          <DeleteTeamsButton id={record.id} name={record.name} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableSettings<Team>
        pageSize={pageSize}
        data={allTeams}
        isLoading={isLoading}
        isError={isError}
        error={error}
        columns={columns}
        filterOptions={filterOptions}
        buttonText="Create Team"
        onActionClick={() => setCreateOpen(true)}
        actionModal={
          <CreateTeamModal
            open={createOpen}
            onCancel={() => setCreateOpen(false)}
            onSuccess={() => {
              setCreateOpen(false);
            }}
          />
        }
        editModal={
          editTeamOpen &&
          editingTeam && (
            <EditTeamModal
              open={editTeamOpen}
              onCancel={() => setEditTeamOpen(false)}
              onSuccess={handleEditSuccess}
              initialValues={{
                id: editingTeam.id,
                name: editingTeam.name,
                verified: editingTeam.verified,
                banned: editingTeam.banned,
                hidden: editingTeam.hidden,
              }}
            />
          )
        }
        onPageSizeChange={(size) => {
          setPageSize(size);
          localStorage.setItem('tablePageSize', size.toString());
        }}
        initialSort={{ columnKey: 'id', order: 'ascend' }}
      />
    </>
  );
};

export default TeamsSettings;
