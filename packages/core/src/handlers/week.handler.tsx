import type { Dispatch, SetStateAction } from 'react';
import type { TFn } from '../i18n';
import type { IScheduler } from '../types';
import { handleMsg, handleMultipleDurations } from '../handlers';

export const weekHandler = (
  durationValue: number,
  scheduler: IScheduler,
  setOccurs: Dispatch<SetStateAction<string>>,
  t: TFn,
) => {
  const _weekPeriod = scheduler.repeat?.weekly?.days || [];

  const msg = handleMsg('scheduler.week', 'scheduler.weeks', durationValue, t);

  const _day = t('scheduler.separator.day');
  const _on = t('scheduler.separator.on');
  const _every = t('scheduler.separator.every');

  const _daysPeriod =
    _weekPeriod?.length === 7 ? _day : handleMultipleDurations(_weekPeriod, t);

  if (durationValue === 1) {
    setOccurs(`${_every} ${_daysPeriod}`);
  } else {
    setOccurs(`${_every} ${msg} ${_on} ${_daysPeriod}`);
  }
};
