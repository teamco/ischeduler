import React, { useState, useMemo } from 'react';
import { SchedulerContext } from './SchedulerContext';
import { createTranslationFn, defaultTranslations } from '../i18n';
import type { SchedulerTranslations } from '../i18n';
import type { ESchedulerPrefix, IScheduler } from '../types';

export interface SchedulerProviderProps {
  /** Scheduler data grouped by type (SALE, DISCOUNT, TRIAL_DISCOUNT) */
  schedulers: Record<ESchedulerPrefix, IScheduler[]>;
  /** Show a global loading state across all child components. @default false */
  loading?: boolean;
  /** Disable all interactions in child components. @default false */
  disabled?: boolean;
  /** Locale code passed to child components (e.g. `"en-US"`) */
  locale?: string;
  /** Called when a new scheduler is created via the drawer form */
  onCreate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  /** Called when an existing scheduler is updated via the edit drawer */
  onUpdate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  /** Called when a scheduler is deleted from the list */
  onDelete?: (type: ESchedulerPrefix, schedulerId: IScheduler['id']) => Promise<void>;
  /** Permission flags controlling which CRUD actions are available. All default to `true`. */
  permissions?: {
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
  };
  /** Override default English translations. Merged with built-in defaults. */
  translations?: Partial<SchedulerTranslations>;
  /** Child components that consume the scheduler context */
  children: React.ReactNode;
}

export const SchedulerProvider = (props: SchedulerProviderProps) => {
  const {
    schedulers,
    loading = false,
    disabled = false,
    locale,
    onCreate,
    onUpdate,
    onDelete,
    permissions,
    translations: customTranslations,
    children,
  } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerConfig, setDrawerConfig] = useState<Record<string, unknown>>({});

  const mergedTranslations = useMemo(
    () => ({ ...defaultTranslations, ...(customTranslations ?? {}) } as Record<string, string>),
    [customTranslations],
  );

  const t = useMemo(() => createTranslationFn(mergedTranslations), [mergedTranslations]);

  const value = useMemo(
    () => ({
      schedulers,
      loading,
      disabled,
      locale,
      t,
      permissions: {
        canCreate: permissions?.canCreate ?? true,
        canUpdate: permissions?.canUpdate ?? true,
        canDelete: permissions?.canDelete ?? true,
      },
      onCreate,
      onUpdate,
      onDelete,
      drawerOpen,
      setDrawerOpen,
      drawerConfig,
      setDrawerConfig,
    }),
    [
      schedulers,
      loading,
      disabled,
      locale,
      t,
      permissions,
      onCreate,
      onUpdate,
      onDelete,
      drawerOpen,
      drawerConfig,
    ],
  );

  return <SchedulerContext.Provider value={value}>{children}</SchedulerContext.Provider>;
};
