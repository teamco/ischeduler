import React, { useState, useMemo } from 'react';
import { Button, ButtonProps } from './ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { CalendarDays, X } from 'lucide-react';
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
  onOpenChange: controlledOnOpenChange,
  showButton = true,
}) => {
  const {
    t,
    loading,
    permissions,
    onCreate,
    limit = DEFAULT_SCHEDULERS_LIMIT,
  } = useSchedulerContext();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (controlledOnOpenChange ?? setInternalOpen)
    : setInternalOpen;

  const DEFAULT_SCHEDULER = useMemo(
    () =>
      schedulerType === ESchedulerPrefix.SALE ? DEFAULT_SALE_SCHEDULER : DEFAULT_DISCOUNT_SCHEDULER,
    [schedulerType],
  );

  const [schedulerValue, setSchedulerValue] = useState<IScheduler>(DEFAULT_SCHEDULER as IScheduler);

  if (!permissions.canCreate) return null;

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSchedulerValue(DEFAULT_SCHEDULER as IScheduler);
    } else {
      setDirty(false);
    }
    setOpen(isOpen);
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
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {showButton && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" disabled={disabled || loading} {...buttonProps}>
                  {t('scheduler')}
                </Button>
              </SheetTrigger>
            </TooltipTrigger>
            {disabled && (
              <TooltipContent>
                <p>{t('scheduler.limited', { limit })}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}

      <SheetContent className="w-full sm:max-w-[600px] flex flex-col p-0">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <SheetTitle>{t('scheduler')}</SheetTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Scheduler
            schedulerType={schedulerType}
            value={schedulerValue}
            onChange={(val) => {
              setSchedulerValue(val);
              setDirty(true);
            }}
            disabled={disabled}
          />
        </div>

        <SheetFooter className="px-6 py-4 border-t shrink-0 flex flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOpen(false);
              setDirty(false);
            }}
          >
            {t('actions.cancel')}
          </Button>
          <SaveButton
            loading={loading || isCreating}
            disabled={disabled || !dirty}
            onClick={handleSave}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
