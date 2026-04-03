import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { SchedulerProvider, ESchedulerPrefix, ECurrency } from '@teamco/ischeduler-core';
import { SchedulersList } from '@teamco/ischeduler-shadcn';
import { emptySchedulers, populatedSchedulers, mockCrudCallbacks } from '../antd/mocks/scheduler.mocks';
import { ShadcnWrapper } from './shadcn-decorator';

const meta: Meta<typeof SchedulersList> = {
  title: 'Shadcn/SchedulersList',
  component: SchedulersList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Table of schedulers (shadcn/ui version) with edit/delete actions, column visibility toggle, and a create button in the toolbar.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ShadcnWrapper className="max-w-[1100px]">
        <Story />
      </ShadcnWrapper>
    ),
  ],
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
  parameters: {
    docs: {
      description: {
        story: 'Empty state (shadcn/ui) — no schedulers exist yet.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Populated with sale schedulers (shadcn/ui).',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Discount schedulers (shadcn/ui) with USD currency display.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Read-only mode (shadcn/ui) — all permissions disabled.',
      },
    },
  },
};
