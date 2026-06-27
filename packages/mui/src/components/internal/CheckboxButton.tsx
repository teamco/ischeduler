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

const selectedToggleSx = {
  '& .MuiToggleButton-root': {
    borderColor: 'divider',
    fontWeight: 500,
    transition: 'all 150ms ease',
    '&.Mui-selected': {
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      borderColor: 'primary.main',
      '&:hover': { bgcolor: 'primary.dark', borderColor: 'primary.dark' },
    },
    '&:hover:not(.Mui-selected)': { bgcolor: 'action.hover' },
  },
};

export const CheckboxButton: React.FC<TCheckboxButtonProps> = (props) => {
  const { options, value = [], onChange, disabled, loading, label, error, helperText } = props;

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValues: string[] | null) => {
    onChange?.(newValues ?? []);
  };

  return (
    <Box>
      {label && (
        <Typography variant="caption" color={error ? 'error' : 'text.secondary'} sx={{ mb: 0.75, display: 'block', fontWeight: 500 }}>
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
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '6px !important',
          },
          ...selectedToggleSx,
        }}
      >
        {options.map((option) => (
          <ToggleButton key={option.key} value={option.value} sx={{ minWidth: 44, px: 1.5, cursor: 'pointer' }}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </Box>
  );
};
