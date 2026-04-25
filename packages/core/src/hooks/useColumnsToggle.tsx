import { useMemo, useState } from 'react';
import type React from 'react';
import type { ICommonDataType } from '../types';

export interface ISelectItemProps {
  label: string;
  value: string;
  disabled?: boolean;
}

type TColumn = ICommonDataType & {
  concealable?: boolean;
  title?: React.ReactNode;
  label?: React.ReactNode;
  dataIndex?: string;
  hidden?: boolean;
};

const getColumnEffectiveKey = (item: TColumn): string => {
  const k = item.key as string;
  const di = item.dataIndex as string;
  return k ? String(k) : String(di);
};

const getColumnLabel = (item: TColumn): string => {
  const text = item.title ?? item.label;
  const fallback = getColumnEffectiveKey(item);
  if (typeof text === 'string' || typeof text === 'number') return String(text);
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

  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    const hiddenSet = new Set(hiddenByDefault.map(String));
    return columnsList.map((c) => c.value).filter((c) => !hiddenSet.has(c));
  });

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
