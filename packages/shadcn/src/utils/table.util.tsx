import type { IScheduler } from '@teamco/ischeduler-core';

export const indexable = (data: IScheduler[]) => {
  return data.map((item, index) => ({
    ...item,
    key: item.id || index.toString(),
    index: index + 1,
  }));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const indexColumn = (t: (key: string) => string) => ({
  title: '#',
  dataIndex: 'index',
  key: 'index',
  width: '50px',
});

export const actionField = (t: (key: string) => string) => ({
  title: t('table.actions'),
  key: 'actions',
  width: '100px',
});
