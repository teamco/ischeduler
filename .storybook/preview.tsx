import type { Preview } from '@storybook/react';
import { ConfigProvider } from 'antd';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'padded',
    docs: {
      source: { type: 'auto' },
    },
    options: {
      storySort: {
        order: [
          'Guides',
          [
            'Getting Started',
            'Firebase Integration',
            'TanStack Query',
            'i18n & Translations',
            'Types Reference',
            'Contributing',
          ],
          'Components',
          'Playground',
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <ConfigProvider warning={{ strict: false }}>
        <Story />
      </ConfigProvider>
    ),
  ],
};

export default preview;
