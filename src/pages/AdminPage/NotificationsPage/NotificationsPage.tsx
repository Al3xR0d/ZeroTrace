import React, { useState, useEffect } from 'react';
import { Input, Checkbox, Button, Radio } from 'antd';
import { DescriptionText } from '@/shared/DescriptionText';
import styles from './NotificationsPage.module.css';
import type { RadioChangeEvent } from 'antd';
import { useCreateNotification } from '@/hooks/useQueries';
import { useUserStore } from '@/store/userStore';
import { formatCurrentDateToRFC3339 } from '@/lib/date';

const { TextArea } = Input;

export const NotificationsPage: React.FC = () => {
  // const [valueRadio, setValueRadio] = useState(1);
  const [titleValue, setTitleValue] = useState<string>('');
  const [contentValue, setContentValue] = useState<string>('');
  const [isSend, setIsSend] = useState<boolean>(false);

  const mutation = useCreateNotification();
  const id = useUserStore((store) => store.currentUser?.id);
  const date = formatCurrentDateToRFC3339();
  const disabled = !titleValue.trim() || !contentValue.trim() || !id;
  // const handleChangeRadio = (e: RadioChangeEvent) => {
  //   setValueRadio(e.target.value);
  // };

  const handleCreate = () => {
    // if (!id) return;
    mutation.mutate(
      // { id, title: titleValue, content: contentValue, date },
      { title: titleValue, content: contentValue },
      {
        onSuccess: () => {
          setTitleValue('');
          setContentValue('');
          setIsSend(true);
        },
      },
    );
  };

  useEffect(() => {
    if (isSend) {
      setTitleValue('');
      setContentValue('');
      setIsSend(false);
    }
  }, [isSend]);

  return (
    <>
      <div className={styles.pageContainer}>
        <Input
          placeholder="Title"
          onChange={(e) => setTitleValue(e.target.value)}
          value={titleValue}
        />
        <DescriptionText children="Notification title" />
        <TextArea
          placeholder="Content"
          rows={4}
          onChange={(e) => setContentValue(e.target.value)}
          value={contentValue}
        />
        <DescriptionText children="Notification contents. Can consist of HTML and/or Markdown" />
        {/* <div className={styles.radioAndCheckbox}>
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
        </div> */}
      </div>
      <Button
        type="primary"
        className={styles.submitButton}
        onClick={handleCreate}
        disabled={disabled}
      >
        Submit
      </Button>
    </>
  );
};

export default NotificationsPage;
