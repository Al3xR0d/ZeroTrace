import React, { useState } from 'react';
import { Modal, Button, Input, InputNumber, Select, Flex } from 'antd';
import { ChallengeHints } from '@/types';
import { useEditChallengeHint } from '@/hooks/useQueries';
import styles from './EditHintModal.module.css';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editedHint: ChallengeHints;
}

export const EditHintModal: React.FC<Props> = ({ open, onCancel, onSuccess, editedHint }) => {
  const [hintContent, setHintContent] = useState<string>(editedHint.content);
  const [cost, setCost] = useState<number | null>(editedHint.cost);
  const [type, setType] = useState<string | null>(editedHint.type);

  const editHintMutation = useEditChallengeHint();

  const handleOk = async () => {
    if (!hintContent.trim()) return;

    await editHintMutation.mutateAsync({
      data: {
        challenge_id: editedHint.challenge_id,
        content: hintContent,
        type: type,
        cost: cost,
      },
      idChallenge: editedHint.challenge_id,
      idHint: editedHint.id,
    });
    setHintContent(editedHint.content);
    setCost(editedHint.cost);
    setType(editedHint.type);
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
            Edit
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
            value={type}
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
