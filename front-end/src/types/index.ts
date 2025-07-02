export interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  is_active: boolean;
  email: string;
  phone_number: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
  license: {
    number: string;
    license_class: string;
    license_expiration: string;
    is_valid: boolean;
  };
  employment: {
    hire_date: string;
    years_experience: number;
    status: "active" | "inactive" | "on-leave" | "suspended";
    employee_id: string;
  };
  performance: {
    safety_rating: number;
    on_time_delivery_rate: number;
    total_miles_driven: number;
    accidents_free: number;
  };
  current_assignment: {
    truck_number: string;
    route: string;
    status: "available" | "on-route" | "loading" | "maintenance" | "off-duty";
  };
  certifications: {
    hazmat_endorsement: boolean;
    drug_test_date: string;
  };
  emergency_contact: {
    emergency_contact: string;
    relationship: string;
    phone: string;
  };
}

export interface Job {
  id: number;
  job_number: string;
  job_date: string;
  job_type: string;
  job_description: string;
  job_status: string;
  priority: string;
  estimatedValue: string;
  weight: string;
  distance: string;
  estimatedDuration: string;
  origin: string;
  destination: string;
  driver: string;
  vehicle: string;
  specialRequirements: string[];
  progress: number;
  nextCheckpoint: string;
  eta: string;
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
  status: "active" | "maintenance" | "out-of-service" | "available";
  fuel_level: number; // percentage
  last_service_date: string;
  next_service_due: number; // mileage
  insurance_expiry: string;
  registration_expiry: string;
  truck_type:
    | "Semi-Truck"
    | "Box Truck"
    | "Flatbed"
    | "Refrigerated"
    | "Tanker";
  truckweight: number; // in lbs
  volume: number; // in cubic feet
  current_location: string;
  last_updated: string;

  fuel_efficiency: number; // mpg
  total_trips: number;
  maintenance_cost_ytd: number;
  downtime_hours: number;
  features: string[];
  condition_score: number; // 1-10
}

export interface Maintenance {
  id?: number;
  truck_id: number;
  mileage: number;
  description: string;
  type: string;
  date: Date;
  next_scheduled: Date;
}

export interface Metric {
  entity: string;
  name: string;
  type: string;
  value: number;
  calculation_config: string;
}

export type EntityType =
  | "drivers"
  | "jobs"
  | "trucks"
  | "maintenance"
  | "metric";
