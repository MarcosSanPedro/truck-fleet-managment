from pydantic import BaseModel, FutureDate
from datetime import date



class MaintenanceBase(BaseModel):
    truck_id : int
    mileage: int
    description : str
    type: str
    date: date
    next_scheduled: FutureDate


class MaintenanceCreate(MaintenanceBase):
    pass

class MaintenanceUpdate(MaintenanceBase):
    pass

class MaintenanceOut(MaintenanceBase):
    id: int
    class Config:
        orm_mode = True
