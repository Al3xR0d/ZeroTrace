import React, { useState } from 'react';
import { Tag, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useFetchAllUsersAdmin } from '@/hooks/useQueries';
import { AllUsers } from '@/types';
import { EditUserModal } from '@/components/Modal/EditUserModal';
import { TableSettings } from '@/shared/TableSettings';
import type { ColumnsType } from 'antd/lib/table';
import type { DefaultOptionType } from 'antd/lib/select';
import { CreateUserModal } from '@/components/Modal/CreateUserModal';
import { DeleteButton } from '@/shared/DeleteButton';
import { useDeleteUser } from '@/hooks/useQueries';

export const UsersSettings: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(
    parseInt(localStorage.getItem('tablePageSize') || '10'),
  );
  const { data: allUsers = [], isLoading, isError, error } = useFetchAllUsersAdmin();
  const [editUserOpen, setEditUserOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<AllUsers | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const handleEditSuccess = () => {
    setEditUserOpen(false);
    setEditingUser(null);
  };

  const filterOptions: DefaultOptionType[] = [
    { value: 'name', label: 'Name' },
    { value: 'id', label: 'ID' },
  ];

  const columns: ColumnsType<AllUsers> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Admin',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (type === 'admin' ? <Tag color="blue">admin</Tag> : null),
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
              setEditingUser(record);
              setEditUserOpen(true);
            }}
          />
          {/* <DeleteUserButton id={record.id} name={record.name} /> */}
          <DeleteButton id={record.id} name={record.name} useDelete={useDeleteUser} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <TableSettings<AllUsers>
        pageSize={pageSize}
        data={allUsers}
        isLoading={isLoading}
        isError={isError}
        error={error}
        columns={columns}
        filterOptions={filterOptions}
        buttonText="Create User"
        onActionClick={() => setCreateOpen(true)}
        actionModal={
          <CreateUserModal
            open={createOpen}
            onCancel={() => setCreateOpen(false)}
            onSuccess={() => {
              setCreateOpen(false);
            }}
          />
        }
        editModal={
          editUserOpen &&
          editingUser && (
            <EditUserModal
              open={editUserOpen}
              onCancel={() => setEditUserOpen(false)}
              onSuccess={handleEditSuccess}
              initialValues={{
                id: editingUser.id,
                name: editingUser.name,
                email: editingUser.email,
                type: editingUser.type,
                banned: editingUser.banned,
                verified: editingUser.verified,
                hidden: editingUser.hidden,
                team_id: editingUser.team_id,
                properties: editingUser.properties,
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

export default UsersSettings;
