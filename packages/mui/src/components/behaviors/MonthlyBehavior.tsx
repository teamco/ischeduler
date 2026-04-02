import React, { Dispatch, SetStateAction, useRef } from 'react';
import { 
  Box, 
  ToggleButton, 
  ToggleButtonGroup, 
  TextField, 
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';

import { WeeklyBehavior } from './WeeklyBehavior';
import { 
  useSchedulerContext, 
  EWeekDays, 
  handleSelectWeeklyDay,
  handleDurationValueChange,
  IScheduler,
  TSchedulerRepeat
} from '@teamco/ischeduler-core';

type TMonthlyBehaviorProps = {
  value?: TSchedulerRepeat['monthly'];
  onChange?: (value: TSchedulerRepeat['monthly']) => void;
  onWeeklyChange?: (days: string[]) => void;
  disabled?: boolean;
  setOccurs: Dispatch<SetStateAction<string>>;
  scheduler: IScheduler;
};

export const MonthlyBehavior: React.FC<TMonthlyBehaviorProps> = (props) => {
  const { t, loading } = useSchedulerContext();
  const { value, onChange, onWeeklyChange, disabled, setOccurs, scheduler } = props;
  const schedulerRef = useRef(scheduler);
  // eslint-disable-next-line react-hooks/refs
  schedulerRef.current = scheduler;

  const monthPeriod = value?.type || 'DAY';

  const handleTypeChange = (_event: React.MouseEvent<HTMLElement>, newType: 'DAY' | 'PERIOD') => {
    if (newType !== null && onChange) {
      const newValue = {
        ...value,
        type: newType,
        ...(newType === 'PERIOD' && !value?.weekDay ? { weekDay: 'FIRST' as keyof typeof EWeekDays } : {}),
      } as TSchedulerRepeat['monthly'];
      onChange(newValue);

      const current = schedulerRef.current;
      const updatedScheduler = {
        ...current,
        repeat: { ...current.repeat, monthly: newValue }
      };

      if (newType === 'DAY') {
        handleSelectWeeklyDay(updatedScheduler.duration.period, updatedScheduler, setOccurs, t);
      } else {
        handleDurationValueChange(updatedScheduler.duration, updatedScheduler, setOccurs, t);
      }
    }
  };

  const handleDayChange = (period: number) => {
    if (onChange) {
      const newValue = { ...value, monthDay: period } as TSchedulerRepeat['monthly'];
      onChange(newValue);

      const current = schedulerRef.current;
      const updatedScheduler = {
        ...current,
        repeat: { ...current.repeat, monthly: newValue }
      };
      handleSelectWeeklyDay(period, updatedScheduler, setOccurs, t);
    }
  };

  const handleWeekDayChange = (_event: React.MouseEvent<HTMLElement>, newWeekDay: keyof typeof EWeekDays) => {
    if (newWeekDay !== null && onChange) {
      const newValue = { ...value, weekDay: newWeekDay } as TSchedulerRepeat['monthly'];
      onChange(newValue);

      const current = schedulerRef.current;
      const updatedScheduler = {
        ...current,
        repeat: { ...current.repeat, monthly: newValue }
      };
      handleDurationValueChange(updatedScheduler.duration, updatedScheduler, setOccurs, t);
    }
  };

  const periods = [
    { value: 'FIRST', label: t('scheduler.day.first') },
    { value: 'SECOND', label: t('scheduler.day.second') },
    { value: 'THIRD', label: t('scheduler.day.third') },
    { value: 'FOURTH', label: t('scheduler.day.fourth') },
    { value: 'LAST', label: t('scheduler.day.last') },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ToggleButtonGroup
        value={monthPeriod}
        exclusive
        onChange={handleTypeChange}
        disabled={disabled || loading}
        size="small"
      >
        <ToggleButton value="DAY" aria-label="day">
          <CalendarMonthIcon fontSize="small" sx={{ mr: 1 }} />
          {t('scheduler.day')}
        </ToggleButton>
        <ToggleButton value="PERIOD" aria-label="period">
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          {t('scheduler.meta.period')}
        </ToggleButton>
      </ToggleButtonGroup>

      {monthPeriod === 'DAY' ? (
        <TextField
          label={t('scheduler.day')}
          type="number"
          size="small"
          value={value?.monthDay ?? ''}
          disabled={disabled || loading}
          inputProps={{ min: 1, max: 31 }}
          onChange={(e) => handleDayChange(parseInt(e.target.value, 10))}
          sx={{ width: 120 }}
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ToggleButtonGroup
            value={value?.weekDay || ''}
            exclusive
            onChange={handleWeekDayChange}
            disabled={disabled || loading}
            size="small"
            sx={{ flexWrap: 'wrap' }}
          >
            {periods.map((p) => (
              <ToggleButton key={p.value} value={p.value}>
                {p.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          
          <WeeklyBehavior
            value={scheduler.repeat?.weekly?.days}
            onChange={(days) => {
              onWeeklyChange?.(days as string[]);
            }}
            disabled={disabled}
            setOccurs={setOccurs}
            scheduler={scheduler}
          />
        </Box>
      )}
    </Box>
  );
};
