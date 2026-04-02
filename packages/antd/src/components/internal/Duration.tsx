import { Form, InputNumber, Select, Space } from 'antd';
import React from 'react';

import { useSchedulerContext } from '@teamco/ischeduler-core';
import { CNsDuration, EDurationTypes } from '@teamco/ischeduler-core';
import { mergeNames, requiredField } from '@teamco/ischeduler-core';

type TDurationProps = {
  min?: number;
  label: string;
  disabled: boolean;
  exclude?: (keyof typeof EDurationTypes)[];
  durationTypes: (keyof typeof EDurationTypes)[];
  required: boolean;
  prefix?: string[];
  namespace?: string;
  onTypeChange?: (value: keyof typeof EDurationTypes) => void;
  onValueChange?: (value: number | null) => void;
};

export const Duration: React.FC<TDurationProps> = (props) => {
  const { t } = useSchedulerContext();

  const {
    min = 1,
    label,
    disabled,
    durationTypes = [],
    required,
    prefix = [],
    exclude = [],
    namespace = CNsDuration,
    onTypeChange,
    onValueChange,
  } = props;

  return (
    <Form.Item label={label}>
      <Space.Compact style={{ width: '100%' }}>
        <Form.Item
          noStyle
          name={mergeNames(prefix, namespace, 'type')}
          rules={[requiredField(t('scheduler.meta.duration'), required)]}
        >
          <Select
            style={{ width: 150 }}
            disabled={disabled}
            onChange={onTypeChange}
            options={durationTypes
              .filter((duration) => !exclude.includes(duration))
              .map((duration, idx) => ({
                key: `${duration}-${idx}`,
                value: duration,
                label: EDurationTypes[duration],
              }))}
          />
        </Form.Item>
        <Form.Item
          noStyle
          name={mergeNames(prefix, namespace, 'period')}
          tooltip={requiredField(label).message}
          rules={[requiredField(label, required)]}
        >
          <InputNumber
            min={min}
            onChange={onValueChange}
            style={{ width: '100%' }}
            disabled={disabled}
            placeholder={label}
          />
        </Form.Item>
      </Space.Compact>
    </Form.Item>
  );
};
