# Storybook Documentation Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Storybook the single source of truth for iScheduler docs — auto-generated component docs, six MDX guide pages, and a slimmed README.

**Architecture:** Enable addon-docs in Storybook 10.3 config, add JSDoc to prop interfaces for auto-generated ArgTypes, add story descriptions, create standalone MDX guide pages under `src/stories/docs/`, and slim README to link to Storybook.

**Tech Stack:** Storybook 10.3, @storybook/addon-docs, React ^19.2.4, Ant Design ^6.3.3, Vite 8, TypeScript ~5.9.3

**Spec:** `docs/superpowers/specs/2026-03-19-storybook-docs-design.md`

**Note:** Tasks 6-11 contain MDX file content inside markdown code fences. The trailing ` ``` ` at the end of each code block is the plan's delimiter — do NOT include it in the actual `.mdx` file. The MDX content ends at the last line of actual content before the closing fence.

---

## File Structure

| Action | File                                            | Responsibility                                 |
| ------ | ----------------------------------------------- | ---------------------------------------------- |
| Modify | `.storybook/main.ts`                            | Enable addon-docs, expand stories glob for MDX |
| Modify | `.storybook/preview.tsx`                        | Sidebar sort order, docs parameters            |
| Modify | `src/provider/SchedulerProvider.tsx`            | JSDoc on `SchedulerProviderProps`              |
| Modify | `src/provider/SchedulerContext.ts`              | JSDoc on `SchedulerContextValue`               |
| Modify | `src/components/Scheduler.tsx`                  | JSDoc on `TSchedulerProps`                     |
| Modify | `src/components/SchedulersList.tsx`             | JSDoc on `SchedulersListProps`                 |
| Modify | `src/components/SchedulerDrawerButton.tsx`      | JSDoc on `SchedulerDrawerButtonProps`          |
| Modify | `src/stories/Scheduler.stories.tsx`             | Add docs descriptions                          |
| Modify | `src/stories/SchedulersList.stories.tsx`        | Add docs descriptions                          |
| Modify | `src/stories/SchedulerDrawerButton.stories.tsx` | Add docs descriptions                          |
| Modify | `src/stories/Playground.stories.tsx`            | Add docs descriptions                          |
| Create | `src/stories/docs/GettingStarted.mdx`           | Installation, peer deps, quick start           |
| Create | `src/stories/docs/FirebaseIntegration.mdx`      | Firestore <-> dayjs conversion                 |
| Create | `src/stories/docs/TanStackQuery.mdx`            | TanStack Query integration                     |
| Create | `src/stories/docs/Translations.mdx`             | i18n system, all translation keys              |
| Create | `src/stories/docs/TypesReference.mdx`           | Enums, interfaces, defaults                    |
| Create | `src/stories/docs/Contributing.mdx`             | Dev setup, standards, PR process               |
| Modify | `README.md`                                     | Slim down, link to Storybook                   |

---

### Task 1: Enable addon-docs and expand stories glob

**Files:**

- Modify: `.storybook/main.ts:1-32`

- [ ] **Step 1: Update main.ts**

Replace the current config:

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) =>
    mergeConfig(config, {
      css: {
        modules: { localsConvention: 'camelCase' },
        preprocessorOptions: {
          less: { javascriptEnabled: true },
        },
      },
      resolve: {
        alias: {
          '@iScheduler': path.resolve(__dirname, '../src'),
        },
      },
    }),
};

export default config;
```

Changes: line 10 adds `'../src/stories/**/*.mdx'` glob, line 11 adds `'@storybook/addon-docs'`.

- [ ] **Step 2: Verify Storybook starts**

Run: `npx storybook dev -p 6006 --no-open`
Expected: Storybook starts without errors. The Docs tab now appears on component pages.

- [ ] **Step 3: Commit**

```bash
git add .storybook/main.ts
git commit -m "feat(storybook): enable addon-docs and MDX story glob"
```

---

### Task 2: Configure preview with sidebar sort and docs parameters

**Files:**

- Modify: `.storybook/preview.tsx:1-19`

- [ ] **Step 1: Update preview.tsx**

Replace the current config:

```tsx
import type { Preview } from '@storybook/react';
import { ConfigProvider } from 'antd';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'padded',
    docs: {
      source: { type: 'auto' },
    },
    options: {
      storySort: {
        order: [
          'Guides',
          [
            'Getting Started',
            'Firebase Integration',
            'TanStack Query',
            'i18n & Translations',
            'Types Reference',
            'Contributing',
          ],
          'Components',
          'Playground',
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <ConfigProvider warning={{ strict: false }}>
        <Story />
      </ConfigProvider>
    ),
  ],
};

export default preview;
```

Changes: added `parameters.docs.source` for auto source display, added `options.storySort` with the sidebar ordering.

- [ ] **Step 2: Verify Storybook loads with new config**

Run: `npx storybook dev -p 6006 --no-open`
Expected: Storybook starts without errors.

- [ ] **Step 3: Commit**

```bash
git add .storybook/preview.tsx
git commit -m "feat(storybook): add sidebar sort order for Guides > Components > Playground"
```

