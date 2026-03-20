import { Button, Drawer, Form, Tooltip } from 'antd';
import { ScheduleTwoTone } from '@ant-design/icons';
import React, { useState } from 'react';

import { Scheduler } from '@iScheduler/components/Scheduler';
import { SaveButton } from '@iScheduler/components/internal/SaveButton';
import { useSchedulerContext } from '@iScheduler/provider/SchedulerContext';
import {
  CScheduler,
  CNsDiscount,
  DEFAULT_SCHEDULERS_LIMIT,
  EDurationTypes,
  EDiscountType,
  ESchedulerPrefix,
  type IScheduler,
} from '@iScheduler/types';

export type SchedulerDrawerButtonProps = {
  /** Scheduler type — determines form fields and default values */
  schedulerType: ESchedulerPrefix;
  /** Disable the create button. Shows a tooltip with the limit message when disabled. */
  disabled?: boolean;
  /** Called after a scheduler is successfully created via the drawer form */
  onSuccess?: (scheduler: IScheduler) => void;
};

export const SchedulerDrawerButton: React.FC<SchedulerDrawerButtonProps> = ({
  schedulerType,
  disabled,
  onSuccess,
}) => {
  const { t, loading, permissions, onCreate } = useSchedulerContext();
  const [formRef] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  if (!permissions.canCreate) return null;

  const prefix = [CScheduler, schedulerType];

  const durationTypes = Object.keys(EDurationTypes) as (keyof typeof EDurationTypes)[];
  const discountTypes = Object.keys(EDiscountType) as (keyof typeof EDiscountType)[];

  const handleSave = async () => {
    try {
      setIsCreating(true);
      await formRef.validateFields();
      const formValue = formRef.getFieldValue(prefix);

      const newScheduler: IScheduler = {
        id: `new-${Date.now()}`,
        ...formValue,
        type: schedulerType,
        [CNsDiscount]: schedulerType === ESchedulerPrefix.SALE ? null : formValue?.[CNsDiscount],
      };

      if (onCreate) {
        await onCreate(schedulerType, newScheduler);
      }

      onSuccess?.(newScheduler);
      setOpen(false);
      formRef.resetFields();
    } catch {
      // Form validation handles errors
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Button
        style={{ padding: 0 }}
        disabled={disabled || loading}
        color="default"
        variant="link"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Tooltip
          title={disabled ? t('scheduler.limited', { limit: DEFAULT_SCHEDULERS_LIMIT }) : undefined}
        >
          {t('scheduler')}
        </Tooltip>
      </Button>
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ScheduleTwoTone />
            {t('scheduler')}
          </div>
        }
        size={600}
        open={open}
        onClose={() => setOpen(false)}
        extra={
          <SaveButton
            size="small"
            loading={loading || isCreating}
            disabled={disabled}
            onClick={handleSave}
          />
        }
      >
        <Scheduler
          formRef={formRef}
          prefix={prefix}
          schedulerType={schedulerType}
          durationTypes={durationTypes}
          discountTypes={discountTypes}
          disabled={disabled}
        />
      </Drawer>
    </>
  );
};
