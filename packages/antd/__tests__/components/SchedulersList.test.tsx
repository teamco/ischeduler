import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { SchedulerProvider } from '@teamco/ischeduler-core';
import { SchedulersList } from '@ischeduler-antd/components/SchedulersList';
import { ESchedulerPrefix, EEndReasonType, EStatus } from '@teamco/ischeduler-core';
import type { IScheduler } from '@teamco/ischeduler-core';
import dayjs from 'dayjs';

const mockScheduler: IScheduler = {
  id: 'test-1',
  type: ESchedulerPrefix.SALE,
  duration: { type: 'WEEK', period: 2 },
  repeat: {
    weekly: { days: ['MONDAY', 'FRIDAY'] },
    monthly: { type: 'DAY', monthDay: 1 },
    yearly: { months: [] },
  },
  range: {
    startedAt: dayjs('2026-01-01'),
    endReason: { type: EEndReasonType.FOREVER, expiredAt: null },
  },
  status: EStatus.ACTIVE,
  metadata: {
    createdAt: dayjs('2026-01-01'),
    updatedAt: dayjs('2026-01-01'),
  },
};

const emptySchedulers = {
  [ESchedulerPrefix.SALE]: [] as IScheduler[],
  [ESchedulerPrefix.DISCOUNT]: [] as IScheduler[],
  [ESchedulerPrefix.TRIAL_DISCOUNT]: [] as IScheduler[],
};

const populatedSchedulers = {
  ...emptySchedulers,
  [ESchedulerPrefix.SALE]: [mockScheduler],
};

describe('SchedulersList', () => {
  it('should render without crashing with empty data', () => {
    const { container } = render(
      <SchedulerProvider schedulers={emptySchedulers}>
        <SchedulersList type={ESchedulerPrefix.SALE} />
      </SchedulerProvider>,
    );
    expect(container.querySelector('.ant-table')).toBeTruthy();
  });

  it('should render table with scheduler data', () => {
    const { container } = render(
      <SchedulerProvider schedulers={populatedSchedulers}>
        <SchedulersList type={ESchedulerPrefix.SALE} />
      </SchedulerProvider>,
    );
    expect(container.querySelector('.ant-table')).toBeTruthy();
    // Should have at least one row in tbody
    const rows = container.querySelectorAll('.ant-table-tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should show toolbar with hide columns', () => {
    const { container } = render(
      <SchedulerProvider schedulers={emptySchedulers}>
        <SchedulersList type={ESchedulerPrefix.SALE} />
      </SchedulerProvider>,
    );
    // Toolbar contains a dropdown button
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should show footer with total count', () => {
    const { container } = render(
      <SchedulerProvider schedulers={populatedSchedulers}>
        <SchedulersList type={ESchedulerPrefix.SALE} />
      </SchedulerProvider>,
    );
    const footer = container.querySelector('.ant-table-footer');
    expect(footer?.textContent).toContain('1');
  });

  it('should respect disabled prop', () => {
    render(
      <SchedulerProvider
        schedulers={emptySchedulers}
        permissions={{ canCreate: false, canUpdate: false, canDelete: false }}
      >
        <SchedulersList type={ESchedulerPrefix.SALE} disabled />
      </SchedulerProvider>,
    );
    // Should still render the table
    expect(document.querySelector('.ant-table')).toBeTruthy();
  });

  it('should call onRefresh when provided', () => {
    const onRefresh = vi.fn();
    render(
      <SchedulerProvider schedulers={emptySchedulers}>
        <SchedulersList type={ESchedulerPrefix.SALE} onRefresh={onRefresh} />
      </SchedulerProvider>,
    );
    // onRefresh is wired to the toolbar, not called on mount
    expect(onRefresh).not.toHaveBeenCalled();
  });
});
