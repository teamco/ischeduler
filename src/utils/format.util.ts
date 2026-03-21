import dayjs from 'dayjs';

export const DEFAULT_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const NADate = '—';

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
 * Converts a timestamp to a Date object.
 * @param {string | number} ts - The timestamp to convert, which can be a number or a string.
 * @returns {Date} A Date object representing the given timestamp.
 */
const toDate = (ts: Date | string | number): Date => {
  if (isNaN(new Date(ts).getDate())) {
    ts = parseInt(ts?.toString(), 10);
  }
  return new Date(ts);
};

export const tsToDate = (ts: Date | string | number | undefined): string =>
  ts ? toDate(ts).toLocaleDateString() : NADate;
export const tsToTime = (ts: Date | string | number | undefined): string =>
  ts ? toDate(ts).toLocaleTimeString() : NADate;
export const tsToLocaleDateTime = (
  ts: Date | string | number | undefined,
): string => {
  let _ts = ts;
  if ((_ts as any)?.seconds && (_ts as any)?.nanoseconds) {
    _ts = (_ts as any).toDate();
  }
  return _ts ? `${tsToDate(_ts)} ${tsToTime(_ts)}` : NADate;
};

/**
 * Return true if the given date should be disabled (before today or before min).
 */
export const getDisabledDate = (current: dayjs.Dayjs, min?: dayjs.Dayjs): boolean => {
  const reference = min || dayjs().startOf('day');
  return current.isBefore(reference, 'day');
};
