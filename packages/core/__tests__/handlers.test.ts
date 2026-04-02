import { describe, it, expect, vi } from 'vitest';
import { createTranslationFn, defaultTranslations } from '../src/i18n';
import {
  handleMsg,
  handleChangeStartDate,
  handleMultipleDurations,
  handleDurationValueChange,
} from '@ischeduler-core/handlers';
import { ESchedulerPrefix, EEndReasonType } from '../src/types';
import dayjs from 'dayjs';
import type { IScheduler } from '../src/types';

const t = createTranslationFn(defaultTranslations);

const mockScheduler: IScheduler = {
  id: 'test-1',
  type: ESchedulerPrefix.SALE,
  duration: { type: 'WEEK', period: 2 },
  repeat: {
    weekly: { days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'] },
    monthly: { type: 'DAY', monthDay: 15 },
    yearly: { months: ['JANUARY'] },
  },
  range: {
    startedAt: dayjs('2026-01-01'),
    endReason: { type: EEndReasonType.FOREVER, expiredAt: null },
  },
};

describe('handlers', () => {
  describe('handleMsg', () => {
    it('should return singular when value is 1', () => {
      const result = handleMsg('scheduler.day', 'scheduler.days', 1, t);
      expect(result).toBe('Day');
    });

    it('should return plural with count when value > 1', () => {
      const result = handleMsg('scheduler.day', 'scheduler.days', 5, t);
      expect(result).toBe('5 Days');
    });
  });

  describe('handleChangeStartDate', () => {
    it('should format and set start date', () => {
      const setStartAt = vi.fn();
      const date = dayjs('2026-06-15T14:30:00');
      handleChangeStartDate(date, setStartAt);

      expect(setStartAt).toHaveBeenCalledTimes(1);
      const result = setStartAt.mock.calls[0][0];
      expect(result).toContain('15');
      expect(result).toContain('June');
      expect(result).toContain('2026');
    });
  });

  describe('handleMultipleDurations', () => {
    it('should join values with commas and "and"', () => {
      const result = handleMultipleDurations(['MONDAY', 'WEDNESDAY', 'FRIDAY'], t);
      expect(result).toContain('MONDAY');
      expect(result).toContain('FRIDAY');
      expect(result).toContain('and');
    });

    it('should handle single value', () => {
      const result = handleMultipleDurations(['MONDAY'], t);
      expect(result).toBe('MONDAY');
    });

    it('should handle empty array', () => {
      const result = handleMultipleDurations([], t);
      expect(result).toBe('');
    });
  });

  describe('handleDurationValueChange', () => {
    it('should call day handler for DAY type', () => {
      const setOccurs = vi.fn();
      handleDurationValueChange(
        { type: 'DAY', period: 3 },
        mockScheduler,
        setOccurs,
        t,
      );
      expect(setOccurs).toHaveBeenCalled();
      const result = setOccurs.mock.calls[0][0];
      expect(result).toContain('every');
      expect(result).toContain('3');
    });

    it('should call week handler for WEEK type', () => {
      const setOccurs = vi.fn();
      handleDurationValueChange(
        { type: 'WEEK', period: 2 },
        mockScheduler,
        setOccurs,
        t,
      );
      expect(setOccurs).toHaveBeenCalled();
    });

    it('should call month handler for MONTH type', () => {
      const setOccurs = vi.fn();
      handleDurationValueChange(
        { type: 'MONTH', period: 1 },
        mockScheduler,
        setOccurs,
        t,
      );
      expect(setOccurs).toHaveBeenCalled();
    });

    it('should call year handler for YEAR type', () => {
      const setOccurs = vi.fn();
      handleDurationValueChange(
        { type: 'YEAR', period: 1 },
        mockScheduler,
        setOccurs,
        t,
      );
      expect(setOccurs).toHaveBeenCalled();
    });
  });
});
