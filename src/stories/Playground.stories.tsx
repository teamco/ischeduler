import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import { Collapse, Typography } from 'antd';
import React from 'react';
import { SchedulerProvider } from '@iScheduler/provider/SchedulerProvider';
import { SchedulersList } from '@iScheduler/components/SchedulersList';
import { ESchedulerPrefix, ECurrency, type IScheduler } from '@iScheduler/types';
import { populatedSchedulers } from './mocks/scheduler.mocks';

const { Title, Paragraph } = Typography;

const PlaygroundDemo = () => {
  const [schedulers, setSchedulers] = useState(populatedSchedulers);

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Playground] Create:', type, scheduler);
    await new Promise((r) => setTimeout(r, 500));
    setSchedulers((prev) => ({
      ...prev,
      [type]: [...prev[type], { ...scheduler, id: `new-${Date.now()}` }],
    }));
  }, []);

  const onUpdate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Playground] Update:', type, scheduler);
    await new Promise((r) => setTimeout(r, 500));
    setSchedulers((prev) => ({
      ...prev,
      [type]: prev[type].map((s) => (s.id === scheduler.id ? scheduler : s)),
    }));
  }, []);

  const onDelete = useCallback(async (type: ESchedulerPrefix, id: string) => {
    console.log('[Playground] Delete:', type, id);
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
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <Title level={2}>iScheduler — Interactive Playground</Title>
        <Paragraph>
          Full interactive demo with all scheduler types. CRUD operations update local state. Open
          the browser console to see callback logs.
        </Paragraph>

        <Collapse
          defaultActiveKey={['sale', 'discount', 'trial']}
          items={[
            {
              key: 'sale',
              label: 'Sale Schedulers',
              children: <SchedulersList type={ESchedulerPrefix.SALE} />,
            },
            {
              key: 'discount',
              label: 'Discount Schedulers',
              children: (
                <SchedulersList type={ESchedulerPrefix.DISCOUNT} currency={ECurrency.USD} />
              ),
            },
            {
              key: 'trial',
              label: 'Trial Discount Schedulers',
              children: <SchedulersList type={ESchedulerPrefix.TRIAL_DISCOUNT} />,
            },
          ]}
        />
      </div>
    </SchedulerProvider>
  );
};

const meta: Meta = {
  title: 'Playground',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const FullDemo: Story = {
  render: () => <PlaygroundDemo />,
};
