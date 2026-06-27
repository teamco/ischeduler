import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      rollupTypes: false,
      insertTypesEntry: true,
      outDir: 'dist',
      pathsToAliases: false,
    }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'iSchedulerShadcn',
      formats: ['es', 'cjs'],
      // CJS output must use .cjs ext — package is "type": "module", so a
      // .js file would be parsed as ESM and break on `exports`.
      fileName: (format) => (format === 'es' ? 'index.es.js' : 'index.cjs'),
      // Emit the compiled Tailwind bundle as dist/index.css.
      cssFileName: 'index',
    },
    rolldownOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'dayjs',
        '@radix-ui/react-dialog',
        '@radix-ui/react-select',
        '@radix-ui/react-popover',
        '@teamco/ischeduler-core',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          dayjs: 'dayjs',
          '@teamco/ischeduler-core': 'iSchedulerCore',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@ischeduler-shadcn': resolve(__dirname, 'src'),
    },
  },
});
