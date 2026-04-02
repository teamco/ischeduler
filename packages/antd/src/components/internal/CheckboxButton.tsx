import { Checkbox, type CheckboxOptionType } from 'antd';
import classnames from 'classnames';
import React from 'react';

import styles from './CheckboxButton.module.less';

type TCheckboxButton = {
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  type?: string;
  value?: string[];
  behavior?: 'hide' | 'show';
  onChange?: (checkedValues: string[]) => void;
  options: (string | number | CheckboxOptionType<string>)[] | undefined;
};

export const CheckboxButton: React.FC<TCheckboxButton> = (props) => {
  const {
    loading,
    className,
    disabled,
    onChange,
    options = [],
    value = [],
    type = 'primary',
    behavior = 'hide',
  } = props;

  return (
    <Checkbox.Group
      options={options}
      className={classnames(className, styles.checkboxWrapper, styles[type], styles[behavior])}
      value={value}
      disabled={disabled || loading}
      onChange={onChange}
    />
  );
};
