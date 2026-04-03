import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Form } from 'antd';
import React from 'react';

import { WeeklyBehavior } from '@ischeduler-antd/components/behaviors/WeeklyBehavior';
import { SchedulerContext } from '@teamco/ischeduler-core';
import * as coreHandlers from '@teamco/ischeduler-core';


const mockT = (k: string) => {
  if (k.startsWith('scheduler.weekdays.short.')) {
    const day = k.split('.').pop() || '';
    return day.charAt(0).toUpperCase() + day.slice(1);
  }
  if (k.startsWith('scheduler.weekdays.')) {
    const day = k.split('.').pop() || '';
    return day.charAt(0).toUpperCase() + day.slice(1);
  }
  return k;
};

const TestWrapper = ({ initialValues, overrides = {} }: any) => {
  const [form] = Form.useForm();
  
  return (
    <SchedulerContext.Provider value={{ t: mockT, loading: false } as any}>
      <Form form={form} initialValues={initialValues}>
        <WeeklyBehavior 
          formRef={form} 
          prefix={['prefix']} 
          namespaces={['repeat', 'weekly']}
          disabled={false}
          setOccurs={vi.fn()} 
          {...overrides} 
        />
      </Form>
    </SchedulerContext.Provider>
  );
};

describe('WeeklyBehavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coreHandlers, 'handleDurationValueChange').mockImplementation(vi.fn());
  });

  it('renders with shortFormat by default and loads initial value', async () => {
    render(
      <TestWrapper 
        initialValues={{ 
          prefix: { 
            duration: { period: 1, type: 'days' },
            repeat: { weekly: { days: ['Mon'] } } 
          } 
        }} 
      />
    );
    
    // Ant Design Tooltip wrapped items usually render the label
    // Since we mock t(k) to capitalize, the expected text is Monday
    expect(screen.getByText('Monday')).toBeInTheDocument();
    
    // Should trigger updateOccursText on mount due to initial values
    await waitFor(() => {
      expect(coreHandlers.handleDurationValueChange).toHaveBeenCalled();
    });
  });

  it('renders long format and no tooltips when shortFormat is false', () => {
    render(
      <TestWrapper 
        initialValues={{ prefix: { repeat: { weekly: { days: [] } } } }} 
        overrides={{ shortFormat: false }}
      />
    );
    expect(screen.getByText('Monday')).toBeInTheDocument();
  });

  it('adds extendBy options correctly', () => {
    const extendBy = [{ key: 'extra', label: 'Extra Day', value: 'EXTRA' }];
    render(<TestWrapper overrides={{ extendBy }} />);
    
    expect(screen.getByText('Extra Day')).toBeInTheDocument();
  });
});
