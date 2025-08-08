import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useFetchCurrentChallenge,
  useFetchChallengeFiles,
  useUploadChallengeFile,
  useDeleteChallengeFile,
  useFetchChallengeFlag,
  useDeleteChallengeFlag,
  useFetchChallengeHints,
  useDeleteChallengeHints,
} from '@/hooks/useQueries';
import { Spin, Typography, Tabs, Upload, Button, message, Space, Table, Alert } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { UploadOutlined, DownloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib';
import { ChallengeFile, ChallengeFlag, ChallengeHints } from '@/types';
import styles from './ChallengeDetailPage.module.css';
import { useQueryClient } from '@tanstack/react-query';
import { downloadChallengeFileBlob } from '@/services/Api/fetches';
import type { ColumnsType } from 'antd/lib/table';
import { CreateFlagModal } from '@/components/Modal/CreateFlagModal';
import { EditFlagModal } from '@/components/Modal/EditFlagModal';
import { CreateHintModal } from '@/components/Modal/CreateHintModal';
import { EditHintModal } from '@/components/Modal/EditHintModal';

export const ChallengeDetailPage: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [createFlagModalOpen, setCreateFlagModalOpen] = useState<boolean>(false);
  const [createHintModalOpen, setCreateHintModalOpen] = useState<boolean>(false);
  const [editFlagModalOpen, setEditFlagModalOpnen] = useState<boolean>(false);
  const [editHintModalOpen, setEditHintModalOpnen] = useState<boolean>(false);
  const [editedflag, setEditedFlag] = useState<ChallengeFlag | null>(null);
  const [editedHint, setEditedHint] = useState<ChallengeHints | null>(null);
  const { id } = useParams<{ id: string }>();
  const challengeId = Number(id);
  const queryClient = useQueryClient();

  const uploadMutation = useUploadChallengeFile();
  const deleteFileMutation = useDeleteChallengeFile();
  const deleteFlagMutation = useDeleteChallengeFlag();
  const deleteHintMutation = useDeleteChallengeHints();

  const {
    data: challenges,
    isLoading: challengeLoading,
    isError: challengeError,
  } = useFetchCurrentChallenge(challengeId);

  const {
    data: files = [],
    isLoading: filesLoading,
    isError: filesError,
  } = useFetchChallengeFiles(challengeId);

  const {
    data: flags = [],
    isLoading: flagsLoading,
    isError: flagsError,
  } = useFetchChallengeFlag(challengeId);

  const {
    data: hints = [],
    isLoading: hintsLoading,
    isError: hintsError,
  } = useFetchChallengeHints(challengeId);

  const handleUpload = async () => {
    if (!fileList.length) return;
    setUploading(true);
    try {
      for (const file of fileList) {
        if (file.originFileObj) {
          await uploadMutation.mutateAsync({
            id: challengeId,
            file: file.originFileObj as File,
            type: file.type || 'application/octet-stream',
          });
        }
      }
      setFileList([]);
      message.success('Files uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['files', challengeId] });
    } catch {
      message.error('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (file: ChallengeFile) => {
    try {
      await deleteFileMutation.mutateAsync({ idChallenge: challengeId, idFile: file.id });
      message.success('File deleted');
    } catch {
      message.error('Error deleting file');
    }
  };

  const handleDownload = async (file: ChallengeFile) => {
    try {
      const response = await downloadChallengeFileBlob(challengeId, file.id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      message.error('Error downloading file');
    }
  };

  const handleDeleteFlag = async (flag: ChallengeFlag) => {
    await deleteFlagMutation.mutateAsync({ idChallenge: challengeId, idFlag: flag.id });
  };

  const handleDeleteHint = async (hint: ChallengeHints) => {
    await deleteHintMutation.mutateAsync({ idChallenge: challengeId, idHint: hint.id });
  };

  if (challengeLoading || filesLoading) return <Spin />;
  if (challengeError || !challenges) return <div>Error loading challenge</div>;
  if (filesError || !files) return <div>Error loading files</div>;
  if (hintsError || !hints) return <div>Error loading hints</div>;

  const uploadProps = {
    multiple: true,
    beforeUpload: () => false,
    onChange: ({ fileList }: { fileList: UploadFile[] }) => setFileList(fileList),
    fileList,
    showUploadList: false,
  };

  const flagColumns: ColumnsType<any> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Flag',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Settings',
      key: 'settings',
      render: (_, record) => (
        <Space>
          {/* <Button
            size="small"
            onClick={() => {
              setEditedFlag(record);
              setEditFlagModalOpnen(true);
            }}
            icon={<EditOutlined />}    ////////// Кнопка редактирования флага
          /> */}
          <Button
            size="small"
            danger
            onClick={() => handleDeleteFlag(record)}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  const hintsColumns: ColumnsType<any> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Hint',
      dataIndex: 'content',
      key: 'content',
      render: (text: string) => <span className={styles.hintContent}>{text}</span>,
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Settings',
      key: 'settings',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setEditedHint(record);
              setEditHintModalOpnen(true);
            }}
            icon={<EditOutlined />}
          />
          <Button
            size="small"
            danger
            onClick={() => handleDeleteHint(record)}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  const handleRemoveSelected = (file: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  return (
    <div className={styles.container}>
      <Typography.Title level={2}>{challenges.name}</Typography.Title>
      <p>Value: {challenges.value}</p>
      <Tabs>
        <TabPane tab="Files" key="file">
          <ul className={styles.fileList}>
            {files.map((file: ChallengeFile) => (
              <li key={file.id} className={styles.fileItem}>
                <span>{file.name}</span>
                <span className={styles.actions}>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(file)}
                    size="small"
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteFile(file)}
                    size="small"
                    danger
                    loading={deleteFileMutation.isPending}
                  />
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.uploadSection}>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} className={styles.uploadButton}>
                Select file(s)
              </Button>
            </Upload>
            <Button
              type="primary"
              onClick={handleUpload}
              loading={uploading}
              disabled={!fileList.length}
              className={styles.uploadSubmitButton}
            >
              Upload
            </Button>
          </div>
          {fileList.length > 0 && (
            <ul className={styles.uploadList}>
              {fileList.map((file) => (
                <li key={file.uid} className={styles.uploadListItem}>
                  <span className={styles.uploadListFileName}>{file.name}</span>
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    className={styles.uploadListRemoveButton}
                    onClick={() => handleRemoveSelected(file)}
                  />
                </li>
              ))}
            </ul>
          )}
        </TabPane>
        <TabPane tab="Flags" key="flags">
          {flagsLoading ? (
            <Spin />
          ) : flagsError ? (
            <Alert type="error" message="Error loading flags" />
          ) : (
            <Table
              rowKey="id"
              dataSource={flags}
              columns={flagColumns}
              pagination={false}
              size="small"
              locale={{ emptyText: 'No flags found' }}
            />
          )}

          <Button
            type="primary"
            onClick={() => setCreateFlagModalOpen(true)}
            className={styles.createButton}
          >
            Add Flag
          </Button>
        </TabPane>
        <TabPane tab="Hints" key="hints">
          {hintsLoading ? (
            <Spin />
          ) : hintsError ? (
            <Alert type="error" message="Error loading hints" />
          ) : (
            <Table
              rowKey="id"
              dataSource={hints}
              columns={hintsColumns}
              pagination={false}
              size="small"
              locale={{ emptyText: 'No hints found' }}
            />
          )}

          <Button
            type="primary"
            onClick={() => setCreateHintModalOpen(true)}
            className={styles.createButton}
          >
            Add Hint
          </Button>
        </TabPane>
      </Tabs>
      {createFlagModalOpen && (
        <CreateFlagModal
          open={createFlagModalOpen}
          onCancel={() => setCreateFlagModalOpen(false)}
          onSuccess={() => setCreateFlagModalOpen(false)}
          challengeId={challengeId}
        />
      )}
      {editFlagModalOpen && editedflag && (
        <EditFlagModal
          open={editFlagModalOpen}
          onCancel={() => setEditFlagModalOpnen(false)}
          onSuccess={() => setEditFlagModalOpnen(false)}
          currentFlag={editedflag}
        />
      )}
      {createHintModalOpen && (
        <CreateHintModal
          open={createHintModalOpen}
          onCancel={() => setCreateHintModalOpen(false)}
          onSuccess={() => setCreateHintModalOpen(false)}
          challengeId={challengeId}
        />
      )}
      {editHintModalOpen && editedHint && (
        <EditHintModal
          open={editHintModalOpen}
          onCancel={() => setEditHintModalOpnen(false)}
          onSuccess={() => setEditHintModalOpnen(false)}
          editedHint={editedHint}
        />
      )}
    </div>
  );
};

export default ChallengeDetailPage;
