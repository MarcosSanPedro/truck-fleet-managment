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

/**
 * Supported data types for auto-detection and filtering
 */
type DataType = "string" | "number" | "boolean" | "date" | "array" | "object";

/**
 * Sort direction enum
 */
type SortDirection = "asc" | "desc" | null;

/**
 * Boolean value mapping for custom labels
 */
interface BooleanLabels {
  true: string;
  false: string;
}

/**
 * Column filter configuration
 */
interface ColumnFilterConfig {
  /** Enable/disable filtering for this column */
  enabled?: boolean;
  /** Override auto-detected data type */
  dataType?: DataType;
  /** Custom labels for boolean values */
  booleanLabels?: BooleanLabels;
  /** Maximum unique values before disabling filter (default: 50) */
  maxUniqueValues?: number;
  /** Custom filter function */
  customFilter?: (value: any, filterValue: string) => boolean;
}

/**
 * Column configuration
 */
interface ColumnConfig<T> {
  /** Column key */
  key: keyof T | string;
  /** Display label */
  label?: string;
  /** Custom render function */
  render?: (value: any, row: T) => React.ReactNode;
  /** Enable sorting */
  sortable?: boolean;
  /** Show/hide column */
  visible?: boolean;
  /** Minimum width */
  minWidth?: number;
  /** Sticky position */
  sticky?: "left" | "right";
  /** Filter configuration */
  filter?: ColumnFilterConfig;
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
 * Data table configuration object
 */
interface DataTableConfig<T extends { id?: string | number }> {
  /** Items per page (default: 10) */
  pageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Column configurations */
  columns?: Record<string, ColumnConfig<T>>;
  /** Enable row selection */
  rowSelection?: boolean;
  /** Enable global search */
  globalSearch?: boolean;
  /** Enable export functionality */
  export?: boolean;
  /** Custom export function */
  onExport?: (data: T[], selectedRows: T[]) => void;
  /** Bulk actions */
  bulkActions?: BulkAction<T>[];
  /** Add row action */
  addAction?: {
    label: string;
    onClick: () => void;
  };
  /** Row actions */
  rowActions?: {
    edit?: (row: T) => void;
    delete?: (row: T) => void;
    custom?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: (row: T) => void;
      variant?: "default" | "destructive";
    }>;
  };
  /** Row navigation */
  rowNavigation?: {
    to: string;
    paramKey: string;
  };
  /** Loading state */
  loading?: boolean;
  /** Custom search function */
  searchFunction?: (data: T[], searchTerm: string) => T[];
}

/**
 * Auto-detected column information
 */
interface DetectedColumn<T> {
  key: keyof T | string;
  label: string;
  dataType: DataType;
  uniqueValues: number;
  hasNullValues: boolean;
  sampleValues: any[];
}

/**
 * Internal filter state
 */
interface FilterState {
  [columnKey: string]: {
    type: DataType;
    values: string[];
    searchTerm?: string;
    booleanLabels?: BooleanLabels;
  };
}

/**
 * Auto-detect data type from sample values
 */
function detectDataType(values: any[]): DataType {
  const nonNullValues = values.filter((v) => v !== null && v !== undefined);
  if (nonNullValues.length === 0) return "string";

  const firstValue = nonNullValues[0];

  // Check for dates
  if (firstValue instanceof Date) return "date";
  if (typeof firstValue === "string" && !isNaN(Date.parse(firstValue))) {
    // Additional date format checks
    const dateRegex =
      /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}|^\d{2}-\d{2}-\d{4}/;
    if (dateRegex.test(firstValue)) return "date";
  }

  // Check for numbers
  if (typeof firstValue === "number") return "number";
  if (typeof firstValue === "string" && !isNaN(Number(firstValue)))
    return "number";

  // Check for booleans
  if (typeof firstValue === "boolean") return "boolean";
  if (
    typeof firstValue === "string" &&
    ["true", "false", "yes", "no", "1", "0"].includes(firstValue.toLowerCase())
  ) {
    return "boolean";
  }

  // Check for arrays
  if (Array.isArray(firstValue)) return "array";

  // Check for objects
  if (typeof firstValue === "object") return "object";

  return "string";
}

/**
 * Generate human-readable label from key
 */
function generateLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, " ")
    .trim();
}

