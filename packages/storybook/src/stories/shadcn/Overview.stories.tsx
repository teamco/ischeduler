import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ShadcnWrapper } from './shadcn-decorator';

const Overview = () => (
  <ShadcnWrapper className="max-w-[640px]">
    <div className="flex flex-col items-center text-center gap-4">
      <h2 className="text-2xl font-semibold">shadcn/ui Adapter</h2>
      <p className="text-muted-foreground max-w-md">
        The <strong>@teamco/ischeduler-shadcn</strong> package provides scheduler components built with{' '}
        <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" className="underline text-primary">
          shadcn/ui
        </a>
        {' '}(Radix UI + Tailwind CSS) — including <code className="bg-muted px-1.5 py-0.5 rounded text-sm">Scheduler</code>,{' '}
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm">SchedulersList</code>, and{' '}
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm">SchedulerDrawerButton</code>.
      </p>
      <pre className="bg-muted text-sm rounded-lg px-5 py-3 text-left">
        {`npm install @teamco/ischeduler-core @teamco/ischeduler-shadcn
npm install dayjs`}
      </pre>
      <p className="text-sm text-muted-foreground">
        Browse the stories below to see each component in action.
      </p>
    </div>
  </ShadcnWrapper>
);

const meta: Meta = {
  title: 'Shadcn/Overview',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`@teamco/ischeduler-shadcn` — shadcn/ui adapter for iScheduler. Provides Scheduler, SchedulersList, and SchedulerDrawerButton components built with Radix UI and Tailwind CSS.',
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
