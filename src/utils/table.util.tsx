import { FieldNumberOutlined } from '@ant-design/icons';
import React from 'react';
import type { IObjectId, ICommonDataType } from '../types';

/**
 * Add idx and key properties to each item for Table rendering.
 */
export const indexable = <T extends IObjectId>(items: T[]): T[] =>
  items.map((item: T, idx: number) => ({
    ...item,
    idx: idx + 1,
    key: item.id,
  }));

/**
 * Index column configuration for antd Table.
 */
export const indexColumn: ICommonDataType = {
  key: 'idx',
  title: (<FieldNumberOutlined />) as React.ReactNode,
  dataIndex: 'idx',
  rowScope: 'row',
  width: 70,
  fixed: 'left',
  align: 'center',
};

/**
 * Action column configuration for antd Table.
 */
export const actionField = (width: number = 100, label: string = 'Actions'): ICommonDataType => ({
  title: label,
  key: 'operation',
  fixed: 'right',
  align: 'center',
  width,
});
