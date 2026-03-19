[![Bump Version](https://github.com/teamco/ischeduler/actions/workflows/version.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/version.yml)
[![Deploy Storybook](https://github.com/teamco/ischeduler/actions/workflows/storybook.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/storybook.yml)
[![Publish to npm](https://github.com/teamco/ischeduler/actions/workflows/publish.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/publish.yml)

# iScheduler

Recurring event scheduler UI components for React + Ant Design.

Provides a complete scheduler form with weekly/monthly/yearly behaviors, a table list with CRUD actions, and a drawer-based creation flow — all driven by a simple provider pattern.

[![npm version](https://img.shields.io/npm/v/@teamco/ischeduler.svg)](https://www.npmjs.com/package/ischeduler)
[![license](https://img.shields.io/npm/l/@teamco/ischeduler.svg)](./LICENSE)

## Demo sandbox: [https://teamco.github.io/ischeduler/](https://teamco.github.io/ischeduler/)

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
import 'iScheduler/dist/ischeduler.css';

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

## Usage with Firebase / Firestore

iScheduler uses `dayjs` for dates. If your backend uses Firebase Timestamps, convert before passing data:

```tsx
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

// Firestore Timestamp → dayjs (when reading)
const toDayjs = (ts: Timestamp) => dayjs(ts.toDate());

// dayjs → Firestore Timestamp (when writing)
const toTimestamp = (d: dayjs.Dayjs) => Timestamp.fromDate(d.toDate());

// Convert scheduler dates before passing to provider
const convertScheduler = (raw: FirestoreScheduler): IScheduler => ({
  ...raw,
  range: {
    startedAt: toDayjs(raw.range.startedAt),
    endReason: {
      ...raw.range.endReason,
      expiredAt: raw.range.endReason.expiredAt
        ? toDayjs(raw.range.endReason.expiredAt)
        : null,
    },
  },
});
```

## Usage with TanStack Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function useSchedulerData(entityId: string) {
  const queryClient = useQueryClient();

  const { data: schedulers, isLoading } = useQuery({
    queryKey: ['schedulers', entityId],
    queryFn: () => fetchSchedulers(entityId),
  });

  const createMutation = useMutation({
    mutationFn: ({ type, scheduler }) => createScheduler(entityId, type, scheduler),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers', entityId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ type, scheduler }) => updateScheduler(entityId, type, scheduler),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers', entityId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }) => deleteScheduler(entityId, type, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers', entityId] }),
  });

  return {
    schedulers,
    isLoading,
    onCreate: (type, scheduler) => createMutation.mutateAsync({ type, scheduler }),
    onUpdate: (type, scheduler) => updateMutation.mutateAsync({ type, scheduler }),
    onDelete: (type, id) => deleteMutation.mutateAsync({ type, id }),
  };
}
```

## API Reference

### SchedulerProvider

Wraps all scheduler components. Provides data, callbacks, permissions, and translations via context.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `schedulers` | `Record<ESchedulerPrefix, IScheduler[]>` | **required** | Scheduler data by type |
| `loading` | `boolean` | `false` | Global loading state |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `locale` | `string` | — | Locale code |
| `onCreate` | `(type, scheduler) => Promise<void>` | — | Create callback |
| `onUpdate` | `(type, scheduler) => Promise<void>` | — | Update callback |
| `onDelete` | `(type, id) => Promise<void>` | — | Delete callback |
| `permissions` | `{ canCreate, canUpdate, canDelete }` | all `true` | Permission flags |
| `translations` | `Partial<SchedulerTranslations>` | — | Override default English translations |

### SchedulersList

Renders a table of schedulers with edit/delete actions and a toolbar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `ESchedulerPrefix` | **required** | Which scheduler type to display |
| `title` | `string` | — | Section title |
| `disabled` | `boolean` | — | Override provider-level disabled |
| `readOnlyFields` | `string[]` | `[]` | Fields that cannot be edited |
| `currency` | `ECurrency` | — | Currency for discount display |
| `onRefresh` | `() => void` | — | Called after CRUD operations |

### SchedulerDrawerButton

Opens a drawer to create a new scheduler.

| Prop | Type | Description |
|------|------|-------------|
| `schedulerType` | `ESchedulerPrefix` | SALE, DISCOUNT, or TRIAL_DISCOUNT |
| `disabled` | `boolean` | Disable the button |
| `onSuccess` | `(scheduler) => void` | Called after successful creation |

### Scheduler

The form component rendered inside drawers. Can also be used standalone.

| Prop | Type | Description |
|------|------|-------------|
| `formRef` | `FormInstance` | Ant Design form instance |
| `prefix` | `string[]` | Form field name prefix |
| `schedulerType` | `ESchedulerPrefix` | SALE, DISCOUNT, or TRIAL_DISCOUNT |
| `entity` | `IScheduler` | Existing scheduler data (for edit mode) |
| `durationTypes` | `EDurationTypes[]` | Available duration types |
| `discountTypes` | `EDiscountType[]` | Available discount types |
| `disabled` | `boolean` | Read-only mode |
| `readOnlyFields` | `string[]` | Specific read-only fields |

## i18n / Translations

Default English translations are built in. Override any key via the `translations` prop:

```tsx
<SchedulerProvider
  translations={{
    'scheduler': 'Planificador',
    'scheduler.startedAt': 'Fecha de inicio',
    'scheduler.duration': 'Repetir cada',
    'scheduler.weekdays.monday': 'Lunes',
    // ... override as many keys as needed
  }}
>
```

Supports `{{variable}}` interpolation:

```
"scheduler.header.title": "{{entity}} Scheduler ({{count}})"
```

To get all available keys, import `defaultTranslations`:

```tsx
import { defaultTranslations } from 'ischeduler';
console.log(Object.keys(defaultTranslations));
```

## Storybook

### Run locally

```bash
# Clone the repo and install dependencies
git clone <repo-url>
cd ischeduler
npm install

# Start Storybook dev server
npm run storybook
```

Storybook will open at [http://localhost:6006](http://localhost:6006) with:

- **Components/SchedulersList** — Empty, populated, discount, and read-only variants
- **Components/Scheduler** — Sale form, discount form, disabled state
- **Components/SchedulerDrawerButton** — Sale, discount, disabled
- **Playground/FullDemo** — Interactive demo with all 3 scheduler types and working CRUD

### Build a static Storybook

```bash
npm run build-storybook
```

This outputs a static site to `storybook-static/` that can be hosted anywhere.

### Deploy Storybook to GitHub Pages

#### Option 1: GitHub Actions (automated)

Create `.github/workflows/storybook.yml`:

```yaml
name: Deploy Storybook

on:
  push:
    branches: [main]
    paths:
      - 'ischeduler/**'

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        working-directory: ischeduler
        run: npm install --immutable

      - name: Build Storybook
        working-directory: ischeduler
        run: npm run build-storybook

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ischeduler/storybook-static

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then go to **Settings > Pages** in your GitHub repo and set source to **GitHub Actions**.

Your Storybook will be live at `https://<username>.github.io/<repo>/`.

#### Option 2: Manual deploy

```bash
# Build the static storybook
cd ischeduler
npm run build-storybook

# Deploy to gh-pages branch using any static hosting tool
npx gh-pages -d storybook-static
```

## Publishing to npm

### First-time setup

```bash
# Login to npm (one-time)
npm login

# Or use an npm token in CI
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
```

### Publish

```bash
cd ischeduler

# Run tests and build
npm run test
npm run build

# Publish to npm
npm run publish
```

### Publish via GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: https://registry.npmjs.org

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        working-directory: ischeduler
        run: npm install --immutable

      - name: Test
        working-directory: ischeduler
        run: npm run test

      - name: Build
        working-directory: ischeduler
        run: npm run build

      - name: Publish
        working-directory: ischeduler
        run: npm run publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add your npm token as `NPM_TOKEN` in **Settings > Secrets and variables > Actions**.

### Version bumps

```bash
# Patch release (0.1.0 → 0.1.1)
npm version patch

# Minor release (0.1.0 → 0.2.0)
npm version minor

# Major release (0.1.0 → 1.0.0)
npm version major
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

### Project structure

```
ischeduler/
├── src/
│   ├── index.ts                    # Public API
│   ├── provider/                   # SchedulerProvider + context
│   ├── components/
│   │   ├── Scheduler.tsx           # Main form
│   │   ├── SchedulersList.tsx      # Table with CRUD
│   │   ├── SchedulerDrawerButton.tsx
│   │   ├── behaviors/              # Weekly, Monthly, Yearly, etc.
│   │   ├── handlers/               # Duration text generators
│   │   ├── metadata/               # Table column definitions
│   │   └── internal/               # Shared UI components
│   ├── types/                      # All TypeScript types
│   ├── utils/                      # Form, format, table utilities
│   ├── i18n/                       # Translations
│   ├── styles/                     # Less CSS modules
│   ├── handlers.tsx                # Core handler functions
│   └── stories/                    # Storybook stories
├── __tests__/                      # Test files
├── .storybook/                     # Storybook config
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

## License

[MIT](./LICENSE)
