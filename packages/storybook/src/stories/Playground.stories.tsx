import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useCallback } from 'react';
import React from 'react';

// Core
import { 
  SchedulerProvider, 
  ESchedulerPrefix, 
  ECurrency, 
  type IScheduler 
} from '@teamco/ischeduler-core';

// Adapters
import { SchedulersList as AntdList } from '@teamco/ischeduler-antd';
import { SchedulersList as MuiList } from '@teamco/ischeduler-mui';
import { SchedulersList as ShadcnList } from '@teamco/ischeduler-shadcn';

// Mocks
import { populatedSchedulers } from './antd/mocks/scheduler.mocks';

// Styles (pre-compiled shadcn Tailwind CSS)
import '../styles/shadcn-compiled.css';

type TAdapter = 'antd' | 'mui' | 'shadcn';

const PlaygroundDemo = () => {
  const [adapter, setAdapter] = useState<TAdapter>('antd');
  const [schedulers, setSchedulers] = useState(populatedSchedulers);

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log(`[Playground] [${adapter}] Create:`, type, scheduler);
    await new Promise((r) => setTimeout(r, 500));
    setSchedulers((prev) => ({
      ...prev,
      [type]: [...prev[type], { ...scheduler, id: `new-${Date.now()}` }],
    }));
  }, [adapter]);

  const onUpdate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log(`[Playground] [${adapter}] Update:`, type, scheduler);
    await new Promise((r) => setTimeout(r, 500));
    setSchedulers((prev) => ({
      ...prev,
      [type]: prev[type].map((s) => (s.id === scheduler.id ? scheduler : s)),
    }));
  }, [adapter]);

  const onDelete = useCallback(async (type: ESchedulerPrefix, id: string) => {
    console.log(`[Playground] [${adapter}] Delete:`, type, id);
    await new Promise((r) => setTimeout(r, 500));
    setSchedulers((prev) => ({
      ...prev,
      [type]: prev[type].filter((s) => s.id !== id),
    }));
  }, [adapter]);

  const renderSchedulersList = () => {
    switch (adapter) {
      case 'antd':
        return (
          <div className="space-y-8">
            <AntdList type={ESchedulerPrefix.SALE} title="Sale Schedulers (AntD)" />
            <AntdList type={ESchedulerPrefix.DISCOUNT} title="Discount Schedulers (AntD)" currency={ECurrency.USD} />
          </div>
        );
      case 'mui':
        return (
          <div className="space-y-8">
            <MuiList type={ESchedulerPrefix.SALE} title="Sale Schedulers (MUI)" />
            <MuiList type={ESchedulerPrefix.DISCOUNT} title="Discount Schedulers (MUI)" currency={ECurrency.USD} />
          </div>
        );
      case 'shadcn':
        return (
          <div className="space-y-8">
            <ShadcnList type={ESchedulerPrefix.SALE} title="Sale Schedulers (shadcn/ui)" />
            <ShadcnList type={ESchedulerPrefix.DISCOUNT} title="Discount Schedulers (shadcn/ui)" currency={ECurrency.USD} />
          </div>
        );
    }
  };

  return (
    <SchedulerProvider
      schedulers={schedulers}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      permissions={{ canCreate: true, canUpdate: true, canDelete: true }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>iScheduler Multi-Adapter Playground</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>
          Switch between different UI implementations to compare the look and feel.
          All adapters share the same state and business logic.
        </p>

        <div style={{ display: 'flex', gap: 4, background: '#f5f5f5', padding: 4, borderRadius: 8, width: 'fit-content', marginBottom: 24 }}>
          {(['antd', 'mui', 'shadcn'] as TAdapter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setAdapter(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                background: adapter === tab ? '#fff' : 'transparent',
                boxShadow: adapter === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                color: adapter === tab ? '#111' : '#888',
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
          {renderSchedulersList()}
        </div>
      </div>
    </SchedulerProvider>
  );
};

const meta: Meta = {
  title: 'Playground',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

export const MultiAdapter: Story = {
  render: () => <PlaygroundDemo />,
};
