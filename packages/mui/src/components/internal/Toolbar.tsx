import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSchedulerContext } from '@teamco/ischeduler-core';

type TToolbarItem = {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type TToolbarProps = {
  children?: React.ReactNode;
  items?: TToolbarItem[];
  extraItems?: TToolbarItem[];
  onRefresh?: () => void;
};

export const Toolbar: React.FC<TToolbarProps> = (props) => {
  const { loading, t } = useSchedulerContext();
  const { children, items = [], extraItems = [], onRefresh } = props;

  const hasExtra = extraItems.length > 0;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
      {children}

      <IconButton
        aria-label="more"
        id="toolbar-button"
        aria-controls={open ? 'toolbar-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        {loading ? <CircularProgress size={20} /> : <MoreVertIcon />}
      </IconButton>

      <Menu
        id="toolbar-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'toolbar-button',
          },
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              }
              handleClose();
            }}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            {typeof item.label === 'string' ? (
              <ListItemText>{item.label}</ListItemText>
            ) : (
              <Box sx={{ flexGrow: 1, display: 'flex' }}>{item.label}</Box>
            )}
          </MenuItem>
        ))}

        {items.length > 0 && hasExtra && <Divider />}

        {extraItems.map((item, index) => (
          <MenuItem
            key={`extra-${index}`}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              }
              handleClose();
            }}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            {typeof item.label === 'string' ? (
              <ListItemText>{item.label}</ListItemText>
            ) : (
              <Box sx={{ flexGrow: 1, display: 'flex' }}>{item.label}</Box>
            )}
          </MenuItem>
        ))}

        {(items.length > 0 || hasExtra) && onRefresh && <Divider />}

        {onRefresh && (
          <MenuItem
            onClick={() => {
              onRefresh();
              handleClose();
            }}
          >
            <ListItemIcon>
              <RefreshIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('toolbar.refresh')}</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
