import React, { useEffect } from 'react';
import { Modal, Form, Flex, Checkbox, Input } from 'antd';
import { useUpdateTeam } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialValues: {
    id: number;
    name: string;
    verified: boolean;
    banned: boolean;
    hidden: boolean;
  };
}

export const EditTeamModal: React.FC<Props> = ({ open, onCancel, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  const mutation = useUpdateTeam(initialValues.id);
  const isLoading = mutation.isPending;

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues);
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      mutation.mutate(values, {
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
        maskClosable={false}
        closable={false}
        okText="Submit"
        confirmLoading={isLoading}
        onOk={handleSubmit}
      >
        <Form form={form}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Flex vertical={false} align="baseline">
            <Form.Item name="verified" valuePropName="checked">
              <Checkbox>Verified</Checkbox>
            </Form.Item>
            <Form.Item name="hidden" valuePropName="checked">
              <Checkbox>Hidden</Checkbox>
            </Form.Item>
            <Form.Item name="banned" valuePropName="checked">
              <Checkbox>Banned</Checkbox>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
