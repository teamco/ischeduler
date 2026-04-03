import React, { useState } from 'react';
import { 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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

  const handleClickOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(entity);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={t('actions.delete')}>
        <span>
          <IconButton 
            color="error" 
            size="small" 
            onClick={handleClickOpen} 
            disabled={disabled}
          >
            <DeleteIcon fontSize="small" />
            {showLabel && t('actions.delete')}
          </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} onClick={(e) => e.stopPropagation()}>
        <DialogTitle>{t('actions.delete')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('actions.confirm.delete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} size="small">{t('actions.cancel')}</Button>
          <Button onClick={handleConfirm} color="error" variant="contained" size="small" autoFocus>
            {t('actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
