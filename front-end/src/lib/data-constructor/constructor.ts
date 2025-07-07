import { isDateOrNot } from "./isDate";
import { isEmailOrNot } from "./isEmail";
import { isPhoneNumberOrNot } from "./isPhone";

// Base types for data table functionality
export type DataTableColumnType = 
  | "string" 
  | "number" 
  | "boolean" 
  | "date" 
  | "email" 
  | "phone"
  | "object"
  | "array";

// Filter configuration interface
export interface DataTableFilterConfig {
  fuzzySearch?: boolean;
  getUniques?: boolean;
  maxUniqueValues?: number; // Maximum unique values before disabling filter
  enabled?: boolean; // Enable/disable filtering for this column
}

// Column configuration interface
export interface DataTableColumnConfig {
  label?: string;
  type?: DataTableColumnType;
  sortable?: boolean;
  uniqueItems?: any[];
  icon?: () => void;
  filterConfig?: DataTableFilterConfig;
  placeHolder?: string;
  visible?: boolean;
  minWidth?: number;
  sticky?: "left" | "right";
  render?: (value: any, row: any) => React.ReactNode;
  enableSorting?: boolean;
  enableHiding?: boolean;
  enableFiltering?: boolean;
}

// Columns configuration - maps column names to their config
export interface DataTableColumnsConfig {
  [columnName: string]: DataTableColumnConfig;
}

// Main configuration interface for the DataTable
export interface DataTableConfig {
  columns?: DataTableColumnsConfig;
  autoDetectTypes?: boolean; // Whether to auto-detect column types
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  enableRowSelection?: boolean;
  enableGlobalSearch?: boolean;
  enableExport?: boolean;
  showColumns?: string[]; // Array of column keys to show by default
  // Add other config options as needed
  [key: string]: any;
}

// Constructor return data structure
export interface DataTableConstructorData<T extends Record<string, any>> {
  data: T[];
  columns: DataTableColumnsConfig;
  detectedColumns: DetectedColumn<T>[];
}

// Generic data row type - ensures it's an object with string keys
export type DataTableRow = Record<string, any>;

// Detected column information
export interface DetectedColumn<T> {
  key: keyof T | string;
  label: string;
  dataType: DataTableColumnType;
  uniqueValues: number;
  hasNullValues: boolean;
  sampleValues: any[];
  isSortable: boolean;
  isFilterable: boolean;
}

// Optional: More specific column types for better type safety
export interface StringColumnConfig extends DataTableColumnConfig {
  type: "string";
}

export interface NumberColumnConfig extends DataTableColumnConfig {
  type: "number";
}

export interface DateColumnConfig extends DataTableColumnConfig {
  type: "date";
}

export interface EmailColumnConfig extends DataTableColumnConfig {
  type: "email";
}

export interface PhoneColumnConfig extends DataTableColumnConfig {
  type: "phone";
}

// Union type for specific column configs
export type SpecificColumnConfig = 
  | StringColumnConfig 
  | NumberColumnConfig 
  | DateColumnConfig 
  | EmailColumnConfig 
  | PhoneColumnConfig;

// Utility type for extracting column names from data
export type ColumnNames<T extends Record<string, any>> = keyof T;

// Type for the utility functions you're importing
export type ValidationFunction = (value: string) => boolean;

export class DataTableConstructor<T extends Record<string, any>> {
  public data: T[];
  public columns: DataTableColumnsConfig;
  public config: DataTableConfig;
  public detectedColumns: DetectedColumn<T>[];

  constructor(data: T[] = [], config: DataTableConfig = {}) {
    this.data = data;
    this.config = config;
    this.columns = config.columns || {};
    this.detectedColumns = [];

    // Initialize showColumns if not provided
    if (!this.config.showColumns) {
      this.config.showColumns = [];
    }

    if (config.autoDetectTypes !== false) {
      this.autoGenTypes();
    }
  }

