import React, { useState } from 'react';
import { Popconfirm, Button, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export interface DeleteButtonProps<ID> {
  id: ID;
  name: string;
  useDelete: (id: ID) => {
    mutate: (
      data?: any,
      opts?: {
        onSuccess?: () => void;
        onError?: () => void;
        onSettled?: () => void;
      },
    ) => void;
  };
  title?: string;
  description?: string;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
}

export const DeleteButton = <ID,>({
  id,
  name,
  useDelete,
  title = `Delete "${name}"?`,
  description = 'This action cannot be undone',
  successMessage = `"${name}" deleted successfully`,
  errorMessage = `Failed to delete "${name}"`,
  onSuccess,
  onError,
  onSettled,
}: DeleteButtonProps<ID>) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { mutate } = useDelete(id);

  const handleConfirm = () => {
    setDeleting(true);
    mutate(undefined, {
      onSuccess: () => {
        message.success(successMessage);
        onSuccess?.();
      },
      onError: () => {
        message.error(errorMessage);
        onError?.();
      },
      onSettled: () => {
        setDeleting(false);
        setOpen(false);
        onSettled?.();
      },
    });
  };

  return (
    <Popconfirm
      title={title}
      description={description}
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
