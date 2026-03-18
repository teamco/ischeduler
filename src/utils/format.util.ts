import dayjs from 'dayjs';

export const DEFAULT_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Get enum key from its value.
 */
export const getKeyFromEnum = <T extends object>(
  enumObj: T,
  value: T[keyof T],
): keyof T | undefined =>
  (Object.keys(enumObj) as Array<keyof T>).find((key) => enumObj[key] === value);

/**
 * Format a number as a currency string.
 */
export const numberToCurrency = (value: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
};

/**
 * Format a timestamp (dayjs or string) to a locale date-time string.
 */
export const tsToLocaleDateTime = (
  ts: dayjs.Dayjs | string | undefined | null,
  format: string = DEFAULT_DATE_TIME_FORMAT,
): string => {
  if (!ts) return '—';
  const d = dayjs(ts);
  return d.isValid() ? d.format(format) : '—';
};

/**
 * Return true if the given date should be disabled (before today or before min).
 */
export const getDisabledDate = (current: dayjs.Dayjs, min?: dayjs.Dayjs): boolean => {
  const reference = min || dayjs().startOf('day');
  return current.isBefore(reference, 'day');
};
