import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, SelectChangeEvent } from '@mui/material';
import { useSchedulerContext } from '@teamco/ischeduler-core';

export interface ISelectItemProps {
  label: string;
  value: string;
  disabled?: boolean;
}

type TProps = {
  columnsList: ISelectItemProps[];
  selectedColumns: string[];
  onChange: (value: string[]) => void;
};

export const HideColumns = (props: TProps): React.JSX.Element => {
  const { t } = useSchedulerContext();
  const { selectedColumns = [], columnsList = [], onChange } = props;

  if (!columnsList?.length) {
    return <></>;
  }

  const label = t('table.hideColumns');

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const newValues = typeof value === 'string' ? value.split(',') : value;
    if (newValues.length < 1) return;
    onChange?.(newValues);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
      <InputLabel id="hide-columns-label">{label}</InputLabel>
      <Select
        labelId="hide-columns-label"
        id="hide-columns-select"
        multiple
        value={selectedColumns}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          selected
            .map((key) => columnsList.find((c) => c.value === key)?.label ?? key)
            .join(', ')
        }
        sx={{ maxHeight: 40 }}
      >
        {columnsList.map((col) => (
          <MenuItem key={col.value} value={col.value}>
            <Checkbox checked={selectedColumns.indexOf(col.value) > -1} size="small" />
            <ListItemText primary={col.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
