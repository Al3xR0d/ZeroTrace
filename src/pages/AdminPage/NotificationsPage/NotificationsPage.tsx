import React, { useState } from 'react';
import { Input, Checkbox, Button, Radio } from 'antd';
import { DescriptionText } from '@/shared/DescriptionText';
import styles from './NotificationsPage.module.css';
import type { RadioChangeEvent } from 'antd';

const { TextArea } = Input;

export const NotificationsPage: React.FC = () => {
  const [valueRadio, setValueRadio] = useState(1);

  const handleChangeRadio = (e: RadioChangeEvent) => {
    setValueRadio(e.target.value);
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <Input placeholder="Title" />
        <DescriptionText text="Notification title" />
        <TextArea placeholder="Content" rows={4} />
        <DescriptionText text="Notification contents. Can consist of HTML and/or Markdown" />
        <div className={styles.radioAndCheckbox}>
          <div className={styles.radioContainer}>
            Notification Type
            <Radio.Group
              onChange={handleChangeRadio}
              value={valueRadio}
              options={[
                {
                  value: 1,
                  label: 'Toast',
                },
                {
                  value: 2,
                  label: 'Alert',
                },
                {
                  value: 3,
                  label: 'Background',
                },
              ]}
            />
            <DescriptionText text="What type of notification users receive" />
          </div>
          <div className={styles.checkboxContainer}>
            Play Sound
            <Checkbox>Play Sound</Checkbox>
            <DescriptionText text="Play sound for users when they receive the notification" />
          </div>
        </div>
      </div>
      <Button type="primary" className={styles.submitButton}>
        Submit
      </Button>
    </>
  );
};

export default NotificationsPage;
