import { Tag } from 'antd';
import styles from '../../styles/scheduler.module.less';

import { COLORS } from '@teamco/ischeduler-core';
import type { IScheduler } from '@teamco/ischeduler-core';

export const handleWeekly = (weekly: IScheduler['repeat']['weekly']) => (
  <div className={styles.tagsWrapper}>
    {weekly?.days.map((day, idx) => (
      <Tag key={idx} color={COLORS.tags.volcano}>
        {day}
      </Tag>
    ))}
  </div>
);

export const handleMonthly = (
  monthly: IScheduler['repeat']['monthly'],
  weekly: IScheduler['repeat']['weekly'],
) => {
  if (monthly?.type === 'PERIOD') {
    return (
      <div className={styles.tagsWrapper}>
        {weekly?.days.map((day, idx) => (
          <Tag key={idx} color={COLORS.tags.cyan}>
            {`${monthly.weekDay} ${day}`}
          </Tag>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.tagsWrapper}>
      <Tag key="monthDay" color={COLORS.tags.gold}>
        {monthly?.monthDay}
      </Tag>
    </div>
  );
};

export const handleYearly = (
  yearly: IScheduler['repeat']['yearly'],
  monthly: IScheduler['repeat']['monthly'],
  weekly: IScheduler['repeat']['weekly'],
) => (
  <>
    {handleMonthly(monthly, weekly)}
    <div className={styles.tagsWrapper}>
      {yearly?.months?.map((month, idx) => (
        <Tag key={idx} color={COLORS.tags.magenta}>
          {month}
        </Tag>
      ))}
    </div>
  </>
);
