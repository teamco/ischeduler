// Compiled Tailwind styles — emitted to dist/index.css, exposed via the
// "./styles" subpath. Consumers: import '@teamco/ischeduler-shadcn/styles'.
import './globals.css';

// Re-export everything from core for convenience
export * from '@teamco/ischeduler-core';

// Shadcn-specific components
export { Scheduler } from './components/Scheduler';
export { SchedulersList } from './components/SchedulersList';
export type { SchedulersListProps } from './components/SchedulersList';
export { SchedulerDrawerButton } from './components/SchedulerDrawerButton';

// Shadcn-specific utils
export { indexable, indexColumn, actionField } from './utils/table.util';
