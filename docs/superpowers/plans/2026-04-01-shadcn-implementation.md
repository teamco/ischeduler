# Plan: Shadcn Implementation — `@teamco/ischeduler/shadcn`

## Summary
Implement the iScheduler UI components using Radix UI and Tailwind CSS, following the Shadcn/UI design patterns.

## Goals
- Deliver a Shadcn-native scheduler.
- Provide a hybrid npm-ready package that works with the user's Tailwind config.
- Ensure consistent styling using Tailwind's `cn` utility.

## Tasks

### 1. Hybrid Package Setup
- [ ] **Tailwind Config**: Define a base Tailwind configuration that can be imported by the user.
- [ ] **Dependencies**: Ensure `packages/shadcn/package.json` includes:
  - `@radix-ui/react-*` (Accordion, Button, Calendar, Checkbox, Dialog, Label, Popover, RadioGroup, Select, Table).
  - `tailwind-merge`, `clsx`, `lucide-react`.
  - `@teamco/ischeduler-core` (as a workspace dependency).

### 2. Implementation Strategy
- [ ] **UI Layer**: Implement the scheduler components using Radix UI primitives and Tailwind classes.
- [ ] **`Scheduler` Form**: Use Radix-based `Select`, `Calendar` (via `react-day-picker`), and `RadioGroup`.
- [ ] **`SchedulersList`**: Use Radix-based `Table` and `DropdownMenu` for actions.
- [ ] **`SchedulerDrawerButton`**: Use Radix `Sheet` (Drawer) for the form container.

### 3. Styling & Customization
- [ ] **Global Styling**: Provide a `dist/ischeduler.css` file containing the base Tailwind styles.
- [ ] **Custom Classes**: Support passing `className` props to all components for easy Tailwind overrides.
- [ ] **Tailwind Extension**: Document how users should extend their `tailwind.config.js` to include the library's styles.

### 4. Validation & Testing
- [ ] **Storybook**: Create `packages/storybook/src/stories/shadcn/` and add comprehensive stories.
- [ ] **Unit Tests**: Create `packages/shadcn/__tests__/` and adapt existing tests.
- [ ] **Visual Check**: Ensure the Shadcn version matches the clean, minimalist look and feel of the design system.
