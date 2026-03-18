import type { Meta, StoryObj } from '@storybook/react';
import { Form } from 'antd';
import React from 'react';
import { SchedulerProvider } from '@iScheduler/provider/SchedulerProvider';
import { Scheduler } from '@iScheduler/components/Scheduler';
import { ESchedulerPrefix, CScheduler, EDurationTypes, EDiscountType } from '@iScheduler/types';
import { emptySchedulers, mockCrudCallbacks } from './mocks/scheduler.mocks';

const durationTypes = Object.keys(EDurationTypes) as (keyof typeof EDurationTypes)[];
const discountTypes = Object.keys(EDiscountType) as (keyof typeof EDiscountType)[];

const SchedulerWithForm = (args: { schedulerType: ESchedulerPrefix; disabled?: boolean }) => {
  const [form] = Form.useForm();
  const prefix = [CScheduler, args.schedulerType];
  return (
    <Scheduler
      formRef={form}
      prefix={prefix}
      schedulerType={args.schedulerType}
      durationTypes={durationTypes}
      discountTypes={discountTypes}
      disabled={args.disabled}
    />
  );
};

const meta: Meta = {
  title: 'Components/Scheduler',
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={emptySchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const SaleScheduler: Story = {
  render: () => <SchedulerWithForm schedulerType={ESchedulerPrefix.SALE} />,
};

export const DiscountScheduler: Story = {
  render: () => <SchedulerWithForm schedulerType={ESchedulerPrefix.DISCOUNT} />,
};

export const Disabled: Story = {
  render: () => <SchedulerWithForm schedulerType={ESchedulerPrefix.SALE} disabled />,
};
