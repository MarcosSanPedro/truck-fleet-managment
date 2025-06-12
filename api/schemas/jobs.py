from pydantic import BaseModel
from datetime import date

class JobBase(BaseModel):
    job_number: str
    job_date: date
    job_type: str
    job_description: str
    job_status: str

class JobCreate(JobBase):
    pass

class JobUpdate(JobBase):
    pass

class JobOut(JobBase):
    id: int
    class Config:
        orm_mode = True





