import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useSchedulerContext } from '@teamco/ischeduler-core';
import dayjs, { Dayjs } from 'dayjs';

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
    <DateTimePicker
      label={t('scheduler.duration.endDate')}
      value={value ?? null}
      onChange={onChange}
      disabled={disabled || !startedAt}
      minDateTime={minDate}
      slotProps={{
        textField: {
          size: 'small',
          fullWidth: true,
        },
      }}
    />
  );
};
