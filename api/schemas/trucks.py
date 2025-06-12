# schemas/truck.py

from pydantic import BaseModel


class TruckBase(BaseModel):
    asign_driver: str
    make: str
    model: str
    year: int
    color: str
    mileage: int
    vin: str
    plate: str

class TruckCreate(TruckBase):
    pass

class TruckUpdate(TruckBase):
    pass

class TruckOut(TruckBase):
    id: int
    class Config:
        orm_mode = True
