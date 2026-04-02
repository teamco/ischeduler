import React from 'react';
import { Chip, Box } from '@mui/material';
import type { IScheduler } from '@teamco/ischeduler-core';

export const handleWeekly = (weekly: IScheduler['repeat']['weekly']) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
    {weekly?.days.map((day: string, idx: number) => (
      <Chip key={idx} label={day} size="small" variant="outlined" color="primary" />
    ))}
  </Box>
);

export const handleMonthly = (
  monthly: IScheduler['repeat']['monthly'],
  weekly: IScheduler['repeat']['weekly'],
) => {
  if (monthly?.type === 'PERIOD') {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {weekly?.days.map((day: string, idx: number) => (
          <Chip 
            key={idx} 
            label={`${monthly.weekDay} ${day}`} 
            size="small" 
            variant="outlined" 
            color="secondary" 
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      <Chip 
        key="monthDay" 
        label={monthly?.monthDay?.toString()} 
        size="small" 
        variant="outlined" 
        color="info" 
      />
    </Box>
  );
};

export const handleYearly = (
  yearly: IScheduler['repeat']['yearly'],
  monthly: IScheduler['repeat']['monthly'],
  weekly: IScheduler['repeat']['weekly'],
) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
    {handleMonthly(monthly, weekly)}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {yearly?.months?.map((month: string, idx: number) => (
        <Chip key={idx} label={month} size="small" variant="outlined" color="warning" />
      ))}
    </Box>
  </Box>
);
