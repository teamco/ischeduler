import { PlusOutlined } from '@ant-design/icons';
import { Drawer, Form, Table, type TableProps } from 'antd';
import { ScheduleTwoTone } from '@ant-design/icons';
import React, { useState, useMemo } from 'react';

import { Scheduler } from '../components/Scheduler';
import { SaveButton } from '../components/internal/SaveButton';
import { SchedulerDrawerButton } from '../components/SchedulerDrawerButton';
import { HideColumns } from '../components/internal/HideColumns';
import { Toolbar } from '../components/internal/Toolbar';
import { columnsMetadata } from '../components/metadata/schedulersList.metadata';
import { useColumnsToggle } from '@teamco/ischeduler-core';
import { useSchedulerContext } from '@teamco/ischeduler-core';
import styles from '../styles/scheduler.module.less';
import {
  CScheduler,
  CNsDiscount,
  DEFAULT_SCHEDULERS_LIMIT,
  EDurationTypes,
  EDiscountType,
  ESchedulerPrefix,
  ECurrency,
  type IScheduler,
} from '@teamco/ischeduler-core';
import { indexable } from '../utils/table.util';

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
  const {
    schedulers,
    loading,
    limit = DEFAULT_SCHEDULERS_LIMIT,
    disabled: ctxDisabled,
    t,
    permissions,
    onUpdate,
    onDelete,
  } = ctx;

  const disabled = disabledProp ?? ctxDisabled;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const entitySchedulers = schedulers[schedulerType] ?? [];

  const [removedNewIds, setRemovedNewIds] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);

  const visibleSchedulers = useMemo(() => {
    if (removedNewIds.size === 0) return entitySchedulers;
    return entitySchedulers.filter((entity) => !entity.id || !removedNewIds.has(entity.id));
  }, [entitySchedulers, removedNewIds]);

  const limited = visibleSchedulers.length >= limit;

  const [editFormRef] = Form.useForm();
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<IScheduler | null>(null);

  const prefix = useMemo(() => [CScheduler, schedulerType], [schedulerType]);
  const durationTypes = useMemo(
    () => Object.keys(EDurationTypes) as (keyof typeof EDurationTypes)[],
    [],
  );
  const discountTypes = useMemo(
    () => Object.keys(EDiscountType) as (keyof typeof EDiscountType)[],
    [],
  );

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
      setDirty(false);
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
                        isCreating={isCreating || loading}
                        setIsCreating={setIsCreating}
                        schedulerType={schedulerType}
                        disabled={disabled || limited}
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
        destroyOnClose
        onClose={() => {
          setDirty(false);
          setEditDrawerOpen(false);
          setEditingEntity(null);
        }}
        extra={
          <SaveButton
            size="small"
            isEdit={!!editingEntity}
            loading={loading || isCreating}
            disabled={disabled || !dirty || limited}
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
