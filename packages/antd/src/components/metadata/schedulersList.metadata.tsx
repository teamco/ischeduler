import { DeleteTwoTone } from '@ant-design/icons';
import React from 'react';

import { DeleteAction } from '../../components/internal/DeleteAction';
import { DrawerEditAction } from '../../components/internal/DrawerEditAction';
import {
  handleMonthly,
  handleWeekly,
  handleYearly,
} from '../../components/metadata/metadata.handlers';
import { StatusTag } from '../../components/internal/StatusTag';
import {
  CDiscountTypeValues,
  ESchedulerPrefix,
  EStatus,
  type ICommonDataType,
  type IScheduler,
  type ISchedulerMetadata,
  type TDiscount,
  type TDuration,
  ECurrency,
} from '@teamco/ischeduler-core';
import { indexColumn } from '../../utils/table.util';
import { numberToCurrency, tsToLocaleDateTime } from '@teamco/ischeduler-core';
import type { TFn } from '@teamco/ischeduler-core';
import type { TableProps } from 'antd';

type TArgs = {
  disabled: boolean;
  schedulerType: ESchedulerPrefix;
  entities: IScheduler[];
  currency?: keyof typeof ECurrency;
  t: TFn;
  onDelete?: (entity: IScheduler) => void;
  onEdit?: (entity: IScheduler) => void;
};

export const columnsMetadata = (
  props: TArgs,
  filterIn: string[] = [],
): TableProps<IScheduler>['columns'] => {
  const { disabled, schedulerType, currency, t, onEdit, onDelete } = props;

  const actionsColumn =
    onEdit || onDelete
      ? {
          title: t('table.actions'),
          key: 'operation',
          fixed: 'right' as const,
          align: 'center' as const,
          width: 100,
          render: (_: unknown, record: IScheduler) => (
            <div>
              {onEdit && (
                <DrawerEditAction<IScheduler>
                  onEdit={onEdit}
                  disabled={disabled}
                  type="text"
                  entity={record}
                />
              )}
              {onDelete && (
                <DeleteAction<IScheduler>
                  onDelete={onDelete}
                  icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                  type="text"
                  entity={record}
                  disabled={disabled}
                />
              )}
            </div>
          ),
        }
      : null;

  const discountColumn = [ESchedulerPrefix.DISCOUNT, ESchedulerPrefix.TRIAL_DISCOUNT].includes(
    schedulerType,
  )
    ? {
        title: t('scheduler.meta.discount'),
        dataIndex: 'discount',
        key: 'discount',
        width: 150,
        render(discount: TDiscount) {
          if (!discount) return '—';
          if (discount.type === 'PERCENT') {
            return `${discount.value}${CDiscountTypeValues[discount.type]}`;
          }
          return numberToCurrency(discount.value, currency ?? 'USD');
        },
      }
    : null;

  const columns = [
    indexColumn,
    {
      title: t('scheduler.meta.duration'),
      dataIndex: 'duration',
      key: 'duration',
      width: 150,
      render(duration: TDuration) {
        return `${duration?.period} (${duration?.type})`;
      },
    },
    {
      title: t('scheduler.duration'),
      key: 'repeat',
      render(_: unknown, record: IScheduler) {
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
            return <></>;
        }
      },
    },
    discountColumn,
    {
      title: t('scheduler.status'),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center' as const,
      concealable: true,
      render: (status: keyof typeof EStatus) => <StatusTag status={status} />,
    },
    {
      title: t('scheduler.updatedAt'),
      width: 200,
      dataIndex: 'metadata',
      align: 'center' as const,
      key: 'metadata.updatedAt',
      concealable: true,
      render: (metadata: ISchedulerMetadata | undefined) => (
        <div>{metadata?.updatedAt ? tsToLocaleDateTime(metadata.updatedAt as any) : '—'}</div>
      ),
    },
    actionsColumn,
  ].filter(Boolean) as ICommonDataType[];

  return filterIn.length
    ? (columns.filter(
        (column) => filterIn.includes(column?.dataIndex as string) || column.dataIndex === 'idx',
      ) as TableProps<IScheduler>['columns'])
    : (columns as TableProps<IScheduler>['columns']);
};
