import type { Driver, Truck } from "../types/index";


export const emptyDriver: Omit<Driver, "id"> = {
  first_name: "",
  last_name: "",
  is_active: true,
  email: "",
  phone_number: "",
  address: {
    street: "",
    city: "",
    state: "",
    zip_code: "",
  },
  license: {
    number: "",
    license_expiration: "",
    license_class: "",
    is_valid: false,
  },
  employment: {
    hire_date: "",
    years_experience: 0,
    status: "active",
    employee_id: "",
  },
  performance: {
    safety_rating: 0,
    on_time_delivery_rate: 0,
    total_miles_driven: 0,
    accidents_free: 0,
  },
  current_assignment: {
    truck_number: "",
    route: "",
    status: "available",
  },
  certifications: {
   
    hazmat_endorsement: false,
    drug_test_date: "",
  },
  emergency_contact: {
    emergency_contact: "",
    relationship: "",
    phone: "",
  },
};

export const emptyTruck: Omit<Truck, "id"> = {
  make: "",
  model: "",
  year: 0,
  color: "",
  mileage: 0,
  vin: "",
  plate: "",
  status: "active",
  truck_type: "Semi-Truck",
  fuel_level: 0,
  condition_score: 0,
  features: [],
  truckweight: 0,
  volume: 0,
  current_location: "",
  last_updated: "",
  fuel_efficiency: 0,
  total_trips: 0,
  maintenance_cost_ytd: 0,
  downtime_hours: 0,
  last_service_date: "",
  next_service_due: 0,
  insurance_expiry: "",
  registration_expiry: "",
  assign_driver: "",
}
