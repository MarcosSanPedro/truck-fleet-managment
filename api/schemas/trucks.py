from typing import Literal
from pydantic import BaseModel
class TruckBase(BaseModel):
    assign_driver: str
    make: str
    model: str
    year: int
    color: str
    mileage: int
    vin: str
    plate: str
    status: Literal[ "active" , "maintenance" , "out-of-service" , "available"]
    fuel_level: int;
    last_service_date: str;
    next_service_due: int; 
    insurance_expiry: str;
    registration_expiry: str;
    truck_type:  Literal["Semi-Truck" , "Box Truck" , "Tanker", "Flatbed"] 
    truckweight: int;
    volume: int; 
    current_location: str;
    last_updated: str;
    fuel_efficiency: int;
    total_trips: int;
    maintenance_cost_ytd: int;
    downtime_hours: int;
    features: list[str];
    condition_score: int;

class TruckCreate(TruckBase):
    pass

class TruckUpdate(TruckBase):
    pass

class TruckOut(TruckBase):
    id: int
    class Config:
        from_attributes = True
