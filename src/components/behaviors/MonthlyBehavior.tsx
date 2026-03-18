import {
  InputNumber,
  Radio,
  Form,
  type RadioChangeEvent,
  type FormInstance,
  Row,
  Col,
} from 'antd';
import React, {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { WeeklyBehavior } from '@iScheduler/components/behaviors/WeeklyBehavior';
import { handleDurationValueChange, handleSelectWeeklyDay } from '@iScheduler/handlers';
import { useSchedulerContext } from '@iScheduler/provider/SchedulerContext';
import { EWeekDays, type TSchedulerRepeat } from '@iScheduler/types';
import { getKeyFromEnum } from '@iScheduler/types';
import { mergeNames, requiredField } from '@iScheduler/utils/form.util';

import styles from '@iScheduler/styles/scheduler.module.less';

type TMonthlyBehaviorProps = {
  min?: number;
  max?: number;
  prefix: string[];
  namespaces?: string[];
  disabled?: boolean;
  formRef: FormInstance;
  setOccurs: Dispatch<SetStateAction<string>>;
};

export const MonthlyBehavior: React.FC<TMonthlyBehaviorProps> = (props) => {
  const { t, loading } = useSchedulerContext();

  const {
    min = 1,
    max = 31,
    prefix,
    disabled = false,
    namespaces = ['repeat', 'monthly'],
    formRef,
    setOccurs,
  } = props;

  const [monthPeriod, setMonthPeriod] =
    useState<TSchedulerRepeat['monthly']['type']>('DAY');

  const day = t('scheduler.day');

  const onChangePeriod = useCallback(
    (type: TSchedulerRepeat['monthly']['type']) => {
      setMonthPeriod(type);

      if (type === 'DAY') {
        const scheduler = formRef.getFieldValue(prefix);
        handleSelectWeeklyDay(scheduler.duration.period, scheduler, setOccurs, t);
      }
    },
    [formRef, prefix, setOccurs, t],
  );

  useEffect(() => {
    const fieldPath = mergeNames([...prefix, ...namespaces], 'type');
    const type: TSchedulerRepeat['monthly']['type'] = formRef.getFieldValue(fieldPath);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    onChangePeriod(type);
  }, [formRef, onChangePeriod, prefix, namespaces]);

  const weeks = useCallback(() => {
    const handleWeekPeriodType = () => {
      const scheduler = formRef.getFieldValue(prefix);
      handleDurationValueChange(
        { type: scheduler.duration.type, period: scheduler.duration.period },
        scheduler,
        setOccurs,
        t,
      );
    };

    if (monthPeriod !== 'PERIOD') return null;

    const periods = [
      { value: getKeyFromEnum(EWeekDays, 'First' as EWeekDays), label: t('scheduler.day.first') },
      { value: getKeyFromEnum(EWeekDays, 'Second' as EWeekDays), label: t('scheduler.day.second') },
      { value: getKeyFromEnum(EWeekDays, 'Third' as EWeekDays), label: t('scheduler.day.third') },
      { value: getKeyFromEnum(EWeekDays, 'Fourth' as EWeekDays), label: t('scheduler.day.fourth') },
      { value: getKeyFromEnum(EWeekDays, 'Last' as EWeekDays), label: t('scheduler.day.last') },
    ];

    return (
      <Col span={24} className={styles.monthlyGridWeek}>
        <Form.Item
          noStyle
          name={mergeNames([...prefix, ...namespaces], 'weekDay')}
          rules={[requiredField(t('scheduler.weekday'))]}
        >
          <Radio.Group
            disabled={loading || disabled}
            optionType="button"
            buttonStyle="solid"
            onChange={handleWeekPeriodType}
            options={periods.map(({ value, label }, idx) => ({
              label,
              value,
              key: idx,
              disabled: disabled || loading,
            }))}
          />
        </Form.Item>
        <WeeklyBehavior
          formRef={formRef}
          prefix={prefix}
          isMultiple={true}
          disabled={disabled || loading}
          extendBy={[
            { key: 'extend-day', label: t('scheduler.day'), value: 'DAY' },
            { key: 'extend-weekday', label: t('scheduler.weekday'), value: 'WEEKDAY' },
            { key: 'extend-weekend', label: t('scheduler.weekend'), value: 'WEEKEND' },
          ]}
          setOccurs={setOccurs}
        />
      </Col>
    );
  }, [disabled, formRef, loading, monthPeriod, namespaces, prefix, setOccurs, t]);

  const days = () => {
    if (monthPeriod !== 'DAY') return null;

    return (
      <Col span={12} className={styles.monthlyGridDay}>
        <Form.Item
          noStyle
          name={mergeNames([...prefix, ...namespaces], 'monthDay')}
          hasFeedback
          rules={[requiredField(t('scheduler.days'))]}
        >
          <InputNumber
            style={{ width: 120 }}
            min={min}
            max={max}
            onChange={(durationValue: number | null) => {
              const scheduler = formRef.getFieldValue(prefix);
              if (durationValue) {
                handleSelectWeeklyDay(durationValue, scheduler, setOccurs, t);
              }
            }}
            disabled={disabled || loading}
            placeholder={day}
          />
        </Form.Item>
      </Col>
    );
  };

  return (
    <div className={styles.monthWrapper}>
      <Form.Item
        noStyle
        name={mergeNames([...prefix, ...namespaces], 'type')}
        rules={[requiredField(t('scheduler.meta.period'))]}
      >
        <Radio.Group
          disabled={disabled || loading}
          optionType="button"
          buttonStyle="solid"
          onChange={(e: RadioChangeEvent) => {
            e.preventDefault();
            onChangePeriod(e.target.value);
          }}
          options={[
            { value: 'DAY', label: t('scheduler.day') },
            { value: 'PERIOD', label: t('scheduler.meta.period') },
          ]}
        />
      </Form.Item>
      <Row className={styles.monthComponents}>
        {days()}
        {weeks()}
      </Row>
    </div>
  );
};
