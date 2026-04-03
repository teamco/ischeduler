# @teamco/ischeduler-antd

iScheduler UI components for [React](https://reactjs.org) and [Ant Design](https://ant.design) v6.

Provides a complete scheduler form, a table list with CRUD actions, and a drawer-based creation flow — all driven by a headless core.

[![license](https://img.shields.io/npm/l/@teamco/ischeduler-antd.svg)](../../LICENSE)

## Demo sandbox: [https://teamco.github.io/ischeduler/](https://teamco.github.io/ischeduler/?path=/story/ant-design-overview--overview-story)

<img width="1024" height="480" alt="Screenshot 2026-03-19 at 8 06 36" src="https://github.com/user-attachments/assets/38efdd68-fb5b-4c9c-9532-5848931605cf" />
<img width="1024" height="582" alt="Screenshot 2026-03-19 at 8 07 03" src="https://github.com/user-attachments/assets/ae0ede0f-a4ee-40a6-8c4a-fa34f0996bff" />

## Installation

```bash
npm install @teamco/ischeduler-core @teamco/ischeduler-antd
npm install react react-dom antd dayjs @ant-design/icons
```

## Quick Start (Form-based)

```tsx
import { useState, useCallback } from 'react';
import { SchedulerProvider, ESchedulerPrefix, type IScheduler } from '@teamco/ischeduler-core';
import { SchedulersList } from '@teamco/ischeduler-antd';

function SchedulerPage() {
  const [schedulers, setSchedulers] = useState({
    [ESchedulerPrefix.SALE]: [] as IScheduler[],
    [ESchedulerPrefix.DISCOUNT]: [] as IScheduler[],
    [ESchedulerPrefix.TRIAL_DISCOUNT]: [] as IScheduler[],
  });

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    const saved = await api.createScheduler(type, scheduler);
    setSchedulers((prev) => ({ ...prev, [type]: [...prev[type], saved] }));
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
    setSchedulers((prev) => ({ ...prev, [type]: prev[type].filter((s) => s.id !== id) }));
  }, []);

  return (
    <SchedulerProvider
      schedulers={schedulers}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      permissions={{ canCreate: true, canUpdate: true, canDelete: true }}
    >
      <SchedulersList type={ESchedulerPrefix.SALE} />
      <SchedulersList type={ESchedulerPrefix.DISCOUNT} currency="USD" />
      <SchedulersList type={ESchedulerPrefix.TRIAL_DISCOUNT} />
    </SchedulerProvider>
  );
}
```

## Components

- **`Scheduler`** — Form for creating/editing a scheduler. Works with Ant Design `Form`.
- **`SchedulersList`** — Table with CRUD actions, column visibility toggle, and pagination.
- **`SchedulerDrawerButton`** — Button that opens a drawer with the `Scheduler` form.

## Documentation

For architecture details, i18n customization, and more examples, visit the [main repository](https://github.com/teamco/ischeduler).

## License

[MIT](../../LICENSE)
