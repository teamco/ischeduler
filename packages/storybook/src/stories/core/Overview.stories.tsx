import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState, useCallback } from 'react';
import {
  SchedulerProvider,
  useSchedulerContext,
  ESchedulerPrefix,
  EEndReasonType,
  EStatus,
  type IScheduler,
} from '@teamco/ischeduler-core';
import dayjs from 'dayjs';

const mockScheduler: IScheduler = {
  id: 'core-demo-1',
  type: ESchedulerPrefix.SALE,
  duration: { type: 'WEEK', period: 2 },
  repeat: {
    weekly: { days: ['MONDAY', 'FRIDAY'] },
    monthly: { type: 'DAY', monthDay: 1 },
    yearly: { months: [] },
  },
  range: {
    startedAt: dayjs('2026-04-01'),
    endReason: { type: EEndReasonType.DATE, expiredAt: dayjs('2026-12-31') },
  },
  discount: null,
  status: EStatus.ACTIVE,
  metadata: {
    createdAt: dayjs('2026-03-15'),
    updatedAt: dayjs('2026-03-18'),
    createdBy: 'user-1',
    updatedBy: 'user-1',
  },
};

const ContextInspector = () => {
  const ctx = useSchedulerContext();
  return (
    <pre
      style={{
        background: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        fontSize: 12,
        overflow: 'auto',
        maxHeight: 400,
      }}
    >
      {JSON.stringify(
        {
          permissions: ctx.permissions,
          disabled: ctx.disabled,
          schedulerCount: Object.fromEntries(
            Object.entries(ctx.schedulers).map(([k, v]) => [k, (v as IScheduler[]).length])
          ),
        },
        null,
        2
      )}
    </pre>
  );
};

const CoreDemo = () => {
  const [schedulers, setSchedulers] = useState<Record<ESchedulerPrefix, IScheduler[]>>({
    [ESchedulerPrefix.SALE]: [mockScheduler],
    [ESchedulerPrefix.DISCOUNT]: [],
    [ESchedulerPrefix.TRIAL_DISCOUNT]: [],
  });

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    setSchedulers((prev) => ({
      ...prev,
      [type]: [...prev[type], { ...scheduler, id: `new-${Date.now()}` }],
    }));
  }, []);

  const onDelete = useCallback(async (type: ESchedulerPrefix, id: string) => {
    setSchedulers((prev) => ({
      ...prev,
      [type]: prev[type].filter((s) => s.id !== id),
    }));
  }, []);

  return (
    <SchedulerProvider
      schedulers={schedulers}
      onCreate={onCreate}
      onDelete={onDelete}
      permissions={{ canCreate: true, canUpdate: true, canDelete: true }}
    >
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h2 style={{ marginTop: 0 }}>@teamco/ischeduler-core — Context Inspector</h2>
        <p style={{ color: '#555' }}>
          This demo shows the raw context values exposed by <code>useSchedulerContext()</code>.
          The headless core has no UI — it provides state, callbacks, and permissions to any
          adapter.
        </p>
        <ContextInspector />
      </div>
    </SchedulerProvider>
  );
};

const meta: Meta = {
  title: 'Core/Overview',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`@teamco/ischeduler-core` — headless core package. Provides `SchedulerProvider`, `useSchedulerContext`, types, utils, handlers, and i18n. UI-framework agnostic.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ContextInspectorStory: Story = {
  name: 'Context Inspector',
  render: () => <CoreDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Renders `useSchedulerContext()` output directly — no UI adapter needed. Shows permissions, disabled state, and scheduler counts.',
      },
    },
  },
};
