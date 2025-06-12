export interface Driver {
    id?: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    license_number: string;
    license_expiration: string;
    is_active: boolean;
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
    asign_driver: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    vin: string;
    plate: string;
  }
  
  export type EntityType = 'drivers' | 'jobs' | 'trucks';