from typing import List, Literal
from pydantic import BaseModel, FutureDate

class AddressBase(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str

class LicenseBase(BaseModel):
    number: str
    license_expiration: FutureDate
    license_class: str
    is_valid: bool

class EmploymentBase(BaseModel):
    hire_date: str
    years_experience: int
    status: Literal['active', 'inactive', 'on-leave', 'suspended']
    employee_id: str

class PerformanceBase(BaseModel):
    safety_rating: float
    on_time_delivery_rate: float
    total_miles_driven: int
    accidents_free: int

class CurrentAssignmentBase(BaseModel):
    truck_number: str
    route: str
    status: Literal['available', 'on-route', 'loading', 'maintenance', 'off-duty']

class CertificationsBase(BaseModel):
    hazmat_endorsement: bool
    drug_test_date: str

class EmergencyContactBase(BaseModel):
    emergency_contact: str
    relationship: str
    phone: str


class DriverBase(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    email: str
    is_active: bool
    address: AddressBase
    license: LicenseBase
    employment: EmploymentBase
    performance: PerformanceBase
    current_assignment: CurrentAssignmentBase
    certifications: CertificationsBase
    emergency_contact: EmergencyContactBase


class DriverCreate(DriverBase):
    pass

class DriverUpdate(DriverBase):
    pass

class DriverOut(DriverBase):
    id: int
    class Config:
        orm_mode = True