---

### Task 3: Add JSDoc to SchedulerProviderProps and SchedulerContextValue

**Files:**

- Modify: `src/provider/SchedulerProvider.tsx:7-22`
- Modify: `src/provider/SchedulerContext.ts:5-27`

- [ ] **Step 1: Add JSDoc to SchedulerProviderProps**

Replace lines 7-22 of `src/provider/SchedulerProvider.tsx`:

```ts
export interface SchedulerProviderProps {
  /** Scheduler data grouped by type (SALE, DISCOUNT, TRIAL_DISCOUNT) */
  schedulers: Record<ESchedulerPrefix, IScheduler[]>;
  /** Show a global loading state across all child components. @default false */
  loading?: boolean;
  /** Disable all interactions in child components. @default false */
  disabled?: boolean;
  /** Locale code passed to child components (e.g. `"en-US"`) */
  locale?: string;
  /** Called when a new scheduler is created via the drawer form */
  onCreate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  /** Called when an existing scheduler is updated via the edit drawer */
  onUpdate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  /** Called when a scheduler is deleted from the list */
  onDelete?: (type: ESchedulerPrefix, schedulerId: string) => Promise<void>;
  /** Permission flags controlling which CRUD actions are available. All default to `true`. */
  permissions?: {
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
  };
  /** Override default English translations. Merged with built-in defaults. */
  translations?: Partial<SchedulerTranslations>;
  /** Child components that consume the scheduler context */
  children: React.ReactNode;
}
```

- [ ] **Step 2: Add JSDoc to SchedulerContextValue**

Replace lines 5-27 of `src/provider/SchedulerContext.ts`:

```ts
export interface SchedulerContextValue {
  /** Scheduler data grouped by type */
  schedulers: Record<ESchedulerPrefix, IScheduler[]>;
  /** Global loading state */
  loading: boolean;
  /** Global disabled state */
  disabled: boolean;
  /** Permission flags for CRUD operations */
  permissions: {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  };
  /** Translation function — call as `t('key')` or `t('key', { var: value })` */
  t: TFn;
  /** Locale code (e.g. `"en-US"`) */
  locale?: string;

  // CRUD callbacks
  /** Create a new scheduler */
  onCreate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  /** Update an existing scheduler */
  onUpdate?: (type: ESchedulerPrefix, scheduler: IScheduler) => Promise<void>;
  /** Delete a scheduler by ID */
  onDelete?: (type: ESchedulerPrefix, schedulerId: string) => Promise<void>;

  // Internal drawer state
  /** Whether the create/edit drawer is currently open */
  drawerOpen: boolean;
  /** Toggle the drawer open/closed */
  setDrawerOpen: (open: boolean) => void;
  /** Arbitrary config passed to the drawer */
  drawerConfig: Record<string, unknown>;
  /** Update the drawer config */
  setDrawerConfig: (config: Record<string, unknown>) => void;
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc -p tsconfig.build.json --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/provider/SchedulerProvider.tsx src/provider/SchedulerContext.ts
git commit -m "docs: add JSDoc to SchedulerProviderProps and SchedulerContextValue"
```

---

### Task 4: Add JSDoc to component prop types

**Files:**

- Modify: `src/components/Scheduler.tsx:27-37`
- Modify: `src/components/SchedulersList.tsx:29-36`
- Modify: `src/components/SchedulerDrawerButton.tsx:18-22`

- [ ] **Step 1: Add JSDoc to TSchedulerProps**

Replace lines 27-37 of `src/components/Scheduler.tsx`:

```ts
type TSchedulerProps = {
  /** Ant Design form instance for managing form state */
  formRef: FormInstance;
  /** Form field name prefix (e.g. `['scheduler', 'sale']`) */
  prefix: string[];
  /** Existing scheduler data for edit mode. Pass `null` for create mode. */
  entity?: IScheduler | null;
  /** Called when the form is submitted */
  onFinish?: (values: unknown) => void;
  /** Disable all form fields. @default false */
  disabled?: boolean;
  /** Field names that should be read-only (e.g. `['discount.value']`). @default [] */
  readOnlyFields?: string[];
  /** Scheduler type — determines which fields are shown (e.g. discount fields for DISCOUNT/TRIAL_DISCOUNT) */
  schedulerType: ESchedulerPrefix;
  /** Available discount type options. Only used when `schedulerType` is DISCOUNT or TRIAL_DISCOUNT. @default [] */
  discountTypes?: (keyof typeof EDiscountType)[];
  /** Available duration type options (HOUR, DAY, WEEK, MONTH, YEAR, FOREVER). @default [] */
  durationTypes?: (keyof typeof EDurationTypes)[];
};
```

- [ ] **Step 2: Add JSDoc to SchedulersListProps**

Replace lines 29-36 of `src/components/SchedulersList.tsx`:

