import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { SchedulerProvider, ESchedulerPrefix, IScheduler } from '@teamco/ischeduler-core';
import { Scheduler } from '@teamco/ischeduler-mui';
import { emptySchedulers, mockCrudCallbacks } from '../antd/mocks/scheduler.mocks';

const SchedulerWithState = (args: { schedulerType: ESchedulerPrefix; disabled?: boolean }) => {
  const [value, setValue] = useState<IScheduler | undefined>();
  
  return (
    <Scheduler
      value={value}
      onChange={setValue}
      schedulerType={args.schedulerType}
      disabled={args.disabled}
    />
  );
};

const meta: Meta = {
  title: 'MUI/Scheduler',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The main scheduling form (MUI version). Renders duration, start date, repeat behavior (weekly/monthly/yearly), and end reason fields. For DISCOUNT and TRIAL_DISCOUNT types, also shows discount type and value fields. Must be wrapped in a `SchedulerProvider`.',
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
  render: () => <SchedulerWithState schedulerType={ESchedulerPrefix.SALE} />,
  parameters: {
    docs: {
      description: {
        story: 'Sale scheduler form (MUI) — shows duration, repeat, start date, and end reason fields. No discount fields.',
      },
    },
  },
};

export const DiscountScheduler: Story = {
  render: () => <SchedulerWithState schedulerType={ESchedulerPrefix.DISCOUNT} />,
  parameters: {
    docs: {
      description: {
        story: 'Discount scheduler form (MUI) — same as sale but with additional discount type (Percent/Fixed) and value fields.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => <SchedulerWithState schedulerType={ESchedulerPrefix.SALE} disabled />,
  parameters: {
    docs: {
      description: {
        story: 'All form fields disabled (MUI). Use for read-only display of scheduler configuration.',
      },
    },
  },
};