/**
 * Analyze data and auto-detect column configurations
 */
function analyzeData<T extends { id?: string | number }>(
  data: T[]
): DetectedColumn<T>[] {
  if (data.length === 0) return [];

  const keys = Object.keys(data[0]) as (keyof T)[];
  const sampleSize = Math.min(100, data.length); // Analyze first 100 rows for performance

  return keys.map((key) => {
    const values = data.slice(0, sampleSize).map((row) => row[key]);
    const uniqueValues = new Set(
      values.filter((v) => v !== null && v !== undefined)
    );
    const hasNullValues = values.some((v) => v === null || v === undefined);
    const dataType = detectDataType(values);

    return {
      key,
      label: generateLabel(String(key)),
      dataType,
      uniqueValues: uniqueValues.size,
      hasNullValues,
      sampleValues: Array.from(uniqueValues).slice(0, 10), // Keep first 10 unique values
    };
  });
}

/**
 * Column filter component with fixed focus issues
 */
function ColumnFilter<T extends { id?: string | number }>({
  column,
  data,
  filters,
  setFilters,
  config,
}: {
  column: DetectedColumn<T>;
  data: T[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  config?: ColumnFilterConfig;
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Use useRef to maintain focus
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const dataType = config?.dataType || column.dataType;
  const columnKey = column.key as string;
  const currentFilter = filters[columnKey];
  const booleanLabels = config?.booleanLabels || { true: "Yes", false: "No" };
  const maxUniqueValues = config?.maxUniqueValues || 50;

  /**
   * Get unique values for the column with proper boolean handling
   */
  const uniqueValues = React.useMemo(() => {
    const values = new Set<string>();
    data.forEach((row) => {
      const value = row[column.key as keyof T];
      if (value !== null && value !== undefined) {
        if (dataType === "boolean") {
          // Convert boolean to string but keep original for filtering
          const boolStr = String(value).toLowerCase();
          if (boolStr === "true" || boolStr === "1" || boolStr === "yes") {
            values.add("true");
          } else if (
            boolStr === "false" ||
            boolStr === "0" ||
            boolStr === "no"
          ) {
            values.add("false");
          }
        } else {
          values.add(String(value));
        }
      }
    });
    return Array.from(values).sort();
  }, [data, column.key, dataType]);

  // Skip filtering if disabled or too many unique values
  if (config?.enabled === false || uniqueValues.length > maxUniqueValues) {
    return <span className="font-medium">{column.label}</span>;
  }

  const filteredValues = uniqueValues.filter((value) => {
    if (dataType === "boolean") {
      const label = value === "true" ? booleanLabels.true : booleanLabels.false;
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return value.toLowerCase().includes(searchTerm.toLowerCase());
  });

  /**
   * Handle filter value toggle
   */
  const handleToggleFilter = (value: string) => {
    const newFilters = { ...filters };
    const currentValues = currentFilter?.values || [];

    if (dataType === "boolean") {
      // For boolean, only allow single selection
      newFilters[columnKey] = {
        type: dataType,
        values: currentValues.includes(value) ? [] : [value],
        booleanLabels,
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
          booleanLabels,
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

  // Handle search input focus properly
  React.useEffect(() => {
    if (isOpen && searchInputRef.current && dataType !== "boolean") {
      // Small delay to ensure dropdown is rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, dataType]);

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
                ref={searchInputRef}
                placeholder={`Search ${column.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
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
              <DropdownMenuRadioItem value="true">
                {booleanLabels.true}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="false">
                {booleanLabels.false}
              </DropdownMenuRadioItem>
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
 * Individual table row component
 */
const DataTableRow = React.memo(
  <T extends { id?: string | number }>({
    row,
    columns,
    config,
    isSelected,
    onRowSelect,
  }: {
    row: T;
    columns: DetectedColumn<T>[];
    config: DataTableConfig<T>;
    isSelected?: boolean;
    onRowSelect?: (rowId: string, selected: boolean) => void;
  }) => {
    /**
     * Handle row click for navigation
     */
    const handleRowClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-dropdown]") ||
        target.closest("[data-checkbox]")
      ) {
        return;
      }

      if (config.rowNavigation && row.id) {
        const linkTo = `${config.rowNavigation.to}/${row.id}`;
        // You would implement navigation here based on your routing solution
        console.log("Navigate to:", linkTo);
      }
    };

    /**
     * Handle row selection change
     */
    const handleRowSelect = (checked: boolean) => {
      if (onRowSelect && row.id) {
        onRowSelect(String(row.id), checked);
      }
    };

    /**
     * Render cell value with proper formatting
     */
    const renderCellValue = (column: DetectedColumn<T>, value: any) => {
      const columnConfig = config.columns?.[column.key as string];

      // Use custom render function if provided
      if (columnConfig?.render) {
        return columnConfig.render(value, row);
      }

      // Handle different data types
      if (column.dataType === "boolean") {
        const booleanLabels = columnConfig?.filter?.booleanLabels || {
          true: "Yes",
          false: "No",
        };
        const boolStr = String(value).toLowerCase();
        const isTrue =
          boolStr === "true" || boolStr === "1" || boolStr === "yes";
        const label = isTrue ? booleanLabels.true : booleanLabels.false;
        return (
          <Badge variant={isTrue ? "default" : "secondary"}>{label}</Badge>
        );
      }

      if (column.dataType === "date" && value) {
        const date = value instanceof Date ? value : new Date(value);
        return date.toLocaleDateString();
      }

      if (column.dataType === "number" && typeof value === "number") {
        return value.toLocaleString();
      }

      if (column.dataType === "array" && Array.isArray(value)) {
        return value.join(", ");
      }

      if (column.dataType === "object" && typeof value === "object") {
        return JSON.stringify(value);
      }

      return String(value || "");
    };

    // Filter visible columns
    const visibleColumns = columns.filter((col) => {
      const columnConfig = config.columns?.[col.key as string];
      return columnConfig?.visible !== false;
    });

    return (
      <TableRow
        className={`
          ${config.rowNavigation ? "cursor-pointer hover:bg-muted/50" : ""}
          ${isSelected ? "bg-muted/30" : ""}
        `}
        onClick={config.rowNavigation ? handleRowClick : undefined}
      >
        {config.rowSelection && (
          <TableCell className="w-12">
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleRowSelect}
              aria-label={`Select row ${row.id}`}
              data-checkbox
            />
          </TableCell>
        )}
        {visibleColumns.map((col) => {
          const columnConfig = config.columns?.[col.key as string];
          return (
            <TableCell
              key={col.key as string}
              className={
                columnConfig?.sticky
                  ? `sticky ${columnConfig.sticky === "left" ? "left-0" : "right-0"} bg-background`
                  : ""
              }
              style={{ minWidth: columnConfig?.minWidth }}
            >
              {renderCellValue(col, row[col.key as keyof T])}
            </TableCell>
          );
        })}
        {config.rowActions && (
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
                {config.rowActions.edit && (
                  <DropdownMenuItem
                    onClick={() => config.rowActions!.edit!(row)}
                  >
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
                {config.rowActions.custom?.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(row)}
                    className={
                      action.variant === "destructive"
                        ? "text-destructive focus:text-destructive"
                        : ""
                    }
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {config.rowActions.delete && (
                  <DropdownMenuItem
                    onClick={() => config.rowActions!.delete!(row)}
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
);

DataTableRow.displayName = "DataTableRow";

/**
 * Main DataTable constructor function
 */
export function createDataTable<T extends { id?: string | number }>(
  data: T[],
  config: DataTableConfig<T> = {}
) {
  /**
   * DataTable component with auto-detection and configuration
   */
  function DataTable() {
    // Auto-detect columns from data
    const detectedColumns = React.useMemo(() => analyzeData(data), []);

    // State management
    const [columnVisibility, setColumnVisibility] = React.useState<
      Record<string, boolean>
    >({});
    const [pagination, setPagination] = React.useState({
      pageIndex: 0,
      pageSize: config.pageSize || 10,
    });
    const [filters, setFilters] = React.useState<FilterState>({});
    const [sorting, setSorting] = React.useState<{
      columnKey: string;
      direction: SortDirection;
    }>({
      columnKey: "",
      direction: null,
    });
    const [globalSearch, setGlobalSearch] = React.useState("");
    const [rowSelection, setRowSelection] = React.useState<
      Record<string, boolean>
    >({});

    // Handle search input focus properly
    React.useEffect(() => {
      // This effect is intentionally placed here to ensure it runs after the component mounts
    }, []);

    /**
     * Apply global search to data
     */
    const searchedData = React.useMemo(() => {
      if (!globalSearch.trim()) return data;

      if (config.searchFunction) {
        return config.searchFunction(data, globalSearch);
      }

      return data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(globalSearch.toLowerCase())
        )
      );
    }, [globalSearch]);

    /**
     * Apply column filters to data
     */
    const filteredData = React.useMemo(() => {
      return searchedData.filter((row) => {
        return Object.entries(filters).every(([columnKey, filter]) => {
          if (filter.values.length === 0) return true;
          const value = row[columnKey as keyof T];

          if (filter.type === "boolean") {
            const boolStr = String(value).toLowerCase();
            const normalizedValue =
              boolStr === "true" || boolStr === "1" || boolStr === "yes"
                ? "true"
                : "false";
            return filter.values.includes(normalizedValue);
          }

          return filter.values.includes(String(value));
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
    }, [rowSelection]);

    /**
     * Handle column sorting
     */
    const handleSort = (columnKey: string) => {
      const columnConfig = config.columns?.[columnKey];
      if (columnConfig?.sortable === false) return;

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
      const newSelection: Record<string, boolean> = {};
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
      if (config.onExport) {
        config.onExport(sortedData, selectedRows);
      } else {
        // Default CSV export
        const visibleColumns = detectedColumns.filter((col) => {
          const columnConfig = config.columns?.[col.key as string];
          return columnConfig?.visible !== false;
        });

        const csvContent = [
          visibleColumns.map((col) => col.label).join(","),
          ...sortedData.map((row) =>
            visibleColumns
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

    // Get visible columns
    const visibleColumns = detectedColumns.filter((col) => {
      const columnConfig = config.columns?.[col.key as string];
      return (
        columnConfig?.visible !== false &&
        columnVisibility[col.key as string] !== false
      );
    });

    const isAllSelected =
      paginatedData.length > 0 &&
      paginatedData.every((row) => row.id && rowSelection[String(row.id)]);
    const isSomeSelected = paginatedData.some(
      (row) => row.id && rowSelection[String(row.id)]
    );

    if (config.loading) {
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
            {config.globalSearch !== false && (
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
            {config.rowSelection &&
              selectedRows.length > 0 &&
              config.bulkActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions ({selectedRows.length})
                      <IconChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {config.bulkActions.map((action, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => action.onClick(selectedRows)}
                        className={
                          action.variant === "destructive"
                            ? "text-destructive"
                            : ""
                        }
                      >
                        {action.icon && (
                          <span className="mr-2">{action.icon}</span>
                        )}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

            {/* Export Button */}
            {config.export && (
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
                {detectedColumns.map((column) => (
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
            {config.addAction && (
              <Button size="sm" onClick={config.addAction.onClick}>
                <IconPlus className="h-4 w-4 mr-1" />
                <span className="hidden lg:inline">
                  {config.addAction.label}
                </span>
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
                  {config.rowSelection && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all rows"
                      />
                    </TableHead>
                  )}
                  {visibleColumns.map((col) => {
                    const columnConfig = config.columns?.[col.key as string];
                    return (
                      <TableHead
                        key={col.key as string}
                        className={
                          columnConfig?.sticky
                            ? `sticky ${columnConfig.sticky === "left" ? "left-0" : "right-0"} bg-muted/50`
                            : ""
                        }
                        style={{ minWidth: columnConfig?.minWidth }}
                      >
                        <div className="flex items-center gap-2">
                          <ColumnFilter
                            column={col}
                            data={data}
                            filters={filters}
                            setFilters={setFilters}
                            config={columnConfig?.filter}
                          />
                          {columnConfig?.sortable !== false && (
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
                    );
                  })}
                  {config.rowActions && (
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
                      columns={detectedColumns}
                      config={config}
                      isSelected={row.id ? rowSelection[String(row.id)] : false}
                      onRowSelect={handleRowSelect}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        visibleColumns.length +
                        (config.rowSelection ? 1 : 0) +
                        (config.rowActions ? 1 : 0)
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
                    {(config.pageSizeOptions || [10, 25, 50, 100]).map(
                      (size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      )
                    )}
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

  return {
    DataTable,
    detectedColumns: analyzeData(data),
    config,
  };
}
