import { InputNumber, Form, type FormInstance, Row, Col, Segmented } from 'antd';
import React, { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from 'react';
import { CalendarTwoTone, ControlTwoTone } from '@ant-design/icons';

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

  const [monthPeriod, setMonthPeriod] = useState<TSchedulerRepeat['monthly']['type']>('DAY');
  const currentWeekDay = Form.useWatch(mergeNames([...prefix, ...namespaces], 'weekDay'), formRef);

  const day = t('scheduler.day');

  const onChangePeriod = useCallback(
    (type: TSchedulerRepeat['monthly']['type']) => {
      setMonthPeriod(type);

      if (type === 'DAY') {
        const scheduler = formRef.getFieldValue(prefix);
        handleSelectWeeklyDay(scheduler.duration.period, scheduler, setOccurs, t);
      }
    },
    [formRef, prefix, setOccurs, setMonthPeriod, t],
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

    const periods = (
      [
        ['First', 'scheduler.day.first'],
        ['Second', 'scheduler.day.second'],
        ['Third', 'scheduler.day.third'],
        ['Fourth', 'scheduler.day.fourth'],
        ['Last', 'scheduler.day.last'],
      ] as const
    ).map(([enumKey, labelKey]) => {
      const value = getKeyFromEnum(EWeekDays, enumKey as EWeekDays);
      return {
        value,
        label: t(labelKey),
        icon: currentWeekDay === value ? <CalendarTwoTone /> : <CalendarTwoTone twoToneColor="gray" />,
      };
    });

    return (
      <Col span={24} className={styles.monthlyGridWeek}>
        <Form.Item
          noStyle
          name={mergeNames([...prefix, ...namespaces], 'weekDay')}
          rules={[requiredField(t('scheduler.weekday'))]}
        >
          <Segmented
            disabled={loading || disabled}
            onChange={handleWeekPeriodType}
            options={periods.map(({ value, label, icon }) => ({
              label,
              value,
              icon,
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
  }, [currentWeekDay, disabled, formRef, loading, monthPeriod, namespaces, prefix, setOccurs, t]);

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
        <Segmented
          disabled={disabled || loading}
          onChange={(value) => {
            onChangePeriod(value as TSchedulerRepeat['monthly']['type']);
          }}
          options={[
            {
              value: 'DAY',
              icon:
                monthPeriod === 'DAY' ? (
                  <CalendarTwoTone />
                ) : (
                  <CalendarTwoTone twoToneColor="gray" />
                ),
              label: t('scheduler.day'),
            },
            {
              value: 'PERIOD',
              icon:
                monthPeriod === 'PERIOD' ? (
                  <ControlTwoTone />
                ) : (
                  <ControlTwoTone twoToneColor="gray" />
                ),
              label: t('scheduler.meta.period'),
            },
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
