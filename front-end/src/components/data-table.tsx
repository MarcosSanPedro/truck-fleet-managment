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
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { useNavigate } from "@tanstack/react-router";

// Column definition for generic table
export interface GenericColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
  enableFiltering?: boolean; // New property to control filtering
}

interface DataTableProps<T extends { id?: string | number }> {
  columns: GenericColumn<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  addRowAction?: {
    onClick: () => void;
    label: string;
  };
  loading?: boolean;
  rowLinkConfig?: { to: string; paramKey: string };
}

function DataTableRow<T extends { id?: string | number }>({
  row,
  columns,
  onEdit,
  onDelete,
  rowLinkConfig,
}: {
  row: T;
  columns: GenericColumn<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  rowLinkConfig?: { to: string; paramKey: string };
}) {
  const navigate = useNavigate();

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on dropdown menu
    const target = e.target as HTMLElement;
    if (target.closest("[data-dropdown]")) {
      return;
    }

    // Navigate to the detail page
    if (rowLinkConfig && row.id) {
      const linkTo = `${rowLinkConfig.to}/${row.id}`;
      navigate({ to: linkTo });
    }
  };

  return (
    <TableRow
      className={rowLinkConfig ? "cursor-pointer hover:bg-muted/50" : ""}
      onClick={rowLinkConfig ? handleRowClick : undefined}
    >
      {columns.map((col) => (
        <TableCell key={col.key as string}>
          {col.render
            ? col.render(row[col.key as keyof T], row)
            : typeof row[col.key as keyof T] === "string" ||
                typeof row[col.key as keyof T] === "number" ||
                typeof row[col.key as keyof T] === "boolean"
              ? (row[col.key as keyof T] as React.ReactNode)
              : JSON.stringify(row[col.key as keyof T])}
        </TableCell>
      ))}
      {(onEdit || onDelete) && (
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
                data-dropdown
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(row)}>
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>Make a copy</DropdownMenuItem>
              <DropdownMenuItem>Favorite</DropdownMenuItem>
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(row)}
                >
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

// Filter component for a single column
function ColumnFilter<T extends { id?: string | number }>({
  column,
  data,
  filters,
  setFilters,
}: {
  column: GenericColumn<T>;
  data: T[];
  filters: Record<string, string[]>;
  setFilters: (filters: Record<string, string[]>) => void;
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Get unique values for this column
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

  // Skip if too many unique values or filtering is disabled
  if (uniqueValues.length >= 20 || column.enableFiltering === false) {
    return null;
  }

  const currentFilters = filters[column.key as string] || [];
  const filteredValues = uniqueValues.filter((value) =>
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFilter = (value: string) => {
    const newFilters = { ...filters };
    if (currentFilters.includes(value)) {
      newFilters[column.key as string] = currentFilters.filter(
        (v) => v !== value
      );
    } else {
      newFilters[column.key as string] = [...currentFilters, value];
    }
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { ...filters };
    delete newFilters[column.key as string];
    setFilters(newFilters);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <IconFilter className="h-4 w-4 mr-1" />
          {column.label}
          {currentFilters.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
              {currentFilters.length}
            </Badge>
          )}
          <IconChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="">
        <div className="p-2">
          <Input
            placeholder={`Search ${column.label.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-60 overflow-y-auto">
          {filteredValues.map((value) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={currentFilters.includes(value)}
              onCheckedChange={() => handleToggleFilter(value)}
            >
              {value}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
        {currentFilters.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearFilters} className="text-red-600">
              <IconX className="h-4 w-4 mr-2" />
              Clear filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data: initialData,
  onEdit,
  onDelete,
  addRowAction,
  loading,
  rowLinkConfig,
}: DataTableProps<T>) {
  const [data, setData] = React.useState<T[]>(() => initialData);
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});

  // Apply filters to data
  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filters).every(([columnKey, filterValues]) => {
        if (filterValues.length === 0) return true;
        const value = String(row[columnKey as keyof T]);
        return filterValues.includes(value);
      });
    });
  }, [data, filters]);

  // Pagination logic
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination]);

  // Reset pagination when filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="w-full flex-col gap-6 rounded-lg h-full flex flex-grow bg-white py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
          <Button variant="outline" size="sm" onClick={addRowAction?.onClick}>
            <IconPlus />
            <span className="hidden lg:inline">{addRowAction?.label}</span>
          </Button>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 flex-grow">
        <div className="overflow-hidden rounded-lg border flex-grow">
          <Table className="flex-grow h-full">
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                {columns.map((col) =>
                  columnVisibility[col.key as string] !== false ? (
                    <TableHead key={col.key as string} className="align-middle">
                      {/* Filter dropdown in header */}
                      <ColumnFilter
                        column={col}
                        data={data}
                        filters={filters}
                        setFilters={setFilters}
                      />
                    </TableHead>
                  ) : null
                )}
                {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length ? (
                paginatedData.map((row) => (
                  <DataTableRow
                    key={row.id}
                    row={row}
                    columns={columns.filter(
                      (col) => columnVisibility[col.key as string] !== false
                    )}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    rowLinkConfig={rowLinkConfig}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    {Object.keys(filters).length > 0
                      ? "No results match your filters."
                      : "No results."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            Showing {paginatedData.length} of {filteredData.length} results
            {Object.keys(filters).length > 0 &&
              ` (filtered from ${data.length} total)`}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="flex w-fit items-center justify-center text-sm font-medium ">
              Page {pagination.pageIndex + 1} of{" "}
              {Math.ceil(filteredData.length / pagination.pageSize)}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => setPagination((p) => ({ ...p, pageIndex: 0 }))}
                disabled={pagination.pageIndex === 0}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    pageIndex: Math.max(0, p.pageIndex - 1),
                  }))
                }
                disabled={pagination.pageIndex === 0}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    pageIndex: Math.min(
                      Math.ceil(filteredData.length / pagination.pageSize) - 1,
                      p.pageIndex + 1
                    ),
                  }))
                }
                disabled={
                  pagination.pageIndex >=
                  Math.ceil(filteredData.length / pagination.pageSize) - 1
                }
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    pageIndex:
                      Math.ceil(filteredData.length / pagination.pageSize) - 1,
                  }))
                }
                disabled={
                  pagination.pageIndex >=
                  Math.ceil(filteredData.length / pagination.pageSize) - 1
                }
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
        {/* Clear all filters button, if any filter is active */}
        {Object.keys(filters).length > 0 && (
          <div className="flex justify-end px-4 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({})}
              className="h-8 text-red-600 hover:text-red-700"
            >
              <IconX className="h-4 w-4 mr-1" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
