import React, { useState, useMemo } from 'react';
import { SchedulerContext } from './SchedulerContext';
import { createTranslationFn, defaultTranslations } from '../i18n';
import type { SchedulerTranslations } from '../i18n';
import type { ESchedulerPrefix, IScheduler } from '../types';

export interface SchedulerProviderProps {
  schedulers: Record<ESchedulerPrefix, IScheduler[]>;
  loading?: boolean;
  disabled?: boolean;
  locale?: string;
  onCreate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  onUpdate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  onDelete?: (type: ESchedulerPrefix, schedulerId: string) => Promise<void>;
  permissions?: {
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
  };
  translations?: Partial<SchedulerTranslations>;
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
