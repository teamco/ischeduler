import React from 'react';
import { Button } from "../ui/button"
import { Loader2, Save } from "lucide-react"
import { useSchedulerContext } from '@teamco/ischeduler-core';
import { cn } from "../../lib/utils"

type TSaveButton = {
  loading?: boolean;
  className?: string;
  isEdit?: boolean;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const SaveButton: React.FC<TSaveButton> = (props) => {
  const { t, permissions } = useSchedulerContext();

  const {
    loading,
    className,
    isEdit,
    disabled,
    size = 'sm',
    variant = 'default',
    onClick,
  } = props;

  const canPerform = isEdit ? permissions.canUpdate : permissions.canCreate;

  if (!canPerform) return null;

  const label = isEdit ? t('actions.update') : t('actions.save');

  return (
    <Button
      size={size}
      variant={variant}
      className={cn("gap-2", className)}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {label}
    </Button>
  );
};
