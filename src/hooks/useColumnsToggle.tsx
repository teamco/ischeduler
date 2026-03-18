import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';

import type { ISelectItemProps } from '@iScheduler/components/internal/HideColumns';
import type { ICommonDataType } from '@iScheduler/types';

type TColumn = ICommonDataType & {
  concealable?: boolean;
  title?: React.ReactNode;
  dataIndex?: string;
  hidden?: boolean;
};

const getColumnEffectiveKey = (item: TColumn): string => {
  const k = item.key as string;
  const di = item.dataIndex as string;
  return k ? String(k) : String(di);
};

const getColumnLabel = (item: TColumn): string => {
  const title = item.title;
  const fallback = getColumnEffectiveKey(item);

  if (typeof title === 'string' || typeof title === 'number') return String(title);

  return fallback;
};

export const filterOutColumns = (columns: TColumn[], selectedColumns: string[]): TColumn[] =>
  columns.map((item) => ({
    ...item,
    hidden: item.concealable && !selectedColumns.includes(getColumnEffectiveKey(item)),
  }));

export const useColumnsToggle = (
  columns: TColumn[],
  hiddenByDefault: string[] = [],
): {
  columnsList: ISelectItemProps[];
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  filteredColumns: TColumn[];
} => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const initializedRef = useRef(false);

  const columnsList = useMemo<ISelectItemProps[]>(
    () =>
      columns
        .filter((col) => col.concealable)
        .map((col) => ({
          label: getColumnLabel(col),
          value: getColumnEffectiveKey(col),
        })),
    [columns],
  );

  useEffect(() => {
    if (!initializedRef.current && columnsList.length > 0) {
      const hiddenSet = new Set(hiddenByDefault.map(String));
      const concealable = columnsList.map((c) => c.value);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedColumns(concealable.filter((c) => !hiddenSet.has(c)));
      initializedRef.current = true;
    }
  }, [columnsList, hiddenByDefault]);

  const filteredColumns = useMemo<TColumn[]>(
    () => filterOutColumns(columns, selectedColumns),
    [columns, selectedColumns],
  );

  return {
    columnsList,
    selectedColumns,
    setSelectedColumns,
    filteredColumns,
  };
};
