import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Form } from 'antd';
import React from 'react';

import { AfterBehavior } from '@ischeduler-antd/components/behaviors/AfterBehavior';
import { SchedulerContext } from '@teamco/ischeduler-core';

const TestWrapper = (props: any) => {
  const [form] = Form.useForm();
  return (
    <SchedulerContext.Provider value={{ t: (k: string) => k } as any}>
      <Form form={form}>
        <AfterBehavior {...props} />
      </Form>
    </SchedulerContext.Provider>
  );
};

describe('AfterBehavior', () => {
  it('renders the InputNumber with default props', async () => {
    render(<TestWrapper />);
    
    expect(screen.getByText('scheduler.occurrences')).toBeInTheDocument();
    
    // Ant Design inputs linked through Form.Item labels can be targeted by getByLabelText
    const input = await screen.findByLabelText('scheduler.occurrences');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-valuemin', '1');
    expect(input).not.toBeDisabled();
  });

  it('respects the disabled prop', async () => {
    render(<TestWrapper disabled={true} />);
    const input = await screen.findByLabelText('scheduler.occurrences');
    expect(input).toBeDisabled();
  });

  it('respects the min prop', async () => {
    render(<TestWrapper min={5} />);
    const input = await screen.findByLabelText('scheduler.occurrences');
    expect(input).toHaveAttribute('aria-valuemin', '5');
  });
});
