from pydantic import BaseModel
from datetime import date
from typing import List, Literal, Optional

class AddressBase(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str

class LicenseBase(BaseModel):
    number: str
    license_class: str
    expiration_date: date
    endorsements: List[str]
    is_valid: bool

class EmploymentBase(BaseModel):
    hire_date: date
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
    expiration_date: date
    is_valid: bool

class CertificationsBase(BaseModel):
    dot_medical_cert: DotMedicalCertBase
    hazmat_endorsement: bool
    drug_test_date: date

class EmergencyContactBase(BaseModel):
    name: str
    relationship: str
    phone: str

class DriverBase(BaseModel):
    first_name: str
    last_name: str
    photo: str
    email: str
    phone: str
    address: AddressBase
    license: LicenseBase
    employment: EmploymentBase
    performance: PerformanceBase
    current_assignment: CurrentAssignmentBase
    certifications: CertificationsBase
    emergency_contact: EmergencyContactBase

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    photo: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[AddressBase] = None
    license: Optional[LicenseBase] = None
    employment: Optional[EmploymentBase] = None
    performance: Optional[PerformanceBase] = None
    current_assignment: Optional[CurrentAssignmentBase] = None
    certifications: Optional[CertificationsBase] = None
    emergency_contact: Optional[EmergencyContactBase] = None

class DriverOut(DriverBase):
    id: str
    
    class Config:
        orm_mode = True