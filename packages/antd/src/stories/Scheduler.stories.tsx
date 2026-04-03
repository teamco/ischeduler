import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from 'antd';
import React from 'react';
import { SchedulerProvider } from '@teamco/ischeduler-core';
import { Scheduler } from '../components/Scheduler';
import { ESchedulerPrefix, CScheduler, EDurationTypes, EDiscountType } from '@teamco/ischeduler-core';
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
      setDirty={() => {}}
    />
  );
};

const meta: Meta = {
  title: 'Components/Scheduler',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The main scheduling form. Renders duration, start date, repeat behavior (weekly/monthly/yearly), and end reason fields. For DISCOUNT and TRIAL_DISCOUNT types, also shows discount type and value fields. Must be wrapped in a `SchedulerProvider`.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Sale scheduler form — shows duration, repeat, start date, and end reason fields. No discount fields.',
      },
    },
  },
};

export const DiscountScheduler: Story = {
  render: () => <SchedulerWithForm schedulerType={ESchedulerPrefix.DISCOUNT} />,
  parameters: {
    docs: {
      description: {
        story: 'Discount scheduler form — same as sale but with additional discount type (Percent/Fixed) and value fields.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => <SchedulerWithForm schedulerType={ESchedulerPrefix.SALE} disabled />,
  parameters: {
    docs: {
      description: {
        story: 'All form fields disabled. Use for read-only display of scheduler configuration.',
      },
    },
  },
};
