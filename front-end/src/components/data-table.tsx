"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
  IconFilter,
  IconX,
  IconSearch,
  IconDownload,
  IconSortAscending,
  IconSortDescending,
  IconSelector,
  IconTrash,
  IconEdit,
  IconCopy,
  IconStar,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";

/**
 * Supported data types for filtering and sorting
 */
type DataType = "string" | "number" | "boolean" | "date";

/**
 * Sort direction enum
 */
type SortDirection = "asc" | "desc" | null;

/**
 * Column definition for the generic data table
 */
export interface GenericColumn<T> {
  /** Unique key for the column, should match a property key in T */
  key: keyof T | string;
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
}

/**
 * Pagination state interface
 */
interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

/**
 * Sorting state interface
 */
interface SortingState {
  columnKey: string;
  direction: SortDirection;
}

/**
 * Filter state for different data types
 */
interface FilterState {
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
interface RowSelectionState {
  [rowId: string]: boolean;
}

/**
 * Bulk action definition
 */
interface BulkAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: T[]) => void;
  variant?: "default" | "destructive";
}

/**
 * Props for the DataTable component
 */
interface DataTableProps<T extends { id?: string | number }> {
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
}

/**
 * Page size options for pagination
 */
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Individual table row component with optimized rendering
 */
interface DataTableRowProps<T extends { id?: string | number }> {
  row: T;
  columns: GenericColumn<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  rowLinkConfig?: { to: string; paramKey: string };
  isSelected?: boolean;
  onRowSelect?: (rowId: string, selected: boolean) => void;
  enableRowSelection?: boolean;
}

function DataTableRowInner<T extends { id?: string | number }>(props: DataTableRowProps<T>) {
  const { row, columns, onEdit, onDelete, rowLinkConfig, isSelected, onRowSelect, enableRowSelection } = props;
  const navigate = useNavigate();

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-dropdown]") ||
      target.closest("[data-checkbox]")
    ) {
      return;
    }
    if (rowLinkConfig && row.id) {
      const linkTo = `${rowLinkConfig.to}/${row.id}`;
      navigate({ to: linkTo });
    }
  };

  const handleRowSelect = (checked: boolean) => {
    if (onRowSelect && row.id) {
      onRowSelect(String(row.id), checked);
    }
  };

  return (
    <TableRow
      className={`
        ${rowLinkConfig ? "cursor-pointer hover:bg-muted/50" : ""}
        ${isSelected ? "bg-muted/30" : ""}
      `}
      onClick={rowLinkConfig ? handleRowClick : undefined}
    >
      {enableRowSelection && (
        <TableCell className="w-12">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleRowSelect}
            aria-label={`Select row ${row.id}`}
            data-checkbox
          />
        </TableCell>
      )}
      {columns.map((col) => (
        <TableCell
          key={col.key as string}
          className={
            col.sticky
              ? `sticky ${col.sticky === "left" ? "left-0" : "right-0"} bg-background`
              : ""
          }
          style={{ minWidth: col.minWidth }}
        >
          {col.render ? (
            col.render(row[col.key as keyof T], row)
          ) : typeof row[col.key as keyof T] === "boolean" ? (
            <Badge
              variant={row[col.key as keyof T] ? "default" : "secondary"}
            >
              {row[col.key as keyof T] ? "Yes" : "No"}
            </Badge>
          ) : typeof row[col.key as keyof T] === "string" ||
            typeof row[col.key as keyof T] === "number" ? (
            (row[col.key as keyof T] as React.ReactNode)
          ) : (
            JSON.stringify(row[col.key as keyof T])
          )}
        </TableCell>
      ))}
      {(onEdit || onDelete) && (
        <TableCell className="w-12">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
                data-dropdown
              >
                <IconDotsVertical className="h-4 w-4" />
                <span className="sr-only">Open row actions menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(row)}>
                  <IconEdit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(JSON.stringify(row))
                }
              >
                <IconCopy className="h-4 w-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconStar className="h-4 w-4 mr-2" />
                Favorite
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(row)}
                  className="text-destructive focus:text-destructive"
                >
                  <IconTrash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
}

