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
    expirationDate: "",
    class: "",
    isValid: false,
  },
  employment: {
    hireDate: "",
    yearsExperience: 0,
    status: "active",
    employeeId: "",
  },
  performance: {
    safetyRating: 0,
    onTimeDeliveryRate: 0,
    totalMilesDriven: 0,
    accidentsFree: 0,
  },
  currentAssignment: {
    truckNumber: "",
    route: "",
    status: "available",
  },
  certifications: {
   
    hazmatEndorsement: false,
    drugTestDate: "",
  },
  emergencyContact: {
    contact_name: "",
    relationship: "",
    phone: "",
  },
};
