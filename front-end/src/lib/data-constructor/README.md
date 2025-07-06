# Data Table Constructor

The `DataTableConstructor` is a powerful utility class that automatically analyzes your data and generates optimal column configurations for the data table component.

## Features

- **Automatic Type Detection**: Detects data types including string, number, boolean, date, email, phone, array, and object
- **Smart Filtering**: Automatically determines which columns should be filterable based on unique value count
- **Column Configuration**: Generates human-readable labels and appropriate settings for each column
- **Validation Integration**: Uses specialized validation functions for email, phone, and date detection
- **Flexible Configuration**: Allows overriding auto-generated settings with custom configurations

## Basic Usage

### Simple Auto-Detection

```typescript
import { DataTableConstructor } from "@/lib/data-constructor/constructor";
import { DataTable } from "@/components/data-table";

const data = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 30, isActive: true },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 28, isActive: false }
];

// Create constructor instance
const constructor = new DataTableConstructor(data);

// Get auto-generated columns
const columns = constructor.getDataTableColumns();

// Use with data table
<DataTable data={data} columns={columns} />
```

### With Custom Configuration

```typescript
const config = {
  autoDetectTypes: true,
  enableRowSelection: true,
  enableGlobalSearch: true,
  columns: {
    email: {
      label: "Email Address",
      filterConfig: {
        getUniques: true,
        enabled: true
      }
    },
    phone: {
      label: "Phone Number",
      sortable: false, // Phone numbers shouldn't be sorted
      filterConfig: {
        getUniques: true,
        enabled: true
      }
    }
  }
};

const constructor = new DataTableConstructor(data, config);
```

## Data Type Detection

The constructor automatically detects the following data types:

### Supported Types

- **string**: Regular text values
- **number**: Numeric values (integers and floats)
- **boolean**: True/false values (including "true", "false", "yes", "no", "1", "0")
- **date**: Date strings in various formats (ISO, US, European, etc.)
- **email**: Valid email addresses
- **phone**: Phone numbers in various formats
- **array**: Array values
- **object**: Object values (excluding Date objects)

### Type Detection Logic

1. **Arrays**: Detected if the first non-null value is an array
2. **Objects**: Detected if the first non-null value is an object (but not Date)
3. **Dates**: Detected using multiple regex patterns and Date constructor validation
4. **Emails**: Detected using comprehensive email validation
5. **Phone Numbers**: Detected using multiple phone number format patterns
6. **Numbers**: Detected if the value is numeric (with additional checks to avoid treating long IDs as numbers)
7. **Booleans**: Detected for boolean values and common string representations
8. **Strings**: Default fallback for all other values

## Column Configuration

### Auto-Generated Settings

- **Label**: Human-readable label generated from column key (e.g., "firstName" → "First Name")
- **Type**: Automatically detected data type
- **Sortable**: True for all types except phone numbers
- **Filterable**: True if unique values ≤ 50
- **Visible**: True by default
- **Placeholder**: Generated search placeholder text

### Custom Overrides

You can override any auto-generated setting:

```typescript
const config = {
  columns: {
    userId: {
      label: "User ID",
      type: "string", // Override detected type
      sortable: false, // Disable sorting
      filterConfig: {
        enabled: false // Disable filtering
      },
      visible: false // Hide column
    }
  }
};
```

## Filter Configuration

### Filter Settings

- **fuzzySearch**: Enable fuzzy search (default: true)
- **getUniques**: Pre-calculate unique values (default: false for columns with >50 unique values)
- **maxUniqueValues**: Maximum unique values before disabling filter (default: 50)
- **enabled**: Enable/disable filtering for the column

### Example

```typescript
const config = {
  columns: {
    status: {
      filterConfig: {
        getUniques: true, // Pre-calculate unique values
        maxUniqueValues: 10, // Allow filtering even with 10 unique values
        enabled: true
      }
    }
  }
};
```

## Integration with Data Table

### Method 1: Auto-Generate Columns

```typescript
import { DataTable } from "@/components/data-table";

function MyComponent() {
  const data = [...]; // Your data
  
  const constructor = new DataTableConstructor(data);
  const columns = constructor.getDataTableColumns();
  
  return (
    <DataTable 
      data={data} 
      columns={columns}
      autoGenerateColumns={true}
    />
  );
}
```

### Method 2: Manual Column Definition with Constructor Help

```typescript
function MyComponent() {
  const data = [...]; // Your data
  
  const constructor = new DataTableConstructor(data);
  
  // Use constructor analysis to help define columns
  const columns = [
    {
      key: "name",
      label: constructor.getColumnConfig("name")?.label || "Name",
      dataType: constructor.getColumnConfig("name")?.type || "string",
      enableSorting: constructor.isColumnSortable("name"),
      enableFiltering: constructor.isColumnFilterable("name"),
    }
  ];
  
  return <DataTable data={data} columns={columns} />;
}
```

## Constructor Methods

### Core Methods

- `getDataTableColumns()`: Get columns compatible with DataTable component
- `getColumnConfig(columnKey)`: Get configuration for a specific column
- `updateColumnConfig(columnKey, config)`: Update column configuration
- `isColumnFilterable(columnKey)`: Check if column is filterable
- `isColumnSortable(columnKey)`: Check if column is sortable
- `getColumnUniqueItems(columnKey)`: Get unique values for a column

### Analysis Methods

- `detectedColumns`: Array of detected column information
- `constructorData`: Complete data structure for integration

## Example Components

See `front-end/src/components/data-table-example.tsx` for complete examples:

- `DataTableWithConstructor`: Auto-generated columns with constructor
- `DataTableWithManualColumns`: Manual columns with constructor integration
- `ConstructorAnalysis`: Shows what the constructor detected

## Best Practices

1. **Use auto-detection for rapid prototyping**: Let the constructor handle initial setup
2. **Override specific columns**: Customize only the columns that need special handling
3. **Consider performance**: For large datasets, disable auto-detection and use manual configuration
4. **Validate data types**: The constructor's type detection is good but not perfect for edge cases
5. **Test with real data**: Always test with your actual data to ensure proper detection

## Configuration Options

```typescript
interface DataTableConfig {
  autoDetectTypes?: boolean; // Whether to auto-detect column types
  defaultPageSize?: number; // Default page size
  pageSizeOptions?: number[]; // Available page sizes
  enableRowSelection?: boolean; // Enable row selection
  enableGlobalSearch?: boolean; // Enable global search
  enableExport?: boolean; // Enable export functionality
  columns?: DataTableColumnsConfig; // Column-specific configurations
}
``` 