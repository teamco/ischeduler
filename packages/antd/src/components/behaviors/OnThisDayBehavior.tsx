import { DatePicker, Form } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import React from 'react';

import { useSchedulerContext } from '@teamco/ischeduler-core';
import { mergeNames, requiredField } from '@teamco/ischeduler-core';
import { DEFAULT_DATE_TIME_FORMAT, getDisabledDate } from '@teamco/ischeduler-core';

type TOnThisDayProps = {
  disabled?: boolean;
  prefix: string[];
};

export const OnThisDayBehavior = (props: TOnThisDayProps): React.JSX.Element => {
  const { disabled, prefix } = props;
  const { t } = useSchedulerContext();

  const startedAt = Form.useWatch(mergeNames(prefix, 'range', 'startedAt')) as Dayjs;

  const disabledDate = (current: Dayjs) => {
    if (!startedAt) {
      return getDisabledDate(current);
    }
    const minEnd = dayjs(startedAt).add(1, 'day').startOf('day');
    return current && current.isBefore(minEnd);
  };

  const dayProps = {
    format: DEFAULT_DATE_TIME_FORMAT,
    showTime: true,
    disabledDate,
    disabled: disabled || !startedAt,
  };

  const label = t('scheduler.duration.endDate');

  return (
    <Form.Item
      label={label}
      name={mergeNames(prefix, 'range', 'endReason', 'expiredAt')}
      rules={[requiredField(label, true)]}
    >
      <DatePicker {...dayProps} />
    </Form.Item>
  );
};
