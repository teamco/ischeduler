import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SchedulerProvider } from '@iScheduler/provider/SchedulerProvider';
import { SchedulerDrawerButton } from '@iScheduler/components/SchedulerDrawerButton';
import { ESchedulerPrefix } from '@iScheduler/types';
import { emptySchedulers, mockCrudCallbacks } from './mocks/scheduler.mocks';

const meta: Meta<typeof SchedulerDrawerButton> = {
  title: 'Components/SchedulerDrawerButton',
  component: SchedulerDrawerButton,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={emptySchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SchedulerDrawerButton>;

export const Sale: Story = {
  args: { schedulerType: ESchedulerPrefix.SALE },
};

export const Discount: Story = {
  args: { schedulerType: ESchedulerPrefix.DISCOUNT },
};

export const Disabled: Story = {
  args: { schedulerType: ESchedulerPrefix.SALE, disabled: true },
};
