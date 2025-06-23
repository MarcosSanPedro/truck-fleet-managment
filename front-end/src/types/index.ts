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
    zipCode: string;
  };
  license: {
    number: string;
    class: string;
    expirationDate: string;
    isValid: boolean;
  };
  employment: {
    hireDate: string;
    yearsExperience: number;
    status: 'active' | 'inactive' | 'on-leave' | 'suspended';
    employeeId: string;
  };
  performance: {
    safetyRating: number;
    onTimeDeliveryRate: number;
    totalMilesDriven: number;
    accidentsFree: number;
  };
  current_assignment: {
    truckNumber: string;
    route: string;
    status: 'available' | 'on-route' | 'loading' | 'maintenance' | 'off-duty';
  };
  certifications: {
    hazmatEndorsement: boolean;
    drugTestDate: string;
  };
  emergencyContact: {
    contact_name: string;
    relationship: string;
    phone: string;
  };
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