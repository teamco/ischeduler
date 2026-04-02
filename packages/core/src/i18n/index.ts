import enUS from './locales/en-US';

export type SchedulerTranslations = Record<string, string>;

export type TFn = (key: string, params?: Record<string, string | number>) => string;

export const defaultTranslations: SchedulerTranslations = enUS;

export const createTranslationFn = (translations: SchedulerTranslations): TFn => {
  return (key: string, params?: Record<string, string | number>): string => {
    const template = translations[key] ?? defaultTranslations[key] ?? key;
    if (!params) return template;
    return template.replace(/\{\{(\w+)}}/g, (_, k) => String(params[k] ?? ''));
  };
};
