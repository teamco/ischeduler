[![Pipeline](https://github.com/teamco/ischeduler/actions/workflows/pipeline.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/pipeline.yml)
[![Publish to npm](https://github.com/teamco/ischeduler/actions/workflows/publish.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/publish.yml)

# iScheduler

Recurring event scheduler UI components for React + Ant Design.

Provides a complete scheduler form with weekly/monthly/yearly behaviors, a table list with CRUD actions, and a drawer-based creation flow — all driven by a simple provider pattern.

[![npm version](https://img.shields.io/npm/v/@teamco/ischeduler.svg)](https://www.npmjs.com/package/ischeduler)
[![license](https://img.shields.io/npm/l/@teamco/ischeduler.svg)](./LICENSE)

## Demo sandbox: [https://teamco.github.io/ischeduler/](https://teamco.github.io/ischeduler/)

<img width="1024" height="480" alt="Screenshot 2026-03-19 at 8 06 36" src="https://github.com/user-attachments/assets/38efdd68-fb5b-4c9c-9532-5848931605cf" />
<img width="1024" height="582" alt="Screenshot 2026-03-19 at 8 07 03" src="https://github.com/user-attachments/assets/ae0ede0f-a4ee-40a6-8c4a-fa34f0996bff" />

## Documentation

See the [Storybook documentation](https://teamco.github.io/ischeduler/) for integration guides (Firebase, TanStack Query), API reference, i18n, types reference, and code examples.

## Installation

```bash
npm install @teamco/ischeduler
# or
yarn add @teamco/ischeduler
```

### Peer Dependencies

Make sure your project has these installed:

```bash
npm install react react-dom antd dayjs @ant-design/icons
```

| Package | Version |
|---------|---------|
| `react` | >= 18 |
| `react-dom` | >= 18 |
| `antd` | >= 6 |
| `dayjs` | >= 1.11 |
| `@ant-design/icons` | >= 5 |

## Quick Start

```tsx
import { useState, useCallback } from 'react';
import {
  SchedulerProvider,
  SchedulersList,
  ESchedulerPrefix,
  type IScheduler,
} from 'ischeduler';
import 'ischeduler/dist/ischeduler.css';

function SchedulerPage() {
  const [schedulers, setSchedulers] = useState({
    [ESchedulerPrefix.SALE]: [] as IScheduler[],
    [ESchedulerPrefix.DISCOUNT]: [] as IScheduler[],
    [ESchedulerPrefix.TRIAL_DISCOUNT]: [] as IScheduler[],
  });

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    // Save to your API / database
    const saved = await api.createScheduler(type, scheduler);
    setSchedulers((prev) => ({
      ...prev,
      [type]: [...prev[type], saved],
    }));
  }, []);

  const onUpdate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    const updated = await api.updateScheduler(type, scheduler);
    setSchedulers((prev) => ({
      ...prev,
      [type]: prev[type].map((s) => (s.id === updated.id ? updated : s)),
    }));
  }, []);

  const onDelete = useCallback(async (type: ESchedulerPrefix, id: string) => {
    await api.deleteScheduler(type, id);
    setSchedulers((prev) => ({
      ...prev,
      [type]: prev[type].filter((s) => s.id !== id),
    }));
  }, []);

  return (
    <SchedulerProvider
      schedulers={schedulers}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      permissions={{ canCreate: true, canUpdate: true, canDelete: true }}
    >
      <h2>Sale Schedulers</h2>
      <SchedulersList type={ESchedulerPrefix.SALE} />

      <h2>Discount Schedulers</h2>
      <SchedulersList type={ESchedulerPrefix.DISCOUNT} currency="USD" />

      <h2>Trial Discount Schedulers</h2>
      <SchedulersList type={ESchedulerPrefix.TRIAL_DISCOUNT} />
    </SchedulerProvider>
  );
}
```

## Development

```bash
npm run dev            # Vite dev server
npm run build          # Production build (TypeScript check + Vite)
npm run test           # Run all tests
npm run test:watch     # Tests in watch mode
npm run lint           # ESLint
npm run format         # Prettier
npm run storybook      # Storybook dev server on port 6006
npm run build-storybook # Static Storybook build
```

## License

[MIT](./LICENSE)
