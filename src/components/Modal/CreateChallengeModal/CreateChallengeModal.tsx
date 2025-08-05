import React, { useState } from 'react';
import {
  Modal,
  Input,
  Select,
  Tabs,
  Flex,
  Card,
  InputNumber,
  DatePicker,
  Checkbox,
  Upload,
  Button,
} from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { DescriptionText } from '@/shared/DescriptionText';
import styles from './CreateChallengeModal.module.css';
import { categoryOptions } from '@/lib/categories';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateChallenge } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const { TextArea } = Input;

//  // pub name: String
//  // pub description: String,
//  // pub value: i32,
// // pub category_id: Option<i32>,
// // pub state: Option<String>,
// // pub max_attempts: Option<i32>,
// pub r#type: Option<String>,
// // pub start: DateTime<Utc>,
// // pub end: DateTime<Utc>,
// // pub freeze: bool,

export const CreateChallengeModal: React.FC<Props> = ({ open, onCancel, onSuccess }) => {
  const [needToUpload, setNeedToUpload] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);

  const createChallengeMutation = useCreateChallenge();

  const handleCreate = () => {
    // if (!name.trim()) return;
    // if (emailError || passError || !email || !password) return;
    createChallengeMutation.mutate(
      { name, description, value },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
    setName('');
    // setEmail('');
    // setPassword('');
    // setEmailError('');
    // setPassError('');
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        onOk={onSuccess}
        okText="Create"
        maskClosable={false}
        closable={false}
        className={styles.modalContainer}
      >
        <Tabs defaultActiveKey="standard">
          <TabPane tab="Standard" key="standard">
            <Flex gap="middle" vertical>
              <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
              <DescriptionText children="The name of your challenge" />
              <Select options={categoryOptions} placeholder="Category" />
              <DescriptionText children="The category of your challenge" />
              <TextArea
                placeholder="Message"
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                //   value={contentValue}
              />
              <DescriptionText children="Use this to give a brief introduction to your challenge" />
              <InputNumber placeholder="Enter value" min={1} className={styles.inputNumber} />
              <DescriptionText children="This is how many points the challenge is worth initially" />
              <Select
                placeholder="State"
                options={[
                  { value: 'visible', label: 'Visible' },
                  { value: 'hidden', label: 'Hidden' },
                ]}
              />
              <InputNumber placeholder="Max attempts" min={1} className={styles.inputNumber} />
              <DatePicker placeholder="Start" showTime />
              <DatePicker placeholder="End" showTime />
              <Select
                placeholder="Freeze"
                options={[
                  { value: true, label: 'Frozen' },
                  { value: false, label: 'Active' },
                ]}
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
              <TextArea
                placeholder="Message"
                rows={4}
                //   onChange={(e) => setContentValue(e.target.value)}
                //   value={contentValue}
              />
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