const DataTableRow = React.memo(DataTableRowInner) as typeof DataTableRowInner;

/**
 * Advanced filter component that handles different data types
 */
function ColumnFilter<T extends { id?: string | number }>({
  column,
  data,
  filters,
  setFilters,
}: {
  column: GenericColumn<T>;
  data: T[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const dataType = column.dataType || "string";
  const columnKey = column.key as string;
  const currentFilter = filters[columnKey];

  /**
   * Get unique values for the column
   */
  const uniqueValues = React.useMemo(() => {
    const values = new Set<string>();
    data.forEach((row) => {
      const value = row[column.key as keyof T];
      if (value !== null && value !== undefined) {
        values.add(String(value));
      }
    });
    return Array.from(values).sort();
  }, [data, column.key]);

  // Skip filtering for columns with too many unique values or disabled filtering
  if (uniqueValues.length >= 50 || column.enableFiltering === false) {
    return <span className="font-medium">{column.label}</span>;
  }

  const filteredValues = uniqueValues.filter((value) =>
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle filter value toggle for multiselect
   */
  const handleToggleFilter = (value: string) => {
    const newFilters = { ...filters };
    const currentValues = currentFilter?.values || [];

    if (dataType === "boolean") {
      // For boolean, only allow single selection
      newFilters[columnKey] = {
        type: dataType,
        values: currentValues.includes(value) ? [] : [value],
      };
    } else {
      // For other types, allow multiselect
      if (currentValues.includes(value)) {
        const updatedValues = currentValues.filter((v) => v !== value);
        if (updatedValues.length === 0) {
          delete newFilters[columnKey];
        } else {
          newFilters[columnKey] = { ...currentFilter, values: updatedValues };
        }
      } else {
        newFilters[columnKey] = {
          type: dataType,
          values: [...currentValues, value],
        };
      }
    }

    setFilters(newFilters);
  };

  /**
   * Clear all filters for this column
   */
  const clearFilters = () => {
    const newFilters = { ...filters };
    delete newFilters[columnKey];
    setFilters(newFilters);
  };

  const activeFilterCount = currentFilter?.values.length || 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 font-medium">
          <IconFilter className="h-4 w-4 mr-1" />
          {column.label}
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
          <IconChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {dataType !== "boolean" && (
          <>
            <div className="p-2">
              <Input
                placeholder={`Search ${column.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <div className="max-h-60 overflow-y-auto">
          {dataType === "boolean" ? (
            <DropdownMenuRadioGroup
              value={currentFilter?.values[0] || ""}
              onValueChange={(value) => handleToggleFilter(value)}
            >
              <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="true">Yes</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="false">No</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          ) : (
            filteredValues.map((value) => (
              <DropdownMenuCheckboxItem
                key={value}
                checked={currentFilter?.values.includes(value) || false}
                onCheckedChange={() => handleToggleFilter(value)}
              >
                {value}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </div>

        {activeFilterCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={clearFilters}
              className="text-destructive"
            >
              <IconX className="h-4 w-4 mr-2" />
              Clear filter
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Main DataTable component with full feature set
 */
export function DataTable<T extends { id?: string | number }>({
  columns,
  data: initialData,
  onEdit,
  onDelete,
  addRowAction,
  loading,
  rowLinkConfig,
  enableRowSelection = false,
  bulkActions = [],
  enableExport = false,
  onExport,
  defaultPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  enableGlobalSearch = true,
  searchFunction,
}: DataTableProps<T>) {
  // State management
  const [data] = React.useState<T[]>(() => initialData);
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [filters, setFilters] = React.useState<FilterState>({});
  const [sorting, setSorting] = React.useState<SortingState>({
    columnKey: "",
    direction: null,
  });
  const [globalSearch, setGlobalSearch] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  /**
   * Apply global search to data
   */
  const searchedData = React.useMemo(() => {
    if (!globalSearch.trim()) return data;

    if (searchFunction) {
      return searchFunction(data, globalSearch);
    }

    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(globalSearch.toLowerCase())
      )
    );
  }, [data, globalSearch, searchFunction]);

  /**
   * Apply column filters to data
   */
  const filteredData = React.useMemo(() => {
    return searchedData.filter((row) => {
      return Object.entries(filters).every(([columnKey, filter]) => {
        if (filter.values.length === 0) return true;
        const value = String(row[columnKey as keyof T]);
        return filter.values.includes(value);
      });
    });
  }, [searchedData, filters]);

  /**
   * Apply sorting to data
   */
  const sortedData = React.useMemo(() => {
    if (!sorting.direction || !sorting.columnKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sorting.columnKey as keyof T];
      const bValue = b[sorting.columnKey as keyof T];

      let comparison = 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sorting.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sorting]);

  /**
   * Apply pagination to data
   */
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return sortedData.slice(start, start + pagination.pageSize);
  }, [sortedData, pagination]);

  /**
   * Get selected rows data
   */
  const selectedRows = React.useMemo(() => {
    return data.filter((row) => row.id && rowSelection[String(row.id)]);
  }, [data, rowSelection]);

  /**
   * Handle column sorting
   */
  const handleSort = (columnKey: string) => {
    setSorting((prev) => {
      if (prev.columnKey !== columnKey) {
        return { columnKey, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { columnKey, direction: "desc" };
      }
      return { columnKey: "", direction: null };
    });
  };

  /**
   * Handle row selection
   */
  const handleRowSelect = (rowId: string, selected: boolean) => {
    setRowSelection((prev) => ({
      ...prev,
      [rowId]: selected,
    }));
  };

  /**
   * Handle select all rows
   */
  const handleSelectAll = (selected: boolean) => {
    const newSelection: RowSelectionState = {};
    if (selected) {
      paginatedData.forEach((row) => {
        if (row.id) {
          newSelection[String(row.id)] = true;
        }
      });
    }
    setRowSelection(newSelection);
  };

  /**
   * Handle export functionality
   */
  const handleExport = () => {
    if (onExport) {
      onExport(sortedData, selectedRows);
    } else {
      // Default CSV export
      const csvContent = [
        columns.map((col) => col.label).join(","),
        ...sortedData.map((row) =>
          columns
            .map((col) => {
              const value = row[col.key as keyof T];
              return typeof value === "string" ? `"${value}"` : String(value);
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data-export.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Reset pagination when filters or search change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, globalSearch]);

  // Visible columns
  const visibleColumns = columns.filter(
    (col) => columnVisibility[col.key as string] !== false
  );
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => row.id && rowSelection[String(row.id)]);
  const isSomeSelected = paginatedData.some(
    (row) => row.id && rowSelection[String(row.id)]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-col gap-6 rounded-lg h-full flex flex-grow bg-background py-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between px-4 lg:px-6 gap-4">
        <div className="flex items-center gap-2 flex-1">
          {/* Global Search */}
          {enableGlobalSearch && (
            <div className="relative max-w-sm">
              <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Bulk Actions */}
          {enableRowSelection && selectedRows.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions ({selectedRows.length})
                  <IconChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {bulkActions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(selectedRows)}
                    className={
                      action.variant === "destructive" ? "text-destructive" : ""
                    }
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Button */}
          {enableExport && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <IconDownload className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">Columns</span>
                <IconChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key as string}
                  className="capitalize"
                  checked={columnVisibility[column.key as string] !== false}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [column.key as string]: !!value,
                    }))
                  }
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Row Button */}
          {addRowAction && (
            <Button size="sm" onClick={addRowAction.onClick}>
              <IconPlus className="h-4 w-4 mr-1" />
              <span className="hidden lg:inline">{addRowAction.label}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 flex-grow">
        <div className="overflow-hidden rounded-lg border flex-grow">
          <Table className="relative">
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                {enableRowSelection && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                )}
                {visibleColumns.map((col) => (
                  <TableHead
                    key={col.key as string}
                    className={`
                      ${col.sticky ? `sticky ${col.sticky === "left" ? "left-0" : "right-0"} bg-muted/50` : ""}
                    `}
                    style={{ minWidth: col.minWidth }}
                  >
                    <div className="flex items-center gap-2">
                      <ColumnFilter
                        column={col}
                        data={data}
                        filters={filters}
                        setFilters={setFilters}
                      />
                      {col.enableSorting !== false && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleSort(col.key as string)}
                        >
                          {sorting.columnKey === col.key ? (
                            sorting.direction === "asc" ? (
                              <IconSortAscending className="h-4 w-4" />
                            ) : (
                              <IconSortDescending className="h-4 w-4" />
                            )
                          ) : (
                            <IconSelector className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
                {(onEdit || onDelete) && (
                  <TableHead className="w-12">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length ? (
                paginatedData.map((row) => (
                  <DataTableRow
                    key={row.id}
                    row={row}
                    columns={visibleColumns}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    rowLinkConfig={rowLinkConfig}
                    isSelected={row.id ? rowSelection[String(row.id)] : false}
                    onRowSelect={handleRowSelect}
                    enableRowSelection={enableRowSelection}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      visibleColumns.length +
                      (enableRowSelection ? 1 : 0) +
                      (onEdit || onDelete ? 1 : 0)
                    }
                    className="h-24 text-center"
                  >
                    {Object.keys(filters).length > 0 || globalSearch
                      ? "No results match your search and filters."
                      : "No data available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground text-sm">
              Showing {paginatedData.length} of {sortedData.length} results
              {Object.keys(filters).length > 0 || globalSearch
                ? ` (filtered from ${data.length} total)`
                : ""}
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <Label htmlFor="page-size" className="text-sm">
                Rows per page:
              </Label>
              <Select
                value={String(pagination.pageSize)}
                onValueChange={(value) =>
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(value),
                    pageIndex: 0,
                  }))
                }
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              Page {pagination.pageIndex + 1} of{" "}
              {Math.ceil(sortedData.length / pagination.pageSize)}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() => setPagination((p) => ({ ...p, pageIndex: 0 }))}
                disabled={pagination.pageIndex === 0}
              >
                <IconChevronsLeft className="h-4 w-4" />
                <span className="sr-only">Go to first page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    pageIndex: Math.max(0, p.pageIndex - 1),
                  }))
                }
                disabled={pagination.pageIndex === 0}
              >
                <IconChevronLeft className="h-4 w-4" />
                <span className="sr-only">Go to previous page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    pageIndex: Math.min(
                      Math.ceil(sortedData.length / pagination.pageSize) - 1,
                      p.pageIndex + 1
                    ),
                  }))
                }
                disabled={
                  pagination.pageIndex >=
                  Math.ceil(sortedData.length / pagination.pageSize) - 1
                }
              >
                <IconChevronRight className="h-4 w-4" />
                <span className="sr-only">Go to next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    pageIndex:
                      Math.ceil(sortedData.length / pagination.pageSize) - 1,
                  }))
                }
                disabled={
                  pagination.pageIndex >=
                  Math.ceil(sortedData.length / pagination.pageSize) - 1
                }
              >
                <IconChevronsRight className="h-4 w-4" />
                <span className="sr-only">Go to last page</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(Object.keys(filters).length > 0 || globalSearch) && (
          <div className="flex justify-center px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({});
                setGlobalSearch("");
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <IconX className="h-4 w-4 mr-1" />
              Clear all filters and search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
