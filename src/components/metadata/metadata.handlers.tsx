import { Tag } from 'antd';
import React from 'react';

import { COLORS } from '@iScheduler/utils/colors.util';
import type { IScheduler } from '@iScheduler/types';

export const handleWeekly = (weekly: IScheduler['repeat']['weekly']) => (
  <div>
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
      <div>
        {weekly?.days.map((day, idx) => (
          <Tag key={idx} color={COLORS.tags.cyan}>
            {`${monthly.weekDay} ${day}`}
          </Tag>
        ))}
      </div>
    );
  }

  return (
    <div>
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
    <div>
      {yearly?.months?.map((month, idx) => (
        <Tag key={idx} color={COLORS.tags.magenta}>
          {month}
        </Tag>
      ))}
    </div>
  </>
);
