import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Form } from 'antd';
import React from 'react';

import { YearlyBehavior } from '@ischeduler-antd/components/behaviors/YearlyBehavior';
import { SchedulerContext } from '@teamco/ischeduler-core';
import * as coreHandlers from '@teamco/ischeduler-core';


vi.mock('@ischeduler-antd/components/behaviors/MonthlyBehavior', () => ({
  MonthlyBehavior: () => <div data-testid="mock-monthly-behavior" />,
}));

const mockT = (k: string) => {
  if (k.startsWith('scheduler.months.short.')) {
    const month = k.split('.').pop() || '';
    return month.substring(0, 3).toUpperCase();
  }
  if (k.startsWith('scheduler.months.')) {
    const month = k.split('.').pop() || '';
    return month.charAt(0).toUpperCase() + month.slice(1);
  }
  return k;
};

const TestWrapper = ({ initialValues, overrides = {} }: any) => {
  const [form] = Form.useForm();
  
  return (
    <SchedulerContext.Provider value={{ t: mockT, loading: false } as any}>
      <Form form={form} initialValues={initialValues}>
        <YearlyBehavior 
          formRef={form} 
          prefix={['prefix']} 
          namespaces={['repeat', 'yearly']}
          setOccurs={vi.fn()} 
          {...overrides} 
        />
      </Form>
    </SchedulerContext.Provider>
  );
};

describe('YearlyBehavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coreHandlers, 'handleDurationValueChange').mockImplementation(vi.fn());
  });

  it('renders shortFormat correctly with MonthlyBehavior child', async () => {
    render(
      <TestWrapper 
        initialValues={{ 
          prefix: { 
            duration: { period: 1, type: 'years' },
            repeat: { yearly: { months: ['JANUARY'] } } 
          } 
        }} 
      />
    );
    
    // Check short month names exist (e.g. 'Jan')
    // Note: mockT returns 'JAN' for short months because of .substring(0,3).toUpperCase()
    expect(screen.getByText('JAN')).toBeInTheDocument();
    expect(screen.getByTestId('mock-monthly-behavior')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(coreHandlers.handleDurationValueChange).toHaveBeenCalled();
    });
  });

  it('renders long format when shortFormat is false', () => {
    render(
      <TestWrapper 
        initialValues={{ 
          prefix: { 
            duration: { period: 1, type: 'years' },
            repeat: { yearly: { months: [] } } 
          } 
        }} 
        overrides={{ shortFormat: false }}
      />
    );
    
    // Check long month names exist
    expect(screen.getByText('January')).toBeInTheDocument();
  });
});
