import React, { useState, useMemo } from 'react';
import { Table, Input, Select, Space, Spin, Alert, Button } from 'antd';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import type { DefaultOptionType } from 'antd/lib/select';
import type { SorterResult } from 'antd/es/table/interface';

interface TableSettingsProps<T> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  columns: ColumnsType<T>;
  filterOptions: DefaultOptionType[];
  editModal: React.ReactNode;
  onPageSizeChange: (size: number) => void;
  initialSort: SorterResult<T>;
  pageSize: number;
  buttonText: string;
  onActionClick: () => void;
  actionModal: React.ReactNode;
}

export const TableSettings = <T extends object>({
  data,
  isLoading,
  isError,
  error,
  columns,
  filterOptions,
  editModal,
  onPageSizeChange,
  initialSort,
  pageSize,
  buttonText,
  onActionClick,
  actionModal,
}: TableSettingsProps<T>) => {
  const [searchText, setSearchText] = useState('');
  const [filterField, setFilterField] = useState<string>(filterOptions[0]?.value as string);
  const [sortState, setSortState] = useState<SorterResult<T>>(initialSort);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const text = searchText.trim().toLowerCase();
      if (!text) return true;

      const value = (item as any)[filterField];
      return value?.toString().toLowerCase().includes(text);
    });
  }, [data, searchText, filterField]);

  const sortedData = useMemo(() => {
    if (!sortState.columnKey || !sortState.order) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[sortState.columnKey as keyof T];
      const bValue = (b as any)[sortState.columnKey as keyof T];
      return sortState.order === 'ascend'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredData, sortState]);

  const handleTableChange: TableProps<T>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter)) {
      setSortState(sorter as SorterResult<T>);
    }
  };

  if (isLoading) return <Spin size="large" />;
  if (isError) return <Alert type="error" message={error?.message} />;

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Select
          value={filterField}
          onChange={setFilterField}
          options={filterOptions}
          style={{ width: 140 }}
        />

        <Input
          placeholder={`Search by ${filterField}`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 240 }}
        />
        <Button onClick={onActionClick}>{buttonText}</Button>
      </Space>

      <Table<T>
        rowKey="id"
        dataSource={sortedData}
        columns={columns}
        pagination={{
          pageSize: pageSize,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          onShowSizeChange: (_, size) => onPageSizeChange(size),
        }}
        onChange={handleTableChange}
      />

      {editModal}
      {actionModal}
    </>
  );
};
