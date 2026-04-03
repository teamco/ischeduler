import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { MoreHorizontal, RefreshCw, Loader2 } from "lucide-react"
import { useSchedulerContext } from '@teamco/ischeduler-core';

type TToolbarItem = {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type TToolbarProps = {
  children?: React.ReactNode;
  items?: TToolbarItem[];
  onRefresh?: () => void;
};

export const Toolbar: React.FC<TToolbarProps> = (props) => {
  const { loading, t } = useSchedulerContext();
  const { children, items = [], onRefresh } = props;

  return (
    <div className="flex items-center justify-end gap-2">
      {children}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {items.map((item, index) => (
            <DropdownMenuItem key={index} onClick={item.onClick} className="gap-2">
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
          
          {items.length > 0 && onRefresh && <DropdownMenuSeparator />}
          
          {onRefresh && (
            <DropdownMenuItem onClick={onRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {t('toolbar.refresh')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
