import { createContext, useContext } from 'react';
import type { TFn } from '../i18n/index';
import type { ESchedulerPrefix, IScheduler } from '../types/index';

export interface SchedulerContextValue {
  /** Scheduler data grouped by type */
  schedulers: Record<ESchedulerPrefix, IScheduler[]>;
  /** Global loading state */
  loading: boolean;
  /** Global disabled state */
  disabled: boolean;
  /** Permission flags for CRUD operations */
  permissions: {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
  /** Translation function — call as `t('key')` or `t('key', { var: value })` */
  t: TFn;
  /** Locale code (e.g. `"en-US"`) */
  locale?: string;

  // CRUD callbacks
  /** Create a new scheduler */
  onCreate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  /** Update an existing scheduler */
  onUpdate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  /** Delete a scheduler by ID */
  onDelete?: (type: ESchedulerPrefix, schedulerId: string) => Promise<void>;

  // Internal drawer state
  /** Whether the create/edit drawer is currently open */
  drawerOpen: boolean;
  /** Toggle the drawer open/closed */
  setDrawerOpen: (open: boolean) => void;
  /** Arbitrary config passed to the drawer */
  drawerConfig: Record<string, unknown>;
  /** Update the drawer config */
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
