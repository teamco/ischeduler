# Plan: Infrastructure Setup — Monorepo & Exports

## Summary
Align the monorepo structure with the `@teamco/ischeduler/*` pattern. Configure the meta-package to export `core`, `antd`, `mui`, and `shadcn` as subpaths.

## Goals
- Fix exports in `@teamco/ischeduler` to support subpath imports.
- Ensure all packages are correctly linked in the workspace.
- Setup `tsconfig.json` paths for local development.

## Tasks

### 1. Update `@teamco/ischeduler` Meta-Package
- [ ] **Verify Subpath Files**: Ensure `packages/ischeduler/src/` contains:
  - `core.ts` (exports from `@teamco/ischeduler-core`)
  - `antd.ts` (exports from `@teamco/ischeduler-antd`)
  - `mui.ts` (exports from `@teamco/ischeduler-mui`)
  - `shadcn.ts` (exports from `@teamco/ischeduler-shadcn`)
  - `index.ts` (default export, typically antd for backward compatibility)
- [ ] **Configure Build**: Update `vite.config.ts` in `packages/ischeduler` to build multiple entry points.
- [ ] **Verify `package.json` Exports**: Double-check that `exports` point to the correct build artifacts.

### 2. Workspace Linking & `tsconfig`
- [ ] **Root `tsconfig.json`**: Add `paths` to resolve `@teamco/ischeduler/core`, `@teamco/ischeduler/antd`, etc., directly to the source files during development.
- [ ] **`package.json` Dependencies**: Ensure the meta-package uses `workspace:*` or `*` for its internal dependencies.

### 3. Validation
- [ ] **Run Build**: Run `npm run build` in the root.
- [ ] **Inspect Output**: Check `packages/ischeduler/dist/` for all subpath bundles (`core.es.js`, `antd.es.js`, etc.).
- [ ] **Lint & Format**: Run `npm run lint` and `npm run format`.
