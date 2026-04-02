import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box, Typography, FormHelperText } from '@mui/material';

type TOption = {
  key: string;
  label: React.ReactNode;
  value: string;
};

type TCheckboxButtonProps = {
  options: TOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
};

export const CheckboxButton: React.FC<TCheckboxButtonProps> = (props) => {
  const { options, value = [], onChange, disabled, loading, label, error, helperText } = props;

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValues: string[] | null) => {
    onChange?.(newValues ?? []);
  };

  return (
    <Box>
      {label && (
        <Typography variant="caption" color={error ? 'error' : 'textSecondary'} sx={{ mb: 0.5, display: 'block' }}>
          {label}
        </Typography>
      )}
      <ToggleButtonGroup
        value={value}
        onChange={handleChange}
        disabled={disabled || loading}
        size="small"
        exclusive={false}
        sx={{
          flexWrap: 'wrap',
          gap: 0.5,
          '& .MuiToggleButtonGroup-grouped': {
            margin: 0,
            border: '1px solid rgba(0, 0, 0, 0.12) !important',
            borderRadius: '4px !important',
          },
        }}
      >
        {options.map((option) => (
          <ToggleButton key={option.key} value={option.value} sx={{ minWidth: 40, px: 1 }}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </Box>
  );
};
