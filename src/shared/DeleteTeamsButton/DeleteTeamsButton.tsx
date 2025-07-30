import React, { useState } from 'react';
import { Popconfirm, Button, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDeleteTeam } from '@/hooks/useQueries';

export const DeleteTeamsButton: React.FC<{ id: number; name: string }> = ({ id, name }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { mutate } = useDeleteTeam(id);

  const handleConfirm = () => {
    setDeleting(true);
    mutate(undefined, {
      onSuccess: () => {
        message.success(`Team "${name}" deleted successfully`);
      },
      onError: () => {
        message.error(`Failed to delete team "${name}"`);
      },
      onSettled: () => {
        setDeleting(false);
        setOpen(false);
      },
    });
  };

  return (
    <Popconfirm
      title={`Delete team "${name}"?`}
      description="This action cannot be undone"
      open={open}
      onConfirm={handleConfirm}
      onCancel={() => setOpen(false)}
      okButtonProps={{ loading: deleting, danger: true }}
      okText="Delete"
      cancelText="Cancel"
    >
      <Button icon={<DeleteOutlined />} danger onClick={() => setOpen(true)} loading={deleting} />
    </Popconfirm>
  );
};
