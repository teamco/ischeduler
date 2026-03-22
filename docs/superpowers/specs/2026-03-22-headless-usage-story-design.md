# Headless Usage Story — Design Spec

## Summary

Add a new Storybook story file `HeadlessUsage.stories.tsx` demonstrating how to use iScheduler without the built-in table. Shows only a button to open the scheduler drawer and a read-only textarea displaying the saved JSON. Two stories: basic (Sale only) and with type selector.

## Audience

External developers who want to use iScheduler's form/drawer but render their own UI for displaying scheduler data.

## Approach

New story file with two render components. No changes to library components — this is purely a usage example.

---

## 1. Files

| Action | File |
|--------|------|
| Create | `src/stories/HeadlessUsage.stories.tsx` |
| Modify | `.storybook/preview.tsx` — add `'Headless'` to `storySort.order` |

## 2. Sidebar Position

```
Guides/
Components/
Playground/
Headless/           ← new
  BasicSale
  WithTypeSelector
```

Add `'Headless'` after `'Playground'` in `preview.tsx` `storySort.order`.

## 3. Meta Configuration

- `meta.title`: `'Headless'`
- Component-level description: "Minimal headless example — just a button and JSON output. No table, no list. Use this pattern when you want the scheduler form but your own display logic."

## 4. Story 1: BasicSale

Render component `BasicSaleDemo`:

- State: `lastSaved: IScheduler | null` (initially `null`), `dirty: boolean`, `isCreating: boolean`
- `SchedulerProvider` with `emptySchedulers` (from `./mocks/scheduler.mocks`). `permissions` prop omitted (defaults to all `true`)
- Callback wiring: `onCreate` is a no-op async function (just logs to console, as in Playground pattern). The `onSuccess` prop on `SchedulerDrawerButton` is what captures the result into `lastSaved` state. These are two separate callbacks — `onCreate` fires on the provider, `onSuccess` fires on the button.
- `SchedulerDrawerButton` with `schedulerType={ESchedulerPrefix.SALE}`, `onSuccess={(s) => setLastSaved(s)}`
- Below button: `Input.TextArea` (from `antd`), `readOnly`, `rows={16}`, value is `JSON.stringify(lastSaved, null, 2)` or empty string
- Story description: "Sale scheduler with JSON output. Click the button, fill the form, save — the resulting scheduler JSON appears in the textarea below."

## 5. Story 2: WithTypeSelector

Render component `TypeSelectorDemo`:

- State: same as BasicSale + `schedulerType: ESchedulerPrefix` (initially `ESchedulerPrefix.SALE`)
- `Radio.Group` (from `antd`) at top with options mapped from `ESchedulerPrefix`: `{ SALE: 'Sale', DISCOUNT: 'Discount', TRIAL_DISCOUNT: 'Trial Discount' }`
- On type change: reset `lastSaved` to `null`, reset `dirty` to `false`
- Same `SchedulerProvider` + `SchedulerDrawerButton` pattern, but `schedulerType` driven by Radio state
- `Input.TextArea` same as BasicSale
- Story description: "Switch between scheduler types and see how the JSON output changes. Discount and Trial Discount types include additional discount fields."

## 6. Props Wiring

`SchedulerDrawerButton` requires `setDirty`, `dirty`, `isCreating`, `setIsCreating` — all managed as local `useState` in the render components. This mirrors how a real consumer would wire it.

## Out of Scope

- No new library components or exports
- No changes to existing component behavior
- No MDX guide page (story descriptions are sufficient)
