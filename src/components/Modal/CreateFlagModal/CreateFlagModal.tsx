import React, { useState } from 'react';
import { Modal, Input, Select, Flex, Button } from 'antd';
import { useCreateFlag } from '@/hooks/useQueries';
import type { CreateFlag } from '@/types';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  challengeId: number;
}

export const CreateFlagModal: React.FC<Props> = ({ open, onCancel, onSuccess, challengeId }) => {
  const [flagContent, setFlagContent] = useState('');
  const [type, setType] = useState('');
  const createFlagMutation = useCreateFlag();

  const handleOk = async () => {
    if (!flagContent.trim()) {
      return;
    }

    await createFlagMutation.mutateAsync({
      data: { challenge_id: challengeId, content: flagContent, type: type } as CreateFlag,
      id: challengeId,
    });
    setFlagContent('');
    onSuccess();
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} disabled={!flagContent || !type}>
            Create
          </Button>,
        ]}
      >
        <Flex vertical gap="middle">
          <Input
            placeholder="Flag"
            value={flagContent}
            onChange={(e) => setFlagContent(e.target.value)}
            onPressEnter={handleOk}
          />
          <Select
            placeholder="Type"
            onChange={(e) => setType(e)}
            options={[
              { value: 'static', label: 'Static' },
              { value: 'dynamic', label: 'Dynamic' },
            ]}
          />
        </Flex>
      </Modal>
    </>
  );
};
