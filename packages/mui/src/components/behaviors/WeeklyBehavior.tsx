import React, { useMemo, useCallback, useRef, Dispatch, SetStateAction, useEffect } from 'react';
import { Box } from '@mui/material';
import { CheckboxButton } from '../internal/CheckboxButton';
import { 
  useSchedulerContext, 
  EDays, 
  CFirstDayIdx, 
  getKeyFromEnum,
  handleDurationValueChange,
  IScheduler
} from '@teamco/ischeduler-core';

type TWeeklyBehaviorProps = {
  value?: (keyof typeof EDays)[];
  onChange?: (values: (keyof typeof EDays)[]) => void;
  disabled?: boolean;
  setOccurs: Dispatch<SetStateAction<string>>;
  scheduler: IScheduler;
};

export const WeeklyBehavior: React.FC<TWeeklyBehaviorProps> = (props) => {
  const { t, loading } = useSchedulerContext();
  const { value = [], onChange, disabled, setOccurs, scheduler } = props;
  const schedulerRef = useRef(scheduler);
  
  useEffect(() => {
    schedulerRef.current = scheduler;
  }, [scheduler]);

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
    const optValue = getKeyFromEnum(EDays, enumValue) as keyof typeof EDays;

    return {
      key: `${day}-${idx}`,
      label: day,
      value: optValue,
    };
  });

  const handleChange = useCallback((newValues: string[]) => {
    if (onChange) {
      const typedValues = newValues as (keyof typeof EDays)[];
      onChange(typedValues);

      const current = schedulerRef.current;
      const updatedScheduler: IScheduler = {
        ...current,
        repeat: {
          ...current.repeat,
          weekly: { days: typedValues }
        }
      };

      handleDurationValueChange(
        updatedScheduler.duration,
        updatedScheduler,
        setOccurs,
        t
      );
    }
  }, [onChange, setOccurs, t]);

  return (
    <Box>
      <CheckboxButton
        label={t('scheduler.days')}
        options={options}
        value={value as string[]}
        onChange={handleChange}
        disabled={disabled}
        loading={loading}
      />
    </Box>
  );
};
