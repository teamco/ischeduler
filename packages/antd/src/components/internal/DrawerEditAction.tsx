import { EditTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

import { useSchedulerContext } from '@teamco/ischeduler-core';
import { COLORS } from '@teamco/ischeduler-core';

import type { ButtonType } from 'antd/es/button';

type TDrawerEditAction<T> = {
  entity: T;
  type?: ButtonType;
  showLabel?: boolean;
  disabled?: boolean;
  onEdit?: (entity: T) => void;
};

export const DrawerEditAction = <T,>(
  props: TDrawerEditAction<T>,
): React.JSX.Element | null => {
  const { t, loading, permissions } = useSchedulerContext();

  const { entity, type = 'primary', showLabel = false, onEdit } = props;

  if (!entity || !permissions.canUpdate) return null;

  return (
    <Button
      disabled={!permissions.canUpdate}
      loading={loading}
      type={type}
      icon={<EditTwoTone twoToneColor={COLORS.success} />}
      onClick={() => onEdit?.(entity)}
    >
      {showLabel && t('actions.edit')}
    </Button>
  );
};
