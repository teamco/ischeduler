# Storybook Documentation Enhancement — Design Spec

## Summary

Enhance the iScheduler Storybook to serve as the single source of truth for both external consumers and contributors. Enable `@storybook/addon-docs`, add JSDoc to component props, add story descriptions, and create six standalone MDX guide pages. Slim the README to avoid duplication.

## Audience

- External developers consuming `@teamco/ischeduler` from npm
- Contributors working on the library

## Tech Stack (aligned with package.json)

- Storybook 10.3 (`storybook`, `@storybook/react`, `@storybook/react-vite`, `@storybook/addon-docs`)
- React ^19.2.4, Ant Design ^6.3.3, dayjs ^1.11.20, @ant-design/icons ^6.1.0
- Vite 8, TypeScript ~5.9.3

## Approach

Hybrid: MDX for guide pages, CSF for component stories. Each format used where it's strongest.

---

## 1. Storybook Configuration Changes

### `.storybook/main.ts`

- Add `@storybook/addon-docs` to the `addons` array
- Expand `stories` glob to match both `.stories.tsx` and `.mdx`:
  ```ts
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(ts|tsx)']
  ```

### `.storybook/preview.tsx`

- Add `parameters.docs` for consistent source display
- Add `parameters.options.storySort` to enforce sidebar order:
  ```ts
  storySort: {
    order: [
      'Guides', ['Getting Started', 'Firebase Integration', 'TanStack Query',
                  'i18n & Translations', 'Types Reference', 'Contributing'],
      'Components',
      'Playground',
    ],
  }
  ```

No new npm dependencies required — `@storybook/addon-docs` ^10.3.0 is already installed.

---

## 2. JSDoc on Component Props

Add JSDoc comments to all exported prop interfaces. No runtime changes — documentation comments only.

### Files to annotate:

| File | Interface |
|------|-----------|
| `src/provider/SchedulerProvider.tsx` | `SchedulerProviderProps` |
| `src/provider/SchedulerContext.ts` | `SchedulerContextValue` |
| `src/components/Scheduler.tsx` | `TSchedulerProps` (internal, not exported) |
| `src/components/SchedulersList.tsx` | `SchedulersListProps` |
| `src/components/SchedulerDrawerButton.tsx` | `SchedulerDrawerButtonProps` |

Each prop gets a one-line JSDoc describing its purpose, type context, and default value (if applicable).

---

## 3. Story Descriptions

Add `parameters.docs.description` to all 4 existing story files:

- **Component-level** (`meta.parameters.docs.description.component`): What the component does, when to use it
- **Story-level** (`Story.parameters.docs.description.story`): What the specific variant demonstrates

Files: `Scheduler.stories.tsx`, `SchedulersList.stories.tsx`, `SchedulerDrawerButton.stories.tsx`, `Playground.stories.tsx`

---

## 4. MDX Guide Pages

Six standalone MDX files in `src/stories/docs/`. Each MDX file uses a `<Meta>` import from `@storybook/blocks` to declare its sidebar title:

```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Guides/Getting Started" />
```

### 4.1 `GettingStarted.mdx`
- Installation command
- Peer deps table (React ^19.2.4, Ant Design ^6.3.3, dayjs ^1.11.20, @ant-design/icons ^6.1.0)
- Quick Start code example (SchedulerProvider + SchedulersList)
- Link to Playground story

### 4.2 `FirebaseIntegration.mdx`
- Firestore Timestamp <-> dayjs conversion helpers
- Full `convertScheduler` function example
- When and why you need this

### 4.3 `TanStackQuery.mdx`
- `useSchedulerData` hook example
- Wiring TanStack Query mutations to provider callbacks

### 4.4 `Translations.mdx`
- How i18n works (provider `translations` prop merges with defaults)
- `{{variable}}` interpolation syntax
- Full list of available translation keys
- Override example (Spanish)

### 4.5 `TypesReference.mdx`
- All exported enums: `ESchedulerPrefix`, `EDurationTypes`, `EDiscountType`, `EEndReasonType`, `EDays`, `EMonths`, `EWeekDays`, `EStatus`, `ECurrency`
- Key interfaces: `IScheduler`, `TSchedulerDuration`, `TSchedulerRange`, `TSchedulerRepeat`, `TDiscount`
- Default objects: `DEFAULT_SALE_SCHEDULER`, `DEFAULT_DISCOUNT_SCHEDULER`
- Only consumer-facing types are documented; internal utility types (`TDuration`, `ISchedulerMetadata`, `TScheduler<P>`, `ESchedulerTypeTransform`, etc.) are intentionally omitted

### 4.6 `Contributing.mdx`
- Dev setup commands
- Code standards (TypeScript strict, React functional, Ant Design 6+, Less CSS modules)
- Testing requirements
- Conventional Commits format
- PR process

### Sidebar Structure

```
Guides/
  Getting Started
  Firebase Integration
  TanStack Query
  i18n & Translations
  Types Reference
  Contributing
Components/
  Scheduler
  SchedulersList
  SchedulerDrawerButton
Playground/
  FullDemo
```

---

## 5. README Slimming

Keep:
- Badges
- One-liner description + Storybook demo link
- Installation + peer deps (npm consumers see README, not Storybook)
- Quick Start code example
- Development commands
- License

Remove (replaced by Storybook docs):
- Firebase integration section
- TanStack Query section
- Full API Reference (SchedulerProvider, SchedulersList, SchedulerDrawerButton, Scheduler prop tables)
- i18n / Translations section
- Project structure section
- Storybook section (redundant when Storybook is the docs itself)
- Version bumps section

Add a single link: "See the [Storybook documentation](https://teamco.github.io/ischeduler/) for integration guides, API reference, and examples."

---

## File Changes Summary

| Action | File |
|--------|------|
| Modify | `.storybook/main.ts` |
| Modify | `.storybook/preview.tsx` |
| Modify | `src/provider/SchedulerProvider.tsx` (JSDoc) |
| Modify | `src/provider/SchedulerContext.ts` (JSDoc) |
| Modify | `src/components/Scheduler.tsx` (JSDoc) |
| Modify | `src/components/SchedulersList.tsx` (JSDoc) |
| Modify | `src/components/SchedulerDrawerButton.tsx` (JSDoc) |
| Modify | `src/stories/Scheduler.stories.tsx` (descriptions) |
| Modify | `src/stories/SchedulersList.stories.tsx` (descriptions) |
| Modify | `src/stories/SchedulerDrawerButton.stories.tsx` (descriptions) |
| Modify | `src/stories/Playground.stories.tsx` (descriptions) |
| Create | `src/stories/docs/GettingStarted.mdx` |
| Create | `src/stories/docs/FirebaseIntegration.mdx` |
| Create | `src/stories/docs/TanStackQuery.mdx` |
| Create | `src/stories/docs/Translations.mdx` |
| Create | `src/stories/docs/TypesReference.mdx` |
| Create | `src/stories/docs/Contributing.mdx` |
| Modify | `README.md` |

## Out of Scope

- No new npm dependencies
- No changes to component runtime behavior
- No changes to build output or npm package contents
- No changes to tests
