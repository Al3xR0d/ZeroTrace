import React, { useState } from 'react';
import { Tag, Button, Space, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { TableSettings } from '@/shared/TableSettings';
import type { ColumnsType } from 'antd/lib/table';
import type { DefaultOptionType } from 'antd/lib/select';
import { CreateChallengeModal } from '@/components/Modal/CreateChallengeModal';
import { EditChallengeModal } from '@/components/Modal/EditChallengeModal';
import { DeleteButton } from '@/shared/DeleteButton';
import { useDeleteChallenge, useFetchAllChallengesAdmin } from '@/hooks/useQueries';
import { Challenge } from '@/types';
import { categoriesMap } from '@/lib/categories';
import { useNavigate } from 'react-router-dom';

export const Challenges: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(
    parseInt(localStorage.getItem('tablePageSize') || '10'),
  );
  const [editChallengeOpen, setEditChallengeOpen] = useState<boolean>(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: allChallenges = [], isLoading, isError, error } = useFetchAllChallengesAdmin();

  const handleEditSuccess = () => {
    setEditChallengeOpen(false);
    setEditingChallenge(null);
  };

  const { Link } = Typography;
  const navigate = useNavigate();

  const filterOptions: DefaultOptionType[] = [
    { value: 'name', label: 'Name' },
    { value: 'id', label: 'ID' },
  ];

  const columns: ColumnsType<Challenge> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <Link onClick={() => navigate(`/admin/challenges/${record.id}`)}>{record.name}</Link>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (category) => categoriesMap.get(category),
      // sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      render: (state) =>
        state === 'visible' ? <Tag color="green">visible</Tag> : <Tag color="red">hidden</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingChallenge(record);
              setEditChallengeOpen(true);
            }}
          />
          <DeleteButton
            id={record.id}
            name={record.name}
            useDelete={useDeleteChallenge}
            successMessage={`Challenge "${record.name}" removed`}
            errorMessage={`Cannot delete challenge "${record.name}"`}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableSettings<Challenge>
        pageSize={pageSize}
        data={allChallenges}
        isLoading={isLoading}
        isError={isError}
        error={error}
        columns={columns}
        filterOptions={filterOptions}
        buttonText="Create Challenge"
        onActionClick={() => setCreateOpen(true)}
        actionModal={
          <CreateChallengeModal
            open={createOpen}
            onCancel={() => setCreateOpen(false)}
            onSuccess={() => {
              setCreateOpen(false);
            }}
          />
        }
        editModal={
          editChallengeOpen &&
          editingChallenge && (
            <EditChallengeModal
              open={editChallengeOpen}
              onCancel={() => setEditChallengeOpen(false)}
              onSuccess={handleEditSuccess}
              initialValues={{
                id: editingChallenge.id,
                name: editingChallenge.name,
                value: editingChallenge.value,
                state: editingChallenge.state,
                description: editingChallenge.description,
                max_attempts: editingChallenge.max_attempts,
                type: editingChallenge.type,
                category_id: editingChallenge.category_id,
                start: editingChallenge.start,
                end: editingChallenge.end,
                freeze: editingChallenge.freeze,
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

export default Challenges;
