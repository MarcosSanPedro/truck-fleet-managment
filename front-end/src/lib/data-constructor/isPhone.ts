// Type definitions
type PhoneType = "String";

type PhoneFormat =
  | "US format (XXX) XXX-XXXX"
  | "US format XXX-XXX-XXXX"
  | "US format XXX.XXX.XXXX"
  | "US format XXXXXXXXXX"
  | "International +X XXX XXX XXXX"
  | "International +X-XXX-XXX-XXXX"
  | "International +X.XXX.XXX.XXXX"
  | "International +XXXXXXXXXXX"
  | "US toll-free 1-800-XXX-XXXX"
  | "US toll-free (800) XXX-XXXX"
  | "Extension format XXX-XXX-XXXX ext XXXX"
  | "Extension format XXX-XXX-XXXX x XXXX"
  | "Parentheses format (XXX)XXX-XXXX"
  | "Spaced format XXX XXX XXXX"
  | "Other recognized format";

interface PhoneDetectionResult {
  isPhone: boolean;
  type: PhoneType | null;
  cleanedNumber: string | null;
  format: PhoneFormat | null;
  countryCode: string | null;
  isUS: boolean;
  isTollFree: boolean;
  hasExtension: boolean;
  extension: string | null;
}

/**
 * Advanced phone number detection utility function
 * Detects if a string value is a phone number in various formats
 * @param value - The string value to check
 * @returns True if the value is a valid phone number, false otherwise
 */
function isPhoneNumberOrNot(value: string): boolean {
  // Handle null, undefined, or empty values
  if (!value || typeof value !== "string") {
    return false;
  }

  const trimmed: string = value.trim();

  // Empty string after trim
  if (trimmed === "") {
    return false;
  }

  // Remove common non-digit characters for initial validation
  const digitsOnly: string = trimmed.replace(/[^\d]/g, "");

  // Must have at least 7 digits (minimum for local number) and max 15 (international standard)
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return false;
  }

  // Common phone number patterns (regex)
  const phonePatterns: RegExp[] = [
    // US formats
    /^\(\d{3}\)\s?\d{3}-\d{4}$/, // (555) 123-4567 or (555)123-4567
    /^\d{3}-\d{3}-\d{4}$/, // 555-123-4567
    /^\d{3}\.\d{3}\.\d{4}$/, // 555.123.4567
    /^\d{3}\s\d{3}\s\d{4}$/, // 555 123 4567
    /^\d{10}$/, // 5551234567
    /^\(\d{3}\)\d{3}-\d{4}$/, // (555)123-4567

    // US with country code
    /^1[-.\s]?\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}$/, // 1-(555)-123-4567
    /^1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/, // 1-555-123-4567
    /^\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/, // +1-555-123-4567
    /^\+1\s?\(\d{3}\)\s?\d{3}[-.\s]?\d{4}$/, // +1 (555) 123-4567

    // International formats
    /^\+\d{1,3}[-.\s]?\d{1,14}$/, // +XX XXXXXXXXXXX
    /^\+\d{1,3}[-.\s]?\(\d{1,4}\)[-.\s]?\d{1,12}$/, // +XX (XXX) XXXXXXXXX
    /^\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, // +XX XXX XXX XXXXXX

    // With extensions
    /^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}[-.\s]?(ext|x|extension)[-.\s]?\d{1,6}$/i,
    /^\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}[-.\s]?(ext|x|extension)[-.\s]?\d{1,6}$/i,
    /^\+\d{1,3}[-.\s]?\d{1,14}[-.\s]?(ext|x|extension)[-.\s]?\d{1,6}$/i,

    // Toll-free numbers
    /^1?[-.\s]?8(00|33|44|55|66|77|88)[-.\s]?\d{3}[-.\s]?\d{4}$/,
    /^1?[-.\s]?\(8(00|33|44|55|66|77|88)\)[-.\s]?\d{3}[-.\s]?\d{4}$/,
  ];

  // Check against patterns
  const matchesPattern: boolean = phonePatterns.some((pattern: RegExp) =>
    pattern.test(trimmed)
  );

  if (matchesPattern) {
    return true;
  }

  // Additional validation for edge cases
  // Check if it's a valid international number (starts with +)
  if (trimmed.startsWith("+")) {
    const withoutPlus = trimmed.substring(1).replace(/[^\d]/g, "");
    if (withoutPlus.length >= 7 && withoutPlus.length <= 15) {
      return true;
    }
  }

  // Check if it's a valid US number without formatting
  if (digitsOnly.length === 10 && /^[2-9]\d{2}[2-9]\d{6}$/.test(digitsOnly)) {
    return true;
  }

  // Check if it's a valid US number with country code
  if (
    digitsOnly.length === 11 &&
    digitsOnly.startsWith("1") &&
    /^1[2-9]\d{2}[2-9]\d{6}$/.test(digitsOnly)
  ) {
    return true;
  }

  return false;
}

