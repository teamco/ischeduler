import React, { useState } from 'react';
import { Button } from "../ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "../ui/dialog"
import { Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { useSchedulerContext } from '@teamco/ischeduler-core';

type TDeleteActionProps<T> = {
  entity: T;
  disabled?: boolean;
  onDelete?: (entity: T) => void;
  showLabel?: boolean;
};

export const DeleteAction = <T,>(props: TDeleteActionProps<T>) => {
  const { t, permissions } = useSchedulerContext();
  const { entity, disabled, onDelete, showLabel = false } = props;
  const [open, setOpen] = useState(false);

  if (!entity || !permissions.canDelete) return null;

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(entity);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={disabled}
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
                {showLabel && <span className="ml-2">{t('actions.delete')}</span>}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('actions.delete')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t('actions.delete')}</DialogTitle>
          <DialogDescription>
            {t('actions.confirm.delete')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{t('actions.cancel')}</Button>
          <Button variant="destructive" onClick={handleConfirm}>{t('actions.delete')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
