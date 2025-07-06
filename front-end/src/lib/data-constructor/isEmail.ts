// Type definitions
type EmailType = "String";

type EmailFormat =
  | "Standard email"
  | "International domain"
  | "Subdomain email"
  | "Plus addressing"
  | "Dot addressing"
  | "Quoted local part"
  | "IP address domain"
  | "Other valid format";

interface EmailDetectionResult {
  isEmail: boolean;
  type: EmailType | null;
  format: EmailFormat | null;
  localPart: string | null;
  domain: string | null;
  isDisposable: boolean;
}

/**
 * Advanced email detection utility function
 * Detects if a string value is a valid email address
 * @param value - The string value to check
 * @returns True if the value is a valid email, false otherwise
 */
function isEmailOrNot(value: string): boolean {
  // Handle null, undefined, or empty values
  if (!value || typeof value !== "string") {
    return false;
  }

  const trimmed: string = value.trim();

  // Empty string after trim
  if (trimmed === "") {
    return false;
  }

  // Basic structure check - must have exactly one @ symbol
  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount !== 1) {
    return false;
  }

  const [localPart, domain] = trimmed.split("@");

  // Check if local part and domain exist
  if (!localPart || !domain) {
    return false;
  }

  // Validate local part (before @)
  if (!isValidLocalPart(localPart)) {
    return false;
  }

  // Validate domain part (after @)
  if (!isValidDomain(domain)) {
    return false;
  }

  return true;
}

/**
 * Validates the local part of an email address (before @)
 */
function isValidLocalPart(localPart: string): boolean {
  // Length check (1-64 characters)
  if (localPart.length < 1 || localPart.length > 64) {
    return false;
  }

  // Handle quoted local parts
  if (localPart.startsWith('"') && localPart.endsWith('"')) {
    const quoted = localPart.slice(1, -1);
    // Quoted strings can contain most characters except unescaped quotes
    return !/(?<!\\)"/.test(quoted);
  }

  // Unquoted local part validation
  // Cannot start or end with dot
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return false;
  }

  // Cannot have consecutive dots
  if (localPart.includes("..")) {
    return false;
  }

  // Valid characters for unquoted local part
  const validLocalChars = /^[a-zA-Z0-9._+-]+$/;
  return validLocalChars.test(localPart);
}

/**
 * Validates the domain part of an email address (after @)
 */
function isValidDomain(domain: string): boolean {
  // Length check (1-255 characters)
  if (domain.length < 1 || domain.length > 255) {
    return false;
  }

  // Handle IP address domains [192.168.1.1]
  if (domain.startsWith("[") && domain.endsWith("]")) {
    const ip = domain.slice(1, -1);
    return isValidIP(ip);
  }

  // Cannot start or end with dot or hyphen
  if (
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.startsWith("-") ||
    domain.endsWith("-")
  ) {
    return false;
  }

  // Split into labels (parts separated by dots)
  const labels = domain.split(".");

  // Must have at least one dot (minimum 2 labels)
  if (labels.length < 2) {
    return false;
  }

  // Validate each label
  for (const label of labels) {
    if (!isValidDomainLabel(label)) {
      return false;
    }
  }

  // Last label (TLD) must be at least 2 characters and all letters
  const tld = labels[labels.length - 1];
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return false;
  }

  return true;
}

/**
 * Validates a single domain label
 */
function isValidDomainLabel(label: string): boolean {
  // Length check (1-63 characters)
  if (label.length < 1 || label.length > 63) {
    return false;
  }

  // Cannot start or end with hyphen
  if (label.startsWith("-") || label.endsWith("-")) {
    return false;
  }

  // Valid characters: letters, numbers, hyphens
  const validLabelChars = /^[a-zA-Z0-9-]+$/;
  return validLabelChars.test(label);
}

/**
 * Validates IP address format
 */
function isValidIP(ip: string): boolean {
  // IPv4 validation
  const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const ipv4Match = ip.match(ipv4Pattern);

  if (ipv4Match) {
    const octets = ipv4Match.slice(1, 5).map(Number);
    return octets.every((octet) => octet >= 0 && octet <= 255);
  }

  // IPv6 validation (basic)
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Pattern.test(ip);
}

/**
 * Common disposable email domains
 */
const disposableDomains = new Set([
  "10minutemail.com",
  "tempmail.org",
  "guerrillamail.com",
  "mailinator.com",
  "yopmail.com",
  "temp-mail.org",
  "throwaway.email",
  "maildrop.cc",
  "mohmal.com",
  "sharklasers.com",
]);

// Enhanced version with additional metadata
function isEmailWithInfo(value: string): EmailDetectionResult {
  const result: EmailDetectionResult = {
    isEmail: false,
    type: null,
    format: null,
    localPart: null,
    domain: null,
    isDisposable: false,
  };

  if (!isEmailOrNot(value)) {
    return result;
  }

  result.isEmail = true;
  result.type = "String";

  const trimmed = value.trim();
  const [localPart, domain] = trimmed.split("@");

  result.localPart = localPart;
  result.domain = domain;
  result.isDisposable = disposableDomains.has(domain.toLowerCase());

  // Determine format
  if (localPart.includes("+")) {
    result.format = "Plus addressing";
  } else if (localPart.includes(".")) {
    result.format = "Dot addressing";
  } else if (localPart.startsWith('"') && localPart.endsWith('"')) {
    result.format = "Quoted local part";
  } else if (domain.startsWith("[") && domain.endsWith("]")) {
    result.format = "IP address domain";
  } else if (domain.split(".").length > 2) {
    result.format = "Subdomain email";
  } else if (/[^\u0000-\u007F]/.test(domain)) {
    result.format = "International domain";
  } else {
    result.format = "Standard email";
  }

  return result;
}

// Export types and functions for module usage
export type { EmailType, EmailFormat, EmailDetectionResult };
export { isEmailOrNot, isEmailWithInfo };
