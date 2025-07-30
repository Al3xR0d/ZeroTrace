import React, { useState } from 'react';
import { Popconfirm, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDeleteUser } from '@/hooks/useQueries';

export const DeleteUserButton: React.FC<{ id: number; name: string }> = ({ id, name }) => {
  const [deleting, setDeleting] = useState(false);
  const { mutate } = useDeleteUser(id);

  const handleConfirm = () => {
    setDeleting(true);
    mutate(undefined, {
      onSettled: () => setDeleting(false),
    });
  };

  return (
    <Popconfirm
      title={`Delete user "${name}"?`}
      description="This action cannot be undone"
      onConfirm={handleConfirm}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ loading: deleting, danger: true }}
    >
      <Button icon={<DeleteOutlined />} danger loading={deleting} />
    </Popconfirm>
  );
};
