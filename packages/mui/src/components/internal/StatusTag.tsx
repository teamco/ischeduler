import React from 'react';
import { Chip } from '@mui/material';
import { EStatus } from '@teamco/ischeduler-core';

type TStatusTagProps = {
  status: keyof typeof EStatus;
};

const statusColors: Record<keyof typeof EStatus, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  ACTIVE: 'success',
  DEACTIVATED: 'default',
  DELETED: 'error',
  PROCESSING: 'info',
  PENDING: 'warning',
  APPROVED: 'success',
  PUBLISHED: 'primary',
};

export const StatusTag: React.FC<TStatusTagProps> = ({ status }) => {
  return (
    <Chip
      label={String(status)}
      size="small"
      color={statusColors[status] || 'default'}
      variant="outlined"
    />
  );
};
