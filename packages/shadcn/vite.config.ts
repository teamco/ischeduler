import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      tsConfigFilePath: './tsconfig.build.json',
      insertTypesEntry: true,
      outputDir: 'dist',
    }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'iSchedulerShadcn',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
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
