import React from 'react';
import { useSchedulerContext, EDurationTypes } from '@teamco/ischeduler-core';
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

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
    <div className="flex flex-col gap-2 w-full">
      <Label>{label}</Label>
      <div className="flex gap-2 w-full">
        <div className="flex-[2]">
          <Select
            value={typeValue}
            onValueChange={(val) => onTypeChange?.(val as keyof typeof EDurationTypes)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('scheduler.meta.period')} />
            </SelectTrigger>
            <SelectContent>
              {durationTypes
                .filter((type) => !exclude.includes(type))
                .map((type) => (
                  <SelectItem key={type} value={type}>
                    {EDurationTypes[type]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Input
            type="number"
            min={min}
            value={periodValue ?? ''}
            onChange={(e) => onValueChange?.(parseInt(e.target.value, 10))}
            disabled={disabled}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
