import { describe, it, expect } from 'vitest';
import { defaultTranslations, createTranslationFn } from '../src/i18n';
import type { SchedulerTranslations } from '../src/i18n';

describe('i18n', () => {
  it('should export defaultTranslations with all required keys', () => {
    expect(defaultTranslations['scheduler']).toBe('Scheduler');
    expect(defaultTranslations['scheduler.startedAt']).toBe('Started at');
    expect(defaultTranslations['scheduler.weekdays.sunday']).toBe('Sunday');
    expect(defaultTranslations['scheduler.months.january']).toBe('January');
  });

  it('should create a translation function that looks up keys', () => {
    const t = createTranslationFn(defaultTranslations);
    expect(t('scheduler')).toBe('Scheduler');
    expect(t('scheduler.duration')).toBe('Repeat Every');
  });

  it('should return key itself when not found', () => {
    const t = createTranslationFn(defaultTranslations);
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('should support {{variable}} interpolation', () => {
    const t = createTranslationFn(defaultTranslations);
    const result = t('scheduler.header.title', { entity: 'Sale', count: 3 });
    expect(result).toBe('Sale Scheduler (3)');
  });

  it('should merge custom translations with defaults', () => {
    const custom: Partial<SchedulerTranslations> = {
      scheduler: 'Planificador',
    };
    const merged = { ...defaultTranslations, ...custom } as SchedulerTranslations;
    const t = createTranslationFn(merged);
    expect(t('scheduler')).toBe('Planificador');
    expect(t('scheduler.startedAt')).toBe('Started at');
  });

  it('should have all weekday keys', () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (const day of days) {
      expect(defaultTranslations[`scheduler.weekdays.${day}`]).toBeDefined();
      expect(defaultTranslations[`scheduler.weekdays.short.${day}`]).toBeDefined();
    }
  });

  it('should have all month keys', () => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december',
    ];
    for (const month of months) {
      expect(defaultTranslations[`scheduler.months.${month}`]).toBeDefined();
      expect(defaultTranslations[`scheduler.months.short.${month}`]).toBeDefined();
    }
  });
});
