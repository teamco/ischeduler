import React, { useState, useMemo, useEffect } from 'react';
import {
  Button,
  Drawer,
  Tooltip,
  Box,
  Typography,
  IconButton,
  Divider,
  ButtonProps,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DateRangeIcon from '@mui/icons-material/DateRange';
import {
  useSchedulerContext,
  ESchedulerPrefix,
  IScheduler,
  DEFAULT_SALE_SCHEDULER,
  DEFAULT_DISCOUNT_SCHEDULER,
  DEFAULT_SCHEDULERS_LIMIT,
  CNsDiscount,
} from '@teamco/ischeduler-core';

import { Scheduler } from './Scheduler';
import { SaveButton } from './internal/SaveButton';

export type SchedulerDrawerButtonProps = {
  schedulerType: ESchedulerPrefix;
  disabled?: boolean;
  onSuccess?: (scheduler: IScheduler) => void;
  setDirty: (dirty: boolean) => void;
  dirty: boolean;
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
  buttonProps?: Partial<ButtonProps>;
  // Controlled props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showButton?: boolean;
};

export const SchedulerDrawerButton: React.FC<SchedulerDrawerButtonProps> = ({
  schedulerType,
  disabled,
  onSuccess,
  setDirty,
  dirty,
  isCreating,
  setIsCreating,
  buttonProps,
  open: controlledOpen,
  onOpenChange,
  showButton = true,
}) => {
  const { t, loading, permissions, onCreate } = useSchedulerContext();
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    else setInternalOpen(val);
  };

  const DEFAULT_SCHEDULER = useMemo(
    () =>
      schedulerType === ESchedulerPrefix.SALE ? DEFAULT_SALE_SCHEDULER : DEFAULT_DISCOUNT_SCHEDULER,
    [schedulerType],
  );

  const [schedulerValue, setSchedulerValue] = useState<IScheduler>(DEFAULT_SCHEDULER as IScheduler);

  // Reset value when drawer opens
  useEffect(() => {
    if (open) {
      setSchedulerValue(DEFAULT_SCHEDULER as IScheduler);
    }
  }, [open, DEFAULT_SCHEDULER]);

  if (!permissions.canCreate) return null;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDirty(false);
  };

  const handleSave = async () => {
    try {
      setIsCreating(true);

      const newScheduler: IScheduler = {
        id: `new-${Date.now()}`,
        ...schedulerValue,
        type: schedulerType,
        [CNsDiscount]:
          schedulerType === ESchedulerPrefix.SALE ? null : schedulerValue?.[CNsDiscount],
      };

      if (onCreate) {
        await onCreate(schedulerType, newScheduler);
      }

      onSuccess?.(newScheduler);
      setOpen(false);
      setDirty(false);
    } catch (error) {
      console.error('Failed to save scheduler:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {showButton && (
        <Tooltip
          title={disabled ? t('scheduler.limited', { limit: DEFAULT_SCHEDULERS_LIMIT }) : ''}
        >
          <span>
            <Button
              variant="text"
              size="small"
              {...buttonProps}
              disabled={disabled || loading}
              onClick={handleOpen}
              sx={{ textTransform: 'none', p: 0, minWidth: 'auto', ...buttonProps?.sx }}
            >
              {t('scheduler')}
            </Button>
          </span>
        </Tooltip>
      )}

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
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
              <Typography variant="h6">{t('scheduler')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SaveButton
                loading={loading || isCreating}
                disabled={disabled || !dirty}
                onClick={handleSave}
              />
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
            <Scheduler
              schedulerType={schedulerType}
              value={schedulerValue}
              onChange={(val) => {
                setSchedulerValue(val);
                setDirty(true);
              }}
              disabled={disabled}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};
