import dayjs from 'dayjs';
import {
  ESchedulerPrefix,
  EEndReasonType,
  EStatus,
  type IScheduler,
} from '@teamco/ischeduler-core';

export const mockSaleScheduler: IScheduler = {
  id: 'sale-1',
  type: ESchedulerPrefix.SALE,
  duration: { type: 'WEEK', period: 2 },
  repeat: {
    weekly: { days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'] },
    monthly: { type: 'DAY', monthDay: 1 },
    yearly: { months: [] },
  },
  range: {
    startedAt: dayjs('2026-04-01'),
    endReason: { type: EEndReasonType.DATE, expiredAt: dayjs('2026-12-31'), occurrences: 1 },
  },
  discount: null,
  status: EStatus.ACTIVE,
  metadata: {
    createdAt: dayjs('2026-03-15'),
    updatedAt: dayjs('2026-03-18'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
};

export const mockDiscountScheduler: IScheduler = {
  id: 'discount-1',
  type: ESchedulerPrefix.DISCOUNT,
  duration: { type: 'MONTH', period: 1 },
  repeat: {
    weekly: { days: ['MONDAY'] },
    monthly: { type: 'PERIOD', weekDay: 'FIRST' },
    yearly: { months: ['JANUARY', 'JULY'] },
  },
  range: {
    startedAt: dayjs('2026-05-01'),
    endReason: { type: EEndReasonType.NUMBER, expiredAt: null, occurrences: 10 },
  },
  discount: { type: 'PERCENT', value: 15 },
  status: EStatus.ACTIVE,
  metadata: {
    createdAt: dayjs('2026-03-10'),
    updatedAt: dayjs('2026-03-17'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
};

export const mockTrialScheduler: IScheduler = {
  id: 'trial-1',
  type: ESchedulerPrefix.TRIAL_DISCOUNT,
  duration: { type: 'DAY', period: 14 },
  repeat: {
    weekly: { days: [] },
    monthly: { type: 'DAY', monthDay: 1 },
    yearly: { months: [] },
  },
  range: {
    startedAt: dayjs('2026-06-01'),
    endReason: { type: EEndReasonType.FOREVER, expiredAt: null, occurrences: 1 },
  },
  discount: { type: 'FIXED', value: 5 },
  status: EStatus.PROCESSING,
  metadata: {
    createdAt: dayjs('2026-03-12'),
    updatedAt: dayjs('2026-03-16'),
    createdBy: 'user-2',
    updatedBy: 'user-2',
  },
};

export const emptySchedulers: Record<ESchedulerPrefix, IScheduler[]> = {
  [ESchedulerPrefix.SALE]: [],
  [ESchedulerPrefix.DISCOUNT]: [],
  [ESchedulerPrefix.TRIAL_DISCOUNT]: [],
};

export const populatedSchedulers: Record<ESchedulerPrefix, IScheduler[]> = {
  [ESchedulerPrefix.SALE]: [mockSaleScheduler],
  [ESchedulerPrefix.DISCOUNT]: [mockDiscountScheduler],
  [ESchedulerPrefix.TRIAL_DISCOUNT]: [mockTrialScheduler],
};

export const mockCrudCallbacks = {
  onCreate: async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Story] onCreate:', type, scheduler);
    await new Promise((r) => setTimeout(r, 500));
  },
  onUpdate: async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Story] onUpdate:', type, scheduler);
    await new Promise((r) => setTimeout(r, 500));
  },
  onDelete: async (type: ESchedulerPrefix, id: string) => {
    console.log('[Story] onDelete:', type, id);
    await new Promise((r) => setTimeout(r, 500));
  },
};
