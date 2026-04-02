[![Pipeline](https://github.com/teamco/ischeduler/actions/workflows/pipeline.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/pipeline.yml)
[![Publish to npm](https://github.com/teamco/ischeduler/actions/workflows/publish.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/publish.yml)

# iScheduler

Recurring event scheduler UI components for React — available for **Ant Design**, **MUI**, and **shadcn/ui**.

Provides a complete scheduler form with weekly/monthly/yearly behaviors, a table list with CRUD actions, and a drawer-based creation flow — all driven by a headless core with adapter-specific UI packages.

[![license](https://img.shields.io/npm/l/@teamco/ischeduler-core.svg)](./LICENSE)

## Demo sandbox: [https://teamco.github.io/ischeduler/](https://teamco.github.io/ischeduler/)

<img width="1024" height="480" alt="Screenshot 2026-03-19 at 8 06 36" src="https://github.com/user-attachments/assets/38efdd68-fb5b-4c9c-9532-5848931605cf" />
<img width="1024" height="582" alt="Screenshot 2026-03-19 at 8 07 03" src="https://github.com/user-attachments/assets/ae0ede0f-a4ee-40a6-8c4a-fa34f0996bff" />

## Packages

This is an **npm workspaces monorepo**. Each adapter is a separate, independently installable package:

| Package | Description | Status |
|---------|-------------|--------|
| [`@teamco/ischeduler-core`](./packages/core) | Headless core — types, utils, handlers, i18n, provider | Stable |
| [`@teamco/ischeduler-antd`](./packages/antd) | UI components for [Ant Design](https://ant.design) v6 | Stable |
| [`@teamco/ischeduler-mui`](./packages/mui) | UI components for [MUI](https://mui.com) v5/v6 | Stable |
| [`@teamco/ischeduler-shadcn`](./packages/shadcn) | UI components for [shadcn/ui](https://ui.shadcn.com) (Radix + Tailwind) | Stable |

## Installation

Pick your adapter and install with the core:

```bash
# Ant Design
npm install @teamco/ischeduler-core @teamco/ischeduler-antd
npm install react react-dom antd dayjs @ant-design/icons

# MUI
npm install @teamco/ischeduler-core @teamco/ischeduler-mui
npm install react react-dom @mui/material @mui/x-date-pickers @mui/icons-material @emotion/react @emotion/styled dayjs

# shadcn/ui
npm install @teamco/ischeduler-core @teamco/ischeduler-shadcn
npm install react react-dom dayjs
```

## Quick Start

### Ant Design (Form-based)

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

### MUI / shadcn/ui (Controlled value/onChange)

MUI and shadcn adapters use a controlled component pattern instead of Ant Design's Form:

```tsx
import { SchedulerProvider, ESchedulerPrefix, type IScheduler } from '@teamco/ischeduler-core';
import { SchedulersList } from '@teamco/ischeduler-mui';    // or '@teamco/ischeduler-shadcn'

// Same SchedulerProvider setup as above — the provider API is identical across all adapters.
// Only the UI components differ.
```

## Architecture

```
                    SchedulerProvider (core)
                    /        |         \
              SchedulersList  Scheduler  SchedulerDrawerButton
              (adapter UI)   (adapter UI)   (adapter UI)
                    \        |         /
                     Core: types, handlers, i18n, utils
```

**Headless core** (`@teamco/ischeduler-core`) provides:
- `SchedulerProvider` / `useSchedulerContext` — centralized state, CRUD callbacks, permissions
- Types: `IScheduler`, `TSchedulerDuration`, `TSchedulerRepeat`, `TSchedulerRange`
- Handlers: duration value change, start date formatting, weekly/monthly/yearly occurs text
- i18n: 90+ translation keys with template variable support, customizable via provider

**Adapters** provide UI components that consume the core:
- `Scheduler` — form for creating/editing a scheduler
- `SchedulersList` — table with CRUD actions, column visibility toggle, pagination
- `SchedulerDrawerButton` — button that opens a drawer with the Scheduler form

## Monorepo Structure

```
ischeduler/
├── packages/
│   ├── core/       # @teamco/ischeduler-core   — headless (types, utils, handlers, i18n, provider)
│   ├── antd/       # @teamco/ischeduler-antd   — Ant Design UI components
│   ├── mui/        # @teamco/ischeduler-mui    — MUI UI components
│   ├── shadcn/     # @teamco/ischeduler-shadcn — shadcn/ui components
│   └── storybook/  # Unified Storybook for all adapters (private, not published)
├── package.json    # workspace root
└── ...
```

## Development

```bash
# Install all workspace dependencies
npm install

# Build all packages (core → antd → mui → shadcn)
npm run build

# Run all tests
npm run test

# Run tests for a specific package
npm run test --workspace=packages/core
npm run test --workspace=packages/antd

# Unified Storybook (all adapters)
npm run storybook

# Lint / format all packages
npm run lint
npm run format
```

## Migrating from `@teamco/ischeduler`

The old meta-package `@teamco/ischeduler` has been deprecated and replaced by individual packages.

### Step 1 — Replace dependencies

```bash
# Remove the old meta-package
npm uninstall @teamco/ischeduler

# Install the new packages (pick your adapter)
# Ant Design
npm install @teamco/ischeduler-core @teamco/ischeduler-antd

# MUI
npm install @teamco/ischeduler-core @teamco/ischeduler-mui

# shadcn/ui
npm install @teamco/ischeduler-core @teamco/ischeduler-shadcn
```

### Step 2 — Update imports

Subpath imports (`@teamco/ischeduler/core`, `@teamco/ischeduler/antd`, etc.) are replaced by direct package names:

```diff
- import { SchedulerProvider, ESchedulerPrefix } from '@teamco/ischeduler/core';
- import { SchedulersList } from '@teamco/ischeduler/antd';
+ import { SchedulerProvider, ESchedulerPrefix } from '@teamco/ischeduler-core';
+ import { SchedulersList } from '@teamco/ischeduler-antd';
```

For MUI:
```diff
- import { Scheduler } from '@teamco/ischeduler/mui';
+ import { Scheduler } from '@teamco/ischeduler-mui';
```

For shadcn/ui:
```diff
- import { SchedulerDrawerButton } from '@teamco/ischeduler/shadcn';
+ import { SchedulerDrawerButton } from '@teamco/ischeduler-shadcn';
```

### Step 3 — Search & replace (optional)

Run a project-wide find-and-replace to catch all imports at once:

| Find | Replace with |
|------|-------------|
| `@teamco/ischeduler/core` | `@teamco/ischeduler-core` |
| `@teamco/ischeduler/antd` | `@teamco/ischeduler-antd` |
| `@teamco/ischeduler/mui` | `@teamco/ischeduler-mui` |
| `@teamco/ischeduler/shadcn` | `@teamco/ischeduler-shadcn` |

No API changes — all components, types, and utilities remain the same.

## License

[MIT](./LICENSE)
