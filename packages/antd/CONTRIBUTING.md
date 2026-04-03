# Contributing to ischeduler

Thank you for your interest in contributing! We welcome contributions from everyone.

## Getting Started

1. **Fork the repository** and clone it locally.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/my-change
   ```

## Development

```bash
npm run dev          # Start dev server
npm run storybook    # Launch Storybook
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run linter
npm run format       # Format code
npm run build        # Production build
```

## Code Standards

- **TypeScript** with strict mode enabled
- **React** functional components with hooks
- **Ant Design** 6+ for UI components
- **Less** CSS modules for styling
- Follow existing patterns in the codebase

## Testing

All changes must include tests:

- Unit tests for utilities and handlers
- Component tests for UI components
- Run `npm run test` to verify all tests pass before submitting

## Pull Request Process

1. Update tests and ensure they pass
2. Run `npm run lint` and fix any issues
3. Run `npm run build` to verify the build succeeds
4. Write a clear PR description explaining what and why
5. Reference any related issues

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` test changes
- `refactor:` code restructuring
- `chore:` maintenance tasks

## Reporting Issues

- Use GitHub Issues to report bugs
- Include steps to reproduce, expected behavior, and actual behavior
- Include browser and OS information if relevant

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
