# Headless Usage Story — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Headless" Storybook section showing how to use iScheduler's drawer/form without the built-in table, outputting raw JSON to a textarea.

**Architecture:** One new story file with two render components (BasicSaleDemo, TypeSelectorDemo) and a sidebar sort update. No library changes.

**Tech Stack:** Storybook 10.3, React, Ant Design (Input.TextArea, Radio.Group), TypeScript

**Spec:** `docs/superpowers/specs/2026-03-22-headless-usage-story-design.md`

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/stories/HeadlessUsage.stories.tsx` | Two stories: BasicSale and WithTypeSelector |
| Modify | `.storybook/preview.tsx:14-26` | Add `'Headless'` to `storySort.order` |

---

### Task 1: Add 'Headless' to sidebar sort order

**Files:**

- Modify: `.storybook/preview.tsx:14-26`

- [ ] **Step 1: Update storySort order**

Add `'Headless'` after `'Playground'` in the `order` array:

```ts
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
    'Headless',
  ],
},
```

- [ ] **Step 2: Commit**

```bash
git add .storybook/preview.tsx
git commit -m "feat(storybook): add Headless to sidebar sort order"
```

---

### Task 2: Create HeadlessUsage.stories.tsx with both stories

**Files:**

- Create: `src/stories/HeadlessUsage.stories.tsx`

- [ ] **Step 1: Create the story file**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import { Input, Radio, Typography } from 'antd';
import React from 'react';
import { SchedulerProvider } from '@iScheduler/provider/SchedulerProvider';
import { SchedulerDrawerButton } from '@iScheduler/components/SchedulerDrawerButton';
import { ESchedulerPrefix, type IScheduler } from '@iScheduler/types';
import { emptySchedulers } from './mocks/scheduler.mocks';

const { Paragraph } = Typography;

const BasicSaleDemo = () => {
  const [lastSaved, setLastSaved] = useState<IScheduler | null>(null);
  const [dirty, setDirty] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Headless] onCreate:', type, scheduler);
  }, []);

  return (
    <SchedulerProvider schedulers={emptySchedulers} onCreate={onCreate}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <Paragraph>
          Click the button to open the scheduler form. After saving, the JSON output appears below.
        </Paragraph>
        <div style={{ marginBottom: 16 }}>
          <SchedulerDrawerButton
            schedulerType={ESchedulerPrefix.SALE}
            onSuccess={(s) => setLastSaved(s)}
            dirty={dirty}
            setDirty={setDirty}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        </div>
        <Input.TextArea
          readOnly
          rows={16}
          value={lastSaved ? JSON.stringify(lastSaved, null, 2) : ''}
          placeholder="Saved scheduler JSON will appear here..."
        />
      </div>
    </SchedulerProvider>
  );
};

const TYPE_OPTIONS = [
  { label: 'Sale', value: ESchedulerPrefix.SALE },
  { label: 'Discount', value: ESchedulerPrefix.DISCOUNT },
  { label: 'Trial Discount', value: ESchedulerPrefix.TRIAL_DISCOUNT },
];

const TypeSelectorDemo = () => {
  const [schedulerType, setSchedulerType] = useState<ESchedulerPrefix>(ESchedulerPrefix.SALE);
  const [lastSaved, setLastSaved] = useState<IScheduler | null>(null);
  const [dirty, setDirty] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const onCreate = useCallback(async (type: ESchedulerPrefix, scheduler: IScheduler) => {
    console.log('[Headless] onCreate:', type, scheduler);
  }, []);

  const handleTypeChange = (value: ESchedulerPrefix) => {
    setSchedulerType(value);
    setLastSaved(null);
    setDirty(false);
  };

  return (
    <SchedulerProvider schedulers={emptySchedulers} onCreate={onCreate}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <Paragraph>
          Select a scheduler type, open the form, and save to see the JSON output.
        </Paragraph>
        <div style={{ marginBottom: 16 }}>
          <Radio.Group
            value={schedulerType}
            onChange={(e) => handleTypeChange(e.target.value)}
            options={TYPE_OPTIONS}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <SchedulerDrawerButton
            schedulerType={schedulerType}
            onSuccess={(s) => setLastSaved(s)}
            dirty={dirty}
            setDirty={setDirty}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        </div>
        <Input.TextArea
          readOnly
          rows={16}
          value={lastSaved ? JSON.stringify(lastSaved, null, 2) : ''}
          placeholder="Saved scheduler JSON will appear here..."
        />
      </div>
    </SchedulerProvider>
  );
};

const meta: Meta = {
  title: 'Headless',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Minimal headless example — just a button and JSON output. No table, no list. Use this pattern when you want the scheduler form but your own display logic.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const BasicSale: Story = {
  render: () => <BasicSaleDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Sale scheduler with JSON output. Click the button, fill the form, save — the resulting scheduler JSON appears in the textarea below.',
      },
    },
  },
};

export const WithTypeSelector: Story = {
  render: () => <TypeSelectorDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Switch between scheduler types and see how the JSON output changes. Discount and Trial Discount types include additional discount fields.',
      },
    },
  },
};
```

- [ ] **Step 2: Verify Storybook builds**

Run: `npm run build-storybook 2>&1 | tail -5`
Expected: Build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add src/stories/HeadlessUsage.stories.tsx
git commit -m "feat(storybook): add Headless usage stories with JSON output"
```

---

### Task 3: Verify everything works

- [ ] **Step 1: Run Storybook build**

Run: `npm run build-storybook`
Expected: Build completes without errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No new lint errors.

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: All tests pass (no functional changes).

- [ ] **Step 4: Manual verification**

Start Storybook: `npm run storybook`

Verify:
- Sidebar shows: Guides > Components > Playground > Headless
- Headless/BasicSale: button opens drawer, save shows JSON in textarea
- Headless/WithTypeSelector: radio switches type, button opens correct form, save shows JSON
- Switching type clears the textarea
