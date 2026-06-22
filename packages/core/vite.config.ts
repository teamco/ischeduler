import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      rollupTypes: false,
      insertTypesEntry: true,
      outDir: 'dist',
    }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'types-api': resolve(__dirname, 'src/types-entry.ts'),
      },
      name: 'iSchedulerCore',
      formats: ['es', 'cjs'],
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'dayjs'],
      output: [
        {
          format: 'es',
          entryFileNames: (chunk) =>
            chunk.name === 'types-api' ? 'types.es.js' : 'index.es.js',
          exports: 'named',
        },
        {
          format: 'cjs',
          entryFileNames: (chunk) =>
            chunk.name === 'types-api' ? 'types.cjs' : 'index.cjs',
          exports: 'named',
        },
      ],
    },
  },
  resolve: {
    alias: {
      '@ischeduler-core': resolve(__dirname, 'src'),
    },
  },
});
