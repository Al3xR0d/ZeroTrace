import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox, Flex } from 'antd';
import { useUpdateUser } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialValues: {
    id: number;
    name: string;
    email: string;
    type: string;
    banned: boolean;
    verified: boolean;
    hidden: boolean;
    team_id: number | null;
    properties: string;
  };
}

export const EditUserModal: React.FC<Props> = ({ open, onCancel, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  //   const { mutate: updateUser, isLoading } = useUpdateUser(initialValues.id);
  const mutation = useUpdateUser(initialValues.id);
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
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="team_id" label="Team id">
            <Input />
          </Form.Item>
          <Form.Item name="properties" label="Properties">
            <Input />
          </Form.Item>
          <Flex vertical={false} justify="space-between" align="baseline">
            <Form.Item name="type" label="Type">
              <Select
                defaultValue={initialValues.type}
                options={[
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
            </Form.Item>
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
