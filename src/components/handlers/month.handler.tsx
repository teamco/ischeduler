import type { Dispatch, SetStateAction } from 'react';
import type { TFn } from '@iScheduler/i18n';
import type { IScheduler } from '@iScheduler/types';
import { handleMsg, handleMultipleDurations, handleSelectWeeklyDay } from '@iScheduler/handlers';

export const monthHandler = (
  durationValue: number,
  scheduler: IScheduler,
  setOccurs: Dispatch<SetStateAction<string>>,
  t: TFn,
) => {
  const _weekDays = scheduler.repeat?.weekly?.days;

  const msg = handleMsg('scheduler.month', 'scheduler.months', durationValue, t);

  const _monthPeriod = scheduler.repeat?.monthly;

  if (_monthPeriod?.type === 'DAY') {
    handleSelectWeeklyDay(scheduler.duration.period, scheduler, setOccurs, t, {
      msg,
    });
  } else if (_monthPeriod?.type === 'PERIOD') {
    const _the = t('scheduler.separator.the');
    const _of = t('scheduler.separator.of');
    const _every = t('scheduler.separator.every');
    const _which = _monthPeriod.weekDay;

    const _days = handleMultipleDurations(_weekDays, t);

    setOccurs(`${_the} ${_which} ${_days} ${_of} ${_every} ${msg}`);
  }
};
