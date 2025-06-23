from typing import List, Literal
from pydantic import BaseModel, FutureDate

class AddressBase(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str

class LicenseBase(BaseModel):
    number: str
    license_class: str
    endorsements: List[str]
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

class DotMedicalCertBase(BaseModel):
    expiration_date: str
    is_valid: bool

class CertificationsBase(BaseModel):
    dot_medical_cert: DotMedicalCertBase
    hazmat_endorsement: bool
    drug_test_date: str

class EmergencyContactBase(BaseModel):
    name: str
    relationship: str
    phone: str


class DriverBase(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    email: str
    license_number: str
    license_expiration: FutureDate
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