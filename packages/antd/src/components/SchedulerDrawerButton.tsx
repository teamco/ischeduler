import { Button, type ButtonProps, Drawer, Form, Tooltip } from 'antd';
import { ScheduleTwoTone } from '@ant-design/icons';
import React, { useState, useMemo } from 'react';

import { Scheduler } from '../components/Scheduler';
import { SaveButton } from '../components/internal/SaveButton';
import { useSchedulerContext } from '@teamco/ischeduler-core';
import {
  CScheduler,
  CNsDiscount,
  DEFAULT_SCHEDULERS_LIMIT,
  EDurationTypes,
  EDiscountType,
  ESchedulerPrefix,
  type IScheduler,
} from '@teamco/ischeduler-core';

export type SchedulerDrawerButtonProps = {
  /** Scheduler type — determines form fields and default values */
  schedulerType: ESchedulerPrefix;
  /** Disable the create button. Shows a tooltip with the limit message when disabled. */
  disabled?: boolean;
  /** Called after a scheduler is successfully created via the drawer form */
  onSuccess?: (scheduler: IScheduler) => void;
  /** isCreating state */
  isCreating: boolean;
  /** Set isCreating state */
  setIsCreating: (isCreating: boolean) => void;
  /** Override the default button appearance. By default renders as a link. Pass e.g. `{ type: 'primary' }` for a visible button. */
  buttonProps?: Omit<ButtonProps, 'disabled' | 'onClick'>;
};

export const SchedulerDrawerButton: React.FC<SchedulerDrawerButtonProps> = ({
  schedulerType,
  disabled,
  onSuccess,
  isCreating,
  setIsCreating,
  buttonProps,
}) => {
  const {
    t,
    loading,
    limit = DEFAULT_SCHEDULERS_LIMIT,
    permissions,
    onCreate,
  } = useSchedulerContext();
  const [formRef] = Form.useForm();
  const [open, setOpen] = useState(false);

  const prefix = useMemo(() => [CScheduler, schedulerType], [schedulerType]);
  const durationTypes = useMemo(
    () => Object.keys(EDurationTypes) as (keyof typeof EDurationTypes)[],
    [],
  );
  const discountTypes = useMemo(
    () => Object.keys(EDiscountType) as (keyof typeof EDiscountType)[],
    [],
  );

  if (!permissions.canCreate) return null;

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
        color="default"
        variant="link"
        {...buttonProps}
        loading={loading || isCreating}
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formRef.resetFields();
          setOpen(true);
        }}
      >
        <Tooltip title={disabled ? t('scheduler.limited', { limit }) : undefined}>
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
        destroyOnHidden
        onClose={() => {
          setOpen(false);
        }}
        extra={
          <SaveButton
            size="small"
            loading={loading || isCreating}
            disabled={disabled}
            onClick={handleSave}
          />
        }
      >
        {open && (
          <Scheduler
            formRef={formRef}
            prefix={prefix}
            schedulerType={schedulerType}
            durationTypes={durationTypes}
            discountTypes={discountTypes}
            disabled={disabled}
          />
        )}
      </Drawer>
    </>
  );
};
