import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) =>
    mergeConfig(config, {
      css: {
        modules: { localsConvention: 'camelCase' },
        preprocessorOptions: {
          less: { javascriptEnabled: true },
        },
      },
      resolve: {
        alias: {
          '@iScheduler': path.resolve(__dirname, '../src'),
        },
      },
    }),
};

export default config;
