import React, { useEffect } from 'react';
import { Modal, Input, Select, Form, InputNumber } from 'antd';
import styles from './EditChallengeModal.module.css';
import { categoryOptions } from '@/lib/categories';
import { formatForInput, parseToUTC } from '@/lib/date';
import { useUpdateChallenge } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialValues: {
    id: number;
    category_id: number;
    name: string;
    value: number;
    state: string;
    description: string;
    max_attempts: number;
    type: string;
    start: string;
    end: string;
    freeze: boolean;
  };
}

const { TextArea } = Input;

export const EditChallengeModal: React.FC<Props> = ({
  open,
  onCancel,
  onSuccess,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const mutation = useUpdateChallenge(initialValues.id);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...initialValues,
        start: formatForInput(initialValues.start),
        end: formatForInput(initialValues.end),
      });
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        start: parseToUTC(values.start),
        end: parseToUTC(values.end),
      };

      mutation.mutate(payload, {
        onSuccess: () => {
          onSuccess();
          onCancel();
        },
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        onOk={handleSubmit}
        okText="Submit"
        maskClosable={false}
        closable={false}
        className={styles.modalContainer}
        centered
      >
        <Form form={form}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="category_id" label="Category">
            <Select options={categoryOptions} optionFilterProp="label" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="value" label="value">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="state" label="State">
            <Select
              options={[
                { value: 'visible', label: 'Visible' },
                { value: 'hidden', label: 'Hidden' },
              ]}
            />
          </Form.Item>
          <Form.Item name="max_attempts" label="Max attempts">
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="type" label="Type">
            <Input />
          </Form.Item>
          <Form.Item name="start" label="Start Date (Moscow Time)">
            <Input
              readOnly
              // type="datetime-local"
            />
          </Form.Item>
          <Form.Item name="end" label="End Date (Moscow Time)">
            <Input
              readOnly
              // type="datetime-local"
            />
          </Form.Item>
          <Form.Item name="freeze" label="Freeze">
            <Select
              options={[
                { value: true, label: 'Frozen' },
                { value: false, label: 'Active' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
