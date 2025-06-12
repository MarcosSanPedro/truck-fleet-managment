from pydantic import BaseModel
from datetime import date

class DriverBase(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    email: str
    license_number: str
    license_expiration: date
    is_active: bool

class DriverCreate(DriverBase):
    pass

class DriverUpdate(DriverBase):
    pass

class DriverOut(DriverBase):
    id: int
    class Config:
        orm_mode = True