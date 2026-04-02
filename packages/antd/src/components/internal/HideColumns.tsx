import { Select, type SelectProps } from 'antd';
import React from 'react';

import { useSchedulerContext } from '@teamco/ischeduler-core';

export interface ISelectItemProps {
  label: string;
  value: string;
  disabled?: boolean;
}

type TProps = {
  columnsList: ISelectItemProps[];
  selectedColumns: string[];
  onChange: (value: string[]) => void;
};

export const HideColumns = (props: TProps): React.JSX.Element => {
  const { t } = useSchedulerContext();

  const { selectedColumns = [], columnsList = [], onChange } = props;

  if (!columnsList?.length) {
    return <></>;
  }

  const placeholder = t('table.hideColumns');

  const sharedProps: SelectProps = {
    mode: 'multiple',
    style: { minWidth: 250 },
    options: [
      {
        label: <span>{placeholder}</span>,
        title: placeholder,
        options: columnsList,
      },
    ],
    placeholder,
    maxTagCount: 'responsive',
  };

  const handleChange = (values: string[]): void => {
    if (values.length < 1) return;
    onChange?.(values);
  };

  return <Select {...sharedProps} value={selectedColumns} onChange={handleChange} />;
};
