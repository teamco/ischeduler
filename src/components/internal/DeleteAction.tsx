import { DeleteTwoTone } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import React from 'react';

import { useSchedulerContext } from '@iScheduler/provider/SchedulerContext';

import type { ButtonType } from 'antd/es/button';

type TDeleteAction<T> = {
  entity: T;
  type?: ButtonType;
  icon?: React.JSX.Element;
  showLabel?: boolean;
  disabled?: boolean;
  onDelete?: (entity: T) => void;
};

export const DeleteAction = <T,>(props: TDeleteAction<T>): React.JSX.Element | null => {
  const { t, loading, permissions } = useSchedulerContext();

  const {
    entity,
    icon,
    type = 'primary',
    showLabel = false,
    disabled,
    onDelete,
  } = props;

  if (!entity || !permissions.canDelete) return null;

  return (
    <Popconfirm
      title={t('actions.confirm.delete')}
      onConfirm={() => onDelete?.(entity)}
      okText={t('actions.delete')}
      cancelText={t('actions.cancel')}
    >
      <Tooltip title={t('actions.delete')}>
        <Button
          disabled={disabled || !permissions.canDelete}
          loading={loading}
          danger
          type={type}
          icon={icon || <DeleteTwoTone twoToneColor="#eb2f96" />}
        >
          {showLabel && t('actions.delete')}
        </Button>
      </Tooltip>
    </Popconfirm>
  );
};
