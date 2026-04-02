import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Form } from 'antd';
import React from 'react';
import dayjs from 'dayjs';

import { OnThisDayBehavior } from '@ischeduler-antd/components/behaviors/OnThisDayBehavior';
import { SchedulerContext } from '@teamco/ischeduler-core';

const TestWrapper = ({ initialValues, overrides = {} }: any) => {
  const [form] = Form.useForm();
  
  return (
    <SchedulerContext.Provider value={{ t: (k: string) => k } as any}>
      <Form form={form} initialValues={initialValues}>
        <Form.Item name={['prefix', 'range', 'startedAt']}>
          <input data-testid="dummy-startedAt" type="hidden" />
        </Form.Item>
        <OnThisDayBehavior prefix={['prefix']} {...overrides} />
      </Form>
    </SchedulerContext.Provider>
  );
};

describe('OnThisDayBehavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders disabled DatePicker when startedAt is missing', async () => {
    render(<TestWrapper initialValues={{ prefix: { range: { startedAt: undefined } } }} />);
    
    expect(screen.getByText('scheduler.duration.endDate')).toBeInTheDocument();
    
    const input = await screen.findByLabelText('scheduler.duration.endDate');
    expect(input).toBeDisabled();
  });

  it('renders enabled DatePicker when startedAt is provided', async () => {
    const startedAt = dayjs('2026-03-20T10:00:00Z');
    
    render(
      <TestWrapper 
        initialValues={{ prefix: { range: { startedAt } } }} 
      />
    );
    
    const input = await screen.findByLabelText('scheduler.duration.endDate');
    
    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });

  it('respects the disabled prop even if startedAt is provided', async () => {
    const startedAt = dayjs('2026-03-20T10:00:00Z');
    
    render(
      <TestWrapper 
        initialValues={{ prefix: { range: { startedAt } } }} 
        overrides={{ disabled: true }}
      />
    );
    
    const input = await screen.findByLabelText('scheduler.duration.endDate');
    
    await waitFor(() => {
      expect(input).toBeDisabled();
    });
  });
});
