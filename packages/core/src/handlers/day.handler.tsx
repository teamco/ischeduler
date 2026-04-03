import type { Dispatch, SetStateAction } from 'react';
import type { TFn } from '../i18n';
import { handleMsg } from '../handlers';

export const dayHandler = (
  durationValue: number,
  extender: string,
  setOccurs: Dispatch<SetStateAction<string>>,
  t: TFn,
) => {
  const _every = t('scheduler.separator.every');

  const msg = `${_every} ${handleMsg('scheduler.day', 'scheduler.days', durationValue, t)}`;

  setOccurs(`${extender}${msg}`);
};
