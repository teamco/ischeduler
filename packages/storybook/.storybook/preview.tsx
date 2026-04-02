import type { Preview } from '@storybook/react-vite';
import { ConfigProvider } from 'antd';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TooltipProvider } from '@radix-ui/react-tooltip';
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
          'Ant Design',
          ['Overview'],
          'MUI',
          ['Overview'],
          'Shadcn',
          ['Overview'],
          'Core',
          ['Overview'],
          'Playground',
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const adapter = context.title?.split('/')[0];
      if (adapter === 'Ant Design' || adapter === 'Playground') {
        return (
          <ConfigProvider warning={{ strict: false }}>
            <Story />
          </ConfigProvider>
        );
      }

      if (adapter === 'MUI') {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Story />
          </LocalizationProvider>
        );
      }

      if (adapter === 'Shadcn') {
        return (
          <TooltipProvider>
            <Story />
          </TooltipProvider>
        );
      }

      return <Story />;
    },
  ],
};

export default preview;
