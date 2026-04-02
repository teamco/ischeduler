# Plan: MUI Implementation — `@teamco/ischeduler/mui`

## Summary
Implement the iScheduler UI components using the MUI (`@mui/material`) library, leveraging the `ischeduler-core` logic.

## Goals
- Provide a full-featured MUI-based scheduler.
- Match the functionality of the `antd` implementation.
- Support MUI's `sx` prop and theme-based styling.

## Tasks

### 1. Project Initialization
- [ ] **Dependencies**: Ensure `packages/mui/package.json` includes:
  - `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`, `@emotion/react`, `@emotion/styled`.
  - `@teamco/ischeduler-core` (as a workspace dependency).

### 2. Core Integration
- [ ] **`SchedulerProvider`**: Wrap the headless core provider with any MUI-specific contexts (e.g., `LocalizationProvider`).

### 3. UI Components
- [ ] **`Scheduler` Form**:
  - Implement duration select using MUI `Select`.
  - Implement start date using MUI `DatePicker`.
  - Implement behavior fields (Weekly/Monthly/Yearly) using MUI `Checkbox` and `Radio` groups.
  - Implement end reason fields.
- [ ] **`SchedulersList`**:
  - Implement the table using MUI `Table`, `TableBody`, `TableCell`, `TableHead`, `TableRow`.
  - Implement actions (Edit/Delete) with MUI `IconButton` and `Menu`.
- [ ] **`SchedulerDrawerButton`**:
  - Implement the button using MUI `Button`.
  - Implement the drawer using MUI `Drawer`.

### 4. Styling & Customization
- [ ] **Theming**: Ensure components respond correctly to MUI's `Theme`.
- [ ] **Override API**: Provide `slotProps` or `sx` props for deep customization of internal components.

### 5. Validation & Testing
- [ ] **Storybook**: Create `packages/storybook/src/stories/mui/` and add comprehensive stories.
- [ ] **Unit Tests**: Create `packages/mui/__tests__/` and adapt existing tests from `antd`.
- [ ] **Visual Check**: Ensure the MUI version looks and feels native to the framework.
