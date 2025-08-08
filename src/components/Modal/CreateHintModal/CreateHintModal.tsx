import React, { useState } from 'react';
import { Modal, Input, Button, InputNumber, Flex, Select } from 'antd';
import { useCreateChallengeHints } from '@/hooks/useQueries';
import styles from './CreateHintModal.module.css';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  challengeId: number;
}

export const CreateHintModal: React.FC<Props> = ({ open, onCancel, onSuccess, challengeId }) => {
  const [hintContent, setHintContent] = useState<string>('');
  const [cost, setCost] = useState<number | null>(null);
  const [type, setType] = useState<string | null>('');

  const createHintMutation = useCreateChallengeHints();

  const handleOk = async () => {
    if (!hintContent) return;

    await createHintMutation.mutateAsync({
      data: { challenge_id: challengeId, content: hintContent, cost: cost, type: type },
      id: challengeId,
    });
    setHintContent('');
    setCost(null);
    onSuccess();
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        onOk={onSuccess}
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} disabled={!hintContent}>
            Create
          </Button>,
        ]}
      >
        <Flex gap="small" vertical>
          <Input.TextArea
            rows={4}
            placeholder="Hint"
            onChange={(e) => setHintContent(e.target.value)}
            value={hintContent}
          />
          <InputNumber
            placeholder="Cost"
            min={0}
            onChange={(e) => setCost(e ?? null)}
            value={cost}
            className={styles.numberInput}
          />
          <Select
            placeholder="Type"
            onChange={(e) => setType(e)}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'dynamic', label: 'Dynamic' },
            ]}
          />
        </Flex>
      </Modal>
    </>
  );
};
