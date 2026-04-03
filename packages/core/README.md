# @teamco/ischeduler-core

Headless core for **iScheduler** — provides types, utilities, handlers, i18n, and the `SchedulerProvider`.

This package is intended to be used alongside one of the UI adapter packages:
- [`@teamco/ischeduler-antd`](https://www.npmjs.com/package/@teamco/ischeduler-antd)
- [`@teamco/ischeduler-mui`](https://www.npmjs.com/package/@teamco/ischeduler-mui)
- [`@teamco/ischeduler-shadcn`](https://www.npmjs.com/package/@teamco/ischeduler-shadcn)

## Features

- **`SchedulerProvider` / `useSchedulerContext`** — Centralized state, CRUD callbacks, and permissions management.
- **Types** — Standardized `IScheduler`, `TSchedulerDuration`, `TSchedulerRepeat`, and `TSchedulerRange`.
- **Handlers** — Logic for duration value changes, start date formatting, and generating recurrence text (weekly/monthly/yearly).
- **i18n** — 90+ translation keys with template variable support, fully customizable via the provider.

## Installation

```bash
npm install @teamco/ischeduler-core
npm install react react-dom dayjs
```

## Usage

The core package provides the context that wraps your scheduling components:

```tsx
import { SchedulerProvider, ESchedulerPrefix } from '@teamco/ischeduler-core';

function App() {
  return (
    <SchedulerProvider
      schedulers={/* your schedulers state */}
      onCreate={/* create callback */}
      onUpdate={/* update callback */}
      onDelete={/* delete callback */}
      permissions={{ canCreate: true, canUpdate: true, canDelete: true }}
    >
      {/* Add your chosen UI adapter components here */}
    </SchedulerProvider>
  );
}
```

## Documentation

For full documentation and examples, visit the [main repository](https://github.com/teamco/ischeduler).

## License

[MIT](../../LICENSE)
