import type { Driver } from "@/types";

export const emptyDriver: Omit<Driver, "id"> = {
  firstName: "",
  lastName: "",
  photo: "",
  email: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
  },
  license: {
    number: "",
    class: "",
    expirationDate: "",
    endorsements: [],
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
    dotMedicalCert: {
      expirationDate: "",
      isValid: false,
    },
    hazmatEndorsement: false,
    drugTestDate: "",
  },
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
  },
};
