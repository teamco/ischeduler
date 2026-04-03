import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { SchedulerProvider } from '@teamco/ischeduler-core';
import { SchedulerDrawerButton } from '../components/SchedulerDrawerButton';
import { ESchedulerPrefix } from '@teamco/ischeduler-core';
import { emptySchedulers, mockCrudCallbacks } from './mocks/scheduler.mocks';

const meta: Meta<typeof SchedulerDrawerButton> = {
  title: 'Components/SchedulerDrawerButton',
  component: SchedulerDrawerButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button that opens a drawer with the scheduler creation form. Automatically hidden when `canCreate` permission is `false`. Must be wrapped in a `SchedulerProvider`.',
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
type Story = StoryObj<typeof SchedulerDrawerButton>;

export const Sale: Story = {
  args: { schedulerType: ESchedulerPrefix.SALE },
  parameters: {
    docs: {
      description: {
        story: 'Opens a drawer with the sale scheduler creation form.',
      },
    },
  },
};

export const Discount: Story = {
  args: { schedulerType: ESchedulerPrefix.DISCOUNT },
  parameters: {
    docs: {
      description: {
        story: 'Opens a drawer with the discount scheduler form, including discount type and value fields.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { schedulerType: ESchedulerPrefix.SALE, disabled: true },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state — shows a tooltip with the scheduler limit message.',
      },
    },
  },
};
