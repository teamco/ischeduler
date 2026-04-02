import React from 'react';
import { Input } from "../ui/input"
import { Label } from "../ui/label"
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

  return (
    <div className="flex flex-col gap-2">
      <Label>{t('scheduler.occurrences')}</Label>
      <Input
        type="number"
        min={min}
        value={value ?? ''}
        disabled={disabled}
        onChange={(e) => onChange?.(parseInt(e.target.value, 10))}
        className="w-full"
      />
    </div>
  );
};
