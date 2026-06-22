/**
 * React-free entry point — safe to use in Node.js/NestJS backends.
 * Exports only pure types, enums, constants, and utilities.
 * Does NOT export React components (SchedulerProvider, useColumnsToggle, etc.).
 * Import via: @teamco/ischeduler-core/types
 */
export * from './types';
export * from './utils';
export * from './i18n';
