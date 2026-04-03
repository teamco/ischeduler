import React, { useMemo, useRef, Dispatch, SetStateAction, useEffect } from 'react';
import { Box, Tooltip } from '@mui/material';
import { CheckboxButton } from '../internal/CheckboxButton';
import { MonthlyBehavior } from './MonthlyBehavior';
import { 
  useSchedulerContext, 
  EMonths, 
  handleDurationValueChange,
  IScheduler,
  TSchedulerRepeat
} from '@teamco/ischeduler-core';

type TYearlyBehaviorProps = {
  value?: TSchedulerRepeat['yearly'];
  onChange?: (value: TSchedulerRepeat['yearly']) => void;
  disabled?: boolean;
  setOccurs: Dispatch<SetStateAction<string>>;
  scheduler: IScheduler;
  repeatMonthly?: TSchedulerRepeat['monthly'];
  onMonthlyChange?: (value: TSchedulerRepeat['monthly']) => void;
  onWeeklyChange?: (days: string[]) => void;
};

export const YearlyBehavior: React.FC<TYearlyBehaviorProps> = (props) => {
  const { t, loading } = useSchedulerContext();
  const { 
    value, 
    onChange, 
    disabled, 
    setOccurs, 
    scheduler,
    repeatMonthly,
    onMonthlyChange,
    onWeeklyChange
  } = props;
  const schedulerRef = useRef(scheduler);

  useEffect(() => {
    schedulerRef.current = scheduler;
  }, [scheduler]);

  const longMonths = useMemo(
    () =>
      Object.keys(EMonths).map((month) =>
        t(`scheduler.months.${EMonths[month as keyof typeof EMonths].toLowerCase()}`),
      ),
    [t],
  );

  const shortMonths = useMemo(
    () =>
      Object.keys(EMonths).map((month) =>
        t(`scheduler.months.short.${EMonths[month as keyof typeof EMonths].toLowerCase()}`),
      ),
    [t],
  );

  const monthsOptions = Object.keys(EMonths).map((month, idx) => ({
    key: `${month}-${idx}`,
    label: (
      <Tooltip title={longMonths[idx]}>
        <span>{shortMonths[idx]}</span>
      </Tooltip>
    ),
    value: month,
  }));

  const handleMonthsChange = (newMonths: string[]) => {
    if (onChange) {
      const typedMonths = newMonths as (keyof typeof EMonths)[];
      const newValue = { ...value, months: typedMonths } as TSchedulerRepeat['yearly'];
      onChange(newValue);

      const current = schedulerRef.current;
      const updatedScheduler: IScheduler = {
        ...current,
        repeat: { ...current.repeat, yearly: newValue }
      };
      
      handleDurationValueChange(
        updatedScheduler.duration,
        updatedScheduler,
        setOccurs,
        t
      );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <CheckboxButton
        label={t('scheduler.months')}
        options={monthsOptions}
        value={value?.months || []}
        onChange={handleMonthsChange}
        disabled={disabled}
        loading={loading}
      />
      <MonthlyBehavior
        value={repeatMonthly}
        onChange={onMonthlyChange}
        onWeeklyChange={onWeeklyChange}
        disabled={disabled}
        setOccurs={setOccurs}
        scheduler={scheduler}
      />
    </Box>
  );
};
