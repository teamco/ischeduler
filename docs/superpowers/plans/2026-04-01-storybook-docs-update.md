# Plan: Storybook & Documentation Update

## Summary
Update the unified Storybook to support multiple adapters and refine the MDX guide pages.

## Goals
- Add stories for MUI and Shadcn.
- Create a multi-adapter "Playground" for live comparison.
- Update documentation to reflect the `@teamco/ischeduler/*` subpath import pattern.

## Tasks

### 1. Unified Storybook
- [ ] **Stories**: Add `mui` and `shadcn` directories in `packages/storybook/src/stories/`.
- [ ] **Playground**: Create a comparison page where users can switch between Antd, MUI, and Shadcn versions.
- [ ] **Docs Metadata**: Update JSDoc in `core` to ensure props are correctly documented for all adapters.

### 2. MDX Guide Pages
- [ ] **Getting Started**: Update installation instructions for the subpath import pattern.
- [ ] **Adapter Setup**: Add specific setup instructions for MUI (`LocalizationProvider`) and Shadcn (Tailwind config).
- [ ] **Integration Guides**: Ensure Firebase and TanStack Query examples are adapter-agnostic (using `core`).

### 3. README Refinement
- [ ] **Main README**: Update installation table and Quick Start to use the new subpath exports.
- [ ] **Package READMEs**: Add package-specific documentation for each adapter.

### 4. Validation
- [ ] **Storybook Build**: Run `npm run build-storybook`.
- [ ] **Manual Audit**: Ensure all stories work and documentation is easy to follow.
