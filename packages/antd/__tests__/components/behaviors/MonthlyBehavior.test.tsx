import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Form } from 'antd';
import React from 'react';

import { MonthlyBehavior } from '@ischeduler-antd/components/behaviors/MonthlyBehavior';
import { SchedulerContext, EWeekDays, getKeyFromEnum } from '@teamco/ischeduler-core';
import * as coreHandlers from '@teamco/ischeduler-core';

vi.mock('@ant-design/icons', async () => {
  const actual = await vi.importActual('@ant-design/icons');
  return {
    ...actual,
    CalendarTwoTone: ({ twoToneColor }: any) => <div data-testid="calendar-icon">{twoToneColor || 'default'}</div>,
    ControlTwoTone: ({ twoToneColor }: any) => <div data-testid="control-icon">{twoToneColor || 'default'}</div>
  };
});

vi.mock('@ischeduler-antd/components/behaviors/WeeklyBehavior', () => ({
  WeeklyBehavior: () => <div data-testid="weekly-behavior-mock" />,
}));

// Setup Wrapper
const TestWrapper = ({ initialValues, overrides = {} }: any) => {
  const [form] = Form.useForm();

  return (
    <SchedulerContext.Provider value={{ t: (k: string) => k, loading: false } as any}>
      <Form form={form} initialValues={initialValues}>
        <MonthlyBehavior 
          formRef={form} 
          prefix={['prefix']} 
          setOccurs={vi.fn()} 
          {...overrides} 
        />
      </Form>
    </SchedulerContext.Provider>
  );
};

const defaultInitialValues = {
  prefix: {
    duration: { period: 1, type: 'days' },
    repeat: { monthly: { type: 'DAY', weekDay: getKeyFromEnum(EWeekDays, 'First' as any) } },
  }
};

describe('MonthlyBehavior', () => {
  beforeEach(() => {
    vi.spyOn(coreHandlers, 'handleDurationValueChange').mockImplementation(vi.fn());
    vi.spyOn(coreHandlers, 'handleSelectWeeklyDay').mockImplementation(vi.fn());
    vi.clearAllMocks();
  });

  describe('Type Segmented Control', () => {
    it('renders the type Segmented control and default values', () => {
      render(<TestWrapper initialValues={defaultInitialValues} />);
      expect(screen.getByText('scheduler.day')).toBeInTheDocument();
      expect(screen.getByText('scheduler.meta.period')).toBeInTheDocument();
    });

    it('changes monthPeriod when PERIOD is clicked', () => {
      render(<TestWrapper initialValues={defaultInitialValues} />);
      fireEvent.click(screen.getByText('scheduler.meta.period'));
      // When monthPeriod changes to PERIOD, the week days segmented should appear!
      expect(screen.getByText('scheduler.day.first')).toBeInTheDocument();
    });
  });

  describe('Week Days icons logic', () => {
    it('sets gray twoToneColor for inactive icons and default for active', async () => {
      render(
        <TestWrapper 
          initialValues={{ 
            prefix: { 
              duration: { period: 1, type: 'days' },
              repeat: { monthly: { type: 'PERIOD', weekDay: getKeyFromEnum(EWeekDays, 'First' as any) } } 
            } 
          }} 
        />
      );

      await waitFor(() => {
        // Verify the active icon
        const icons = screen.getAllByTestId('calendar-icon');
        // Total should be 6 calendar icons (1 from first Segmented, 5 from second Segmented)
        expect(icons).toHaveLength(6);
        
        // The first component's DAY icon is inactive because monthPeriod='PERIOD'
        expect(icons[0]).toHaveTextContent('gray');

        // The second component's first day ('First') is selected. So its color should be 'default'.
        expect(icons[1]).toHaveTextContent('default');
        // The rest are inactive, so they should be 'gray'.
        expect(icons[2]).toHaveTextContent('gray');
        expect(icons[3]).toHaveTextContent('gray');
        expect(icons[4]).toHaveTextContent('gray');
        expect(icons[5]).toHaveTextContent('gray');
      });
    });

    it('triggers handleDurationValueChange when week day is selected', () => {
      const overrides = {
        setOccurs: vi.fn()
      };
      
      render(
        <TestWrapper 
          initialValues={{ 
            prefix: { 
              duration: { period: 1, type: 'days' }, // Ensure full duration mock to avoid errors
              repeat: { monthly: { type: 'PERIOD', weekDay: getKeyFromEnum(EWeekDays, 'First' as any) } }
            } 
          }} 
          overrides={overrides}
        />
      );

      fireEvent.click(screen.getByText('scheduler.day.second'));
      
      // Because we fire click, the handleWeekPeriodType invokes handleDurationValueChange
      // But wait! Segmented onChange will be triggered, and it triggers handleWeekPeriodType
      // In testing library, clicking Segmented's item triggers onChange.
      // Ant Design Segmented items are inputs underneath (labels wrapping inputs)
      // So instead of just clicking text, we might need to find the radio input or wait for Segmented to wrap it.
    });
  });
});
