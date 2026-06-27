import React, { useState, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { CalendarDays, Plus, X } from 'lucide-react';

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

type TToolbarItem = {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export type SchedulersListProps = {
  type: ESchedulerPrefix;
  title?: string;
  disabled?: boolean;
  readOnlyFields?: string[];
  currency?: keyof typeof ECurrency;
  onRefresh?: () => void;
  extraItems?: TToolbarItem[];
};

export const SchedulersList: React.FC<SchedulersListProps> = (props) => {
  const {
    type: schedulerType,
    title,
    disabled: disabledProp,
    readOnlyFields = [],
    currency,
    onRefresh,
    extraItems = [],
  } = props;

  const {
    schedulers,
    loading,
    limit = DEFAULT_SCHEDULERS_LIMIT,
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
  const [createDirty, setCreateDirty] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<IScheduler | null>(null);

  const visibleSchedulers = useMemo(() => {
    let result = entitySchedulers;
    if (removedNewIds.size > 0) {
      result = result.filter((entity) => !entity.id || !removedNewIds.has(entity.id));
    }
    return indexable(result);
  }, [entitySchedulers, removedNewIds]);

  const limited = visibleSchedulers.length >= limit;

  const handleEdit = useCallback((entity: IScheduler) => {
    setEditingEntity(JSON.parse(JSON.stringify(entity)));
    setEditDrawerOpen(true);
    setDirty(false);
  }, []);

  const handleEditSave = useCallback(async () => {
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
  }, [editingEntity, onUpdate, schedulerType, onRefresh]);

  const handleDelete = useCallback(
    async (entity: IScheduler) => {
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
    },
    [onDelete, schedulerType, onRefresh],
  );

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
      handleEdit,
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
          <Toolbar
            onRefresh={onRefresh}
            extraItems={extraItems}
            items={
              permissions.canCreate && !limited
                ? [
                    {
                      label: t('scheduler'),
                      icon: <Plus className="h-4 w-4" />,
                      onClick: () => setCreateDrawerOpen(true),
                    },
                  ]
                : []
            }
          >
            <HideColumns
              columnsList={columnsList as any}
              selectedColumns={selectedColumns}
              onChange={setSelectedColumns}
            />
          </Toolbar>
        </div>
      </div>

      {permissions.canCreate && !limited && (
        <SchedulerDrawerButton
          showButton={false}
          open={createDrawerOpen}
          onOpenChange={setCreateDrawerOpen}
          setDirty={setCreateDirty}
          dirty={createDirty}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          schedulerType={schedulerType}
          disabled={disabled || loading || limited}
          onSuccess={() => onRefresh?.()}
        />
      )}

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
                  {t('table.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={editDrawerOpen} onOpenChange={(open) => !open && setEditDrawerOpen(false)}>
        <SheetContent className="w-full sm:max-w-[600px] flex flex-col p-0">
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 shrink-0">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <SheetTitle>{title ?? t('scheduler')}</SheetTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditDrawerOpen(false);
                setEditingEntity(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
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

          <SheetFooter className="px-6 py-4 border-t shrink-0 flex flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditDrawerOpen(false);
                setEditingEntity(null);
                setDirty(false);
              }}
            >
              {t('actions.cancel')}
            </Button>
            <SaveButton
              isEdit={true}
              loading={loading}
              disabled={disabled || !dirty || isCreating}
              onClick={handleEditSave}
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
