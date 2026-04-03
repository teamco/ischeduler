import React from 'react';
import { Button } from "../ui/button"
import { Pencil } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useSchedulerContext } from '@teamco/ischeduler-core';

type TDrawerEditActionProps<T> = {
  entity: T;
  disabled?: boolean;
  onEdit?: (entity: T) => void;
  showLabel?: boolean;
};

export const DrawerEditAction = <T,>(props: TDrawerEditActionProps<T>) => {
  const { t, permissions } = useSchedulerContext();
  const { entity, disabled, onEdit, showLabel = false } = props;

  if (!entity || !permissions.canUpdate) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(entity);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            disabled={disabled}
            onClick={handleClick}
          >
            <Pencil className="h-4 w-4" />
            {showLabel && <span className="ml-2">{t('actions.edit')}</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('actions.edit')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
