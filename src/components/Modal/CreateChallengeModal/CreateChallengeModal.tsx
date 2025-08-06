import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  Select,
  Tabs,
  Flex,
  Card,
  InputNumber,
  Checkbox,
  Upload,
  Button,
} from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { DescriptionText } from '@/shared/DescriptionText';
import styles from './CreateChallengeModal.module.css';
import { categoryOptions, categoriesMap } from '@/lib/categories';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateChallenge } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const { TextArea } = Input;

export const CreateChallengeModal: React.FC<Props> = ({ open, onCancel, onSuccess }) => {
  const [needToUpload, setNeedToUpload] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [value, setValue] = useState<number | null>(null);
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [freeze, setFreeze] = useState<boolean | null>(null);
  const [type, setType] = useState<string>('standard');
  const [maxAttempts, setMaxAttempts] = useState<number | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [category, setCategory] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setValue(null);
      setStart('');
      setEnd('');
      setFreeze(null);
      setType('standard');
      setMaxAttempts(null);
      setState(null);
      setCategory(null);
    }
  }, [open, type]);

  const createChallengeMutation = useCreateChallenge();

  const handleCreate = () => {
    if (!category || !value) return;

    const payload: {
      name: string;
      description: string;
      value: number;
      start: string;
      end: string;
      type: string;
      category_id: number;
    } & Partial<{ max_attempts: number; freeze: boolean; state: string }> = {
      name,
      description,
      value,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      type,
      category_id: category,
    };
    console.log(payload);
    if (typeof maxAttempts === 'number' && maxAttempts > 0) {
      payload.max_attempts = maxAttempts;
    }
    if (freeze !== null) {
      payload.freeze = freeze;
    }
    if (state !== null) {
      payload.state = state;
    }

    createChallengeMutation.mutate(payload, {
      onSuccess: onSuccess,
    });

    setName('');
    setDescription('');
    setValue(null);
    setStart('');
    setEnd('');
    setFreeze(null);
    setType('standard');
    setMaxAttempts(null);
    setState(null);
    setCategory(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        onOk={handleCreate}
        okText="Create"
        maskClosable={false}
        closable={false}
        className={styles.modalContainer}
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreate}>
            Create
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="standard" onChange={(e) => setType(e)}>
          <TabPane tab="Standard" key="standard">
            <Flex gap="middle" vertical>
              <Input placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
              <DescriptionText children="The name of your challenge" />
              <Select
                options={categoryOptions}
                placeholder="Category"
                onChange={(e) => setCategory(e)}
                value={category ?? undefined}
              />
              <DescriptionText children="The category of your challenge" />
              <TextArea
                placeholder="Message"
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              <DescriptionText children="Use this to give a brief introduction to your challenge" />
              <InputNumber
                placeholder="Enter value"
                min={1}
                className={styles.inputNumber}
                onChange={(e) => setValue(e ?? null)}
                value={value}
                onKeyDown={handleKeyDown}
              />
              <DescriptionText children="This is how many points the challenge is worth initially" />
              <Select
                placeholder="State"
                onChange={(e) => setState(e)}
                options={[
                  { value: 'visible', label: 'Visible' },
                  { value: 'hidden', label: 'Hidden' },
                ]}
                value={state}
              />
              <InputNumber
                placeholder="Max attempts"
                min={1}
                className={styles.inputNumber}
                onChange={(e) => setMaxAttempts(e ?? null)}
                value={maxAttempts}
                onKeyDown={handleKeyDown}
              />
              <Input
                type="datetime-local"
                placeholder="Start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={styles.inputDate}
              />
              <Input
                type="datetime-local"
                placeholder="End"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={styles.inputDate}
              />
              <Select
                placeholder="Freeze"
                onChange={(e) => setFreeze(e)}
                options={[
                  { value: true, label: 'Frozen' },
                  { value: false, label: 'Active' },
                ]}
                value={freeze}
              />
              <Input placeholder="Flag" />
              <DescriptionText children="Static flag for your challenge" />
              <Checkbox onChange={(e) => setNeedToUpload(e.target.checked)}>
                Need to upload files
              </Checkbox>
              {needToUpload && (
                <Upload>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              )}
            </Flex>
          </TabPane>
          <TabPane tab="Dynamic" key="dynamic">
            <Flex gap="middle" vertical>
              <Card>
                Dynamic value challenges decrease in value as they receive solves. The more solves a
                dynamic challenge has, the lower its value is to everyone who has solved it.
              </Card>
              <Input placeholder="Name" />
              <DescriptionText children="The name of your challenge" />
              <Input placeholder="Category" />
              <DescriptionText children="The category of your challenge" />
              <TextArea placeholder="Message" rows={4} />
              <DescriptionText children="Use this to give a brief introduction to your challenge" />
              <InputNumber placeholder="Enter value" min={1} className={styles.inputNumber} />
              <DescriptionText children="This is how many points the challenge is worth initially" />
              <Select
                defaultValue="linar"
                options={[
                  { value: 'linar', label: 'Linar' },
                  { value: 'logarithmic', label: 'Logarithmic' },
                ]}
              />
              <DescriptionText>
                How the dynamic value will be calculated based on the Decay value
                <br />– Linear: Calculated as{' '}
                <span className={styles.attentionText}>Initial - (Decay * SolveCount)</span>
                <br />– Logarithmic: Calculated as{' '}
                <span className={styles.attentionText}>
                  (((Minimum - Initial) / (Decay^2)) * (SolveCount^2)) + Initial
                </span>
              </DescriptionText>
              <InputNumber placeholder="Decay value" min={1} className={styles.inputNumber} />
              <DescriptionText>
                The decay value is used differently depending on the above Decay Function
                <br />- Linear: The amount of points deducted per solve. Equal deduction per solve.
                <br />- Logarithmic: The amount of solves before the challenge reaches its minimum
                value. Earlier solves will lose less points. Later solves will lose more points
              </DescriptionText>
              <InputNumber placeholder="Minimum Value" className={styles.inputNumber} min={1} />
              <DescriptionText children="This is the lowest that the challenge can be worth" />
            </Flex>
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};
