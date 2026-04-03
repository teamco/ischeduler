# @teamco/ischeduler-shadcn

iScheduler UI components for [React](https://reactjs.org) and [shadcn/ui](https://ui.shadcn.com) (Radix UI + Tailwind).

Provides a complete scheduler form, a table list with CRUD actions, and a drawer-based creation flow — all driven by a headless core.

[![license](https://img.shields.io/npm/l/@teamco/ischeduler-shadcn.svg)](../../LICENSE)

## Demo sandbox: [https://teamco.github.io/ischeduler/](https://teamco.github.io/ischeduler/)

<img width="1024" height="480" alt="Screenshot 2026-03-19 at 8 06 36" src="https://github.com/user-attachments/assets/38efdd68-fb5b-4c9c-9532-5848931605cf" />

## Installation

```bash
npm install @teamco/ischeduler-core @teamco/ischeduler-shadcn
npm install react react-dom dayjs
```

## Quick Start (Controlled pattern)

MUI and shadcn adapters use a controlled component pattern instead of Ant Design's Form:

```tsx
import { SchedulerProvider, ESchedulerPrefix, type IScheduler } from '@teamco/ischeduler-core';
import { SchedulersList } from '@teamco/ischeduler-shadcn';

function App() {
  return (
    <SchedulerProvider
      schedulers={/* your schedulers state */}
      onCreate={/* create callback */}
      onUpdate={/* update callback */}
      onDelete={/* delete callback */}
      permissions={{ canCreate: true, canUpdate: true, canDelete: true }}
    >
      <SchedulersList type={ESchedulerPrefix.SALE} />
    </SchedulerProvider>
  );
}
```

## Components

- **`Scheduler`** — Form for creating/editing a scheduler.
- **`SchedulersList`** — Table with CRUD actions, column visibility toggle, and pagination.
- **`SchedulerDrawerButton`** — Button that opens a drawer with the `Scheduler` form.

## Documentation

For architecture details, i18n customization, and more examples, visit the [main repository](https://github.com/teamco/ischeduler).

## License

[MIT](../../LICENSE)
