import React, { type Dispatch, type SetStateAction, useMemo } from 'react';
import { CheckboxButton } from '../internal/CheckboxButton';
import { MonthlyBehavior } from './MonthlyBehavior';
import {
  useSchedulerContext,
  EMonths,
  handleDurationValueChange,
  type IScheduler,
  type TSchedulerRepeat
} from '@teamco/ischeduler-core';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{shortMonths[idx]}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{longMonths[idx]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    value: month,
  }));

  const handleMonthsChange = (newMonths: string[]) => {
    if (onChange) {
      const newValue = { ...value, months: newMonths } as TSchedulerRepeat['yearly'];
      onChange(newValue);

      const updatedScheduler = {
        ...scheduler,
        repeat: { ...scheduler.repeat, yearly: newValue }
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
    <div className="flex flex-col gap-6">
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
    </div>
  );
};
