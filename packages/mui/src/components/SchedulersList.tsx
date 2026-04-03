import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CloseIcon from '@mui/icons-material/Close';

import { Scheduler } from './Scheduler';
import { SaveButton } from './internal/SaveButton';
import { SchedulerDrawerButton } from './SchedulerDrawerButton';
import { HideColumns } from './internal/HideColumns';
import { Toolbar } from './internal/Toolbar';
import { columnsMetadata, TMuiColumn } from './metadata/schedulersList.metadata';
import { indexable } from '../utils/table.util';
import {
  DEFAULT_SCHEDULERS_LIMIT,
  ECurrency,
  ESchedulerPrefix,
  IScheduler,
  useColumnsToggle,
  useSchedulerContext,
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
    limit = DEFAULT_SCHEDULERS_LIMIT,
    disabled: ctxDisabled,
    t,
    permissions,
    onUpdate,
    onDelete,
  } = useSchedulerContext();
  const disabled = disabledProp ?? ctxDisabled;

  const [removedNewIds, setRemovedNewIds] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState<boolean>(false);
  const [editDrawerDirty, setEditDrawerDirty] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<IScheduler | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const visibleSchedulers = useMemo(() => {
    let result = schedulers[schedulerType] ?? [];
    if (removedNewIds.size > 0) {
      result = result.filter((entity) => !entity.id || !removedNewIds.has(entity.id));
    }
    return indexable(result);
  }, [schedulers, schedulerType, removedNewIds]);

  const limited = visibleSchedulers.length >= limit;

  const handleEdit = useCallback((entity: IScheduler) => {
    setEditingEntity(JSON.parse(JSON.stringify(entity)));
    setEditDrawerOpen(true);
    setEditDrawerDirty(false);
  }, []);

  const handleEditSave = async () => {
    if (!editingEntity || !onUpdate) return;
    try {
      await onUpdate(schedulerType, editingEntity);
      setEditDrawerOpen(false);
      setEditingEntity(null);
      setEditDrawerDirty(false);
      onRefresh?.();
    } catch (error) {
      console.error('Failed to update scheduler:', error);
    }
  };

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
        entities: visibleSchedulers as IScheduler[],
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
      permissions,
      handleEdit,
      handleDelete,
    ],
  );

  const { filteredColumns, columnsList, selectedColumns, setSelectedColumns } = useColumnsToggle(
    columns as TMuiColumn[],
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedSchedulers = visibleSchedulers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
        <Toolbar
          onRefresh={onRefresh}
          items={
            permissions.canCreate && !limited
              ? [
                  {
                    label: t('scheduler'),
                    icon: <AddIcon />,
                    onClick: () => setCreateDrawerOpen(true),
                  },
                ]
              : []
          }
        >
          <HideColumns
            columnsList={columnsList}
            selectedColumns={selectedColumns}
            onChange={setSelectedColumns}
          />
        </Toolbar>
      </Box>

      {/* Create Drawer */}
      <SchedulerDrawerButton
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
        showButton={false}
        schedulerType={schedulerType}
        setDirty={setDirty}
        dirty={dirty}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        onSuccess={() => onRefresh?.()}
      />

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="schedulers table" size="small">
          <TableHead>
            <TableRow>
              {(filteredColumns as (TMuiColumn & { hidden?: boolean })[])
                .filter((c) => !c.hidden)
                .map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSchedulers.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.key}>
                {(filteredColumns as (TMuiColumn & { hidden?: boolean })[])
                  .filter((c) => !c.hidden)
                  .map((column) => {
                    const value = column.id.includes('.')
                      ? column.id
                          .split('.')
                          .reduce(
                            (obj: Record<string, unknown> | undefined, key) =>
                              obj?.[key] as Record<string, unknown> | undefined,
                            row as unknown as Record<string, unknown>,
                          )
                      : (row as unknown as Record<string, unknown>)[column.id];

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format
                          ? column.format(value, row as IScheduler)
                          : (value as React.ReactNode)}
                      </TableCell>
                    );
                  })}
              </TableRow>
            ))}
            {paginatedSchedulers.length === 0 && (
              <TableRow>
                <TableCell colSpan={filteredColumns.length} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No items found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={visibleSchedulers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Drawer */}
      <Drawer
        anchor="right"
        open={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setEditingEntity(null);
        }}
        slotProps={{
          paper: {
            sx: { width: { xs: '100%', sm: 600 }, p: 0 },
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateRangeIcon color="primary" />
              <Typography variant="h6">{title ?? t('scheduler')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SaveButton
                isEdit={true}
                loading={loading}
                disabled={disabled || !editDrawerDirty || isCreating}
                onClick={handleEditSave}
              />
              <IconButton onClick={() => setEditDrawerOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
            {editDrawerOpen && editingEntity && (
              <Scheduler
                schedulerType={schedulerType}
                value={editingEntity}
                onChange={(val) => {
                  setEditingEntity(val);
                  setEditDrawerDirty(true);
                }}
                disabled={disabled}
                readOnlyFields={readOnlyFields}
              />
            )}
          </Box>
        </Box>
      </Drawer>
    </Paper>
  );
};
