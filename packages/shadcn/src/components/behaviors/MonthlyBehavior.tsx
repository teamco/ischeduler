import React, { type Dispatch, type SetStateAction } from 'react';
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { Calendar, Settings } from "lucide-react"

import { WeeklyBehavior } from './WeeklyBehavior';
import {
  useSchedulerContext,
  EWeekDays,
  handleSelectWeeklyDay,
  handleDurationValueChange,
  type IScheduler,
  type TSchedulerRepeat
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

  const monthPeriod = value?.type || 'DAY';

  const handleTypeChange = (newType: string) => {
    if (!onChange) return;
    const type = newType as 'DAY' | 'PERIOD';
    const newValue = { ...value, type } as TSchedulerRepeat['monthly'];
    onChange(newValue);
    
    const updatedScheduler = {
      ...scheduler,
      repeat: { ...scheduler.repeat, monthly: newValue }
    };

    if (type === 'DAY') {
      handleSelectWeeklyDay(updatedScheduler.duration.period, updatedScheduler, setOccurs, t);
    } else {
      handleDurationValueChange(updatedScheduler.duration, updatedScheduler, setOccurs, t);
    }
  };

  const handleDayChange = (period: number) => {
    if (onChange) {
      const newValue = { ...value, monthDay: period } as TSchedulerRepeat['monthly'];
      onChange(newValue);
      
      const updatedScheduler = {
        ...scheduler,
        repeat: { ...scheduler.repeat, monthly: newValue }
      };
      handleSelectWeeklyDay(period, updatedScheduler, setOccurs, t);
    }
  };

  const handleWeekDayChange = (newWeekDay: string) => {
    if (!onChange) return;
    const newValue = { ...value, weekDay: newWeekDay as keyof typeof EWeekDays } as TSchedulerRepeat['monthly'];
    onChange(newValue);
    
    const updatedScheduler = {
      ...scheduler,
      repeat: { ...scheduler.repeat, monthly: newValue }
    };
    handleDurationValueChange(updatedScheduler.duration, updatedScheduler, setOccurs, t);
  };

  const periods = [
    { value: 'FIRST', label: t('scheduler.day.first') },
    { value: 'SECOND', label: t('scheduler.day.second') },
    { value: 'THIRD', label: t('scheduler.day.third') },
    { value: 'FOURTH', label: t('scheduler.day.fourth') },
    { value: 'LAST', label: t('scheduler.day.last') },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={monthPeriod} onValueChange={handleTypeChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="DAY" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t('scheduler.day')}
          </TabsTrigger>
          <TabsTrigger value="PERIOD" className="gap-2">
            <Settings className="h-4 w-4" />
            {t('scheduler.meta.period')}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {monthPeriod === 'DAY' ? (
        <div className="flex flex-col gap-2">
          <Label>{t('scheduler.day')}</Label>
          <Input
            type="number"
            min={1}
            max={31}
            value={value?.monthDay ?? ''}
            disabled={disabled || loading}
            onChange={(e) => handleDayChange(parseInt(e.target.value, 10))}
            className="w-[120px]"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Tabs 
            value={value?.weekDay || ''} 
            onValueChange={handleWeekDayChange} 
            className="w-full"
          >
            <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted">
              {periods.map((p) => (
                <TabsTrigger key={p.value} value={p.value} className="flex-1 min-w-[80px]">
                  {p.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <WeeklyBehavior
            value={scheduler.repeat?.weekly?.days}
            onChange={(days) => {
              onWeeklyChange?.(days as string[]);
            }}
            disabled={disabled}
            setOccurs={setOccurs}
            scheduler={scheduler}
          />
        </div>
      )}
    </div>
  );
};
