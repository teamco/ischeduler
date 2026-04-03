import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useSchedulerContext } from '@teamco/ischeduler-core';

type TSaveButton = {
  loading?: boolean;
  className?: string;
  isEdit?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  icon?: React.ReactNode;
  type?: 'submit' | 'reset' | 'button';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'text' | 'outlined' | 'contained';
};

export const SaveButton: React.FC<TSaveButton> = (props) => {
  const { t, permissions } = useSchedulerContext();

  const {
    loading,
    className,
    isEdit,
    disabled,
    size = 'small',
    color = 'primary',
    icon = <SaveIcon fontSize="small" />,
    type = 'button',
    variant = 'contained',
    onClick,
  } = props;

  const canPerform = isEdit ? permissions.canUpdate : permissions.canCreate;

  if (!canPerform) return null;

  const label = isEdit ? t('actions.update') : t('actions.save');

  return (
    <Button
      type={type}
      size={size}
      variant={variant}
      className={className}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : icon}
      onClick={onClick}
      color={color}
    >
      {label}
    </Button>
  );
};