```ts
export type SchedulersListProps = {
  /** Which scheduler type to display (SALE, DISCOUNT, or TRIAL_DISCOUNT) */
  type: ESchedulerPrefix;
  /** Section title shown in the edit drawer header */
  title?: string;
  /** Override provider-level disabled state */
  disabled?: boolean;
  /** Field names that should be read-only in the edit form. @default [] */
  readOnlyFields?: string[];
  /** Currency for discount value display (e.g. `"USD"`). Only relevant for DISCOUNT types. */
  currency?: keyof typeof ECurrency;
  /** Called after any CRUD operation completes (create, update, or delete) */
  onRefresh?: () => void;
};
```

- [ ] **Step 3: Add JSDoc to SchedulerDrawerButtonProps**

Replace lines 18-22 of `src/components/SchedulerDrawerButton.tsx`:

```ts
export type SchedulerDrawerButtonProps = {
  /** Scheduler type — determines form fields and default values */
  schedulerType: ESchedulerPrefix;
  /** Disable the create button. Shows a tooltip with the limit message when disabled. */
  disabled?: boolean;
  /** Called after a scheduler is successfully created via the drawer form */
  onSuccess?: (scheduler: IScheduler) => void;
};
```

- [ ] **Step 4: Verify build**

Run: `npx tsc -p tsconfig.build.json --noEmit`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Scheduler.tsx src/components/SchedulersList.tsx src/components/SchedulerDrawerButton.tsx
git commit -m "docs: add JSDoc to Scheduler, SchedulersList, and SchedulerDrawerButton props"
```

---

### Task 5: Add docs descriptions to story files

**Files:**

- Modify: `src/stories/Scheduler.stories.tsx`
- Modify: `src/stories/SchedulersList.stories.tsx`
- Modify: `src/stories/SchedulerDrawerButton.stories.tsx`
- Modify: `src/stories/Playground.stories.tsx`

- [ ] **Step 1: Update Scheduler.stories.tsx**

Replace the meta object (lines 27-37):

```ts
const meta: Meta = {
  title: 'Components/Scheduler',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The main scheduling form. Renders duration, start date, repeat behavior (weekly/monthly/yearly), and end reason fields. For DISCOUNT and TRIAL_DISCOUNT types, also shows discount type and value fields. Must be wrapped in a `SchedulerProvider`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={emptySchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
};
```

Add descriptions to each story:

```ts
export const SaleScheduler: Story = {
  render: () => <SchedulerWithForm schedulerType={ESchedulerPrefix.SALE} />,
  parameters: {
    docs: {
      description: {
        story: 'Sale scheduler form — shows duration, repeat, start date, and end reason fields. No discount fields.',
      },
    },
  },
};

export const DiscountScheduler: Story = {
  render: () => <SchedulerWithForm schedulerType={ESchedulerPrefix.DISCOUNT} />,
  parameters: {
    docs: {
      description: {
        story: 'Discount scheduler form — same as sale but with additional discount type (Percent/Fixed) and value fields.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => <SchedulerWithForm schedulerType={ESchedulerPrefix.SALE} disabled />,
  parameters: {
    docs: {
      description: {
        story: 'All form fields disabled. Use for read-only display of scheduler configuration.',
      },
    },
  },
};
```

- [ ] **Step 2: Update SchedulersList.stories.tsx**

Replace the meta object (lines 12-16):

```ts
const meta: Meta<typeof SchedulersList> = {
  title: 'Components/SchedulersList',
  component: SchedulersList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Table of schedulers with edit/delete actions, column visibility toggle, and a create button in the toolbar. Wrap with `SchedulerProvider` to supply data, callbacks, and permissions.',
      },
    },
  },
};
```

Add descriptions to each story:

```ts
export const Empty: Story = {
  args: { type: ESchedulerPrefix.SALE },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={emptySchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Empty state — no schedulers exist yet. The create button is available in the toolbar.',
      },
    },
  },
};

export const WithSaleSchedulers: Story = {
  args: { type: ESchedulerPrefix.SALE },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={populatedSchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Populated with sale schedulers. Click a row\'s edit action to open the edit drawer.',
      },
    },
  },
};

export const WithDiscountSchedulers: Story = {
  args: { type: ESchedulerPrefix.DISCOUNT, currency: ECurrency.USD },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={populatedSchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Discount schedulers with USD currency display. The discount column shows type and value.',
      },
    },
  },
};

export const ReadOnly: Story = {
  args: { type: ESchedulerPrefix.SALE, disabled: true },
  decorators: [
    (Story) => (
      <SchedulerProvider
        schedulers={populatedSchedulers}
        disabled
        permissions={{ canCreate: false, canUpdate: false, canDelete: false }}
      >
        <Story />
      </SchedulerProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Read-only mode — all permissions disabled, no create/edit/delete actions shown.',
      },
    },
  },
};
```

- [ ] **Step 3: Update SchedulerDrawerButton.stories.tsx**

Replace the meta object (lines 8-18):

```ts
const meta: Meta<typeof SchedulerDrawerButton> = {
  title: 'Components/SchedulerDrawerButton',
  component: SchedulerDrawerButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Button that opens a drawer with the scheduler creation form. Automatically hidden when `canCreate` permission is `false`. Must be wrapped in a `SchedulerProvider`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <SchedulerProvider schedulers={emptySchedulers} {...mockCrudCallbacks}>
        <Story />
      </SchedulerProvider>
    ),
  ],
};
```

Add descriptions to each story:

```ts
export const Sale: Story = {
  args: { schedulerType: ESchedulerPrefix.SALE },
  parameters: {
    docs: {
      description: {
        story: 'Opens a drawer with the sale scheduler creation form.',
      },
    },
  },
};

