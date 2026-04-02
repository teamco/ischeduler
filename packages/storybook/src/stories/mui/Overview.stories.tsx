import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const Overview = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 64,
      gap: 16,
      fontFamily: 'sans-serif',
    }}
  >
    <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>MUI Adapter</h2>
    <p style={{ margin: 0, color: '#666', maxWidth: 480, textAlign: 'center' }}>
      The <strong>@teamco/ischeduler-mui</strong> package provides scheduler components built with{' '}
      <a href="https://mui.com" target="_blank" rel="noreferrer">
        MUI (Material UI)
      </a>
      {' '} — including <code>Scheduler</code>, <code>SchedulersList</code>, and{' '}
      <code>SchedulerDrawerButton</code>.
    </p>
    <pre
      style={{
        background: '#f5f5f5',
        padding: '12px 20px',
        borderRadius: 8,
        fontSize: 13,
        color: '#333',
      }}
    >
      {`npm install @teamco/ischeduler-core @teamco/ischeduler-mui
npm install @mui/material @mui/x-date-pickers @mui/icons-material @emotion/react @emotion/styled dayjs`}
    </pre>
    <p style={{ margin: 0, color: '#666', maxWidth: 480, textAlign: 'center', fontSize: 14 }}>
      Browse the stories below to see each component in action.
    </p>
  </div>
);

const meta: Meta = {
  title: 'MUI/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`@teamco/ischeduler-mui` — MUI adapter for iScheduler. Provides Scheduler, SchedulersList, and SchedulerDrawerButton components built with Material UI.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const OverviewStory: Story = {
  name: 'Overview',
  render: () => <Overview />,
};