// Enhanced version with additional metadata
function isPhoneNumberWithInfo(value: string): PhoneDetectionResult {
  const result: PhoneDetectionResult = {
    isPhone: false,
    type: null,
    cleanedNumber: null,
    format: null,
    countryCode: null,
    isUS: false,
    isTollFree: false,
    hasExtension: false,
    extension: null,
  };

  if (!isPhoneNumberOrNot(value)) {
    return result;
  }

  result.isPhone = true;
  result.type = "String";

  const trimmed: string = value.trim();
  const digitsOnly: string = trimmed.replace(/[^\d]/g, "");
  result.cleanedNumber = digitsOnly;

  // Check for extension
  const extMatch = trimmed.match(/(ext|x|extension)[-.\s]?(\d{1,6})/i);
  if (extMatch) {
    result.hasExtension = true;
    result.extension = extMatch[2];
  }

  // Determine format and characteristics
  if (/^\(\d{3}\)\s?\d{3}-\d{4}$/.test(trimmed)) {
    result.format = "US format (XXX) XXX-XXXX";
    result.isUS = true;
  } else if (/^\d{3}-\d{3}-\d{4}$/.test(trimmed)) {
    result.format = "US format XXX-XXX-XXXX";
    result.isUS = true;
  } else if (/^\d{3}\.\d{3}\.\d{4}$/.test(trimmed)) {
    result.format = "US format XXX.XXX.XXXX";
    result.isUS = true;
  } else if (/^\d{3}\s\d{3}\s\d{4}$/.test(trimmed)) {
    result.format = "Spaced format XXX XXX XXXX";
    result.isUS = true;
  } else if (/^\d{10}$/.test(trimmed)) {
    result.format = "US format XXXXXXXXXX";
    result.isUS = true;
  } else if (/^\(\d{3}\)\d{3}-\d{4}$/.test(trimmed)) {
    result.format = "Parentheses format (XXX)XXX-XXXX";
    result.isUS = true;
  } else if (/^\+1/.test(trimmed)) {
    result.countryCode = "1";
    result.isUS = true;
    if (trimmed.includes("(") && trimmed.includes(")")) {
      result.format = "International +X XXX XXX XXXX";
    } else if (trimmed.includes("-")) {
      result.format = "International +X-XXX-XXX-XXXX";
    } else if (trimmed.includes(".")) {
      result.format = "International +X.XXX.XXX.XXXX";
    } else {
      result.format = "International +XXXXXXXXXXX";
    }
  } else if (/^\+/.test(trimmed)) {
    const countryCodeMatch = trimmed.match(/^\+(\d{1,3})/);
    if (countryCodeMatch) {
      result.countryCode = countryCodeMatch[1];
    }
    if (trimmed.includes("-")) {
      result.format = "International +X-XXX-XXX-XXXX";
    } else if (trimmed.includes(".")) {
      result.format = "International +X.XXX.XXX.XXXX";
    } else if (trimmed.includes(" ")) {
      result.format = "International +X XXX XXX XXXX";
    } else {
      result.format = "International +XXXXXXXXXXX";
    }
  } else if (/^1[-.\s]?8(00|33|44|55|66|77|88)/.test(trimmed)) {
    result.format = "US toll-free 1-800-XXX-XXXX";
    result.isUS = true;
    result.isTollFree = true;
  } else if (/^\(8(00|33|44|55|66|77|88)\)/.test(trimmed)) {
    result.format = "US toll-free (800) XXX-XXXX";
    result.isUS = true;
    result.isTollFree = true;
  } else if (result.hasExtension) {
    if (trimmed.includes("-")) {
      result.format = "Extension format XXX-XXX-XXXX ext XXXX";
    } else {
      result.format = "Extension format XXX-XXX-XXXX x XXXX";
    }
    result.isUS = true;
  } else {
    result.format = "Other recognized format";
  }

  // Check if it's a toll-free number
  if (digitsOnly.length >= 10) {
    const areaCode =
      digitsOnly.length === 11
        ? digitsOnly.substring(1, 4)
        : digitsOnly.substring(0, 3);
    if (["800", "833", "844", "855", "866", "877", "888"].includes(areaCode)) {
      result.isTollFree = true;
    }
  }

  return result;
}

// Export types and functions for module usage
export type { PhoneType, PhoneFormat, PhoneDetectionResult };
export { isPhoneNumberOrNot, isPhoneNumberWithInfo };
