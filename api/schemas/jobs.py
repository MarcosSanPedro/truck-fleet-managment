from pydantic import BaseModel
from datetime import date

class JobBase(BaseModel):
    job_number: str
    job_date: date
    job_type: str
    job_description: str
    job_status: str
    priority: str;
    estimatedValue: str;
    weight: str;
    distance: str;
    estimatedDuration: str;
    origin: str;
    destination: str;
    driver: str;
    vehicle: str;
    specialRequirements: list[str];
    progress: int;
    nextCheckpoint: str;
    eta: str;

class JobCreate(JobBase):
    pass

class JobUpdate(JobBase):
    pass

class JobOut(JobBase):
    id: int
    class Config:
        from_attributes = True





