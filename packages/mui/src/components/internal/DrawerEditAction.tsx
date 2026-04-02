import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSchedulerContext } from '@teamco/ischeduler-core';

type TDrawerEditActionProps<T> = {
  entity: T;
  disabled?: boolean;
  onEdit?: (entity: T) => void;
  showLabel?: boolean;
};

export const DrawerEditAction = <T,>(props: TDrawerEditActionProps<T>) => {
  const { t, permissions } = useSchedulerContext();
  const { entity, disabled, onEdit, showLabel = false } = props;

  if (!entity || !permissions.canUpdate) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(entity);
  };

  return (
    <Tooltip title={t('actions.edit')}>
      <span>
        <IconButton 
          color="primary" 
          size="small" 
          onClick={handleClick} 
          disabled={disabled}
        >
          <EditIcon fontSize="small" />
          {showLabel && t('actions.edit')}
        </IconButton>
      </span>
    </Tooltip>
  );
};
