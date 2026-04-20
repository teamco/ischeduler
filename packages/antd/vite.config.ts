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
      name: 'iSchedulerAntd',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`,
    },
    rolldownOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'antd',
        'dayjs',
        '@ant-design/icons',
        '@teamco/ischeduler-core',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          dayjs: 'dayjs',
          '@ant-design/icons': 'icons',
          '@teamco/ischeduler-core': 'iSchedulerCore',
        },
      },
    },
    cssCodeSplit: false,
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@ischeduler-antd': resolve(__dirname, 'src'),
    },
  },
});