export const Discount: Story = {
  args: { schedulerType: ESchedulerPrefix.DISCOUNT },
  parameters: {
    docs: {
      description: {
        story:
          'Opens a drawer with the discount scheduler form, including discount type and value fields.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { schedulerType: ESchedulerPrefix.SALE, disabled: true },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state — shows a tooltip with the scheduler limit message.',
      },
    },
  },
};
```

- [ ] **Step 4: Update Playground.stories.tsx**

Replace the meta object (lines 84-87):

```ts
const meta: Meta = {
  title: 'Playground',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Interactive playground with all three scheduler types (Sale, Discount, Trial Discount) and working CRUD operations. State is managed locally — open the browser console to see callback logs.',
      },
    },
  },
};
```

Add description to the FullDemo story:

```ts
export const FullDemo: Story = {
  render: () => <PlaygroundDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Full interactive demo with Sale, Discount, and Trial Discount schedulers. Create, edit, and delete schedulers — state updates in real time. Check the browser console for callback logs.',
      },
    },
  },
};
```

- [ ] **Step 5: Verify Storybook builds**

Run: `npx storybook build --quiet 2>&1 | tail -5`
Expected: Build completes without errors.

- [ ] **Step 6: Commit**

```bash
git add src/stories/Scheduler.stories.tsx src/stories/SchedulersList.stories.tsx src/stories/SchedulerDrawerButton.stories.tsx src/stories/Playground.stories.tsx
git commit -m "docs(storybook): add component and story descriptions for addon-docs"
```

---

### Task 6: Create Getting Started MDX page

**Files:**

- Create: `src/stories/docs/GettingStarted.mdx`

- [ ] **Step 1: Create the file**

````mdx
import { Meta } from '@storybook/blocks';

<Meta title="Guides/Getting Started" />

# Getting Started

## Installation

```bash
npm install @teamco/ischeduler
# or
yarn add @teamco/ischeduler
```
````

## Peer Dependencies

Make sure your project has these installed:

```bash
npm install react react-dom antd dayjs @ant-design/icons
```

| Package             | Version  |
| ------------------- | -------- |
| `react`             | ^19.2.4  |
| `react-dom`         | ^19.2.4  |
| `antd`              | ^6.3.3   |
| `dayjs`             | ^1.11.20 |
| `@ant-design/icons` | ^6.1.0   |

## Quick Start

Wrap your scheduler UI with `SchedulerProvider` and use `SchedulersList` to render tables:

```tsx
import { useState, useCallback } from 'react';
import {
  SchedulerProvider,
  SchedulersList,
  ESchedulerPrefix,
  type IScheduler,
} from '@teamco/ischeduler';
import '@teamco/ischeduler/dist/ischeduler.css';

function SchedulerPage() {
  const [schedulers, setSchedulers] = useState({
    [ESchedulerPrefix.SALE]: [] as IScheduler[],
    [ESchedulerPrefix.DISCOUNT]: [] as IScheduler[],
    [ESchedulerPrefix.TRIAL_DISCOUNT]: [] as IScheduler[],
  });

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
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

## Next Steps

- See the **[Playground](?path=/story/playground--full-demo)** for a live interactive demo
- Check **[Firebase Integration](?path=/docs/guides-firebase-integration--docs)** or **[TanStack Query](?path=/docs/guides-tanstack-query--docs)** for backend integration patterns
- Browse the **[Types Reference](?path=/docs/guides-types-reference--docs)** for all exported enums and interfaces

````

- [ ] **Step 2: Verify it appears in Storybook sidebar**

Run: `npx storybook dev -p 6006 --no-open`
Expected: "Guides > Getting Started" appears in the sidebar.

- [ ] **Step 3: Commit**

```bash
git add src/stories/docs/GettingStarted.mdx
git commit -m "docs(storybook): add Getting Started guide page"
````

---

### Task 7: Create Firebase Integration MDX page

**Files:**

- Create: `src/stories/docs/FirebaseIntegration.mdx`

- [ ] **Step 1: Create the file**

````mdx
import { Meta } from '@storybook/blocks';

<Meta title="Guides/Firebase Integration" />

# Firebase / Firestore Integration

iScheduler uses `dayjs` for all date values. If your backend uses Firebase Timestamps, you need to convert between the two formats.

## Conversion Helpers

```tsx
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

// Firestore Timestamp → dayjs (when reading from Firestore)
const toDayjs = (ts: Timestamp) => dayjs(ts.toDate());

// dayjs → Firestore Timestamp (when writing to Firestore)
const toTimestamp = (d: dayjs.Dayjs) => Timestamp.fromDate(d.toDate());
```
````

## Converting Scheduler Data

Convert scheduler date fields before passing data to the provider:

```tsx
import type { IScheduler } from '@teamco/ischeduler';

// Raw Firestore document → IScheduler
const convertScheduler = (raw: FirestoreScheduler): IScheduler => ({
  ...raw,
  range: {
    startedAt: toDayjs(raw.range.startedAt),
    endReason: {
      ...raw.range.endReason,
      expiredAt: raw.range.endReason.expiredAt ? toDayjs(raw.range.endReason.expiredAt) : null,
    },
  },
});
```

## Writing Back to Firestore

When saving, convert dayjs values back to Timestamps in your `onCreate` / `onUpdate` callbacks:

```tsx
const toFirestoreScheduler = (scheduler: IScheduler) => ({
  ...scheduler,
  range: {
    startedAt: toTimestamp(scheduler.range.startedAt as dayjs.Dayjs),
    endReason: {
      ...scheduler.range.endReason,
      expiredAt: scheduler.range.endReason.expiredAt
        ? toTimestamp(scheduler.range.endReason.expiredAt as dayjs.Dayjs)
        : null,
    },
  },
});

// In your SchedulerProvider callbacks:
const onCreate = async (type, scheduler) => {
  const doc = toFirestoreScheduler(scheduler);
  await addDoc(collection(db, 'schedulers'), doc);
};
```

````

- [ ] **Step 2: Commit**

```bash
git add src/stories/docs/FirebaseIntegration.mdx
git commit -m "docs(storybook): add Firebase Integration guide page"
````

---

### Task 8: Create TanStack Query MDX page

**Files:**

- Create: `src/stories/docs/TanStackQuery.mdx`

- [ ] **Step 1: Create the file**

````mdx
import { Meta } from '@storybook/blocks';

<Meta title="Guides/TanStack Query" />

# TanStack Query Integration

Wire iScheduler's CRUD callbacks to TanStack Query mutations for automatic cache invalidation and optimistic updates.

## Custom Hook

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ESchedulerPrefix, IScheduler } from '@teamco/ischeduler';

