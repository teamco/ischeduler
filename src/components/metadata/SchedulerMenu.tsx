import { DeleteTwoTone, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import React from 'react';

import { useSchedulerContext } from '@iScheduler/provider/SchedulerContext';
import { COLORS } from '@iScheduler/utils/colors.util';

type TProps = {
  disabled?: boolean;
  record: { key?: string };
  prefix: string;
  onDeleteScheduler: (key: string, prefix: string) => void;
};

export const SchedulerMenu = (props: TProps) => {
  const { t, loading, permissions } = useSchedulerContext();

  const { disabled, record, prefix, onDeleteScheduler } = props;

  const isDisabled = disabled || loading;
  const canDelete = permissions.canDelete && !isDisabled;
  const canUpdate = permissions.canUpdate && !isDisabled;

  const editItems = [
    {
      label: t('actions.edit'),
      disabled: !canUpdate,
      key: 'edit',
      icon: <EditOutlined />,
    },
  ];

  const deleteItems = [
    {
      label: (
        <Popconfirm
          placement="topRight"
          disabled={!canDelete}
          onConfirm={() => canDelete && record.key && onDeleteScheduler(record.key, prefix)}
          title={t('actions.confirm.delete')}
        >
          {t('actions.delete')}
        </Popconfirm>
      ) as React.ReactNode,
      key: 'delete',
      disabled: !canDelete,
      icon: <DeleteTwoTone twoToneColor={COLORS.danger} />,
    },
  ];

  return [...editItems, { type: 'divider' as const }, ...deleteItems];
};
