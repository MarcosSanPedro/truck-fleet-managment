import type { DataTableConfig, DataTableColumnType } from "@/lib/data-constructor/constructor";

/**
 * Supported data types for filtering and sorting
 */
export type DataType = DataTableColumnType;

/**
 * Sort direction enum
 */
export type SortDirection = "asc" | "desc" | null;

/**
 * Column definition for the generic data table
 */
export interface GenericColumn<T> {
  /** Unique key for the column, should match a property key in T */
  key: string;
  /** Display label for the column header */
  label: string;
  /** Custom render function for cell content */
  render?: (value: any, row: T) => React.ReactNode;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Enable hiding/showing this column */
  enableHiding?: boolean;
  /** Enable filtering for this column */
  enableFiltering?: boolean;
  /** Data type for proper filtering and sorting */
  dataType?: DataType;
  /** Minimum width for the column */
  minWidth?: number;
  /** Whether this column should be sticky (left or right) */
  sticky?: "left" | "right";
  /** Column configuration from constructor */
  constructorConfig?: any;
}

/**
 * Pagination state export interface
 */
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

/**
 * Sorting state export interface
 */
export interface SortingState {
  columnKey: string;
  direction: SortDirection;
}

/**
 * Filter state for different data types
 */
export interface FilterState {
  [columnKey: string]: {
    type: DataType;
    values: string[];
    searchTerm?: string;
    dateRange?: { from: Date | null; to: Date | null };
    numberRange?: { min: number | null; max: number | null };
  };
}

/**
 * Row selection state
 */
export interface RowSelectionState {
  [rowId: string]: boolean;
}

/**
 * Bulk action definition
 */
export interface BulkAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: T[]) => void;
  variant?: "default" | "destructive";
}

/**
 * Props for the DataTable component
 */
export interface DataTableProps<T extends { id?: string | number }> {
  /** Column definitions */
  columns: GenericColumn<T>[];
  /** Table data */
  data: T[];
  /** Edit row callback */
  onEdit?: (row: T) => void;
  /** Delete row callback */
  onDelete?: (row: T) => void;
  /** Add row action configuration */
  addRowAction?: {
    onClick: () => void;
    label: string;
  };
  /** Loading state */
  loading?: boolean;
  /** Row link configuration for navigation */
  rowLinkConfig?: { to: string; paramKey: string };
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Bulk actions for selected rows */
  bulkActions?: BulkAction<T>[];
  /** Enable export functionality */
  enableExport?: boolean;
  /** Custom export function */
  onExport?: (data: T[], selectedRows: T[]) => void;
  /** Default page size */
  defaultPageSize?: number;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Enable global search */
  enableGlobalSearch?: boolean;
  /** Custom search function */
  searchFunction?: (data: T[], searchTerm: string) => T[];
  /** Data constructor configuration */
  dataConstructorConfig?: DataTableConfig;
  /** Auto-generate columns from data */
  autoGenerateColumns?: boolean;
  /** Route path for useSearch (e.g., '/Drivers', '/Trucks', '/Jobs') */
  from?: string;
}

/**
 * Page size options for pagination
 */
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Individual table row component with optimized rendering
 */
export interface DataTableRowProps<T extends { id?: string | number }> {
  row: T;
  columns: GenericColumn<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  rowLinkConfig?: { to: string; paramKey: string };
  isSelected?: boolean;
  onRowSelect?: (rowId: string, selected: boolean) => void;
  enableRowSelection?: boolean;
}