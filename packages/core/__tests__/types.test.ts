import { describe, it, expect } from 'vitest';
import {
  EEndReasonType,
  EDays,
  EMonths,
  EWeekDays,
  ESchedulerPrefix,
  EDurationTypes,
  EStatus,
  EDiscountType,
  ESchedulerTypeTransform,
  ECurrency,
  CScheduler,
  CFirstDayIdx,
  DEFAULT_SCHEDULERS_LIMIT,
  CEndReasonTypes,
  CNsDiscount,
  CNsDuration,
  CNsPrice,
  DEFAULT_SALE_SCHEDULER,
  DEFAULT_DISCOUNT_SCHEDULER,
  getKeyFromEnum,
} from '../src/types';

describe('ischeduler types', () => {
  it('should export ESchedulerPrefix with correct values', () => {
    expect(ESchedulerPrefix.SALE).toBe('sale');
    expect(ESchedulerPrefix.DISCOUNT).toBe('discount');
    expect(ESchedulerPrefix.TRIAL_DISCOUNT).toBe('trialDiscount');
  });

  it('should export EDurationTypes', () => {
    expect(EDurationTypes.DAY).toBe('Day');
    expect(EDurationTypes.WEEK).toBe('Week');
    expect(EDurationTypes.MONTH).toBe('Month');
    expect(EDurationTypes.YEAR).toBe('Year');
  });

  it('should export EEndReasonType', () => {
    expect(EEndReasonType.DATE).toBe('Date');
    expect(EEndReasonType.NUMBER).toBe('Number');
    expect(EEndReasonType.FOREVER).toBe('Forever');
  });

  it('should export EDays with 7 days', () => {
    expect(Object.keys(EDays).filter((k) => isNaN(Number(k)))).toHaveLength(7);
  });

  it('should export EMonths with 12 months', () => {
    expect(Object.keys(EMonths).filter((k) => isNaN(Number(k)))).toHaveLength(12);
  });

  it('should export EWeekDays', () => {
    expect(EWeekDays.FIRST).toBe('First');
    expect(EWeekDays.LAST).toBe('Last');
  });

  it('should export EStatus with all values', () => {
    expect(EStatus.ACTIVE).toBe('ACTIVE');
    expect(EStatus.DEACTIVATED).toBe('DEACTIVATED');
    expect(EStatus.PROCESSING).toBe('PROCESSING');
    expect(EStatus.PENDING).toBe('PENDING');
  });

  it('should export ECurrency', () => {
    expect(ECurrency.USD).toBe('USD');
    expect(ECurrency.EUR).toBe('EUR');
  });

  it('should export EDiscountType', () => {
    expect(EDiscountType.PERCENT).toBe('Percent');
    expect(EDiscountType.FIXED).toBe('Fixed');
  });

  it('should export constants', () => {
    expect(CScheduler).toBe('scheduler');
    expect(CFirstDayIdx).toBe(1);
    expect(DEFAULT_SCHEDULERS_LIMIT).toBe(5);
    expect(CEndReasonTypes).toHaveLength(3);
    expect(CNsDiscount).toBe('discount');
    expect(CNsDuration).toBe('duration');
    expect(CNsPrice).toBe('price');
  });

  it('should export DEFAULT_SALE_SCHEDULER with type SALE', () => {
    expect(DEFAULT_SALE_SCHEDULER.type).toBe(ESchedulerPrefix.SALE);
    expect(DEFAULT_SALE_SCHEDULER.discount).toBeNull();
  });

  it('should export DEFAULT_DISCOUNT_SCHEDULER with type DISCOUNT', () => {
    expect(DEFAULT_DISCOUNT_SCHEDULER.type).toBe(ESchedulerPrefix.DISCOUNT);
    expect(DEFAULT_DISCOUNT_SCHEDULER.discount).toBeDefined();
    expect(DEFAULT_DISCOUNT_SCHEDULER.discount?.type).toBe('PERCENT');
  });

  it('should export ESchedulerTypeTransform', () => {
    expect(ESchedulerTypeTransform.MONTH).toBe('monthly');
    expect(ESchedulerTypeTransform.WEEK).toBe('weekly');
    expect(ESchedulerTypeTransform.DAY).toBe('daily');
    expect(ESchedulerTypeTransform.YEAR).toBe('yearly');
  });

  it('should export getKeyFromEnum utility', () => {
    expect(getKeyFromEnum(EDays, EDays.MONDAY)).toBe('MONDAY');
    expect(getKeyFromEnum(EDays, 'NonExistent' as EDays)).toBeUndefined();
  });
});
