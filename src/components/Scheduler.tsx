import { Col, DatePicker, Form, type FormInstance, InputNumber, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import { Duration } from '@iScheduler/components/internal/Duration';
import { AfterBehavior } from '@iScheduler/components/behaviors/AfterBehavior';
import { MonthlyBehavior } from '@iScheduler/components/behaviors/MonthlyBehavior';
import { OnThisDayBehavior } from '@iScheduler/components/behaviors/OnThisDayBehavior';
import { WeeklyBehavior } from '@iScheduler/components/behaviors/WeeklyBehavior';
import { YearlyBehavior } from '@iScheduler/components/behaviors/YearlyBehavior';
import { handleChangeStartDate, handleDurationValueChange } from '@iScheduler/handlers';
import { useSchedulerContext } from '@iScheduler/provider/SchedulerContext';
import styles from '@iScheduler/styles/scheduler.module.less';
import {
  CEndReasonTypes,
  CNsDiscount,
  CNsDuration,
  DEFAULT_DISCOUNT_SCHEDULER,
  DEFAULT_SALE_SCHEDULER,
  type EDurationTypes,
  EDiscountType,
  ESchedulerPrefix,
  type IScheduler,
} from '@iScheduler/types';
import { isReadOnlyField, mergeNames, requiredField } from '@iScheduler/utils/form.util';
import { DEFAULT_DATE_TIME_FORMAT, getDisabledDate } from '@iScheduler/utils/format.util';

type TSchedulerProps = {
  formRef: FormInstance;
  prefix: string[];
  entity?: IScheduler | null;
  onFinish?: (values: unknown) => void;
  disabled?: boolean;
  readOnlyFields?: string[];
  schedulerType: ESchedulerPrefix;
  discountTypes?: (keyof typeof EDiscountType)[];
  durationTypes?: (keyof typeof EDurationTypes)[];
};

export const Scheduler: React.FC<TSchedulerProps> = (props) => {
  const { t, loading } = useSchedulerContext();

  const {
    formRef,
    prefix,
    entity,
    onFinish,
    disabled = false,
    durationTypes = [],
    discountTypes = [],
    readOnlyFields = [],
    schedulerType,
  } = props;

  const [endType, setEndType] = useState<string | null>(null);
  const [periodType, setPeriodType] = useState<string | null>(null);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [occurs, setOccurs] = useState<string>('0');

  const scheduler = formRef.getFieldValue(prefix);

  const DEFAULT_SCHEDULER =
    schedulerType === ESchedulerPrefix.SALE ? DEFAULT_SALE_SCHEDULER : DEFAULT_DISCOUNT_SCHEDULER;

  useEffect(() => {
    formRef.resetFields();
  }, [formRef]);

  useEffect(() => {
    if (entity) {
      // Set nested form values without lodash
      const obj: Record<string, unknown> = {};
      let current: Record<string, unknown> = obj;
      for (let i = 0; i < prefix.length - 1; i++) {
        current[prefix[i]] = {};
        current = current[prefix[i]] as Record<string, unknown>;
      }
      current[prefix[prefix.length - 1]] = entity;
      formRef.setFieldsValue(obj);
    }

    const _periodType = formRef.getFieldValue(mergeNames(prefix, CNsDuration, 'type'));
    const _periodValue = formRef.getFieldValue(mergeNames(prefix, CNsDuration, 'period'));
    const _startAt = formRef.getFieldValue(mergeNames(prefix, 'range', 'startedAt'));

    if (_startAt) handleChangeStartDate(_startAt, setStartAt);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPeriodType(_periodType);
    if (_periodType && _periodValue) {
      handleDurationValueChange(
        { type: _periodType, period: _periodValue },
        entity ?? (DEFAULT_SCHEDULER as IScheduler),
        setOccurs,
        t,
      );
    }

    const _endReason = formRef.getFieldValue(mergeNames(prefix, 'range', 'endReason', 'type'));
    setEndType(_endReason);
  }, [DEFAULT_SCHEDULER, entity, formRef, prefix, t]);

  // Build initial values without lodash
  const buildInitialValues = () => {
    const obj: Record<string, unknown> = {};
    let current: Record<string, unknown> = obj;
    for (let i = 0; i < prefix.length - 1; i++) {
      current[prefix[i]] = {};
      current = current[prefix[i]] as Record<string, unknown>;
    }
    current[prefix[prefix.length - 1]] = DEFAULT_SCHEDULER;
    return obj;
  };

  return (
    <Space>
      <Form
        layout="vertical"
        autoComplete="off"
        form={formRef}
        className={styles.scheduler}
        onFinish={onFinish}
        initialValues={buildInitialValues()}
      >
        {[ESchedulerPrefix.DISCOUNT, ESchedulerPrefix.TRIAL_DISCOUNT].includes(schedulerType) && (
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item label={t('scheduler.meta.duration')}>
                <Space.Compact>
                  <Form.Item
                    noStyle
                    name={mergeNames(prefix, CNsDiscount, 'type')}
                    rules={[requiredField(t('scheduler.meta.duration'), true)]}
                  >
                    <Select
                      style={{ width: 150 }}
                      disabled={disabled || loading}
                      options={discountTypes.sort().map((type, idx) => ({
                        key: idx,
                        label: EDiscountType[type],
                        value: type,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    name={mergeNames(prefix, CNsDiscount, 'value')}
                    rules={[requiredField(t('scheduler.meta.duration'), true)]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      readOnly={isReadOnlyField(
                        mergeNames(null, CNsDiscount, 'value').join('.'),
                        readOnlyFields,
                      )}
                      disabled={disabled || loading}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Duration
              label={t('scheduler.duration')}
              disabled={disabled || loading}
              onTypeChange={(value: keyof typeof EDurationTypes) => {
                setPeriodType(value);
                handleDurationValueChange(
                  { type: value, period: scheduler?.duration?.period },
                  scheduler,
                  setOccurs,
                  t,
                );
              }}
              onValueChange={(durationValue) => {
                if (durationValue) {
                  handleDurationValueChange(
                    { type: scheduler?.duration?.type, period: durationValue },
                    scheduler,
                    setOccurs,
                    t,
                  );
                }
              }}
              prefix={prefix}
              namespace={CNsDuration}
              required={true}
              durationTypes={durationTypes}
            />
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('scheduler.startedAt')}
              name={mergeNames(prefix, 'range', 'startedAt')}
              rules={[requiredField(t('scheduler.startedAt'))]}
            >
              <DatePicker
                onChange={(value) => value && handleChangeStartDate(value, setStartAt)}
                showTime
                format={DEFAULT_DATE_TIME_FORMAT}
                disabledDate={(current) => getDisabledDate(current)}
                disabled={disabled || loading}
              />
            </Form.Item>
          </Col>
        </Row>
        {periodType === 'WEEK' && (
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <WeeklyBehavior
                prefix={prefix}
                isMultiple={true}
                formRef={formRef}
                setOccurs={setOccurs}
                disabled={disabled}
              />
            </Col>
          </Row>
        )}
        {periodType === 'MONTH' && (
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <MonthlyBehavior
                formRef={formRef}
                prefix={prefix}
                disabled={disabled}
                setOccurs={setOccurs}
              />
            </Col>
          </Row>
        )}
        {periodType === 'YEAR' && (
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <YearlyBehavior
                formRef={formRef}
                prefix={prefix}
                disabled={disabled}
                setOccurs={setOccurs}
              />
            </Col>
          </Row>
        )}
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label={t('scheduler.duration.end')}
              name={mergeNames(prefix, 'range', 'endReason', 'type')}
              rules={[requiredField(t('scheduler.duration.end'))]}
            >
              <Select
                disabled={disabled}
                onChange={(value: string) => setEndType(value)}
                options={[
                  t('scheduler.duration.end.day'),
                  t('scheduler.duration.end.after'),
                  t('scheduler.duration.end.no'),
                ].map((type, idx) => ({
                  key: idx,
                  label: type,
                  value: CEndReasonTypes[idx],
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            {endType === CEndReasonTypes[0] && <OnThisDayBehavior prefix={prefix} disabled={disabled} />}
            {endType === CEndReasonTypes[1] && <AfterBehavior prefix={prefix} disabled={disabled} />}
          </Col>
        </Row>
        <span
          className={styles.result}
          dangerouslySetInnerHTML={{
            __html: t('scheduler.result', { occurs, startAt: startAt ?? '' }),
          }}
        />
      </Form>
    </Space>
  );
};