function useSchedulerData(entityId: string) {
  const queryClient = useQueryClient();

  const { data: schedulers, isLoading } = useQuery({
    queryKey: ['schedulers', entityId],
    queryFn: () => fetchSchedulers(entityId),
  });

  const createMutation = useMutation({
    mutationFn: ({ type, scheduler }: { type: ESchedulerPrefix; scheduler: IScheduler }) =>
      createScheduler(entityId, type, scheduler),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers', entityId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ type, scheduler }: { type: ESchedulerPrefix; scheduler: IScheduler }) =>
      updateScheduler(entityId, type, scheduler),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers', entityId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: ESchedulerPrefix; id: string }) =>
      deleteScheduler(entityId, type, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedulers', entityId] }),
  });

  return {
    schedulers,
    isLoading,
    onCreate: (type: ESchedulerPrefix, scheduler: IScheduler) =>
      createMutation.mutateAsync({ type, scheduler }),
    onUpdate: (type: ESchedulerPrefix, scheduler: IScheduler) =>
      updateMutation.mutateAsync({ type, scheduler }),
    onDelete: (type: ESchedulerPrefix, id: string) => deleteMutation.mutateAsync({ type, id }),
  };
}
```
````

## Usage with SchedulerProvider

```tsx
import { SchedulerProvider, SchedulersList, ESchedulerPrefix } from '@teamco/ischeduler';

function SchedulerPage({ entityId }: { entityId: string }) {
  const { schedulers, isLoading, onCreate, onUpdate, onDelete } = useSchedulerData(entityId);

  if (!schedulers) return null;

  return (
    <SchedulerProvider
      schedulers={schedulers}
      loading={isLoading}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
    >
      <SchedulersList type={ESchedulerPrefix.SALE} />
      <SchedulersList type={ESchedulerPrefix.DISCOUNT} currency="USD" />
    </SchedulerProvider>
  );
}
```

````

- [ ] **Step 2: Commit**

```bash
git add src/stories/docs/TanStackQuery.mdx
git commit -m "docs(storybook): add TanStack Query guide page"
````

---

### Task 9: Create Translations MDX page

**Files:**

- Create: `src/stories/docs/Translations.mdx`

- [ ] **Step 1: Create the file**

````mdx
import { Meta } from '@storybook/blocks';

<Meta title="Guides/i18n & Translations" />

# i18n & Translations

iScheduler ships with English translations built in. Override any key via the `translations` prop on `SchedulerProvider`.

## How It Works

1. Pass a `translations` object to `SchedulerProvider`
2. Your overrides are merged with the built-in English defaults
3. Components call `t('key')` to resolve translations at render time

```tsx
<SchedulerProvider
  translations={{
    scheduler: 'Planificador',
    'scheduler.startedAt': 'Fecha de inicio',
    'scheduler.duration': 'Repetir cada',
    'scheduler.weekdays.monday': 'Lunes',
    // ... override as many keys as needed
  }}
>
  {/* components use translated strings */}
</SchedulerProvider>
```
````

## Variable Interpolation

Translation values support `{{variable}}` interpolation:

```
"scheduler.header.title": "{{entity}} Scheduler ({{count}})"
"scheduler.result": "Occurs <strong>{{occurs}}</strong>, starting {{startAt}}."
"scheduler.limited": "The Scheduler is limited to: {{limit}}"
```

Usage in code: `t('scheduler.header.title', { entity: 'Product', count: 3 })`

## Accessing All Keys

Import `defaultTranslations` to see every available key:

```tsx
import { defaultTranslations } from '@teamco/ischeduler';
console.log(Object.keys(defaultTranslations));
```

## All Translation Keys

| Key                                  | Default (English)                               |
| ------------------------------------ | ----------------------------------------------- |
| `scheduler`                          | Scheduler                                       |
| `scheduler.info`                     | Scheduler Info                                  |
| `scheduler.header.title`             | {{entity}} Scheduler ({{count}})                |
| `scheduler.result`                   | Occurs **{{occurs}}**, starting {{startAt}}.    |
| `scheduler.startedAt`                | Started at                                      |
| `scheduler.updatedAt`                | Updated at                                      |
| `scheduler.status`                   | Status                                          |
| `scheduler.duration`                 | Repeat Every                                    |
| `scheduler.occurrences`              | Occurrences                                     |
| `scheduler.duration.end`             | End Reason                                      |
| `scheduler.duration.endDate`         | End Date                                        |
| `scheduler.duration.end.day`         | On this day                                     |
| `scheduler.duration.end.after`       | After                                           |
| `scheduler.duration.end.no`          | No end day                                      |
| `scheduler.weekdays.sunday`          | Sunday                                          |
| `scheduler.weekdays.monday`          | Monday                                          |
| `scheduler.weekdays.tuesday`         | Tuesday                                         |
| `scheduler.weekdays.wednesday`       | Wednesday                                       |
| `scheduler.weekdays.thursday`        | Thursday                                        |
| `scheduler.weekdays.friday`          | Friday                                          |
| `scheduler.weekdays.saturday`        | Saturday                                        |
| `scheduler.weekdays.short.sunday`    | Sun                                             |
| `scheduler.weekdays.short.monday`    | Mon                                             |
| `scheduler.weekdays.short.tuesday`   | Tue                                             |
| `scheduler.weekdays.short.wednesday` | Wed                                             |
| `scheduler.weekdays.short.thursday`  | Thu                                             |
| `scheduler.weekdays.short.friday`    | Fri                                             |
| `scheduler.weekdays.short.saturday`  | Sat                                             |
| `scheduler.months.january`           | January                                         |
| `scheduler.months.february`          | February                                        |
| `scheduler.months.march`             | March                                           |
| `scheduler.months.april`             | April                                           |
| `scheduler.months.may`               | May                                             |
| `scheduler.months.june`              | June                                            |
| `scheduler.months.july`              | July                                            |
| `scheduler.months.august`            | August                                          |
| `scheduler.months.september`         | September                                       |
| `scheduler.months.october`           | October                                         |
| `scheduler.months.november`          | November                                        |
| `scheduler.months.december`          | December                                        |
| `scheduler.months.short.january`     | Jan                                             |
| `scheduler.months.short.february`    | Feb                                             |
| `scheduler.months.short.march`       | Mar                                             |
| `scheduler.months.short.april`       | Apr                                             |
| `scheduler.months.short.may`         | May                                             |
| `scheduler.months.short.june`        | Jun                                             |
| `scheduler.months.short.july`        | Jul                                             |
| `scheduler.months.short.august`      | Aug                                             |
| `scheduler.months.short.september`   | Sep                                             |
| `scheduler.months.short.october`     | Oct                                             |
| `scheduler.months.short.november`    | Nov                                             |
| `scheduler.months.short.december`    | Dec                                             |
| `scheduler.separator.and`            | and                                             |
| `scheduler.separator.on`             | on                                              |
| `scheduler.separator.day`            | day                                             |
| `scheduler.separator.every`          | every                                           |
| `scheduler.separator.of`             | of                                              |
| `scheduler.separator.the`            | the                                             |
| `scheduler.day.first`                | First                                           |
| `scheduler.day.second`               | Second                                          |
| `scheduler.day.third`                | Third                                           |
| `scheduler.day.fourth`               | Fourth                                          |
| `scheduler.day.last`                 | Last                                            |
| `scheduler.weekday`                  | Weekday                                         |
| `scheduler.weekend`                  | Weekend Day                                     |
| `scheduler.day`                      | Day                                             |
| `scheduler.days`                     | Days                                            |
| `scheduler.week`                     | Week                                            |
| `scheduler.weeks`                    | Weeks                                           |
| `scheduler.year`                     | Year                                            |
| `scheduler.years`                    | Years                                           |
| `scheduler.monthDay`                 | Month Day                                       |
| `scheduler.month`                    | Month                                           |
| `scheduler.months`                   | Months                                          |
| `scheduler.actions.manage`           | Manage Scheduler                                |
| `scheduler.meta.assignedTo`          | Assigned To                                     |
| `scheduler.meta.duration`            | Duration                                        |
| `scheduler.meta.period`              | Period                                          |
| `scheduler.limited`                  | The Scheduler is limited to: {{limit}}          |
| `scheduler.info.helper`              | Set the scheduler to set a sale period.         |
| `table.actions`                      | Actions                                         |
| `actions.edit`                       | Edit                                            |
| `actions.delete`                     | Delete                                          |
| `actions.save`                       | Save                                            |
| `actions.update`                     | Update                                          |
| `actions.cancel`                     | Cancel                                          |
| `actions.confirm.delete`             | Are you sure you want to delete this scheduler? |
| `table.hideColumns`                  | Hide Columns                                    |
| `toolbar.refresh`                    | Refresh                                         |

````

- [ ] **Step 2: Commit**

```bash
git add src/stories/docs/Translations.mdx
git commit -m "docs(storybook): add i18n & Translations guide page"
````

---

### Task 10: Create Types Reference MDX page

**Files:**

- Create: `src/stories/docs/TypesReference.mdx`

- [ ] **Step 1: Create the file**

````mdx
import { Meta } from '@storybook/blocks';

<Meta title="Guides/Types Reference" />

# Types Reference

All public types are exported from `@teamco/ischeduler`. Only consumer-facing types are documented here; internal utility types are intentionally omitted.

## Enums

### ESchedulerPrefix

The three scheduler categories:

```ts
enum ESchedulerPrefix {
  SALE = 'sale',
  DISCOUNT = 'discount',
  TRIAL_DISCOUNT = 'trialDiscount',
}
```
````

### EDurationTypes

Repeat interval units:

```ts
enum EDurationTypes {
  HOUR = 'Hour',
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year',
  FOREVER = 'Forever',
}
```

### EDiscountType

Discount calculation method:

```ts
enum EDiscountType {
  PERCENT = 'Percent',
  FIXED = 'Fixed',
}
```

### ECurrency

Supported currencies:

```ts
enum ECurrency {
  USD = 'USD',
  EUR = 'EUR',
}
```

### EEndReasonType

How a scheduler's range ends:

```ts
enum EEndReasonType {
  DATE = 'Date', // Ends on a specific date
  NUMBER = 'Number', // Ends after N occurrences
  FOREVER = 'Forever', // Never ends
}
```

### EStatus

Scheduler lifecycle status:

```ts
enum EStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
  DELETED = 'DELETED',
  PROCESSING = 'PROCESSING',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
}
```

### EDays

Days of the week:

```ts
enum EDays {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
}
```

### EMonths

Months of the year:

```ts
enum EMonths {
  JANUARY = 'January',
  FEBRUARY = 'February',
  MARCH = 'March',
  APRIL = 'April',
  MAY = 'May',
  JUNE = 'June',
  JULY = 'July',
  AUGUST = 'August',
  SEPTEMBER = 'September',
  OCTOBER = 'October',
  NOVEMBER = 'November',
  DECEMBER = 'December',
}
```

### EWeekDays

Ordinal week day positions (for monthly repeat rules):

```ts
enum EWeekDays {
  FIRST = 'First',
  SECOND = 'Second',
  THIRD = 'Third',
  FOURTH = 'Fourth',
  LAST = 'Last',
}
```

## Interfaces

### IScheduler

The main scheduler object:

```ts
interface IScheduler {
  id?: string;
  type: ESchedulerPrefix;
  duration: TSchedulerDuration;
  repeat: TSchedulerRepeat;
  range: TSchedulerRange;
  discount?: TDiscount | null;
  status?: EStatus;
  metadata?: ISchedulerMetadata;
}
```

### TSchedulerDuration

How often the scheduler repeats:

```ts
type TSchedulerDuration = {
  type: keyof typeof EDurationTypes; // e.g. 'WEEK', 'MONTH'
  period: number; // e.g. 2 (every 2 weeks)
};
```

### TSchedulerRange

Start and end configuration:

```ts
type TSchedulerRange = {
  startedAt: dayjs.Dayjs | string;
  endReason: {
    type: EEndReasonType;
    expiredAt: dayjs.Dayjs | string | null;
  };
};
```

### TSchedulerRepeat

Repeat rules for weekly, monthly, and yearly patterns:

```ts
type TSchedulerRepeat = {
  weekly: {
    days: (keyof typeof EDays)[]; // e.g. ['MONDAY', 'WEDNESDAY', 'FRIDAY']
  };
  monthly: {
    weekDay?: keyof typeof EWeekDays; // e.g. 'FIRST'
    monthDay?: number; // e.g. 15
    type: 'DAY' | 'PERIOD';
  };
  yearly: {
    months?: (keyof typeof EMonths)[]; // e.g. ['JANUARY', 'JULY']
  };
};
```

### TDiscount

Discount configuration (for DISCOUNT and TRIAL_DISCOUNT types):

```ts
type TDiscount = {
  type: TDiscountType; // 'PERCENT' | 'FIXED'
  value: number; // e.g. 15 (meaning 15% or $15)
};
```

## Default Objects

### DEFAULT_SALE_SCHEDULER

Template used when creating a new sale scheduler. Includes sensible defaults for duration, repeat rules, and range.

### DEFAULT_DISCOUNT_SCHEDULER

Template used when creating a new discount scheduler. Same as sale but includes a default discount of 1%.

````

- [ ] **Step 2: Commit**

```bash
git add src/stories/docs/TypesReference.mdx
git commit -m "docs(storybook): add Types Reference guide page"
````

