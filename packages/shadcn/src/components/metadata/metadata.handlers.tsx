import React from 'react';
import { Badge } from "../ui/badge"
import type { IScheduler } from '@teamco/ischeduler-core';

export const handleWeekly = (weekly: IScheduler['repeat']['weekly']) => (
  <div className="flex flex-wrap gap-1">
    {weekly?.days.map((day, idx) => (
      <Badge key={idx} variant="outline" className="font-normal">
        {day}
      </Badge>
    ))}
  </div>
);

export const handleMonthly = (
  monthly: IScheduler['repeat']['monthly'],
  weekly: IScheduler['repeat']['weekly'],
) => {
  if (monthly?.type === 'PERIOD') {
    return (
      <div className="flex flex-wrap gap-1">
        {weekly?.days.map((day, idx) => (
          <Badge 
            key={idx} 
            variant="outline" 
            className="font-normal bg-blue-50 text-blue-700 border-blue-200" 
          >
            {`${monthly.weekDay} ${day}`}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      <Badge 
        variant="outline" 
        className="font-normal bg-orange-50 text-orange-700 border-orange-200" 
      >
        {monthly?.monthDay}
      </Badge>
    </div>
  );
};

export const handleYearly = (
  yearly: IScheduler['repeat']['yearly'],
  monthly: IScheduler['repeat']['monthly'],
  weekly: IScheduler['repeat']['weekly'],
) => (
  <div className="flex flex-col gap-1">
    {handleMonthly(monthly, weekly)}
    <div className="flex flex-wrap gap-1">
      {yearly?.months?.map((month, idx) => (
        <Badge key={idx} variant="outline" className="font-normal bg-purple-50 text-purple-700 border-purple-200">
          {month}
        </Badge>
      ))}
    </div>
  </div>
);
