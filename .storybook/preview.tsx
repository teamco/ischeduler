import type { Preview } from '@storybook/react';
import { ConfigProvider } from 'antd';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'padded',
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