---

### Task 11: Create Contributing MDX page

**Files:**

- Create: `src/stories/docs/Contributing.mdx`

- [ ] **Step 1: Create the file**

````mdx
import { Meta } from '@storybook/blocks';

<Meta title="Guides/Contributing" />

# Contributing

## Getting Started

```bash
# Clone the repo
git clone https://github.com/teamco/ischeduler.git
cd ischeduler

# Install dependencies
npm install

# Start Storybook dev server
npm run storybook
```
````

## Development Commands

| Command                   | Description                                |
| ------------------------- | ------------------------------------------ |
| `npm run dev`             | Vite dev server                            |
| `npm run build`           | Production build (TypeScript check + Vite) |
| `npm run test`            | Run all tests                              |
| `npm run test:watch`      | Tests in watch mode                        |
| `npm run lint`            | ESLint                                     |
| `npm run format`          | Prettier                                   |
| `npm run storybook`       | Storybook dev server on port 6006          |
| `npm run build-storybook` | Static Storybook build                     |

## Code Standards

- **TypeScript** with strict mode enabled
- **React** functional components with hooks
- **Ant Design** 6+ for all UI components
- **Less** CSS modules for styling (`.module.less`)
- Follow existing patterns in the codebase

## Testing

All changes must include tests:

- Unit tests for utilities and handlers
- Component tests for UI components
- Run `npm run test` to verify all tests pass before submitting

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | Use for               |
| ----------- | --------------------- |
| `feat:`     | New features          |
| `fix:`      | Bug fixes             |
| `docs:`     | Documentation changes |
| `test:`     | Test changes          |
| `refactor:` | Code restructuring    |
| `chore:`    | Maintenance tasks     |

