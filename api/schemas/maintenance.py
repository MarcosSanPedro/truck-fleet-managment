from pydantic import BaseModel
from datetime import date

class MaintenanceBase(BaseModel):
    maintenance_id: int
    truck_id : int
    maintenance_mileage: int
    maintenance_description : str
    maintenance_type: str
    maintenance_date: date
    maintenance_next_scheduled: date


class MaintenanceCreate(MaintenanceBase):
    pass

class MaintenanceUpdate(MaintenanceBase):
    pass

class MaintenanceOut(MaintenanceBase):
    id: int
    class Config:
        orm_mode = True
