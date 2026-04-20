import React from 'react';
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

export type TShadcnColumn = {
  id: string;
  key: string;
  title: string;
  label: string;
  className?: string;
  format?: (value: any, record: IScheduler) => React.ReactNode;
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

export const columnsMetadata = (props: TArgs): TShadcnColumn[] => {
  const { disabled, schedulerType, currency, t, onEdit, onDelete } = props;

  const col = (id: string, label: string, rest: Partial<TShadcnColumn> = {}): TShadcnColumn => ({
    id, key: id, title: label, label, ...rest,
  });

  const columns: (TShadcnColumn | null)[] = [
    col('index', '#', { className: "w-[50px]" }),
    col('duration', t('scheduler.meta.duration'), {
      className: "w-[120px]",
      format: (duration: TDuration) => `${duration?.period} (${duration?.type})`,
    }),
    col('repeat', t('scheduler.duration'), {
      className: "min-w-[200px]",
      format: (_, record: IScheduler) => {
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
    }),
    [ESchedulerPrefix.DISCOUNT, ESchedulerPrefix.TRIAL_DISCOUNT].includes(schedulerType)
      ? col('discount', t('scheduler.meta.discount'), {
          className: "w-[120px]",
          format: (discount: TDiscount) => {
            if (!discount) return '—';
            if (discount.type === 'PERCENT') {
              return `${discount.value}${CDiscountTypeValues[discount.type]}`;
            }
            return numberToCurrency(discount.value, currency ?? 'USD');
          },
        })
      : null,
    col('status', t('scheduler.status'), {
      className: "w-[120px] text-center",
      concealable: true,
      format: (status: keyof typeof EStatus) => <StatusTag status={status} />,
    }),
    col('updatedAt', t('scheduler.updatedAt'), {
      className: "w-[180px] text-center",
      concealable: true,
      format: (metadata: ISchedulerMetadata) => (
        <span>{metadata?.updatedAt ? tsToLocaleDateTime(metadata.updatedAt as any) : '—'}</span>
      ),
    }),
    (onEdit || onDelete)
      ? col('actions', t('table.actions'), {
          className: "w-[100px] text-center",
          format: (_, record: IScheduler) => (
            <div className="flex justify-center gap-1">
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
            </div>
          ),
        })
      : null,
  ];

  return columns.filter(Boolean) as TShadcnColumn[];
};
