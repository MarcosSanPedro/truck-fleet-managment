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
  | "object";

// Filter configuration interface
export interface DataTableFilterConfig {
  fuzzySearch?: boolean;
  getUniques?: boolean;
}

// Column configuration interface
export interface DataTableColumnConfig {
  label?: string;
  type?: DataTableColumnType;
  sortable?: boolean;
  uniqueItems?: any[];
  icon?: () => void;
  filter?: DataTableFilterConfig;
  placeHolder?: string;
  visible?: boolean; // Fixed typo from "visable"
}

// Columns configuration - maps column names to their config
export interface DataTableColumnsConfig {
  [columnName: string]: DataTableColumnConfig;
}

// Main configuration interface for the DataTable
export interface DataTableConfig {
  columns: DataTableColumnsConfig;
  // Add other config options as needed
  [key: string]: any;
}

// Constructor return data structure
export interface DataTableConstructorData<T extends Record<string, any>> {
  data: T[];
  columns: DataTableColumnsConfig;
}

// Generic data row type - ensures it's an object with string keys
export type DataTableRow = Record<string, any>;

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

  constructor(data: T[] = [], config: DataTableConfig) {
    this.data = data;
    this.config = config;
    this.columns = config.columns;

    this.autoGenTypes()
  }

  autoGenTypes(): void {
    // Get column names from the first data row if data exists
    const columnNames = this.data.length > 0 ? Object.keys(this.data[0]) : [];
    
    columnNames.forEach((column: string) => {
      const columnConfig: DataTableColumnConfig = {
        label: column,
        type: "string",
        sortable: true,
        uniqueItems: [],
        icon: () => {},
        filter: {
          fuzzySearch: true,
          getUniques: false
        },
        placeHolder: "",
        visible: true, // Fixed typo
      };
      
      const value = this.data[0][column];

      if (this.isPhoneNumber(value)) {
        columnConfig.type = "phone";
        columnConfig.sortable = false;
      } else if (this.isDate(value)) {
        columnConfig.type = "date";
      } else if (this.isEmail(value)) {
        columnConfig.type = "email";
      } else {
        // Set type based on JavaScript typeof
        columnConfig.type = typeof value as DataTableColumnType;
      }
      
      columnConfig.placeHolder = `Search for ${column}...`;
      
      if (columnConfig.filter?.getUniques) {
        columnConfig.uniqueItems = this.getColumnUniqueItem(column);
      }
      
      // Add the column config to the columns object
      const finalColumnsConfig = {...columnConfig, ...this.columns[column]}
      this.columns[column] = finalColumnsConfig;
    });
  }

  getColumnUniqueItem(column: string): any[] {
    return [...new Set(this.data.map((item) => item[column]))];
  }

  isEmail(value: any): boolean {
    if (typeof value === "string") {
      return isEmailOrNot(value);
    }
    return false;
  }

  isPhoneNumber(value: any): boolean {
    if (typeof value === "string") {
      return isPhoneNumberOrNot(value);
    }
    return false;
  }

  isDate(value: any): boolean {
    if (typeof value === "string") {
      return isDateOrNot(value);
    }
    return false;
  }

  get constructorData(): DataTableConstructorData<T> {
    return {
      data: this.data,
      columns: this.columns,
    };
  }
}