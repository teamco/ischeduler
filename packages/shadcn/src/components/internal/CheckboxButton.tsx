import React from 'react';
import { Label } from "../ui/label"
import { cn } from "../../lib/utils"

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
  className?: string;
};

export const CheckboxButton: React.FC<TCheckboxButtonProps> = (props) => {
  const { options, value = [], onChange, disabled, loading, label, className } = props;

  const handleToggle = (optValue: string) => {
    if (disabled || loading) return;
    const newValue = value.includes(optValue)
      ? value.filter((v) => v !== optValue)
      : [...value, optValue];
    onChange?.(newValue);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label className="text-muted-foreground">{label}</Label>}
      <div className="flex flex-wrap gap-1">
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <button
              key={option.key}
              type="button"
              disabled={disabled || loading}
              onClick={() => handleToggle(option.value)}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
