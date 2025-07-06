// Type definitions
type DateType = 'String';

type DateFormat = 
  | 'ISO 8601'
  | 'ISO date'
  | 'US format (MM/DD/YYYY)'
  | 'European format (DD.MM.YYYY)'
  | 'Dash format (DD-MM-YYYY)'
  | 'Time format'
  | 'Month name format'
  | 'Timestamp string'
  | 'Relative date'
  | 'Other recognized format';

interface DateDetectionResult {
  isDate: boolean;
  type: DateType | null;
  parsedDate: Date | null;
  format: DateFormat | null;
}

/**
 * Advanced date detection utility function
 * Detects if a string value is a date in various formats
 * @param value - The string value to check
 * @returns True if the value is a valid date, false otherwise
 */
function isDateOrNot(value: string): boolean {
  // Handle null, undefined, or empty values
  if (!value || typeof value !== 'string') {
    return false;
  }

  // Handle strings
  const trimmed: string = value.trim();
  
  // Empty string after trim
  if (trimmed === '') {
    return false;
  }

  // Common date patterns (regex)
  const datePatterns: RegExp[] = [
      // ISO 8601 formats
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2})?$/,
      /^\d{4}-\d{2}-\d{2}$/,
      
      // US formats
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      /^\d{1,2}\/\d{1,2}\/\d{2}$/,
      /^\d{4}\/\d{1,2}\/\d{1,2}$/,
      
      // European formats
      /^\d{1,2}\.\d{1,2}\.\d{4}$/,
      /^\d{1,2}\.\d{1,2}\.\d{2}$/,
      /^\d{4}\.\d{1,2}\.\d{1,2}$/,
      
      // Dash formats
      /^\d{1,2}-\d{1,2}-\d{4}$/,
      /^\d{1,2}-\d{1,2}-\d{2}$/,
      /^\d{4}-\d{1,2}-\d{1,2}$/,
      
      // Time formats
      /^\d{1,2}:\d{2}(:\d{2})?(\s?(AM|PM))?$/i,
      /^\d{4}-\d{2}-\d{2}\s\d{1,2}:\d{2}(:\d{2})?$/,
      
      // Month names
      /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}$/i,
      /^\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}$/i,
      /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}$/i,
      
      // Timestamps
      /^\d{10}$/,  // Unix timestamp (10 digits)
      /^\d{13}$/,  // JavaScript timestamp (13 digits)
      
      // Relative dates
      /^(today|tomorrow|yesterday)$/i,
      /^\d+\s+(days?|weeks?|months?|years?)\s+(ago|from\s+now)$/i,
  ];

  // Check against patterns first for performance
  const matchesPattern: boolean = datePatterns.some((pattern: RegExp) => pattern.test(trimmed));
  
  if (matchesPattern) {
    // Additional validation using Date constructor
    const date: Date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      const year: number = date.getFullYear();
      return year >= 1900 && year <= 2100;
    }
  }

  // Try parsing with Date constructor for other formats
  const date: Date = new Date(trimmed);
  if (!isNaN(date.getTime())) {
    // Additional checks to avoid false positives
    const year: number = date.getFullYear();
    
    // Reject if year is unreasonable
    if (year < 1900 || year > 2100) {
      return false;
    }
    
    // Reject pure numbers that aren't timestamps
    if (/^\d+$/.test(trimmed) && trimmed.length < 8) {
      return false;
    }
    
    // Reject single words that aren't date-related
    if (!/\d/.test(trimmed) && !/today|tomorrow|yesterday|now/i.test(trimmed)) {
      return false;
    }
    
    return true;
  }

  return false;
}

// Enhanced version with additional metadata
function isDateWithInfo(value: string): DateDetectionResult {
  const result: DateDetectionResult = {
    isDate: false,
    type: null,
    parsedDate: null,
    format: null
  };

  if (!isDateOrNot(value)) {
    return result;
  }

  result.isDate = true;
  result.type = 'String';
  result.parsedDate = new Date(value);
  
  const trimmed: string = value.trim();
  
  // Determine format
  if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
    result.format = 'ISO 8601';
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    result.format = 'ISO date';
  } else if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed)) {
    result.format = 'US format (MM/DD/YYYY)';
  } else if (/^\d{1,2}\.\d{1,2}\.\d{2,4}$/.test(trimmed)) {
    result.format = 'European format (DD.MM.YYYY)';
  } else if (/^\d{1,2}-\d{1,2}-\d{2,4}$/.test(trimmed)) {
    result.format = 'Dash format (DD-MM-YYYY)';
  } else if (/^\d{1,2}:\d{2}/.test(trimmed)) {
    result.format = 'Time format';
  } else if (/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(trimmed)) {
    result.format = 'Month name format';
  } else if (/^\d{10,13}$/.test(trimmed)) {
    result.format = 'Timestamp string';
  } else if (/today|tomorrow|yesterday/i.test(trimmed)) {
    result.format = 'Relative date';
  } else {
    result.format = 'Other recognized format';
  }

  return result;
}

// Export types and functions for module usage
export type { DateType, DateFormat, DateDetectionResult };
export { isDateOrNot, isDateWithInfo };