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
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'iSchedulerCore',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'dayjs'],
      output: [
        {
          format: 'es',
          entryFileNames: 'index.es.js',
          exports: 'named',
        },
        {
          format: 'cjs',
          entryFileNames: 'index.cjs.js',
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
