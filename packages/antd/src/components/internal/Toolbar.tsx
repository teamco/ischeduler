import { MoreOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, type MenuProps } from 'antd';
import React from 'react';

import { useSchedulerContext } from '@teamco/ischeduler-core';

import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { ItemType } from 'antd/es/menu/interface';

type TToolbarProps = {
  children?: React.ReactNode;
  items?: ItemType[];
  extraItems?: ItemType[];
  onRefresh?: () => void;
  size?: SizeType;
};

export const Toolbar = (props: TToolbarProps): React.JSX.Element => {
  const { loading, t } = useSchedulerContext();

  const { children, items = [], extraItems = [], size = 'middle', onRefresh } = props;

  const refreshItem: ItemType[] = onRefresh
    ? [
        {
          key: 'refresh',
          label: t('toolbar.refresh'),
          icon: <ReloadOutlined />,
          onClick: onRefresh,
        },
      ]
    : [];

  const hasItems = items.length > 0;
  const hasExtra = extraItems.length > 0;
  const hasRefresh = refreshItem.length > 0;

  let baseItems: MenuProps['items'] = [];
  if (hasItems) baseItems = [...items];
  if (hasItems && hasExtra) baseItems = [...baseItems, { type: 'divider' }];
  if (hasExtra) baseItems = [...baseItems, ...extraItems];
  if ((hasItems || hasExtra) && hasRefresh) baseItems = [...baseItems, { type: 'divider' }];
  baseItems = [...baseItems, ...refreshItem];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
      {children ? children : null}
      <Dropdown menu={{ items: baseItems }} trigger={['click']}>
        <Button
          loading={loading}
          size={size}
          color="default"
          variant="filled"
          icon={<MoreOutlined />}
          type="primary"
        />
      </Dropdown>
    </div>
  );
};
