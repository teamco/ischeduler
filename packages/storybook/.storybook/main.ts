// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [getAbsolutePath("@storybook/addon-docs")],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: {
        alias: {
          '@teamco/ischeduler-core': path.resolve(__dirname, '../../core/src/index.ts'),
          '@teamco/ischeduler-antd': path.resolve(__dirname, '../../antd/src/index.ts'),
          '@teamco/ischeduler-mui': path.resolve(__dirname, '../../mui/src/index.ts'),
          '@teamco/ischeduler-shadcn': path.resolve(__dirname, '../../shadcn/src/index.ts'),
        },
      },
      css: {
        modules: { localsConvention: 'camelCase' },
        preprocessorOptions: {
          less: { javascriptEnabled: true },
        },
      },
    }),
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