  /**
   * Auto-generate column types and configurations based on data analysis
   */
  autoGenTypes(): void {
    if (this.data.length === 0) return;

    // Get column names from the first data row
    const columnNames = Object.keys(this.data[0]);
    
    columnNames.forEach((column: string) => {
      // Analyze the column data
      const columnAnalysis = this.analyzeColumn(column);
      this.detectedColumns.push(columnAnalysis);

      // Determine if column should be visible based on showColumns config
      const isVisible = this.config.showColumns!.length === 0 || 
                       this.config.showColumns!.includes(column);

      // Create default column configuration
      const columnConfig: DataTableColumnConfig = {
        label: this.generateLabel(column),
        type: columnAnalysis.dataType,
        sortable: columnAnalysis.isSortable,
        uniqueItems: [],
        icon: () => {},
        filterConfig: {
          fuzzySearch: true,
          getUniques: columnAnalysis.uniqueValues <= 50, // Only get uniques if reasonable number
          maxUniqueValues: 50,
          enabled: columnAnalysis.isFilterable
        },
        placeHolder: `Search for ${this.generateLabel(column)}...`,
        visible: isVisible,
        enableSorting: columnAnalysis.isSortable,
        enableHiding: true,
        enableFiltering: columnAnalysis.isFilterable,
      };

      // Get unique items if needed
      if (columnConfig.filterConfig?.getUniques) {
        columnConfig.uniqueItems = this.getColumnUniqueItemsAsStrings(column);
      }
      
      // Merge with existing configuration (existing config takes precedence)
      const finalColumnsConfig = { ...columnConfig, ...this.columns[column] };
      this.columns[column] = finalColumnsConfig;
    });
  }

  /**
   * Analyze a single column to determine its properties
   */
  private analyzeColumn(column: string): DetectedColumn<T> {
    const values = this.data.map((item) => item[column]);
    const nonNullValues = values.filter((v) => v !== null && v !== undefined);
    const uniqueValues = new Set(nonNullValues);
    const hasNullValues = values.some((v) => v === null || v === undefined);
    
    // Determine data type
    const dataType = this.detectDataType(values);
    
    // Determine if sortable (phone numbers are not sortable)
    const isSortable = dataType !== "phone";
    
    // Determine if filterable (reasonable number of unique values)
    const isFilterable = uniqueValues.size <= 50;

    return {
      key: column,
      label: this.generateLabel(column),
      dataType,
      uniqueValues: uniqueValues.size,
      hasNullValues,
      sampleValues: Array.from(uniqueValues).slice(0, 10),
      isSortable,
      isFilterable
    };
  }

  /**
   * Detect data type from sample values
   */
  private detectDataType(values: any[]): DataTableColumnType {
    const nonNullValues = values.filter((v) => v !== null && v !== undefined);
    if (nonNullValues.length === 0) return "string";

    const firstValue = nonNullValues[0];

    // Check for arrays
    if (Array.isArray(firstValue)) return "array";

    // Check for objects (but not Date objects)
    if (typeof firstValue === "object" && !(firstValue instanceof Date)) return "object";

    // Check for dates
    if (firstValue instanceof Date) return "date";
    if (typeof firstValue === "string" && this.isDate(firstValue)) return "date";

    // Check for emails
    if (typeof firstValue === "string" && this.isEmail(firstValue)) return "email";

    // Check for phone numbers
    if (typeof firstValue === "string" && this.isPhoneNumber(firstValue)) return "phone";

    // Check for numbers
    if (typeof firstValue === "number") return "number";
    if (typeof firstValue === "string" && !isNaN(Number(firstValue)) && firstValue.trim() !== "") {
      // Additional check to avoid treating IDs as numbers
      if (firstValue.length > 10) return "string"; // Likely an ID
      return "number";
    }

    // Check for booleans
    if (typeof firstValue === "boolean") return "boolean";
    if (typeof firstValue === "string" && 
        ["true", "false", "yes", "no", "1", "0"].includes(firstValue.toLowerCase())) {
      return "boolean";
    }

    return "string";
  }

