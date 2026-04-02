import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    mainFields: ['source', 'module', 'main'],
    alias: {
      '@ischeduler-antd': resolve(__dirname, 'src'),
      '@teamco/ischeduler-core': resolve(__dirname, '../core/src/index.ts'),
    },
  },
});
