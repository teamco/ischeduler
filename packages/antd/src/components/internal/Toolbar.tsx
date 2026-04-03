import { MoreOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, type MenuProps } from 'antd';
import React from 'react';

import { useSchedulerContext } from '@teamco/ischeduler-core';

import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { ItemType } from 'antd/es/menu/interface';

type TToolbarProps = {
  children?: React.ReactNode;
  items?: ItemType[];
  onRefresh?: () => void;
  size?: SizeType;
};

export const Toolbar = (props: TToolbarProps): React.JSX.Element => {
  const { loading, t } = useSchedulerContext();

  const { children, items = [], size = 'middle', onRefresh } = props;

  let baseItems: MenuProps['items'] = onRefresh
    ? [
        {
          key: 'refresh',
          label: t('toolbar.refresh'),
          icon: <ReloadOutlined />,
          onClick: onRefresh,
        },
      ]
    : [];

  if (items?.length) {
    baseItems = items.concat([{ type: 'divider' }, ...baseItems]);
  }

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
