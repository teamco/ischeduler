import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@ischeduler-core/types': resolve(__dirname, 'src/types'),
      '@ischeduler-core/utils': resolve(__dirname, 'src/utils'),
      '@ischeduler-core/handlers': resolve(__dirname, 'src/handlers.tsx'),
      '@ischeduler-core': resolve(__dirname, 'src'),
    },
  },
});
