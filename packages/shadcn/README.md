# @teamco/ischeduler-shadcn

iScheduler UI components for [React](https://reactjs.org) and [shadcn/ui](https://ui.shadcn.com) (Radix UI + Tailwind).

Provides a complete scheduler form, a table list with CRUD actions, and a drawer-based creation flow — all driven by a headless core.

[![license](https://img.shields.io/npm/l/@teamco/ischeduler-shadcn.svg)](../../LICENSE)

## Demo sandbox: [https://teamco.github.io/ischeduler/](https://teamco.github.io/ischeduler/?path=/story/shadcn-overview--overview-story)

<img width="1024" height="239" alt="Screenshot 2026-04-03 at 9 29 00" src="https://github.com/user-attachments/assets/de3375b6-1ff6-436c-92da-17965c1302a2" />
<img width="1024" height="504" alt="Screenshot 2026-04-03 at 9 29 19" src="https://github.com/user-attachments/assets/46460517-7573-453e-83d0-2324dfb88986" />

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
