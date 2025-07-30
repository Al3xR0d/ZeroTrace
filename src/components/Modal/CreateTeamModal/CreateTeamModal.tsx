import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { useCreateTeam } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateTeamModal: React.FC<Props> = ({ open, onCancel, onSuccess }) => {
  const [name, setName] = useState('');

  const createTeamMutation = useCreateTeam();

  const isDisabled = !name.trim();

  const handleCreate = () => {
    if (!name.trim()) return;
    (createTeamMutation.mutate({ name }, { onSuccess: () => onSuccess() }), setName(''));
  };

  useEffect(() => {
    if (open) {
      setName('');
    }
  }, [open]);

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        onOk={onSuccess}
        title="Create Team"
        closable={false}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreate} disabled={isDisabled}>
            Create
          </Button>,
        ]}
      >
        <Input onChange={(e) => setName(e.target.value)} placeholder="Name" value={name} />
      </Modal>
    </>
  );
};
