import React from 'react';
import { Select, Button, Typography } from 'antd';
import styles from './CtfVisibility.module.css';
import { DescriptionText } from '@/shared/DescriptionText';

const { Text } = Typography;

export const CtfVisibility: React.FC = () => {
  return (
    <>
      <div className={styles.inputContainer}>
        <Text>Challenge Visibility</Text>
        <Select
          defaultValue="private"
          style={{ width: 220 }}
          options={[
            { value: 'private', label: 'Private' },
            { value: 'public', label: 'Public' },
            { value: 'admins', label: 'Admins only' },
          ]}
        />
        <DescriptionText text="Control whether users must be logged in to see challenges" />
        <Text>Account Visibility</Text>
        <Select
          defaultValue="public"
          style={{ width: 220 }}
          options={[
            { value: 'private', label: 'Private' },
            { value: 'public', label: 'Public' },
            { value: 'admins', label: 'Admins only' },
          ]}
        />
        <DescriptionText
          text="Control whether accounts (users & teams) are shown to everyone, only to authenticated
          users, or only to admins"
        />
        <Text>Score Visibility</Text>
        <Select
          defaultValue="public"
          style={{ width: 220 }}
          options={[
            { value: 'private', label: 'Private' },
            { value: 'public', label: 'Public' },
            { value: 'admins', label: 'Admins only' },
            { value: 'hidden', label: 'Hidden' },
          ]}
        />
        <DescriptionText
          text="Control whether solves/score are shown to the public, to logged in users, hidden to all
          non-admins, or only shown to admins.
          Score Visibility is a subset of Account Visibility. This means that if accounts are
          visible to a user then score visibility will control whether they can see the score of
          that user. If accounts are not visibile then score visibility has no effect."
        />
        <Text>Registration Visibility</Text>
        <Select
          defaultValue="private"
          style={{ width: 220 }}
          options={[
            { value: 'private', label: 'Private' },
            { value: 'public', label: 'Public' },
            { value: 'majorLeague', label: 'MajorLeagueCyber only' },
          ]}
        />
        <DescriptionText text="Control whether registration is enabled for everyone or disabled" />
      </div>
      <Button type="primary" className={styles.updateButton}>
        Update
      </Button>
    </>
  );
};

export default CtfVisibility;
