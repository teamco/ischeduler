import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Settings2 } from "lucide-react"
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

  const handleCheckedChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedColumns, value]);
    } else {
      if (selectedColumns.length <= 1) return; // Prevent hiding all columns
      onChange(selectedColumns.filter((col) => col !== value));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnsList.map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.value}
              className="capitalize"
              checked={selectedColumns.includes(column.value)}
              onCheckedChange={(value) => handleCheckedChange(column.value, !!value)}
              disabled={column.disabled}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
