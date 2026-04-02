import React from 'react';
import { TextField } from '@mui/material';
import { useSchedulerContext } from '@teamco/ischeduler-core';

type TAfterBehaviorProps = {
  min?: number;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
};

export const AfterBehavior: React.FC<TAfterBehaviorProps> = (props) => {
  const { t } = useSchedulerContext();
  const { min = 1, value, onChange, disabled = false } = props;

  const occurrencesLabel = t('scheduler.occurrences');

  return (
    <TextField
      fullWidth
      size="small"
      type="number"
      label={occurrencesLabel}
      value={value ?? ''}
      disabled={disabled}
      slotProps={{ htmlInput: { min } }}
      onChange={(e) => onChange?.(parseInt(e.target.value, 10))}
    />
  );
};
