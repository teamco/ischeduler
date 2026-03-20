import { PlusOutlined } from '@ant-design/icons';
import { Drawer, Form, Table, type TableProps } from 'antd';
import { ScheduleTwoTone } from '@ant-design/icons';
import React, { useState, useMemo } from 'react';

import { Scheduler } from '@iScheduler/components/Scheduler';
import { SaveButton } from '@iScheduler/components/internal/SaveButton';
import { SchedulerDrawerButton } from '@iScheduler/components/SchedulerDrawerButton';
import { HideColumns } from '@iScheduler/components/internal/HideColumns';
import { Toolbar } from '@iScheduler/components/internal/Toolbar';
import { columnsMetadata } from '@iScheduler/components/metadata/schedulersList.metadata';
import { useColumnsToggle } from '@iScheduler/hooks/useColumnsToggle';
import { useSchedulerContext } from '@iScheduler/provider/SchedulerContext';
import styles from '@iScheduler/styles/scheduler.module.less';
import {
  CScheduler,
  CNsDiscount,
  DEFAULT_SCHEDULERS_LIMIT,
  EDurationTypes,
  EDiscountType,
  ESchedulerPrefix,
  type ECurrency,
  type IScheduler,
} from '@iScheduler/types';
import { indexable } from '@iScheduler/utils/table.util';

import type { ItemType } from 'antd/es/menu/interface';

export type SchedulersListProps = {
  /** Which scheduler type to display (SALE, DISCOUNT, or TRIAL_DISCOUNT) */
  type: ESchedulerPrefix;
  /** Section title shown in the edit drawer header */
  title?: string;
  /** Override provider-level disabled state */
  disabled?: boolean;
  /** Field names that should be read-only in the edit form. @default [] */
  readOnlyFields?: string[];
  /** Currency for discount value display (e.g. `"USD"`). Only relevant for DISCOUNT types. */
  currency?: keyof typeof ECurrency;
  /** Called after any CRUD operation completes (create, update, or delete) */
  onRefresh?: () => void;
};

export const SchedulersList = (props: SchedulersListProps): React.JSX.Element => {
  const {
    type: schedulerType,
    title,
    disabled: disabledProp,
    readOnlyFields = [],
    currency,
    onRefresh,
  } = props;

  const ctx = useSchedulerContext();
  const { schedulers, loading, disabled: ctxDisabled, t, permissions, onUpdate, onDelete } = ctx;

  const disabled = disabledProp ?? ctxDisabled;
  const entitySchedulers = schedulers[schedulerType] ?? [];

  const [removedNewIds, setRemovedNewIds] = useState<Set<string>>(new Set());

  const visibleSchedulers = useMemo(() => {
    if (removedNewIds.size === 0) return entitySchedulers;
    return entitySchedulers.filter((entity) => !entity.id || !removedNewIds.has(entity.id));
  }, [entitySchedulers, removedNewIds]);

  const limited = visibleSchedulers.length >= DEFAULT_SCHEDULERS_LIMIT;

  const [editFormRef] = Form.useForm();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<IScheduler | null>(null);

  const prefix = [CScheduler, schedulerType];
  const durationTypes = Object.keys(EDurationTypes) as (keyof typeof EDurationTypes)[];
  const discountTypes = Object.keys(EDiscountType) as (keyof typeof EDiscountType)[];

  const handleEdit = (entity: IScheduler) => {
    setEditingEntity(entity);
    setEditDrawerOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await editFormRef.validateFields();
      const formValue = editFormRef.getFieldValue(prefix);

      const updatedScheduler: IScheduler = {
        ...editingEntity,
        ...formValue,
        type: schedulerType,
        [CNsDiscount]: schedulerType === ESchedulerPrefix.SALE ? null : formValue?.[CNsDiscount],
      };

      if (onUpdate) {
        await onUpdate(schedulerType, updatedScheduler);
      }

      setEditDrawerOpen(false);
      setEditingEntity(null);
      editFormRef.resetFields();
      onRefresh?.();
    } catch {
      // Form validation handles errors
    }
  };

  const handleDelete = async (entity: IScheduler) => {
    if (entity.id?.startsWith('new-')) {
      setRemovedNewIds((prev) => {
        const next = new Set(prev);
        if (entity.id) next.add(entity.id);
        return next;
      });
      return;
    }

    if (onDelete && entity.id) {
      await onDelete(schedulerType, entity.id);
      onRefresh?.();
    } else {
      console.warn('No onDelete handler provided');
    }
  };

  const columns: TableProps<IScheduler>['columns'] = columnsMetadata({
    disabled,
    schedulerType,
    entities: visibleSchedulers,
    currency,
    t,
    onEdit: permissions.canUpdate ? handleEdit : undefined,
    onDelete: permissions.canDelete ? handleDelete : undefined,
  });

  const { filteredColumns, columnsList, selectedColumns, setSelectedColumns } = useColumnsToggle(
    columns as any[],
  );

  const tableProps: TableProps<IScheduler> = {
    columns: filteredColumns as TableProps<IScheduler>['columns'],
    loading,
    scroll: { x: 1000 },
    bordered: true,
    className: styles.gridList,
    dataSource: indexable(visibleSchedulers),
    rowKey: (record: IScheduler) => record.id ?? `row-${Math.random()}`,
    title: () => (
      <div className={styles.gridHeader}>
        <Toolbar
          onRefresh={onRefresh}
          items={
            permissions.canCreate && !limited
              ? ([
                  {
                    label: (
                      <SchedulerDrawerButton
                        schedulerType={schedulerType}
                        disabled={disabled || loading || limited}
                        onSuccess={() => onRefresh?.()}
                      />
                    ),
                    icon: <PlusOutlined />,
                  },
                ] as unknown as ItemType[])
              : []
          }
        >
          <HideColumns
            columnsList={columnsList}
            selectedColumns={selectedColumns}
            onChange={setSelectedColumns}
          />
        </Toolbar>
      </div>
    ),
    footer: () => (
      <div className={styles.gridFooter}>{`Total ${visibleSchedulers.length} items`}</div>
    ),
  };

  return (
    <>
      <Table<IScheduler> {...tableProps} />
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ScheduleTwoTone />
            {title ?? t('scheduler')}
          </div>
        }
        size={600}
        open={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setEditingEntity(null);
        }}
        extra={
          <SaveButton
            size="small"
            isEdit
            loading={loading}
            disabled={disabled}
            onClick={handleEditSave}
          />
        }
      >
        {editDrawerOpen && (
          <Scheduler
            formRef={editFormRef}
            prefix={prefix}
            entity={editingEntity}
            schedulerType={schedulerType}
            durationTypes={durationTypes}
            discountTypes={discountTypes}
            disabled={disabled}
            readOnlyFields={readOnlyFields}
          />
        )}
      </Drawer>
    </>
  );
};
