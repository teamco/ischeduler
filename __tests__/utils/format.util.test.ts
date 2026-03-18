import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  getKeyFromEnum,
  numberToCurrency,
  tsToLocaleDateTime,
  DEFAULT_DATE_TIME_FORMAT,
  getDisabledDate,
} from '@iScheduler/utils';

describe('format utilities', () => {
  describe('getKeyFromEnum', () => {
    enum TestEnum {
      A = 'alpha',
      B = 'beta',
    }
    it('should return key for value', () => {
      expect(getKeyFromEnum(TestEnum, 'alpha' as TestEnum)).toBe('A');
    });
    it('should return undefined for unknown value', () => {
      expect(getKeyFromEnum(TestEnum, 'gamma' as TestEnum)).toBeUndefined();
    });
  });

  describe('numberToCurrency', () => {
    it('should format number as USD', () => {
      const result = numberToCurrency(42.5, 'USD');
      expect(result).toContain('42');
    });

    it('should format number as EUR', () => {
      const result = numberToCurrency(100, 'EUR');
      expect(result).toContain('100');
    });
  });

  describe('tsToLocaleDateTime', () => {
    it('should format dayjs date', () => {
      const date = dayjs('2026-01-15T10:30:00');
      const result = tsToLocaleDateTime(date);
      expect(result).toContain('2026');
    });

    it('should format string date', () => {
      const result = tsToLocaleDateTime('2026-01-15T10:30:00');
      expect(result).toContain('2026');
    });

    it('should handle undefined gracefully', () => {
      const result = tsToLocaleDateTime(undefined);
      expect(result).toBe('—');
    });
  });

  describe('DEFAULT_DATE_TIME_FORMAT', () => {
    it('should be a string', () => {
      expect(typeof DEFAULT_DATE_TIME_FORMAT).toBe('string');
    });
  });

  describe('getDisabledDate', () => {
    it('should disable dates before today by default', () => {
      const yesterday = dayjs().subtract(1, 'day');
      expect(getDisabledDate(yesterday)).toBe(true);
    });

    it('should not disable future dates', () => {
      const tomorrow = dayjs().add(1, 'day');
      expect(getDisabledDate(tomorrow)).toBe(false);
    });

    it('should disable dates before min when provided', () => {
      const min = dayjs('2026-06-01');
      const before = dayjs('2026-05-31');
      expect(getDisabledDate(before, min)).toBe(true);
    });
  });
});
