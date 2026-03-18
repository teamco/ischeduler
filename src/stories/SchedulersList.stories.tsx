import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SchedulerProvider } from '@iScheduler/provider/SchedulerProvider';
import { SchedulersList } from '@iScheduler/components/SchedulersList';
import { ESchedulerPrefix, ECurrency } from '@iScheduler/types';
import {
  emptySchedulers,
  populatedSchedulers,
  mockCrudCallbacks,
} from './mocks/scheduler.mocks';

const meta: Meta<typeof SchedulersList> = {
  title: 'Components/SchedulersList',
  component: SchedulersList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof SchedulersList>;

export const Empty: Story = {
  args: { type: ESchedulerPrefix.SALE },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={emptySchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
};

export const WithSaleSchedulers: Story = {
  args: { type: ESchedulerPrefix.SALE },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={populatedSchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
};

export const WithDiscountSchedulers: Story = {
  args: { type: ESchedulerPrefix.DISCOUNT, currency: ECurrency.USD },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={populatedSchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
};

export const ReadOnly: Story = {
  args: { type: ESchedulerPrefix.SALE, disabled: true },
  decorators: [
    (Story) => (
      <SchedulerProvider
        schedulers={populatedSchedulers}
        disabled
        permissions={{ canCreate: false, canUpdate: false, canDelete: false }}
      >
        <Story />
      </SchedulerProvider>
    ),
  ],
};
