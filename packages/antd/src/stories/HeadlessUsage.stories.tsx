import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useCallback } from 'react';
import { Input, Radio, Typography } from 'antd';
import React from 'react';
import { SchedulerProvider } from '@teamco/ischeduler-core';
import { SchedulerDrawerButton } from '../components/SchedulerDrawerButton';
import { ESchedulerPrefix, type IScheduler } from '@teamco/ischeduler-core';
import { emptySchedulers } from './mocks/scheduler.mocks';

const { Paragraph } = Typography;

const BasicSaleDemo = () => {
  const [lastSaved, setLastSaved] = useState<IScheduler | null>(null);
  const [dirty, setDirty] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Headless] onCreate:', type, scheduler);
  }, []);

  return (
    <SchedulerProvider schedulers={emptySchedulers} onCreate={onCreate}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <Paragraph>
          Click the button to open the scheduler form. After saving, the JSON output appears below.
        </Paragraph>
        <div style={{ marginBottom: 16 }}>
          <SchedulerDrawerButton
            schedulerType={ESchedulerPrefix.SALE}
            onSuccess={(s) => setLastSaved(s)}
            dirty={dirty}
            setDirty={setDirty}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            buttonProps={{ color: 'primary', variant: 'solid', style: {} }}
          />
        </div>
        <Input.TextArea
          readOnly
          rows={16}
          value={lastSaved ? JSON.stringify(lastSaved, null, 2) : ''}
          placeholder="Saved scheduler JSON will appear here..."
        />
      </div>
    </SchedulerProvider>
  );
};

const TYPE_OPTIONS = [
  { label: 'Sale', value: ESchedulerPrefix.SALE },
  { label: 'Discount', value: ESchedulerPrefix.DISCOUNT },
  { label: 'Trial Discount', value: ESchedulerPrefix.TRIAL_DISCOUNT },
];

const TypeSelectorDemo = () => {
  const [schedulerType, setSchedulerType] = useState<ESchedulerPrefix>(ESchedulerPrefix.SALE);
  const [lastSaved, setLastSaved] = useState<IScheduler | null>(null);
  const [dirty, setDirty] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Headless] onCreate:', type, scheduler);
  }, []);

  const handleTypeChange = (value: ESchedulerPrefix) => {
    setSchedulerType(value);
    setLastSaved(null);
    setDirty(false);
    setIsCreating(false);
  };

  return (
    <SchedulerProvider schedulers={emptySchedulers} onCreate={onCreate}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <Paragraph>
          Select a scheduler type, open the form, and save to see the JSON output.
        </Paragraph>
        <div style={{ marginBottom: 16 }}>
          <Radio.Group
            value={schedulerType}
            onChange={(e) => handleTypeChange(e.target.value)}
            options={TYPE_OPTIONS}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <SchedulerDrawerButton
            key={schedulerType}
            schedulerType={schedulerType}
            onSuccess={(s) => setLastSaved(s)}
            dirty={dirty}
            setDirty={setDirty}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            buttonProps={{ color: 'primary', variant: 'solid', style: {} }}
          />
        </div>
        <Input.TextArea
          readOnly
          rows={16}
          value={lastSaved ? JSON.stringify(lastSaved, null, 2) : ''}
          placeholder="Saved scheduler JSON will appear here..."
        />
      </div>
    </SchedulerProvider>
  );
};

const meta: Meta = {
  title: 'Headless',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Minimal headless example — just a button and JSON output. No table, no list. Use this pattern when you want the scheduler form but your own display logic.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const BasicSale: Story = {
  render: () => <BasicSaleDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Sale scheduler with JSON output. Click the button, fill the form, save — the resulting scheduler JSON appears in the textarea below.',
      },
    },
  },
};

export const WithTypeSelector: Story = {
  render: () => <TypeSelectorDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Switch between scheduler types and see how the JSON output changes. Discount and Trial Discount types include additional discount fields.',
      },
    },
  },
};
