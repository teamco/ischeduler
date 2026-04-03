import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState, useCallback } from 'react';
import { SchedulerProvider, ESchedulerPrefix, ECurrency, type IScheduler } from '@teamco/ischeduler-core';
import { SchedulersList } from '@teamco/ischeduler-shadcn';
import { emptySchedulers, populatedSchedulers } from '../antd/mocks/scheduler.mocks';
import { ShadcnWrapper } from './shadcn-decorator';

const SchedulersListWithState = (props: { type: ESchedulerPrefix; currency?: keyof typeof ECurrency; initialData?: Record<ESchedulerPrefix, IScheduler[]> }) => {
  const [schedulers, setSchedulers] = useState(props.initialData || emptySchedulers);

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Shadcn Story] onCreate:', type, scheduler);
    await new Promise((r) => setTimeout(r, 500));
    setSchedulers((prev) => ({
      ...prev,
      [type]: [...prev[type], { ...scheduler, id: `new-${Date.now()}` }],
    }));
  }, []);

  const onUpdate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Shadcn Story] onUpdate:', type, scheduler);
    await new Promise((r) => setTimeout(r, 500));
    setSchedulers((prev) => ({
      ...prev,
      [type]: prev[type].map((s) => (s.id === scheduler.id ? scheduler : s)),
    }));
  }, []);

  const onDelete = useCallback(async (type: ESchedulerPrefix, id: string) => {
    console.log('[Shadcn Story] onDelete:', type, id);
    await new Promise((r) => setTimeout(r, 500));
    setSchedulers((prev) => ({
      ...prev,
      [type]: prev[type].filter((s) => s.id !== id),
    }));
  }, []);

  return (
    <SchedulerProvider
      schedulers={schedulers}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      permissions={{ canCreate: true, canUpdate: true, canDelete: true }}
    >
      <SchedulersList type={props.type} currency={props.currency as ECurrency} />
    </SchedulerProvider>
  );
};

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
  render: () => <SchedulersListWithState type={ESchedulerPrefix.SALE} />,
  parameters: {
    docs: {
      description: {
        story: 'Empty state (shadcn/ui) — no schedulers exist yet.',
      },
    },
  },
};

export const WithSaleSchedulers: Story = {
  render: () => <SchedulersListWithState type={ESchedulerPrefix.SALE} initialData={populatedSchedulers} />,
  parameters: {
    docs: {
      description: {
        story: 'Populated with sale schedulers (shadcn/ui).',
      },
    },
  },
};

export const WithDiscountSchedulers: Story = {
  render: () => <SchedulersListWithState type={ESchedulerPrefix.DISCOUNT} currency={ECurrency.USD} initialData={populatedSchedulers} />,
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
