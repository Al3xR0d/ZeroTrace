import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { useEditChallengeFlag } from '@/hooks/useQueries';
import { ChallengeFlag } from '@/types';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  currentFlag: ChallengeFlag;
}

export const EditFlagModal: React.FC<Props> = ({ open, onCancel, onSuccess, currentFlag }) => {
  const [flagContent, setFlagContent] = useState(currentFlag.content);

  const editFlagMutation = useEditChallengeFlag();

  const handleOk = async () => {
    if (!flagContent.trim()) {
      return;
    }

    await editFlagMutation.mutateAsync({
      data: {
        challenge_id: currentFlag.challenge_id,
        content: flagContent,
        type: currentFlag.type,
      },
      idChallenge: currentFlag.challenge_id,
      idFlag: currentFlag.id,
    });
    setFlagContent('');
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
          <Button key="submit" type="primary" onClick={handleOk} disabled={!flagContent}>
            Edit
          </Button>,
        ]}
      >
        <Input
          onChange={(e) => setFlagContent(e.target.value)}
          placeholder="Flag"
          value={flagContent}
        />
      </Modal>
    </>
  );
};
