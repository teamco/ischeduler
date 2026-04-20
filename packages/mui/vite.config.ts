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
      name: 'iSchedulerMui',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rolldownOptions: {
      external: (id) =>
        /^(react|react-dom|react\/jsx-runtime|dayjs|@mui\/|@emotion\/|@teamco\/ischeduler)/.test(id),
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          dayjs: 'dayjs',
          '@mui/material': 'MuiMaterial',
          '@teamco/ischeduler-core': 'iSchedulerCore',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@ischeduler-mui': resolve(__dirname, 'src'),
    },
  },
});
