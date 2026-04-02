# Deprecate `@teamco/ischeduler`

After publishing the new packages, run this once to mark the old meta-package as deprecated on npm:

```bash
npm deprecate @teamco/ischeduler "Package split: use @teamco/ischeduler-core + @teamco/ischeduler-antd (or -mui, -shadcn). See https://github.com/teamco/ischeduler"
```

This adds a warning that users see on `npm install`. The package stays on npm at version 0.1.50 — no new releases needed.

## Verify

```bash
npm view @teamco/ischeduler deprecated
```

Should print the deprecation message.

## Undo (if needed)

```bash
npm deprecate @teamco/ischeduler ""
```

Passing an empty string removes the deprecation.
