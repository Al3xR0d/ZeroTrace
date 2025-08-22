import React, { useState, useEffect, useMemo } from 'react';
import {
  Tabs,
  Form,
  FormProps,
  InputNumber,
  Select,
  Typography,
  Input,
  Row,
  Col,
  Divider,
  Checkbox,
  Button,
  Flex,
} from 'antd';
import styles from './CtfTimes.module.css';
import { DescriptionText } from '@/shared/DescriptionText';
import { useFreezeChallengeTime, useThawallChallengeTime } from '@/hooks/useQueries';
import { formatInTimeZone, timestampToRFC3339 } from '@/lib/date';

const { Text } = Typography;

interface CalcState {
  local: string;
  tzTime: string;
  utcTs: string;
}

const timezones = [
  { label: 'Europe/Moscow', value: 'Europe/Moscow' },
  { label: 'UTC', value: 'UTC' },
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export const CtfTimes: React.FC = () => {
  const [form] = Form.useForm();
  const [tz, setTz] = useState<string>('Europe/Moscow');
  const [calc, setCalc] = useState<CalcState>({
    local: '',
    tzTime: '',
    utcTs: '',
  });

  const freezeMutation = useFreezeChallengeTime();
  const thawallMutation = useThawallChallengeTime();

  const now = useMemo(() => new Date(), []);
  const initialValues = useMemo(
    () => ({
      month: now.getMonth() + 1,
      day: now.getDate(),
      year: now.getFullYear(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    }),
    [now],
  );

  const [maxDay, setMaxDay] = useState<number>(
    getDaysInMonth(initialValues.year, initialValues.month),
  );

  const doCompute = (values: any, timezone: string) => {
    const { month, day, year, hour, minute } = values;
    if ([month, day, year, hour, minute].every((v) => v != null)) {
      const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);

      if (isNaN(localDate.getTime())) {
        setCalc({ local: 'Invalid date', tzTime: 'Invalid date', utcTs: '' });
        return;
      }

      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const local = formatInTimeZone(localDate, browserTz);
      const tzTime = formatInTimeZone(localDate, timezone);
      const utcTs = Math.floor(localDate.getTime() / 1000).toString();

      setCalc({ local, tzTime, utcTs });
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    doCompute(initialValues, tz);
    setMaxDay(getDaysInMonth(initialValues.year, initialValues.month));
  }, [form, initialValues, tz]);

  const onValuesChange: FormProps<any>['onValuesChange'] = (_changed, allValues) => {
    const changedKeys = Object.keys(_changed);
    if (changedKeys.includes('month') || changedKeys.includes('year')) {
      const month = allValues.month ?? initialValues.month;
      const year = allValues.year ?? initialValues.year;
      const md = getDaysInMonth(year, month);
      setMaxDay(md);

      const currentDay = allValues.day ?? initialValues.day;
      if (currentDay > md) {
        form.setFieldsValue({ day: md });
        allValues.day = md;
      }
    }

    doCompute(allValues, tz);
  };

  const onTzChange = (newTz: string) => {
    setTz(newTz);
    doCompute(form.getFieldsValue(), newTz);
  };

  const handleFreezeOk = () => {
    freezeMutation.mutate({
      data: { unfreeze_at: timestampToRFC3339(calc.utcTs) },
    });
  };

  const handleThawallOk = () => {
    thawallMutation.mutate();
  };

  const renderTimeFields = () => (
    <Row gutter={16} className={styles.timeFields}>
      <Col>
        <Form.Item name="month" label="Month" rules={[{ required: true }]}>
          <InputNumber min={1} max={12} className={styles.timeField} />
        </Form.Item>
      </Col>
      <Col>
        <Form.Item name="day" label="Day" rules={[{ required: true }]}>
          <InputNumber min={1} max={maxDay} className={styles.timeField} />
        </Form.Item>
      </Col>
      <Col>
        <Form.Item name="year" label="Year" rules={[{ required: true }]}>
          <InputNumber min={1970} className={styles.timeField} />
        </Form.Item>
      </Col>
      <Col>
        <Form.Item name="hour" label="Hour" rules={[{ required: true }]}>
          <InputNumber min={0} max={23} className={styles.timeField} />
        </Form.Item>
      </Col>
      <Col>
        <Form.Item name="minute" label="Minute" rules={[{ required: true }]}>
          <InputNumber min={0} max={59} className={styles.timeField} />
        </Form.Item>
      </Col>
    </Row>
  );

  const renderCommonFooter = () => (
    <>
      <Divider />
      <Form.Item label="Local Time">
        <Input readOnly value={calc.local} />
      </Form.Item>
      <Form.Item label="Timezone Time">
        <Input readOnly value={calc.tzTime} />
      </Form.Item>
      <Form.Item label="UTC Timestamp">
        <Input readOnly value={calc.utcTs} />
      </Form.Item>
      {/* <Form.Item>
        <Button type="primary" className={styles.updateButton}>
          Update
        </Button>
      </Form.Item> */}
    </>
  );

  return (
    <Tabs
      defaultActiveKey="start"
      className={styles.tabs}
      items={[
        {
          key: 'start',
          label: 'Start Time',
          children: (
            <>
              <Text className={styles.description}>
                This is the time when the competition will begin. Challenges will automatically
                unlock and users will be able to submit answers.
              </Text>
              <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onValuesChange={onValuesChange}
                className={styles.formContainer}
              >
                {renderTimeFields()}
                <Form.Item label="Timezone">
                  <Select options={timezones} value={tz} onChange={onTzChange} />
                </Form.Item>
                {renderCommonFooter()}
              </Form>
            </>
          ),
        },
        {
          key: 'end',
          label: 'End Time',
          children: (
            <>
              <Text className={styles.description}>
                This is the time when the competition will end. Challenges will automatically close
                and users won't be able to submit answers.
              </Text>
              <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onValuesChange={onValuesChange}
                className={styles.formContainer}
              >
                {renderTimeFields()}
                <Form.Item label="Timezone">
                  <Select options={timezones} value={tz} onChange={onTzChange} />
                </Form.Item>
                <Form.Item name="viewAfter" valuePropName="checked" className={styles.checkbox}>
                  <Checkbox>View After CTF</Checkbox>
                </Form.Item>
                <DescriptionText>
                  Allows challenges to be viewed after the End Time, however no new submissions will
                  be recorded. For participants to be able to submit after End Time but not alter
                  the scoreboard, configure Freeze Time to be your End Time.
                </DescriptionText>
                {renderCommonFooter()}
              </Form>
            </>
          ),
        },
        {
          key: 'freeze',
          label: 'Freeze Time',
          children: (
            <>
              <Text className={styles.description}>
                Freeze time specifies the timestamp that the competition will be frozen to. All
                solves before the freeze time will be shown, but new solves won't be shown to users.
              </Text>
              <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onValuesChange={onValuesChange}
                className={styles.formContainer}
              >
                {renderTimeFields()}
                <Form.Item label="Timezone">
                  <Select options={timezones} value={tz} onChange={onTzChange} />
                </Form.Item>
                {renderCommonFooter()}
              </Form>
              <div className={styles.buttonContainer}>
                <Button onClick={handleFreezeOk} type="primary">
                  Freeze
                </Button>
                <Button onClick={handleThawallOk} type="primary">
                  Thawall
                </Button>
              </div>
            </>
          ),
        },
      ]}
    />
  );
};

export default CtfTimes;
