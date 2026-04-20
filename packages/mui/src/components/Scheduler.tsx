import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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

  // Sync state when props change (Derived state pattern)
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
      if (keys.length === 1) {
        return { ...obj, [keys[0]]: val };
      }
      const [head, ...rest] = keys;
      return {
        ...obj,
        [head]: setByPath((obj[head] ?? {}) as Record<string, unknown>, rest, val),
      };
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
        {isDiscount && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('scheduler.meta.discount')}</InputLabel>
                  <Select
                    value={scheduler.discount?.type || ''}
                    label={t('scheduler.meta.discount')}
                    disabled={disabled || loading}
                    onChange={(e) => handleFieldChange('discount.type', e.target.value)}
                  >
                    {discountTypes.map((type) => (
                      <MenuItem key={String(type)} value={type as string}>
                        {EDiscountType[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label={t('scheduler.meta.discount')}
                  value={scheduler.discount?.value ?? ''}
                  disabled={disabled || loading}
                  onChange={(e) => handleFieldChange('discount.value', parseInt(e.target.value, 10))}
                />
              </Box>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
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
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DateTimePicker
              label={t('scheduler.startedAt')}
              value={dayjs(scheduler.range?.startedAt)}
              onChange={(val) => handleFieldChange('range.startedAt', val)}
              disabled={disabled || loading}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Grid>
        </Grid>

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

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('scheduler.duration.end')}</InputLabel>
              <Select
                value={scheduler.range?.endReason?.type || ''}
                label={t('scheduler.duration.end')}
                disabled={disabled}
                onChange={(e) => handleFieldChange('range.endReason.type', e.target.value)}
              >
                {[
                  { label: t('scheduler.duration.end.day'), value: CEndReasonTypes[0] },
                  { label: t('scheduler.duration.end.after'), value: CEndReasonTypes[1] },
                  { label: t('scheduler.duration.end.no'), value: CEndReasonTypes[2] },
                ].map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            {scheduler.range?.endReason?.type === CEndReasonTypes[0] && (
              <OnThisDayBehavior
                value={dayjs(scheduler.range?.endReason?.expiredAt)}
                startedAt={dayjs(scheduler.range?.startedAt)}
                onChange={(val) => handleFieldChange('range.endReason.expiredAt', val)}
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
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{ fontStyle: 'italic', color: 'text.secondary' }}
          dangerouslySetInnerHTML={{
            __html: t('scheduler.result', { occurs, startAt: startAt ?? '' }),
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};
