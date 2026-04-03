import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

import {
  useSchedulerContext,
  ESchedulerPrefix,
  EDiscountType,
  EDurationTypes,
  IScheduler,
  DEFAULT_SALE_SCHEDULER,
  DEFAULT_DISCOUNT_SCHEDULER,
  CEndReasonTypes,
  handleChangeStartDate,
  handleDurationValueChange,
} from '@teamco/ischeduler-core';

import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Duration } from './internal/Duration';
import { WeeklyBehavior } from './behaviors/WeeklyBehavior';
import { MonthlyBehavior } from './behaviors/MonthlyBehavior';
import { YearlyBehavior } from './behaviors/YearlyBehavior';
import { OnThisDayBehavior } from './behaviors/OnThisDayBehavior';
import { AfterBehavior } from './behaviors/AfterBehavior';

export type TSchedulerProps = {
  value?: IScheduler;
  onChange?: (value: IScheduler) => void;
  disabled?: boolean;
  readOnlyFields?: string[];
  schedulerType: ESchedulerPrefix;
  discountTypes?: (keyof typeof EDiscountType)[];
  durationTypes?: (keyof typeof EDurationTypes)[];
};

export const Scheduler: React.FC<TSchedulerProps> = (props) => {
  const { t, loading } = useSchedulerContext();
  const {
    value,
    onChange,
    disabled = false,
    durationTypes = Object.keys(EDurationTypes) as (keyof typeof EDurationTypes)[],
    discountTypes = Object.keys(EDiscountType) as (keyof typeof EDiscountType)[],
    schedulerType,
  } = props;

  const DEFAULT_SCHEDULER = useMemo(() =>
    schedulerType === ESchedulerPrefix.SALE ? DEFAULT_SALE_SCHEDULER : DEFAULT_DISCOUNT_SCHEDULER
  , [schedulerType]);

  const [internalValue, setInternalValue] = useState<IScheduler>(
    () => (value ?? DEFAULT_SCHEDULER as IScheduler),
  );

  const scheduler = value ?? internalValue;

  const [occurs, setOccurs] = useState<string>('0');
  const [startAt, setStartAt] = useState<string | null>(null);

  // Sync state when props change (only if value identity actually changed)
  const [prevValue, setPrevValue] = useState<IScheduler | undefined>(value);
  if (value !== prevValue) {
    setInternalValue(value ?? DEFAULT_SCHEDULER as IScheduler);
    setPrevValue(value);
  }

  useEffect(() => {
    if (scheduler.range?.startedAt) {
      handleChangeStartDate(dayjs(scheduler.range.startedAt), setStartAt);
    }

    if (scheduler.duration) {
      handleDurationValueChange(
        scheduler.duration,
        scheduler,
        setOccurs,
        t,
      );
    }
  }, [scheduler, t]);

  const handleFieldChange = (path: string, fieldValue: unknown) => {
    const parts = path.split('.');

    const setByPath = (obj: Record<string, unknown>, keys: string[], val: unknown): Record<string, unknown> => {
      if (keys.length === 1) return { ...obj, [keys[0]]: val };
      const [head, ...rest] = keys;
      return { ...obj, [head]: setByPath((obj[head] ?? {}) as Record<string, unknown>, rest, val) };
    };

    const newScheduler = setByPath(
      scheduler as unknown as Record<string, unknown>,
      parts,
      fieldValue,
    ) as unknown as IScheduler;

    setInternalValue(newScheduler);
    onChange?.(newScheduler);
  };

  const isDiscount = [ESchedulerPrefix.DISCOUNT, ESchedulerPrefix.TRIAL_DISCOUNT].includes(schedulerType);

  return (
    <div className="flex flex-col gap-6 py-4">
      {isDiscount && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>{t('scheduler.meta.duration')}</Label>
            <div className="flex gap-2">
              <Select
                value={scheduler.discount?.type || ''}
                onValueChange={(val) => handleFieldChange('discount.type', val)}
                disabled={disabled || loading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('scheduler.meta.duration')} />
                </SelectTrigger>
                <SelectContent>
                  {discountTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {EDiscountType[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={scheduler.discount?.value ?? ''}
                disabled={disabled || loading}
                onChange={(e) => handleFieldChange('discount.value', parseInt(e.target.value, 10))}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Duration
          label={t('scheduler.duration')}
          disabled={disabled || loading}
          typeValue={scheduler.duration?.type as keyof typeof EDurationTypes}
          periodValue={scheduler.duration?.period}
          durationTypes={durationTypes}
          required={true}
          onTypeChange={(type) => handleFieldChange('duration.type', type)}
          onValueChange={(period) => handleFieldChange('duration.period', period)}
        />

        <div className="flex flex-col gap-2">
          <Label>{t('scheduler.startedAt')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !scheduler.range?.startedAt && "text-muted-foreground"
                )}
                disabled={disabled || loading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduler.range?.startedAt ? (
                  format(dayjs(scheduler.range.startedAt).toDate(), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={scheduler.range?.startedAt ? dayjs(scheduler.range.startedAt).toDate() : undefined}
                onSelect={(date) => handleFieldChange('range.startedAt', date ? dayjs(date).toISOString() : null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {scheduler.duration?.type === 'WEEK' && (
        <WeeklyBehavior
          value={scheduler.repeat?.weekly?.days}
          onChange={(days) => handleFieldChange('repeat.weekly.days', days)}
          disabled={disabled}
          setOccurs={setOccurs}
          scheduler={scheduler}
        />
      )}

      {scheduler.duration?.type === 'MONTH' && (
        <MonthlyBehavior
          value={scheduler.repeat?.monthly}
          onChange={(monthly) => handleFieldChange('repeat.monthly', monthly)}
          onWeeklyChange={(days) => handleFieldChange('repeat.weekly.days', days)}
          disabled={disabled}
          setOccurs={setOccurs}
          scheduler={scheduler}
        />
      )}

      {scheduler.duration?.type === 'YEAR' && (
        <YearlyBehavior
          value={scheduler.repeat?.yearly}
          onChange={(yearly) => handleFieldChange('repeat.yearly', yearly)}
          disabled={disabled}
          setOccurs={setOccurs}
          scheduler={scheduler}
          repeatMonthly={scheduler.repeat?.monthly}
          onMonthlyChange={(monthly) => handleFieldChange('repeat.monthly', monthly)}
          onWeeklyChange={(days) => handleFieldChange('repeat.weekly.days', days)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>{t('scheduler.duration.end')}</Label>
          <Select
            value={scheduler.range?.endReason?.type || ''}
            onValueChange={(val) => handleFieldChange('range.endReason.type', val)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('scheduler.duration.end')} />
            </SelectTrigger>
            <SelectContent>
              {[
                { label: t('scheduler.duration.end.day'), value: CEndReasonTypes[0] },
                { label: t('scheduler.duration.end.after'), value: CEndReasonTypes[1] },
                { label: t('scheduler.duration.end.no'), value: CEndReasonTypes[2] },
              ].map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          {scheduler.range?.endReason?.type === CEndReasonTypes[0] && (
            <OnThisDayBehavior
              value={dayjs(scheduler.range?.endReason?.expiredAt)}
              startedAt={dayjs(scheduler.range?.startedAt)}
              onChange={(val) => handleFieldChange('range.endReason.expiredAt', val ? val.toISOString() : null)}
              disabled={disabled}
            />
          )}
          {scheduler.range?.endReason?.type === CEndReasonTypes[1] && (
            <AfterBehavior
              value={scheduler.range?.endReason?.occurrences}
              onChange={(val) => handleFieldChange('range.endReason.occurrences', val)}
              disabled={disabled}
            />
          )}
        </div>
      </div>

      <div 
        className="text-sm text-muted-foreground"
        dangerouslySetInnerHTML={{
          __html: t('scheduler.result', { occurs, startAt: startAt ?? '' }),
        }}
      />
    </div>
  );
};