## Pull Request Process

1. Update tests and ensure they pass
2. Run `npm run lint` and fix any issues
3. Run `npm run build` to verify the build succeeds
4. Write a clear PR description explaining what and why
5. Reference any related issues

````

- [ ] **Step 2: Commit**

```bash
git add src/stories/docs/Contributing.mdx
git commit -m "docs(storybook): add Contributing guide page"
````

---

### Task 12: Slim the README

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Replace README.md**

Keep: badges, description, screenshots, installation, peer deps, quick start, dev commands, license.
Remove: Firebase, TanStack Query, API Reference, i18n, project structure, Storybook section, version bumps.
Add: link to Storybook for full docs.

Replace the entire file with the content below. This keeps: badges, description, screenshots, installation, peer deps, quick start, dev commands, license. Removes: Firebase, TanStack Query, API Reference, i18n, project structure, Storybook, version bumps. Adds: Documentation link to Storybook.

The new README content (everything between the `---README START---` and `---README END---` markers):

---README START---
[![Bump Version](https://github.com/teamco/ischeduler/actions/workflows/version.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/version.yml)
[![Deploy Storybook](https://github.com/teamco/ischeduler/actions/workflows/storybook.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/storybook.yml)
[![Publish to npm](https://github.com/teamco/ischeduler/actions/workflows/publish.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/publish.yml)
[![CodeQL Advanced](https://github.com/teamco/ischeduler/actions/workflows/codeql.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/codeql.yml)
[![ESLint](https://github.com/teamco/ischeduler/actions/workflows/eslint.yml/badge.svg)](https://github.com/teamco/ischeduler/actions/workflows/eslint.yml)

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

| Package             | Version  |
| ------------------- | -------- |
| `react`             | ^19.2.4  |
| `react-dom`         | ^19.2.4  |
| `antd`              | ^6.3.3   |
| `dayjs`             | ^1.11.20 |
| `@ant-design/icons` | ^6.1.0   |

## Quick Start

```tsx
import { useState, useCallback } from 'react';
import { SchedulerProvider, SchedulersList, ESchedulerPrefix, type IScheduler } from 'ischeduler';
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
---README END---

- [ ] **Step 2: Verify README renders correctly**

Review the new README to ensure markdown formatting is correct and all links work.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: slim README, link to Storybook for full documentation"
```

---

### Task 13: Final verification

- [ ] **Step 1: Run full Storybook build**

Run: `npm run build-storybook`
Expected: Build completes without errors.

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc -p tsconfig.build.json --noEmit`
Expected: No errors.

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: All tests pass (JSDoc and story descriptions are non-functional changes).

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: No new lint errors.

- [ ] **Step 5: Verify library build**

Run: `npm run build`
Expected: Build completes without errors. Confirms JSDoc/story changes don't break the npm package output.

- [ ] **Step 6: Manual verification**

Start Storybook: `npm run storybook`

Verify:

- Sidebar shows: Guides (6 pages) > Components (3) > Playground (1)
- Each Guides page renders with correct content
- Each Component Docs tab shows: description, ArgTypes table, source, stories
- Playground Docs tab shows description
- All story canvases still render correctly
