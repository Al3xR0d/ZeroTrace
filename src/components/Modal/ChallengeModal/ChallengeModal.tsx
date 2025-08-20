import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Input, Flex } from 'antd';
import { Challenge } from '@/types';
import { MdKeyboardReturn } from 'react-icons/md';
import styles from './ChallengeModal.module.css';
import { useFetchChallengeFilesUser } from '@/hooks/useQueries';
import fileSrc from '@/images/files.png';
import { ChallengeFile } from '@/types';
import { downloadChallengeFileUserBlob } from '@/services/Api/fetches';
import { useAttemptFlag } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onCancel: () => void;
  currentChallenge: Challenge;
  categoryName: string;
}

interface FileItemProps {
  name: string;
  fileId: number;
  challengeId: number;
}

const FileItem = React.memo(({ name, fileId, challengeId }: FileItemProps) => {
  const handleDownload = async () => {
    try {
      const blob = await downloadChallengeFileUserBlob(challengeId, fileId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
    }
  };

  return (
    <div className={styles.fileItem} onClick={handleDownload}>
      <img
        src={fileSrc}
        alt="File icon"
        className={styles.fileIcon}
        style={{ willChange: 'auto' }}
      />
      <span className={styles.fileName}>{name}</span>
    </div>
  );
});

export const ChallengeModal: React.FC<Props> = ({
  open,
  onCancel,
  currentChallenge,
  categoryName,
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const {
    data: files = [],
    isLoading: filesLoading,
    isError: filesError,
  } = useFetchChallengeFilesUser(currentChallenge.id);

  const getFlagMutation = useAttemptFlag(onCancel);

  const handleCreateAttempt = () => {
    getFlagMutation.mutate({ idChallenge: currentChallenge.id, submission: inputValue });
    setInputValue('');
  };

  useEffect(() => {
    const img = new Image();
    img.src = fileSrc;
  }, [fileSrc]);

  const isButtonDisabled = useMemo(() => !inputValue || inputValue.trim() === '', [inputValue]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleCreateAttempt}
      title={`/task/${categoryName}/${currentChallenge.name}.txt`}
      maskClosable={false}
      centered
      closable={false}
      className={styles.modal}
      mask={false}
      okText={
        <span className={styles.okInner}>
          <span className={styles.prompt}>&gt;_</span>
          <MdKeyboardReturn size={18} />
        </span>
      }
      okButtonProps={{
        type: 'primary',
        className: styles.okButton,
        disabled: isButtonDisabled,
      }}
      width={720}
    >
      <Flex vertical gap="middle">
        {currentChallenge.description}

        {!filesLoading && !filesError && files.length > 0 && (
          <div className={styles.filesContainer}>
            {files.map((file: ChallengeFile) => (
              <FileItem
                key={file.id}
                name={file.name}
                fileId={file.id}
                challengeId={currentChallenge.id}
              />
            ))}
          </div>
        )}
        <Input
          placeholder="Enter the flag"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Flex>
    </Modal>
  );
};
