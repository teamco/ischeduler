import { Col, DatePicker, Form, type FormInstance, InputNumber, Row, Select, Space } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';

import { Duration } from '../components/internal/Duration';
import { AfterBehavior } from '../components/behaviors/AfterBehavior';
import { MonthlyBehavior } from '../components/behaviors/MonthlyBehavior';
import { OnThisDayBehavior } from '../components/behaviors/OnThisDayBehavior';
import { WeeklyBehavior } from '../components/behaviors/WeeklyBehavior';
import { YearlyBehavior } from '../components/behaviors/YearlyBehavior';
import { handleChangeStartDate, handleDurationValueChange } from '@teamco/ischeduler-core';
import { useSchedulerContext } from '@teamco/ischeduler-core';
import styles from '../styles/scheduler.module.less';
import {
  CEndReasonTypes,
  CNsDiscount,
  CNsDuration,
  DEFAULT_DISCOUNT_SCHEDULER,
  DEFAULT_SALE_SCHEDULER,
  EDurationTypes,
  EDiscountType,
  ESchedulerPrefix,
  type IScheduler,
} from '@teamco/ischeduler-core';
import { isReadOnlyField, mergeNames, requiredField } from '@teamco/ischeduler-core';
import { DEFAULT_DATE_TIME_FORMAT, getDisabledDate } from '@teamco/ischeduler-core';

type TSchedulerProps = {
  /** Ant Design form instance for managing form state */
  formRef: FormInstance;
  /** Form field name prefix (e.g. `['scheduler', 'sale']`) */
  prefix: string[];
  /** Existing scheduler data for edit mode. Pass `null` for create mode. */
  entity?: IScheduler | null;
  /** Called when the form is submitted */
  onFinish?: (values: unknown) => void;
  /** Disable all form fields. @default false */
  disabled?: boolean;
  /** Field names that should be read-only (e.g. `['discount.value']`). @default [] */
  readOnlyFields?: string[];
  /** Scheduler type — determines which fields are shown (e.g. discount fields for DISCOUNT/TRIAL_DISCOUNT) */
  schedulerType: ESchedulerPrefix;
  /** Available discount type options. Only used when `schedulerType` is DISCOUNT or TRIAL_DISCOUNT. @default [] */
  discountTypes?: (keyof typeof EDiscountType)[];
  /** Available duration type options (HOUR, DAY, WEEK, MONTH, YEAR, FOREVER). @default [] */
  durationTypes?: (keyof typeof EDurationTypes)[];
  /** Callback to set the dirty state. */
  setDirty: (dirty: boolean) => void;
};

export const Scheduler: React.FC<TSchedulerProps> = (props) => {
  const { t, loading } = useSchedulerContext();

  const {
    formRef,
    prefix,
    entity,
    onFinish,
    setDirty,
    disabled = false,
    durationTypes = [],
    discountTypes = [],
    readOnlyFields = [],
    schedulerType,
  } = props;

  const [startAt, setStartAt] = useState<string | null>(null);
  const [occurs, setOccurs] = useState<string>('0');

  const schedulerValue = Form.useWatch(prefix, formRef);

  const DEFAULT_SCHEDULER = useMemo(
    () =>
      schedulerType === ESchedulerPrefix.SALE ? DEFAULT_SALE_SCHEDULER : DEFAULT_DISCOUNT_SCHEDULER,
    [schedulerType],
  );

  // Sync entity to form
  useEffect(() => {
    if (entity) {
      const obj: Record<string, unknown> = {};
      let current: Record<string, unknown> = obj;
      for (let i = 0; i < prefix.length - 1; i++) {
        current[prefix[i]] = {};
        current = current[prefix[i]] as Record<string, unknown>;
      }
      current[prefix[prefix.length - 1]] = entity;
      formRef.setFieldsValue(obj);
    } else {
      formRef.resetFields();
    }
  }, [entity, formRef, prefix]);

  // Sync occurs text whenever relevant form values change
  useEffect(() => {
    if (!schedulerValue) return;

    const _startAt = schedulerValue.range?.startedAt;
    if (_startAt) {
      handleChangeStartDate(_startAt, setStartAt);
    }

    const _duration = schedulerValue.duration;
    if (_duration?.type && _duration?.period) {
      handleDurationValueChange(
        _duration,
        schedulerValue as IScheduler,
        setOccurs,
        t,
      );
    }
  }, [schedulerValue, t]);

  const endType = schedulerValue?.range?.endReason?.type;
  const periodType = schedulerValue?.duration?.type;

  const buildInitialValues = useMemo(() => {
    const obj: Record<string, unknown> = {};
    let current: Record<string, unknown> = obj;
    for (let i = 0; i < prefix.length - 1; i++) {
      current[prefix[i]] = {};
      current = current[prefix[i]] as Record<string, unknown>;
    }
    current[prefix[prefix.length - 1]] = DEFAULT_SCHEDULER;
    return obj;
  }, [DEFAULT_SCHEDULER, prefix]);

  return (
    <Space orientation="vertical" style={{ width: '100%' }}>
      <Form
        layout="vertical"
        autoComplete="off"
        form={formRef}
        className={styles.scheduler}
        onFinish={onFinish}
        onFieldsChange={() => setDirty(true)}
        initialValues={buildInitialValues}
      >
        {[ESchedulerPrefix.DISCOUNT, ESchedulerPrefix.TRIAL_DISCOUNT].includes(schedulerType) && (
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item label={t('scheduler.meta.discount')}>
                <Space.Compact>
                  <Form.Item
                    noStyle
                    name={mergeNames(prefix, CNsDiscount, 'type')}
                    rules={[requiredField(t('scheduler.meta.discount'), true)]}
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
                    rules={[requiredField(t('scheduler.meta.discount'), true)]}
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
                showTime
                format={DEFAULT_DATE_TIME_FORMAT}
                disabledDate={(current) => getDisabledDate(current)}
                disabled={disabled || loading}
                style={{ width: '100%' }}
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
            {endType === CEndReasonTypes[0] && (
              <OnThisDayBehavior prefix={prefix} disabled={disabled} />
            )}
            {endType === CEndReasonTypes[1] && (
              <AfterBehavior prefix={prefix} disabled={disabled} />
            )}
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
