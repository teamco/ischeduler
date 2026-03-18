import { createContext, useContext } from 'react';
import type { TFn } from '../i18n';
import type { ESchedulerPrefix, IScheduler } from '../types';

export interface SchedulerContextValue {
  schedulers: Record<ESchedulerPrefix, IScheduler[]>;
  loading: boolean;
  disabled: boolean;
  permissions: {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
  t: TFn;
  locale?: string;

  // CRUD callbacks
  onCreate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  onUpdate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  onDelete?: (type: ESchedulerPrefix, schedulerId: string) => Promise<void>;

  // Internal drawer state
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  drawerConfig: Record<string, unknown>;
  setDrawerConfig: (config: Record<string, unknown>) => void;
}

export const SchedulerContext = createContext<SchedulerContextValue | null>(null);

export const useSchedulerContext = (): SchedulerContextValue => {
  const ctx = useContext(SchedulerContext);
  if (!ctx) {
    throw new Error('useSchedulerContext must be used within a SchedulerProvider');
  }
  return ctx;
};
