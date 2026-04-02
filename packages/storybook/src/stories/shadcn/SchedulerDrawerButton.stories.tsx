import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { SchedulerProvider, ESchedulerPrefix } from '@teamco/ischeduler-core';
import { SchedulerDrawerButton } from '@teamco/ischeduler-shadcn';
import { emptySchedulers, mockCrudCallbacks } from '../antd/mocks/scheduler.mocks';
import { ShadcnWrapper } from './shadcn-decorator';

const SchedulerDrawerButtonWithState = (args: any) => {
  const [dirty, setDirty] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <ShadcnWrapper>
      <SchedulerDrawerButton
        {...args}
        dirty={dirty}
        setDirty={setDirty}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
      />
    </ShadcnWrapper>
  );
};

const meta: Meta<typeof SchedulerDrawerButton> = {
  title: 'Shadcn/SchedulerDrawerButton',
  component: SchedulerDrawerButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button that opens a drawer with the scheduler creation form (shadcn/ui version).',
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
        story: 'Opens a drawer with the sale scheduler creation form (shadcn/ui).',
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
        story: 'Opens a drawer with the discount scheduler form (shadcn/ui).',
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
        story: 'Disabled state (shadcn/ui).',
      },
    },
  },
};
