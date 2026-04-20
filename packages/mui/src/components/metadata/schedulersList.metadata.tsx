import React from 'react';
import dayjs from 'dayjs';
import { 
  ESchedulerPrefix, 
  EStatus, 
  IScheduler, 
  ISchedulerMetadata, 
  TDiscount, 
  TDuration, 
  ECurrency,
  TFn,
  CDiscountTypeValues,
  numberToCurrency,
  tsToLocaleDateTime
} from '@teamco/ischeduler-core';

import { StatusTag } from '../internal/StatusTag';
import { DeleteAction } from '../internal/DeleteAction';
import { DrawerEditAction } from '../internal/DrawerEditAction';
import { handleMonthly, handleWeekly, handleYearly } from './metadata.handlers';
import { Box } from '@mui/material';

export type TMuiColumn = {
  id: string;
  key: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: unknown, record: IScheduler) => React.ReactNode;
  concealable?: boolean;
};

type TArgs = {
  disabled: boolean;
  schedulerType: ESchedulerPrefix;
  entities: IScheduler[];
  currency?: keyof typeof ECurrency;
  t: TFn;
  onDelete?: (entity: IScheduler) => void;
  onEdit?: (entity: IScheduler) => void;
};

export const columnsMetadata = (props: TArgs): TMuiColumn[] => {
  const { disabled, schedulerType, currency, t, onEdit, onDelete } = props;

  const columns: (TMuiColumn | null)[] = [
    { id: 'index', key: 'index', label: '#', minWidth: 50 },
    {
      id: 'duration',
      key: 'duration',
      label: t('scheduler.meta.duration'),
      minWidth: 120,
      format: (duration: unknown) => {
        const d = duration as TDuration;
        return `${d?.period} (${d?.type})`;
      },
    },
    {
      id: 'repeat',
      key: 'repeat',
      label: t('scheduler.duration'),
      minWidth: 200,
      format: (_: unknown, record: IScheduler) => {
        const { duration, repeat } = record;
        const { weekly, monthly, yearly } = repeat;

        switch (duration?.type) {
          case 'WEEK':
            return handleWeekly(weekly);
          case 'MONTH':
            return handleMonthly(monthly, weekly);
          case 'YEAR':
            return handleYearly(yearly, monthly, weekly);
          default:
            return null;
        }
      },
    },
    [ESchedulerPrefix.DISCOUNT, ESchedulerPrefix.TRIAL_DISCOUNT].includes(schedulerType)
      ? {
          id: 'discount',
          key: 'discount',
          label: t('scheduler.meta.discount'),
          minWidth: 120,
          format: (discount: unknown) => {
            const d = discount as TDiscount;
            if (!d) return '—';
            if (d.type === 'PERCENT') {
              return `${d.value}${CDiscountTypeValues[d.type]}`;
            }
            return numberToCurrency(d.value, currency ?? 'USD');
          },
        }
      : null,
    {
      id: 'status',
      key: 'status',
      label: t('scheduler.status'),
      minWidth: 120,
      align: 'center',
      concealable: true,
      format: (status: unknown) => <StatusTag status={status as keyof typeof EStatus} />,
    },
    {
      id: 'updatedAt',
      key: 'updatedAt',
      label: t('scheduler.updatedAt'),
      minWidth: 180,
      align: 'center',
      concealable: true,
      format: (metadata: unknown) => {
        const m = metadata as ISchedulerMetadata;
        return (
          <span>{m?.updatedAt ? tsToLocaleDateTime(dayjs(m.updatedAt).toDate()) : '—'}</span>
        );
      },
    },
    (onEdit || onDelete)
      ? {
          id: 'actions',
          key: 'actions',
          label: t('table.actions'),
          minWidth: 100,
          align: 'center',
          format: (_: unknown, record: IScheduler) => (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
              {onEdit && (
                <DrawerEditAction<IScheduler>
                  onEdit={onEdit}
                  disabled={disabled}
                  entity={record}
                />
              )}
              {onDelete && (
                <DeleteAction<IScheduler>
                  onDelete={onDelete}
                  entity={record}
                  disabled={disabled}
                />
              )}
            </Box>
          ),
        }
      : null,
  ];

  return columns.filter(Boolean) as TMuiColumn[];
};
