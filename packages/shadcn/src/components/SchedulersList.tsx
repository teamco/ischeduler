import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { CalendarDays, X } from 'lucide-react';

import { Scheduler } from './Scheduler';
import { SaveButton } from './internal/SaveButton';
import { SchedulerDrawerButton } from './SchedulerDrawerButton';
import { HideColumns } from './internal/HideColumns';
import { Toolbar } from './internal/Toolbar';
import { columnsMetadata, TShadcnColumn } from './metadata/schedulersList.metadata';
import { indexable } from '../utils/table.util';
import {
  useColumnsToggle,
  useSchedulerContext,
  ESchedulerPrefix,
  ECurrency,
  IScheduler,
  DEFAULT_SCHEDULERS_LIMIT,
} from '@teamco/ischeduler-core';

export type SchedulersListProps = {
  type: ESchedulerPrefix;
  title?: string;
  disabled?: boolean;
  readOnlyFields?: string[];
  currency?: keyof typeof ECurrency;
  onRefresh?: () => void;
};

export const SchedulersList: React.FC<SchedulersListProps> = (props) => {
  const {
    type: schedulerType,
    title,
    disabled: disabledProp,
    readOnlyFields = [],
    currency,
    onRefresh,
  } = props;

  const {
    schedulers,
    loading,
    disabled: ctxDisabled,
    t,
    permissions,
    onUpdate,
    onDelete,
  } = useSchedulerContext();
  const disabled = disabledProp ?? ctxDisabled;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const entitySchedulers = schedulers[schedulerType] ?? [];

  const [removedNewIds, setRemovedNewIds] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<IScheduler | null>(null);

  const visibleSchedulers = useMemo(() => {
    let result = entitySchedulers;
    if (removedNewIds.size > 0) {
      result = result.filter((entity) => !entity.id || !removedNewIds.has(entity.id));
    }
    return indexable(result);
  }, [entitySchedulers, removedNewIds]);

  const limited = visibleSchedulers.length >= DEFAULT_SCHEDULERS_LIMIT;

  const handleEdit = (entity: IScheduler) => {
    setEditingEntity(JSON.parse(JSON.stringify(entity)));
    setEditDrawerOpen(true);
    setDirty(false);
  };

  const handleEditSave = async () => {
    if (!editingEntity || !onUpdate) return;
    try {
      await onUpdate(schedulerType, editingEntity);
      setEditDrawerOpen(false);
      setEditingEntity(null);
      setDirty(false);
      onRefresh?.();
    } catch (error) {
      console.error('Failed to update scheduler:', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
  };

  const columns = useMemo(
    () =>
      columnsMetadata({
        disabled,
        schedulerType,
        entities: visibleSchedulers as any,
        currency,
        t,
        onEdit: permissions.canUpdate ? handleEdit : undefined,
        onDelete: permissions.canDelete ? handleDelete : undefined,
      }),
    [
      disabled,
      schedulerType,
      visibleSchedulers,
      currency,
      t,
      permissions.canUpdate,
      permissions.canDelete,
      handleDelete,
    ],
  );

  const { filteredColumns, columnsList, selectedColumns, setSelectedColumns } = useColumnsToggle(
    columns as any[],
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        <div className="ml-auto flex items-center gap-2">
          {permissions.canCreate && !limited && (
            <SchedulerDrawerButton
              setDirty={setDirty}
              dirty={dirty}
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              schedulerType={schedulerType}
              disabled={disabled || loading || limited || isCreating}
              onSuccess={() => onRefresh?.()}
              buttonProps={{
                variant: 'outline',
                size: 'sm',
              }}
            />
          )}
          <Toolbar onRefresh={onRefresh}>
            <HideColumns
              columnsList={columnsList as any}
              selectedColumns={selectedColumns}
              onChange={setSelectedColumns}
            />
          </Toolbar>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {(filteredColumns as unknown as (TShadcnColumn & { hidden?: boolean })[])
                .filter((c) => !c.hidden)
                .map((column) => (
                  <TableHead key={column.id} className={column.className}>
                    {column.label}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleSchedulers.map((row: any) => (
              <TableRow key={row.key}>
                {(filteredColumns as unknown as (TShadcnColumn & { hidden?: boolean })[])
                  .filter((c) => !c.hidden)
                  .map((column) => {
                    const value = column.id.includes('.')
                      ? column.id.split('.').reduce((obj, key) => obj?.[key], row)
                      : row[column.id];

                    return (
                      <TableCell key={column.id} className={column.className}>
                        {column.format ? column.format(value, row) : value}
                      </TableCell>
                    );
                  })}
              </TableRow>
            ))}
            {visibleSchedulers.length === 0 && (
              <TableRow>
                <TableCell colSpan={filteredColumns.length} className="h-24 text-center">
                  {t('table.noData') || 'No items found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={editDrawerOpen} onOpenChange={(open) => !open && setEditDrawerOpen(false)}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <SheetTitle>{title ?? t('scheduler')}</SheetTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditDrawerOpen(false);
                  setEditingEntity(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <SaveButton
                isEdit={true}
                loading={loading}
                disabled={disabled || !dirty || isCreating}
                onClick={handleEditSave}
              />
            </div>
          </SheetHeader>

          <div className="mt-6">
            {editDrawerOpen && editingEntity && (
              <Scheduler
                schedulerType={schedulerType}
                value={editingEntity}
                onChange={(val) => {
                  setEditingEntity(val);
                  setDirty(true);
                }}
                disabled={disabled}
                readOnlyFields={readOnlyFields}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
