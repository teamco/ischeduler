import { Form, type FormInstance, Tooltip } from 'antd';
import classnames from 'classnames';
import React, {
  type Dispatch,
  type JSX,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { CheckboxButton } from '@iScheduler/components/internal/CheckboxButton';
import { handleDurationValueChange } from '@iScheduler/handlers';
import { useSchedulerContext } from '@iScheduler/provider/SchedulerContext';
import { CFirstDayIdx, EDays } from '@iScheduler/types';
import { getKeyFromEnum } from '@iScheduler/types';
import { mergeNames, requiredField } from '@iScheduler/utils/form.util';

import styles from '@iScheduler/styles/scheduler.module.less';

type TWeeklyBehaviorProps = {
  formRef: FormInstance;
  disabled: boolean;
  shortFormat?: boolean;
  isMultiple?: boolean;
  extendBy?: {
    key: string;
    label: string | JSX.Element;
    value: string;
  }[];
  prefix: string[];
  namespaces?: string[];
  setOccurs: Dispatch<SetStateAction<string>>;
};

export const WeeklyBehavior: React.FC<TWeeklyBehaviorProps> = (props) => {
  const { t, loading } = useSchedulerContext();

  const {
    formRef,
    shortFormat = true,
    isMultiple = false,
    extendBy = [],
    namespaces = ['repeat', 'weekly'],
    prefix,
    disabled,
    setOccurs,
  } = props;

  const fieldNames = mergeNames([...prefix, ...namespaces], 'days');
  const prevSelectionRef = useRef<string[]>([]);

  // On mount, read initial value and update occurs text
  useEffect(() => {
    const selected = formRef.getFieldValue(fieldNames);
    if (Array.isArray(selected) && selected.length) {
      prevSelectionRef.current = selected;
      updateOccursText();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef]);

  const updateOccursText = useCallback(() => {
    const scheduler = formRef.getFieldValue(prefix);
    if (scheduler?.duration) {
      handleDurationValueChange(
        { type: scheduler.duration.type, period: scheduler.duration.period },
        scheduler,
        setOccurs,
        t,
      );
    }
  }, [formRef, prefix, setOccurs, t]);

  const longDays = useMemo(
    () =>
      Object.keys(EDays).map((day) =>
        t(`scheduler.weekdays.${EDays[day as keyof typeof EDays].toLowerCase()}`),
      ),
    [t],
  );

  const shortDays = useMemo(
    () =>
      Object.keys(EDays).map((day) =>
        t(`scheduler.weekdays.short.${EDays[day as keyof typeof EDays].toLowerCase()}`),
      ),
    [t],
  );

  const orderByFirstDayOfWeek = (days: string[]) =>
    days.map((_, i) => days[(i + CFirstDayIdx) % 7]);

  const weekShortDays = orderByFirstDayOfWeek(shortDays);
  const weekLongDays = orderByFirstDayOfWeek(longDays);

  let options = (shortFormat ? weekShortDays : weekLongDays).map((day, idx) => {
    const enumValue = weekLongDays[idx] as EDays;
    const optValue = getKeyFromEnum(EDays, enumValue) as string;

    return {
      key: `${day}-${idx}`,
      label: shortFormat ? <Tooltip title={weekLongDays[idx]}>{day}</Tooltip> : day,
      value: optValue,
    };
  });

  let _wrapperCss: string | undefined;
  if (extendBy.length) {
    options = [...options, ...extendBy];
    _wrapperCss = styles.weekDaysWrap;
  }

  // Called by antd Form.Item when CheckboxButton value changes.
  // Form.Item already syncs the value to the form — we just need to update occurs text.
  const onChangePeriod = useCallback(
    (values: string[]) => {
      if (!isMultiple) {
        // Single-select: keep only newly clicked item
        const prev = prevSelectionRef.current;
        const newOnly = values.filter((day) => !prev.includes(day));
        const selected = newOnly.length ? newOnly : values;

        // Update the form field to the single selection
        formRef.setFieldValue(fieldNames, selected);
        prevSelectionRef.current = selected;
      } else {
        // Multiple mode: antd handles toggle, just track it
        prevSelectionRef.current = values;
      }

      // Update the "occurs" summary text
      updateOccursText();
    },
    [isMultiple, formRef, fieldNames, updateOccursText],
  );

  return (
    <div className={classnames(styles.weekWrapper, _wrapperCss)}>
      <Form.Item
        label={t('scheduler.days')}
        name={fieldNames}
        rules={[requiredField(t('scheduler.days'))]}
      >
        <CheckboxButton
          loading={loading}
          disabled={disabled}
          options={options}
          onChange={onChangePeriod}
        />
      </Form.Item>
    </div>
  );
};
