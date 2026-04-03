import React from 'react';
import { Box, MenuItem, TextField, Select, FormControl, InputLabel } from '@mui/material';
import { useSchedulerContext, EDurationTypes } from '@teamco/ischeduler-core';

type TDurationProps = {
  min?: number;
  label: string;
  disabled: boolean;
  exclude?: (keyof typeof EDurationTypes)[];
  durationTypes: (keyof typeof EDurationTypes)[];
  required: boolean;
  typeValue?: keyof typeof EDurationTypes;
  periodValue?: number;
  onTypeChange?: (value: keyof typeof EDurationTypes) => void;
  onValueChange?: (value: number) => void;
};

export const Duration: React.FC<TDurationProps> = (props) => {
  const { t } = useSchedulerContext();
  const {
    min = 1,
    label,
    disabled,
    durationTypes = [],
    exclude = [],
    typeValue,
    periodValue,
    onTypeChange,
    onValueChange,
  } = props;

  return (
    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
      <FormControl fullWidth size="small">
        <InputLabel id="duration-type-label">{t('scheduler.meta.period')}</InputLabel>
        <Select
          labelId="duration-type-label"
          value={typeValue || ''}
          label={t('scheduler.meta.period')}
          disabled={disabled}
          onChange={(e) => onTypeChange?.(e.target.value as keyof typeof EDurationTypes)}
        >
          {durationTypes
            .filter((type) => !exclude.includes(type))
            .map((type) => (
              <MenuItem key={String(type)} value={type as string}>
                {EDurationTypes[type]}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        size="small"
        type="number"
        label={label}
        value={periodValue ?? ''}
        disabled={disabled}
        slotProps={{ htmlInput: { min } }}
        onChange={(e) => onValueChange?.(parseInt(e.target.value, 10))}
      />
    </Box>
  );
};
