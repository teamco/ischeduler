import dayjs, { type Dayjs } from 'dayjs';
import type { Dispatch, SetStateAction } from 'react';

import { dayHandler } from './handlers/day.handler';
import { monthHandler } from './handlers/month.handler';
import { weekHandler } from './handlers/week.handler';
import { yearHandler } from './handlers/year.handler';
import { EDiscountType, EDurationTypes, type IScheduler, type TSchedulerDuration } from './types';
import type { TFn } from './i18n';
import type { IFormInstance } from './utils/form.util';

export const handleMsg = (singular: string, plural: string, value: number, t: TFn) => {
  let msg = `${value} ${t(plural)}`;
  if (value === 1) {
    msg = t(singular);
  }
  return msg;
};

export const handleDurationValueChange = (
  duration: TSchedulerDuration,
  scheduler: IScheduler,
  setOccurs: Dispatch<SetStateAction<string>>,
  t: TFn,
  extender: string = '',
) => {
  switch (duration.type) {
    case 'DAY':
      return dayHandler(duration.period, extender, setOccurs, t);
    case 'WEEK':
      return weekHandler(duration.period, scheduler, setOccurs, t);
    case 'MONTH':
      return monthHandler(duration.period, scheduler, setOccurs, t);
    case 'YEAR':
      return yearHandler(duration.period, scheduler, setOccurs, t);
  }
};

export const handleChangeStartDate = (
  value: Dayjs,
  setStartAt: Dispatch<SetStateAction<string | null>>,
) => {
  const _m = dayjs(value);
  const _startAt = [
    _m.format('dddd'),
    `${_m.date()} ${_m.format('MMMM')} ${_m.format('YYYY')}`,
    `at ${_m.hour()}:${_m.minute()}`,
  ].join(', ');

  setStartAt(_startAt);
};

export const handleSelectWeeklyDay = (
  durationValue: number,
  scheduler: IScheduler,
  setOccurs: Dispatch<SetStateAction<string>>,
  t: TFn,
  extra?: { msg?: string },
) => {
  const _day = t('scheduler.separator.day');
  const _of = t('scheduler.separator.of');
  const _every = t('scheduler.separator.every');
  const period = `${_day} ${scheduler?.repeat?.monthly?.monthDay} ${_of} ${_every} `;

  if (extra?.msg) {
    setOccurs(`${period} ${extra?.msg}`);
  } else {
    handleDurationValueChange(
      { type: scheduler.duration.type, period: durationValue },
      scheduler,
      setOccurs,
      t,
      period,
    );
  }
};

export const handleMultipleDurations = (values: string[] = [], t: TFn) => {
  const _and = t('scheduler.separator.and');
  const joined = values.join(', ');
  const lastCommaIndex = joined.lastIndexOf(',');

  // If there's no comma, return the string as is
  if (lastCommaIndex === -1) return joined;

  // Replace the last comma with the translated "and"
  return joined.slice(0, lastCommaIndex) + _and + joined.slice(lastCommaIndex + 1);
};

export type THandleSchedulerForm = {
  disabled: boolean;
  formRef: IFormInstance;
  entity: IScheduler;
  handlers: {
    onSave: () => void;
    setLoading: (loading: boolean) => void;
    setOpenDrawer: (open: boolean) => void;
    setConfigDrawer: (config: Record<string, unknown>) => void;
    setOnRefreshDrawer: (fn: () => void) => void;
  };
  options: {
    title?: string;
    loading: boolean;
    schedulerType: IScheduler['type'];
    isEdit: boolean;
    isDirty: boolean;
    prefix?: string[];
    readOnlyFields?: string[];
    t: TFn;
  };
};

export const handleSchedulerForm = ({
  disabled,
  formRef,
  entity,
  handlers: { onSave, setLoading, setOpenDrawer, setConfigDrawer, setOnRefreshDrawer },
  options: { title, loading, schedulerType, isEdit, isDirty, prefix = [], readOnlyFields = [], t },
}: THandleSchedulerForm) => {
  // Dynamic import to avoid circular dependency
  // Scheduler component will be rendered by the caller
  if (disabled) return;

  const durationTypes = Object.keys(EDurationTypes) as (keyof typeof EDurationTypes)[];
  const discountTypes = Object.keys(EDiscountType) as (keyof typeof EDiscountType)[];

  setLoading(true);
  setOpenDrawer(true);

  const refresh = () => {
    setLoading(true);
    setConfigDrawer({
      size: 600,
      schedulerType,
      durationTypes,
      discountTypes,
      readOnlyFields,
      prefix,
      entity,
      formRef,
      title,
      isEdit,
      isDirty,
      loading,
      onSave,
      disabled,
      t,
    });
    setLoading(false);
  };

  setOnRefreshDrawer(refresh);
  refresh();
};
