import React, { type Dispatch, type SetStateAction, useMemo, useCallback } from 'react';
import { CheckboxButton } from '../internal/CheckboxButton';
import {
  useSchedulerContext,
  EDays,
  CFirstDayIdx,
  getKeyFromEnum,
  handleDurationValueChange,
  type IScheduler
} from '@teamco/ischeduler-core';

type TWeeklyBehaviorProps = {
  value?: string[];
  onChange?: (values: string[]) => void;
  disabled?: boolean;
  setOccurs: Dispatch<SetStateAction<string>>;
  scheduler: IScheduler;
};

export const WeeklyBehavior: React.FC<TWeeklyBehaviorProps> = (props) => {
  const { t, loading } = useSchedulerContext();
  const { value = [], onChange, disabled, setOccurs, scheduler } = props;

  const shortDays = useMemo(
    () =>
      Object.keys(EDays).map((day) =>
        t(`scheduler.weekdays.short.${EDays[day as keyof typeof EDays].toLowerCase()}`),
      ),
    [t],
  );

  const longDays = useMemo(
    () =>
      Object.keys(EDays).map((day) =>
        t(`scheduler.weekdays.${EDays[day as keyof typeof EDays].toLowerCase()}`),
      ),
    [t],
  );

  const orderByFirstDayOfWeek = (days: string[]) =>
    days.map((_, i) => days[(i + CFirstDayIdx) % 7]);

  const weekShortDays = orderByFirstDayOfWeek(shortDays);
  const weekLongDays = orderByFirstDayOfWeek(longDays);

  const options = weekShortDays.map((day, idx) => {
    const enumValue = weekLongDays[idx] as EDays;
    const optValue = getKeyFromEnum(EDays, enumValue) as string;

    return {
      key: `${day}-${idx}`,
      label: day,
      value: optValue,
    };
  });

  const handleChange = useCallback((newValues: string[]) => {
    if (onChange) {
      onChange(newValues);
      
      const updatedScheduler = {
        ...scheduler,
        repeat: {
          ...scheduler.repeat,
          weekly: { days: newValues as (keyof typeof EDays)[] }
        }
      };
      
      handleDurationValueChange(
        updatedScheduler.duration,
        updatedScheduler,
        setOccurs,
        t
      );
    }
  }, [onChange, scheduler, setOccurs, t]);

  return (
    <CheckboxButton
      label={t('scheduler.days')}
      options={options}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      loading={loading}
    />
  );
};
