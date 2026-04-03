import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { SchedulerProvider, ESchedulerPrefix, ECurrency } from '@teamco/ischeduler-core';
import { SchedulersList } from '@teamco/ischeduler-antd';
import {
  emptySchedulers,
  populatedSchedulers,
  mockCrudCallbacks,
} from './mocks/scheduler.mocks';

const meta: Meta<typeof SchedulersList> = {
  title: 'Ant Design/SchedulersList',
  component: SchedulersList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Table of schedulers with edit/delete actions, column visibility toggle, and a create button in the toolbar. Wrap with `SchedulerProvider` to supply data, callbacks, and permissions.',
      },
    },
  },
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
        story: 'Empty state — no schedulers exist yet. The create button is available in the toolbar.',
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
        story: "Populated with sale schedulers. Click a row's edit action to open the edit drawer.",
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
        story: 'Discount schedulers with USD currency display. The discount column shows type and value.',
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
        story: 'Read-only mode — all permissions disabled, no create/edit/delete actions shown.',
      },
    },
  },
};
