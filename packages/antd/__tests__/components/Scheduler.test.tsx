import '@testing-library/jest-dom';
import { render, } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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

const DrawerLike: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const [form] = Form.useForm();
  return (
    <SchedulerContext.Provider value={ctxValue}>
      <SaveButton isEdit={false} disabled={disabled} />
      <Scheduler
        formRef={form}
        prefix={[CScheduler, ESchedulerPrefix.DISCOUNT]}
        schedulerType={ESchedulerPrefix.DISCOUNT}
        durationTypes={['DAY', 'WEEK', 'MONTH', 'YEAR']}
        discountTypes={['PERCENT', 'FIXED']}
        entity={entity}
      />
    </SchedulerContext.Provider>
  );
};

describe('Scheduler disabled tracking', () => {
  it('save button is enabled initially', async () => {
    const { container } = render(<DrawerLike disabled={false} />);

    const saveBtn = container.querySelector('button.ant-btn') as HTMLButtonElement;
    expect(saveBtn).toBeTruthy();
    expect(saveBtn).not.toBeDisabled();
  });

  it('save button is disabled initially', async () => {
    const { container } = render(<DrawerLike disabled={true} />);

    const saveBtn = container.querySelector('button.ant-btn') as HTMLButtonElement;
    expect(saveBtn).toBeTruthy();
    expect(saveBtn).toBeDisabled();
  });
});
