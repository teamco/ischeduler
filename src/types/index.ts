import type dayjs from 'dayjs';

// ============================================================
// Utility
// ============================================================

export const getKeyFromEnum = <T extends object>(
  enumObj: T,
  value: T[keyof T],
): keyof T | undefined =>
  (Object.keys(enumObj) as Array<keyof T>).find((key) => enumObj[key] === value);

// ============================================================
// Common Enums
// ============================================================

export enum EStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
  DELETED = 'DELETED',
  PROCESSING = 'PROCESSING',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
}

export enum EDurationTypes {
  HOUR = 'Hour',
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year',
  FOREVER = 'Forever',
}

export type TDuration = {
  type: keyof typeof EDurationTypes;
  period: number;
};

// ============================================================
// Price / Discount
// ============================================================

export const CNsPrice = 'price';
export const CNsDuration = 'duration';
export const CNsDiscount = 'discount';
export const CNsTrial = 'trialPeriod';

export enum ECurrency {
  USD = 'USD',
  EUR = 'EUR',
}

export enum EDiscountType {
  PERCENT = 'Percent',
  FIXED = 'Fixed',
}

export const CDiscountTypeValues = {
  PERCENT: '%',
  FIXED: ECurrency,
} as const;

export type TDiscountType = keyof typeof EDiscountType;
export type TDiscount = {
  type: TDiscountType;
  value: number;
};

// ============================================================
// Scheduler Enums
// ============================================================

export enum EEndReasonType {
  DATE = 'Date',
  NUMBER = 'Number',
  FOREVER = 'Forever',
}

export enum EDays {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}

export enum EMonths {
  JANUARY = 'January',
  FEBRUARY = 'February',
  MARCH = 'March',
  APRIL = 'April',
  MAY = 'May',
  JUNE = 'June',
  JULY = 'July',
  AUGUST = 'August',
  SEPTEMBER = 'September',
  OCTOBER = 'October',
  NOVEMBER = 'November',
  DECEMBER = 'December',
}

export enum EWeekDays {
  FIRST = 'First',
  SECOND = 'Second',
  THIRD = 'Third',
  FOURTH = 'Fourth',
  LAST = 'Last',
}

export enum ESchedulerPrefix {
  SALE = 'sale',
  DISCOUNT = 'discount',
  TRIAL_DISCOUNT = 'trialDiscount',
}

export enum ESchedulerTypeTransform {
  MONTH = 'monthly',
  YEAR = 'yearly',
  WEEK = 'weekly',
  DAY = 'daily',
}

// ============================================================
// Scheduler Constants
// ============================================================

export const CScheduler = 'scheduler';
export const CEndReasonTypes = [
  EEndReasonType.DATE,
  EEndReasonType.NUMBER,
  EEndReasonType.FOREVER,
];
export const CFirstDayIdx = 1;
export const DEFAULT_SCHEDULERS_LIMIT = 5;

// ============================================================
// Scheduler Types
// ============================================================

export type TSchedulerDuration = {
  type: keyof typeof EDurationTypes;
  period: number;
};

export type TSchedulerRange = {
  startedAt: dayjs.Dayjs | string;
  endReason: {
    type: EEndReasonType;
    expiredAt: dayjs.Dayjs | string | null;
  };
};

export type TSchedulerRepeat = {
  weekly: {
    days: (keyof typeof EDays)[];
  };
  monthly: {
    weekDay?: keyof typeof EWeekDays;
    monthDay?: number;
    type: 'DAY' | 'PERIOD';
  };
  yearly: {
    months?: (keyof typeof EMonths)[];
  };
};

export interface ISchedulerMetadata {
  createdAt?: string | dayjs.Dayjs;
  updatedAt?: string | dayjs.Dayjs;
  createdBy?: string;
  updatedBy?: string;
}

export interface IScheduler {
  id?: string;
  type: ESchedulerPrefix;
  duration: TSchedulerDuration;
  repeat: TSchedulerRepeat;
  range: TSchedulerRange;
  discount?: TDiscount | null;
  status?: EStatus;
  metadata?: ISchedulerMetadata;
}

// ============================================================
// Conditional Discount Type
// ============================================================

type TConditionalDiscount<P extends ESchedulerPrefix> = P extends ESchedulerPrefix.SALE
  ? { [CNsDiscount]?: null }
  : { [CNsDiscount]?: TDiscount };

export type TScheduler<P extends ESchedulerPrefix> = IScheduler & TConditionalDiscount<P>;

export type RequiredSchedulers = {
  [K in Exclude<ESchedulerPrefix, ESchedulerPrefix.TRIAL_DISCOUNT>]: TScheduler<K>[];
};

export type OptionalSchedulers = {
  [ESchedulerPrefix.TRIAL_DISCOUNT]?: TScheduler<ESchedulerPrefix.TRIAL_DISCOUNT>[];
};

export type TSchedulers = {
  [CScheduler]: RequiredSchedulers & OptionalSchedulers;
};

// ============================================================
// Common Interfaces (simplified from @common/types)
// ============================================================

export interface IObjectId {
  id?: string;
  uid?: string;
}

export interface ICommonDataType extends IObjectId {
  key: string;
  [key: string]: unknown;
}

// ============================================================
// Default Scheduler Objects
// ============================================================

import djs from 'dayjs';

const BASE_SCHEDULER: Omit<IScheduler, 'id' | 'type' | 'metadata' | 'discount'> = {
  duration: {
    type: 'MONTH',
    period: 7,
  },
  repeat: {
    weekly: {
      days: [getKeyFromEnum(EDays, Object.values(EDays)[CFirstDayIdx]) as keyof typeof EDays],
    },
    monthly: {
      weekDay: 'SECOND',
      monthDay: 2,
      type: 'PERIOD',
    },
    yearly: {
      months: ['JANUARY'],
    },
  },
  range: {
    startedAt: djs(new Date()),
    endReason: { type: CEndReasonTypes[2], expiredAt: null },
  },
  status: EStatus.PROCESSING,
};

export const DEFAULT_SALE_SCHEDULER: Partial<TScheduler<ESchedulerPrefix.SALE>> = {
  ...BASE_SCHEDULER,
  type: ESchedulerPrefix.SALE,
  [CNsDiscount]: null,
};

export const DEFAULT_DISCOUNT_SCHEDULER: Partial<TScheduler<ESchedulerPrefix.DISCOUNT>> = {
  ...BASE_SCHEDULER,
  type: ESchedulerPrefix.DISCOUNT,
  [CNsDiscount]: {
    type: 'PERCENT',
    value: 1,
  },
};
