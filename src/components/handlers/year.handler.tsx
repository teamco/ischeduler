import type { Dispatch, SetStateAction } from 'react';
import type { TFn } from '@iScheduler/i18n';
import type { IScheduler } from '@iScheduler/types';
import { handleMsg, handleMultipleDurations } from '@iScheduler/handlers';

export const yearHandler = (
  durationValue: number,
  scheduler: IScheduler,
  setOccurs: Dispatch<SetStateAction<string>>,
  t: TFn,
) => {
  const msg = handleMsg('scheduler.year', 'scheduler.years', durationValue, t);

  const { months } = scheduler.repeat.yearly;

  if (months) {
    const _every = t('scheduler.separator.every');
    const _the = t('scheduler.separator.the');
    const _of = t('scheduler.separator.of');

    const _months = handleMultipleDurations(months, t);
    const _weekDays = handleMultipleDurations(scheduler.repeat?.weekly?.days, t);

    let explanation = scheduler.duration?.period > 1 ? ` ${_of} ${_every} ${msg}` : '';

    if (scheduler.repeat?.monthly?.type === 'PERIOD') {
      explanation =
        `${_the} ${scheduler.repeat?.monthly?.weekDay} ${_weekDays} ${_of} ${_every} ${_months}` +
        explanation;
    } else {
      explanation =
        `${_every} ${_months} ${scheduler.repeat?.monthly?.monthDay}` + explanation;
    }

    setOccurs(explanation);
  }
};
