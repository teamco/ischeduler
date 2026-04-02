import React from 'react';
import { Badge } from "../ui/badge"
import { EStatus } from '@teamco/ischeduler-core';

type TStatusTagProps = {
  status: keyof typeof EStatus;
};

const statusVariants: Record<keyof typeof EStatus, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: 'default',
  DEACTIVATED: 'secondary',
  DELETED: 'destructive',
  PROCESSING: 'outline',
  PENDING: 'outline',
  APPROVED: 'default',
  PUBLISHED: 'default',
};

export const StatusTag: React.FC<TStatusTagProps> = ({ status }) => {
  return (
    <Badge variant={statusVariants[status] || 'outline'}>
      {status}
    </Badge>
  );
};
