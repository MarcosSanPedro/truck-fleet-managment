// Driver Types
export interface Address {
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface License {
  number: string;
  license_class: string;
  expiration_date: string;
  endorsements: string[];
  is_valid: boolean;
}

export interface Employment {
  hire_date: string;
  years_experience: number;
  status: 'active' | 'inactive' | 'on-leave' | 'suspended';
  employee_id: string;
}

export interface Performance {
  safety_rating: number;
  on_time_delivery_rate: number;
  total_miles_driven: number;
  accidents_free: number;
}

export interface CurrentAssignment {
  truck_number: string;
  route: string;
  status: 'available' | 'on-route' | 'loading' | 'maintenance' | 'off-duty';
}

export interface DotMedicalCert {
  expiration_date: string;
  is_valid: boolean;
}

export interface Certifications {
  dot_medical_cert: DotMedicalCert;
  hazmat_endorsement: boolean;
  drug_test_date: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  photo: string;
  email: string;
  phone: string;
  address: Address;
  license: License;
  employment: Employment;
  performance: Performance;
  current_assignment: CurrentAssignment;
  certifications: Certifications;
  emergency_contact: EmergencyContact;
}

// For creating new drivers (without ID)
export interface DriverCreate {
  first_name: string;
  last_name: string;
  photo: string;
  email: string;
  phone: string;
  address: Address;
  license: License;
  employment: Employment;
  performance: Performance;
  current_assignment: CurrentAssignment;
  certifications: Certifications;
  emergency_contact: EmergencyContact;
}

// For updating drivers (all fields optional except nested objects can be partial)
export interface DriverUpdate {
  first_name?: string;
  last_name?: string;
  photo?: string;
  email?: string;
  phone?: string;
  address?: Partial<Address>;
  license?: Partial<License>;
  employment?: Partial<Employment>;
  performance?: Partial<Performance>;
  current_assignment?: Partial<CurrentAssignment>;
  certifications?: Partial<Certifications>;
  emergency_contact?: Partial<EmergencyContact>;
}

// Helper type for form handling - makes nested objects optional for step-by-step forms
export interface DriverFormData {
  first_name: string;
  last_name: string;
  photo?: string;
  email: string;
  phone: string;
  address?: Partial<Address>;
  license?: Partial<License>;
  employment?: Partial<Employment>;
  performance?: Partial<Performance>;
  current_assignment?: Partial<CurrentAssignment>;
  certifications?: Partial<Certifications>;
  emergency_contact?: Partial<EmergencyContact>;
}

// API Response types
export interface DriverListResponse {
  drivers: Driver[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Status enums for better type safety
export const EmploymentStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on-leave',
  SUSPENDED: 'suspended'
} as const;

export const AssignmentStatus = {
  AVAILABLE: 'available',
  ON_ROUTE: 'on-route',
  LOADING: 'loading',
  MAINTENANCE: 'maintenance',
  OFF_DUTY: 'off-duty'
} as const;

// Type guards for runtime checking
export function isValidEmploymentStatus(status: string): status is Employment['status'] {
  return Object.values(EmploymentStatus).includes(status as Employment['status']);
}

export function isValidAssignmentStatus(status: string): status is CurrentAssignment['status'] {
  return Object.values(AssignmentStatus).includes(status as CurrentAssignment['status']);
}
  
  export interface Job {
    id?: number;
    job_number: string;
    job_date: string;
    job_type: string;
    job_description: string;
    job_status: string;
  }
  
  export interface Truck {
    id?: number;
    assign_driver: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    vin: string;
    plate: string;
  }

  export interface Maintenance {
    id?: number;
    truck_id : number;
    mileage: number;
    description : string;
    type: string;
    date: Date;
    next_scheduled: Date
  }
  
  export type EntityType = 'drivers' | 'jobs' | 'trucks' | 'maintenance';