import React from 'react';
import { useSchedulerContext } from '@teamco/ischeduler-core';
import dayjs, { Dayjs } from 'dayjs';
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "../../lib/utils"

type TOnThisDayProps = {
  disabled?: boolean;
  value?: Dayjs | null;
  startedAt?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
};

export const OnThisDayBehavior: React.FC<TOnThisDayProps> = (props) => {
  const { disabled, value, startedAt, onChange } = props;
  const { t } = useSchedulerContext();

  const minDate = startedAt ? dayjs(startedAt).add(1, 'day') : dayjs();

  return (
    <div className="flex flex-col gap-2">
      <Label>{t('scheduler.duration.endDate')}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled || !startedAt}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value.toDate(), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value?.toDate()}
            onSelect={(date) => onChange?.(date ? dayjs(date) : null)}
            disabled={(date) => date < minDate.toDate()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
