import '@testing-library/jest-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Form } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import { Scheduler } from '@ischeduler-antd/components/Scheduler';
import { SaveButton } from '@ischeduler-antd/components/internal/SaveButton';
import {
  SchedulerContext,
  CScheduler,
  EEndReasonType,
  EStatus,
  ESchedulerPrefix,
  type IScheduler,
} from '@teamco/ischeduler-core';

const ctxValue = {
  schedulers: {
    [ESchedulerPrefix.SALE]: [],
    [ESchedulerPrefix.DISCOUNT]: [],
    [ESchedulerPrefix.TRIAL_DISCOUNT]: [],
  },
  loading: false,
  disabled: false,
  permissions: { canCreate: true, canUpdate: true, canDelete: true },
  t: (k: string) => k,
  drawerOpen: false,
  setDrawerOpen: () => {},
  drawerConfig: {},
  setDrawerConfig: () => {},
} as any;

const entity: IScheduler = {
  id: 'test-1',
  type: ESchedulerPrefix.DISCOUNT,
  discount: { type: 'PERCENT', value: 5 },
  duration: { type: 'DAY', period: 3 },
  repeat: {
    weekly: { days: ['MONDAY'] },
    monthly: { type: 'DAY', monthDay: 1, weekDay: 'FIRST' },
    yearly: { months: ['JANUARY'] },
  },
  range: {
    startedAt: dayjs('2026-01-01'),
    endReason: { type: EEndReasonType.FOREVER, expiredAt: null },
  },
  status: EStatus.ACTIVE,
  metadata: { createdAt: dayjs('2026-01-01'), updatedAt: dayjs('2026-01-01') },
};

const Wrapper: React.FC<{ setDirty: (v: boolean) => void }> = ({ setDirty }) => {
  const [form] = Form.useForm();
  return (
    <SchedulerContext.Provider value={ctxValue}>
      <Scheduler
        formRef={form}
        prefix={[CScheduler, ESchedulerPrefix.DISCOUNT]}
        schedulerType={ESchedulerPrefix.DISCOUNT}
        durationTypes={['DAY', 'WEEK', 'MONTH', 'YEAR']}
        discountTypes={['PERCENT', 'FIXED']}
        entity={entity}
        setDirty={setDirty}
      />
    </SchedulerContext.Provider>
  );
};

const DrawerLike: React.FC = () => {
  const [form] = Form.useForm();
  const [dirty, setDirty] = React.useState(false);
  return (
    <SchedulerContext.Provider value={ctxValue}>
      <SaveButton isEdit={false} disabled={!dirty} />
      <Scheduler
        formRef={form}
        prefix={[CScheduler, ESchedulerPrefix.DISCOUNT]}
        schedulerType={ESchedulerPrefix.DISCOUNT}
        durationTypes={['DAY', 'WEEK', 'MONTH', 'YEAR']}
        discountTypes={['PERCENT', 'FIXED']}
        entity={entity}
        setDirty={setDirty}
      />
    </SchedulerContext.Provider>
  );
};

describe('Scheduler dirty tracking', () => {
  it('calls setDirty(true) when a form field value changes', async () => {
    const setDirty = vi.fn();
    const { container } = render(<Wrapper setDirty={setDirty} />);

    const input = container.querySelector(
      'input#scheduler_discount_discount_value',
    ) as HTMLInputElement;
    expect(input).toBeTruthy();

    await act(async () => {
      fireEvent.change(input, { target: { value: '42' } });
      fireEvent.blur(input);
    });

    expect(setDirty).toHaveBeenCalledWith(true);
  });

  it('does not call setDirty on initial mount', () => {
    const setDirty = vi.fn();
    render(<Wrapper setDirty={setDirty} />);
    expect(setDirty).not.toHaveBeenCalled();
  });

  it('save button is disabled initially and enabled after a field change', async () => {
    const { container } = render(<DrawerLike />);

    const saveBtn = container.querySelector('button.ant-btn') as HTMLButtonElement;
    expect(saveBtn).toBeTruthy();
    expect(saveBtn).toBeDisabled();

    const input = container.querySelector(
      'input#scheduler_discount_discount_value',
    ) as HTMLInputElement;
    expect(input).toBeTruthy();

    await act(async () => {
      fireEvent.change(input, { target: { value: '42' } });
      fireEvent.blur(input);
    });

    expect(saveBtn).not.toBeDisabled();
  });
});
