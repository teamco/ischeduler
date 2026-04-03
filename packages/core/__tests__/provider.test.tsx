import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SchedulerProvider } from '../src/provider/SchedulerProvider';
import { useSchedulerContext } from '../src/provider/SchedulerContext';
import { ESchedulerPrefix } from '../src/types';

const TestConsumer = () => {
  const ctx = useSchedulerContext();
  return (
    <div>
      <span data-testid="loading">{String(ctx.loading)}</span>
      <span data-testid="disabled">{String(ctx.disabled)}</span>
      <span data-testid="can-create">{String(ctx.permissions.canCreate)}</span>
      <span data-testid="scheduler-count">
        {ctx.schedulers[ESchedulerPrefix.SALE]?.length ?? 0}
      </span>
    </div>
  );
};

describe('SchedulerProvider', () => {
  const defaultSchedulers = {
    [ESchedulerPrefix.SALE]: [],
    [ESchedulerPrefix.DISCOUNT]: [],
    [ESchedulerPrefix.TRIAL_DISCOUNT]: [],
  };

  it('should provide default context values', () => {
    render(
      <SchedulerProvider schedulers={defaultSchedulers}>
        <TestConsumer />
      </SchedulerProvider>,
    );
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('disabled').textContent).toBe('false');
    expect(screen.getByTestId('can-create').textContent).toBe('true');
  });

  it('should pass schedulers to context', () => {
    const schedulers = {
      ...defaultSchedulers,
      [ESchedulerPrefix.SALE]: [
        { id: '1', type: ESchedulerPrefix.SALE } as any,
      ],
    };
    render(
      <SchedulerProvider schedulers={schedulers}>
        <TestConsumer />
      </SchedulerProvider>,
    );
    expect(screen.getByTestId('scheduler-count').textContent).toBe('1');
  });

  it('should pass loading and disabled props', () => {
    render(
      <SchedulerProvider schedulers={defaultSchedulers} loading disabled>
        <TestConsumer />
      </SchedulerProvider>,
    );
    expect(screen.getByTestId('loading').textContent).toBe('true');
    expect(screen.getByTestId('disabled').textContent).toBe('true');
  });

  it('should pass permissions', () => {
    render(
      <SchedulerProvider
        schedulers={defaultSchedulers}
        permissions={{ canCreate: false }}
      >
        <TestConsumer />
      </SchedulerProvider>,
    );
    expect(screen.getByTestId('can-create').textContent).toBe('false');
  });

  it('should merge translations with defaults', () => {
    const TransConsumer = () => {
      const { t } = useSchedulerContext();
      return <span data-testid="translated">{t('scheduler')}</span>;
    };

    render(
      <SchedulerProvider
        schedulers={defaultSchedulers}
        translations={{ scheduler: 'Custom' }}
      >
        <TransConsumer />
      </SchedulerProvider>,
    );
    expect(screen.getByTestId('translated').textContent).toBe('Custom');
  });

  it('should throw when useSchedulerContext used outside provider', () => {
    const BrokenConsumer = () => {
      useSchedulerContext();
      return null;
    };

    expect(() => render(<BrokenConsumer />)).toThrow(
      'useSchedulerContext must be used within a SchedulerProvider',
    );
  });
});
