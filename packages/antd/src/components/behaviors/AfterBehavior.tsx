import { InputNumber, Form } from 'antd';
import React from 'react';

import { useSchedulerContext } from '@teamco/ischeduler-core';
import { mergeNames, placeholderField, requiredField } from '@teamco/ischeduler-core';

type TAfterBehaviorProps = {
  min?: number;
  prefix?: string[];
  disabled?: boolean;
  required?: boolean;
};

export const AfterBehavior: React.FC<TAfterBehaviorProps> = (props) => {
  const { t } = useSchedulerContext();

  const { min = 1, prefix = [], disabled = false, required = true } = props;

  const occurrences = t('scheduler.occurrences');

  return (
    <Form.Item
      label={occurrences}
      name={mergeNames(prefix, 'range', 'endReason', 'occurrences')}
      rules={[requiredField(occurrences, required)]}
    >
      <InputNumber
        min={min}
        style={{ width: 'calc(100% - 90px)' }}
        disabled={disabled}
        placeholder={placeholderField(occurrences)}
      />
    </Form.Item>
  );
};