  /**
   * Generate human-readable label from column key
   */
  private generateLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .trim();
  }

  /**
   * Get unique items for a column
   */
  getColumnUniqueItems(column: string): any[] {
    const values = this.data.map((item) => item[column]);
    const uniqueValues = [...new Set(values.filter((v) => v !== null && v !== undefined))];
    return uniqueValues.sort();
  }

  /**
   * Get unique items as strings for filtering (safe for toLowerCase operations)
   */
  getColumnUniqueItemsAsStrings(column: string): string[] {
    const values = this.data.map((item) => item[column]);
    const uniqueValues = [...new Set(values.filter((v) => v !== null && v !== undefined))];
    return uniqueValues.map(String).sort();
  }

  /**
   * Check if a value is an email
   */
  isEmail(value: any): boolean {
    if (typeof value === "string") {
      return isEmailOrNot(value);
    }
    return false;
  }

  /**
   * Check if a value is a phone number
   */
  isPhoneNumber(value: any): boolean {
    if (typeof value === "string") {
      return isPhoneNumberOrNot(value);
    }
    return false;
  }

  /**
   * Check if a value is a date
   */
  isDate(value: any): boolean {
    if (typeof value === "string") {
      return isDateOrNot(value);
    }
    return false;
  }

  /**
   * Get constructor data for integration with data table
   */
  get constructorData(): DataTableConstructorData<T> {
    return {
      data: this.data,
      columns: this.columns,
      detectedColumns: this.detectedColumns,
    };
  }

  /**
   * Get columns configuration compatible with the data table
   */
  getDataTableColumns(): Array<{
    key: string;
    label: string;
    dataType: string;
    sortable: boolean;
    filterable: boolean;
    visible: boolean;
    minWidth?: number;
    sticky?: "left" | "right";
    render?: (value: any, row: any) => React.ReactNode;
  }> {
    return Object.entries(this.columns).map(([key, config]) => ({
      key,
      label: config.label || this.generateLabel(key),
      dataType: config.type || "string",
      sortable: config.sortable ?? config.enableSorting ?? true,
      filterable: config.filterConfig?.enabled ?? config.enableFiltering ?? true,
      visible: config.visible ?? true,
      minWidth: config.minWidth,
      sticky: config.sticky,
      render: config.render,
    }));
  }

  /**
   * Update column configuration
   */
  updateColumnConfig(columnKey: string, config: Partial<DataTableColumnConfig>): void {
    if (this.columns[columnKey]) {
      this.columns[columnKey] = { ...this.columns[columnKey], ...config };
    }
  }

  /**
   * Get column configuration
   */
  getColumnConfig(columnKey: string): DataTableColumnConfig | undefined {
    return this.columns[columnKey];
  }

  /**
   * Check if a column is filterable
   */
  isColumnFilterable(columnKey: string): boolean {
    const config = this.columns[columnKey];
    return config?.filterConfig?.enabled ?? config?.enableFiltering ?? true;
  }

  /**
   * Check if a column is sortable
   */
  isColumnSortable(columnKey: string): boolean {
    const config = this.columns[columnKey];
    return config?.sortable ?? config?.enableSorting ?? true;
  }

  /**
   * Get a custom sort function for a column based on its data type
   */
  getSortFunction(column: string): ((a: any, b: any) => number) | null {
    const config = this.columns[column];
    if (!config || !config.sortable) return null;

    const dataType = config.type || this.detectDataType(this.data.map(item => item[column]));

    switch (dataType) {
      case "date":
        return (a: any, b: any) => {
          const dateA = a instanceof Date ? a : new Date(a);
          const dateB = b instanceof Date ? b : new Date(b);
          
          // Handle invalid dates
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          
          return dateA.getTime() - dateB.getTime();
        };
      
      case "number":
        return (a: any, b: any) => {
          const numA = typeof a === "number" ? a : Number(a);
          const numB = typeof b === "number" ? b : Number(b);
          
          if (isNaN(numA) && isNaN(numB)) return 0;
          if (isNaN(numA)) return 1;
          if (isNaN(numB)) return -1;
          
          return numA - numB;
        };
      
      case "phone":
        // Phone numbers should not be sortable
        return null;
      
      case "boolean":
        return (a: any, b: any) => {
          const boolA = Boolean(a);
          const boolB = Boolean(b);
          return boolA === boolB ? 0 : boolA ? 1 : -1;
        };
      
      default:
        // String comparison
        return (a: any, b: any) => {
          const strA = String(a || "");
          const strB = String(b || "");
          return strA.localeCompare(strB);
        };
    }
  }

  /**
   * Update showColumns configuration and sync column visibility
   */
  updateShowColumns(showColumns: string[]): void {
    this.config.showColumns = showColumns;
    
    // Update column visibility based on showColumns
    Object.keys(this.columns).forEach(columnKey => {
      const isVisible = showColumns.length === 0 || showColumns.includes(columnKey);
      this.updateColumnConfig(columnKey, { visible: isVisible });
    });
  }

  /**
   * Add a column to showColumns
   */
  showColumn(columnKey: string): void {
    if (!this.config.showColumns!.includes(columnKey)) {
      this.config.showColumns!.push(columnKey);
      this.updateColumnConfig(columnKey, { visible: true });
    }
  }

  /**
   * Remove a column from showColumns
   */
  hideColumn(columnKey: string): void {
    this.config.showColumns = this.config.showColumns!.filter(key => key !== columnKey);
    this.updateColumnConfig(columnKey, { visible: false });
  }

  /**
   * Get current showColumns configuration
   */
  getShowColumns(): string[] {
    return this.config.showColumns || [];
  }
}