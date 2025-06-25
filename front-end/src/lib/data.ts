import type { Driver } from "@/types";


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
    zipCode: "",
  },
  license: {
    number: "",
    expiration_date: "",
    class: "",
    isValid: false,
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
    contact_name: "",
    relationship: "",
    phone: "",
  },
};
