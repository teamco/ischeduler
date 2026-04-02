import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { SchedulerProvider, ESchedulerPrefix } from '@teamco/ischeduler-core';
import { SchedulerDrawerButton } from '@teamco/ischeduler-mui';
import { emptySchedulers, mockCrudCallbacks } from '../antd/mocks/scheduler.mocks';

const SchedulerDrawerButtonWithState = (args: any) => {
  const [dirty, setDirty] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  return (
    <SchedulerDrawerButton
      {...args}
      dirty={dirty}
      setDirty={setDirty}
      isCreating={isCreating}
      setIsCreating={setIsCreating}
    />
  );
};

const meta: Meta<typeof SchedulerDrawerButton> = {
  title: 'MUI/SchedulerDrawerButton',
  component: SchedulerDrawerButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button that opens a drawer with the scheduler creation form (MUI version). Automatically hidden when `canCreate` permission is `false`. Must be wrapped in a `SchedulerProvider`.',
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
  render: (args) => <SchedulerDrawerButtonWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Opens a drawer with the sale scheduler creation form (MUI).',
      },
    },
  },
};

export const Discount: Story = {
  args: { schedulerType: ESchedulerPrefix.DISCOUNT },
  render: (args) => <SchedulerDrawerButtonWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Opens a drawer with the discount scheduler form (MUI), including discount type and value fields.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { schedulerType: ESchedulerPrefix.SALE, disabled: true },
  render: (args) => <SchedulerDrawerButtonWithState {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Disabled state (MUI) — shows a tooltip with the scheduler limit message.',
      },
    },
  },
};
