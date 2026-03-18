import { Form, type FormInstance, Tooltip } from 'antd';
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CheckboxButton } from '@iScheduler/components/internal/CheckboxButton';
import { MonthlyBehavior } from '@iScheduler/components/behaviors/MonthlyBehavior';
import { handleDurationValueChange } from '@iScheduler/handlers';
import { useSchedulerContext } from '@iScheduler/provider/SchedulerContext';
import { EMonths } from '@iScheduler/types';
import { mergeNames, requiredField, setNestedDynamicFields } from '@iScheduler/utils/form.util';

import styles from '@iScheduler/styles/scheduler.module.less';

type TYearlyBehaviorProps = {
  shortFormat?: boolean;
  isMultiple?: boolean;
  prefix: string[];
  disabled?: boolean;
  namespaces?: string[];
  formRef: FormInstance;
  setOccurs: Dispatch<SetStateAction<string>>;
};

export const YearlyBehavior: React.FC<TYearlyBehaviorProps> = (props) => {
  const { t, loading } = useSchedulerContext();

  const {
    shortFormat = true,
    isMultiple = false,
    setOccurs,
    formRef,
    prefix,
    namespaces = ['repeat', 'yearly'],
    disabled,
  } = props;

  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const fieldNames = mergeNames([...prefix, ...namespaces], 'months');

  const longMonths = useMemo(
    () =>
      Object.keys(EMonths).map((month) =>
        t(`scheduler.months.${EMonths[month as keyof typeof EMonths].toLowerCase()}`),
      ),
    [t],
  );

  const shortMonths = useMemo(
    () =>
      Object.keys(EMonths).map((month) =>
        t(`scheduler.months.short.${EMonths[month as keyof typeof EMonths].toLowerCase()}`),
      ),
    [t],
  );

  useEffect(
    () => {
      const selected = formRef.getFieldValue(fieldNames);
      if (selected) onChangePeriod(selected);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formRef],
  );

  const months = Object.keys(EMonths).map((month, idx) => ({
    key: `${month}-${idx}`,
    label: shortFormat ? (
      <Tooltip title={longMonths[idx]}>{shortMonths[idx]}</Tooltip>
    ) : (
      longMonths[idx]
    ),
    value: month,
  }));

  const onChangePeriod = (values: string[]) => {
    let selected = [...values];

    if (selected.length) {
      if (!isMultiple) {
        selected = values.filter((month) => !selectedMonths.includes(month));
      }
    } else {
      selected = selectedMonths;
    }

    setSelectedMonths(selected);
    setNestedDynamicFields(formRef, fieldNames.join('.'), selected);

    const scheduler = formRef.getFieldValue(prefix);
    handleDurationValueChange(
      { type: scheduler.duration.type, period: scheduler.duration.period },
      scheduler,
      setOccurs,
      t,
    );
  };

  return (
    <div className={styles.yearWrapper}>
      <Form.Item
        noStyle
        name={fieldNames}
        rules={[requiredField(t('scheduler.months'))]}
      >
        <CheckboxButton
          options={months}
          disabled={disabled}
          className={styles.monthsWrapper}
          loading={loading}
          onChange={onChangePeriod}
          value={selectedMonths}
        />
      </Form.Item>
      <MonthlyBehavior
        formRef={formRef}
        prefix={prefix}
        disabled={disabled}
        setOccurs={setOccurs}
      />
    </div>
  );
};
