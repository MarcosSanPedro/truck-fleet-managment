"use client";

import React, { useState, useEffect } from 'react';
import { DataTable } from './data-table';
import { DataTableConstructor } from '../lib/data-constructor/constructor';
import type { GenericColumn } from './data-table-types';

// Test data with various data types
const testData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-123-4567',
    date: '2024-01-15',
    number: 42,
    status: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1-555-987-6543',
    date: '2024-03-20',
    number: 15,
    status: false,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1-555-456-7890',
    date: '2024-02-10',
    number: 78,
    status: true,
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    phone: '+1-555-321-0987',
    date: '2024-04-05',
    number: 33,
    status: false,
  },
];

type TestDataType = typeof testData[0];

export function TestFilter() {
  const [data, setData] = useState<TestDataType[]>(testData);
  const [constructor] = useState(() => new DataTableConstructor<TestDataType>(testData, {
    autoDetectTypes: true,
    columns: {
      name: {
        label: 'Name',
        enableSorting: true,
        enableFiltering: true,
      },
      email: {
        label: 'Email',
        type: 'email',
        enableSorting: true,
        enableFiltering: true,
      },
      phone: {
        label: 'Phone',
        type: 'phone',
        enableSorting: false, // Phone numbers should not be sortable
        enableFiltering: true,
      },
      date: {
        label: 'Date',
        type: 'date',
        enableSorting: true, // Dates should be sortable by actual date
        enableFiltering: true,
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
      number: {
        label: 'Number',
        type: 'number',
        enableSorting: true,
        enableFiltering: true,
      },
      status: {
        label: 'Status',
        type: 'boolean',
        enableSorting: true,
        enableFiltering: true,
        render: (value: boolean) => (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value ? 'Active' : 'Inactive'}
          </span>
        ),
      },
    },
  }));

  // Convert constructor columns to GenericColumn format
  const columns: GenericColumn<TestDataType>[] = React.useMemo(() => {
    return constructor.getDataTableColumns().map(col => ({
      key: col.key,
      label: col.label,
      dataType: col.dataType as any,
      enableSorting: col.sortable,
      enableFiltering: col.filterable,
      visible: col.visible,
      minWidth: col.minWidth,
      sticky: col.sticky,
      render: col.render,
    }));
  }, [constructor]);

  // Update constructor when data changes
  useEffect(() => {
    constructor.data = data;
    constructor.autoGenTypes();
  }, [data, constructor]);

  const handleEdit = (row: TestDataType) => {
    console.log('Edit:', row);
  };

  const handleDelete = (row: TestDataType) => {
    setData(prev => prev.filter(item => item.id !== row.id));
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Data Table Constructor Test</h2>
        <p className="text-gray-600 mb-4">
          This test demonstrates the improved sorting functionality:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
          <li><strong>Phone numbers</strong> are not sortable (sorting disabled)</li>
          <li><strong>Dates</strong> are sorted by actual date values, not string comparison</li>
          <li><strong>Numbers</strong> are sorted numerically</li>
          <li><strong>Emails</strong> are detected and rendered as clickable links</li>
          <li><strong>Booleans</strong> are rendered as status badges</li>
        </ul>
      </div>

      <DataTable<TestDataType>
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableGlobalSearch={true}
        enableExport={true}
        dataConstructorConfig={constructor.config}
        autoGenerateColumns={false}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Constructor Information:</h3>
        <div className="text-sm space-y-1">
          <p><strong>Detected Columns:</strong> {constructor.detectedColumns.length}</p>
          <p><strong>Data Rows:</strong> {constructor.data.length}</p>
          <div className="mt-2">
            <strong>Column Analysis:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              {constructor.detectedColumns.map(col => (
                <li key={col.key}>
                  {col.label}: {col.dataType} 
                  {col.isSortable ? ' (sortable)' : ' (not sortable)'}
                  {col.isFilterable ? ' (filterable)' : ' (not filterable)'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 