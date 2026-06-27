import React from 'react';
import { cn } from '../../lib/utils';
import { EStatus } from '@teamco/ischeduler-core';

type TStatusTagProps = {
  status: keyof typeof EStatus;
};

const statusClasses: Record<keyof typeof EStatus, string> = {
  ACTIVE:      'bg-green-100 text-green-800 border-green-200',
  APPROVED:    'bg-green-100 text-green-800 border-green-200',
  PUBLISHED:   'bg-green-100 text-green-800 border-green-200',
  DEACTIVATED: 'bg-gray-100 text-gray-600 border-gray-200',
  DELETED:     'bg-red-100 text-red-700 border-red-200',
  PROCESSING:  'bg-blue-100 text-blue-700 border-blue-200',
  PENDING:     'bg-amber-100 text-amber-700 border-amber-200',
};

export const StatusTag: React.FC<TStatusTagProps> = ({ status }) => {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      statusClasses[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
    )}>
      {status}
    </span>
  );
};
